import { MongoClient, Db, ChangeStream, ObjectId } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";

const DB_SOURCES = [
  { db: "jeff-cline", name: "Jeff Cline", collections: ["users", "leads", "contacts"] },
  { db: "multifamilyoffice-ai", name: "MultiFamilyOffice.ai", collections: ["users", "leads", "contacts"] },
  { db: "agents-biz", name: "agents.biz", collections: ["users", "leads", "contacts"] },
  { db: "moneywords", name: "MoneyWords", collections: ["users", "leads"] },
  { db: "elag", name: "el.ag", collections: ["users", "leads", "visitors"] },
];

let syncClient: MongoClient | null = null;
let changeStreams: ChangeStream[] = [];
let watcherRunning = false;

async function getSyncClient(): Promise<MongoClient> {
  if (syncClient) return syncClient;
  syncClient = await MongoClient.connect(MONGODB_URI, {
    connectTimeoutMS: 5000,
    serverSelectionTimeoutMS: 5000,
  });
  return syncClient;
}

function getCrmDb(client: MongoClient): Db {
  return client.db("jeff-cline");
}

export interface NormalizedLead {
  sourceKey: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  sourceDb: string;
  sourceCollection: string;
  sourcePage: string;
  createdAt: Date;
  rawData: Record<string, unknown>;
  importedAt: Date;
}

export function normalizeLead(
  doc: Record<string, unknown>,
  sourceName: string,
  sourceDb: string,
  sourceCollection: string
): NormalizedLead {
  const firstName = (doc.firstName as string) || "";
  const lastName = (doc.lastName as string) || "";
  const name =
    (doc.name as string) ||
    (firstName ? `${firstName} ${lastName}`.trim() : "") ||
    (doc.fullName as string) ||
    (doc.username as string) ||
    "(no name)";

  const email = ((doc.email as string) || "").toLowerCase().trim();
  const phone = (doc.phone as string) || (doc.phoneNumber as string) || "";
  const sourcePage = (doc.sourcePage as string) || (doc.page as string) || (doc.referrer as string) || (doc.url as string) || "";

  let createdAt: Date;
  if (doc.createdAt instanceof Date) createdAt = doc.createdAt;
  else if (typeof doc.createdAt === "string") createdAt = new Date(doc.createdAt);
  else if (doc.created_at) createdAt = new Date(doc.created_at as string);
  else if (doc.timestamp) createdAt = new Date(doc.timestamp as string);
  else if (doc._id && ObjectId.isValid(doc._id as string)) createdAt = new ObjectId(doc._id as string).getTimestamp();
  else createdAt = new Date();

  const sourceKey = `${sourceDb}:${sourceCollection}:${doc._id}`;

  return {
    sourceKey,
    name,
    email,
    phone,
    source: sourceName,
    sourceDb,
    sourceCollection,
    sourcePage,
    createdAt,
    rawData: doc,
    importedAt: new Date(),
  };
}

/**
 * Full backfill sync — pulls all existing docs from all source databases.
 * Deduplicates by sourceKey (db:collection:_id).
 */
export async function fullSync(): Promise<{ inserted: number; skipped: number }> {
  const client = await getSyncClient();
  const crmDb = getCrmDb(client);
  const crmLeads = crmDb.collection("crm_leads");

  // Ensure indexes
  await crmLeads.createIndex({ sourceKey: 1 }, { unique: true, background: true }).catch(() => {});
  await crmLeads.createIndex({ email: 1, source: 1 }, { background: true }).catch(() => {});
  await crmLeads.createIndex({ createdAt: -1 }, { background: true }).catch(() => {});

  let inserted = 0;
  let skipped = 0;

  for (const source of DB_SOURCES) {
    try {
      const sourceDb = client.db(source.db);
      for (const colName of source.collections) {
        try {
          const col = sourceDb.collection(colName);
          const cursor = col.find({}).sort({ _id: -1 });
          for await (const doc of cursor) {
            const lead = normalizeLead(doc as Record<string, unknown>, source.name, source.db, colName);
            try {
              await crmLeads.insertOne(lead);
              inserted++;
            } catch (e: unknown) {
              // Duplicate key = already synced
              if ((e as { code?: number }).code === 11000) skipped++;
              else throw e;
            }
          }
        } catch {
          // Collection may not exist
        }
      }
    } catch {
      // DB may not exist
    }
  }

  return { inserted, skipped };
}

/**
 * Insert a single lead from a webhook call.
 * Deduplicates by email + source if sourceKey not provided.
 */
export async function ingestLead(data: {
  source: string;
  name?: string;
  email?: string;
  phone?: string;
  page?: string;
  data?: Record<string, unknown>;
  priority?: string;
  message?: string;
  type?: string;
  company?: string;
}): Promise<{ ok: boolean; id?: string; duplicate?: boolean }> {
  const client = await getSyncClient();
  const crmDb = getCrmDb(client);
  const crmLeads = crmDb.collection("crm_leads");

  const email = (data.email || "").toLowerCase().trim();
  const sourceKey = `webhook:${data.source}:${email || Date.now()}`;

  // Check for duplicate by sourceKey
  const existing = await crmLeads.findOne({ sourceKey });
  if (existing) return { ok: true, id: existing._id.toString(), duplicate: true };

  // Also check email+source dedup (within last 60 seconds to allow re-entries over time)
  if (email) {
    const recent = await crmLeads.findOne({
      email,
      source: data.source,
      importedAt: { $gte: new Date(Date.now() - 60000) },
    });
    if (recent) return { ok: true, id: recent._id.toString(), duplicate: true };
  }

  const lead: NormalizedLead & { priority?: string; message?: string } = {
    sourceKey,
    name: data.name || "(no name)",
    email,
    phone: data.phone || "",
    source: data.source,
    sourceDb: "webhook",
    sourceCollection: "webhook",
    sourcePage: data.page || "",
    createdAt: new Date(),
    rawData: data.data || {},
    importedAt: new Date(),
    ...(data.priority && { priority: data.priority }),
    ...(data.message && { message: data.message }),
    ...(data.type && { type: data.type }),
    ...(data.company && { company: data.company }),
  };

  const result = await crmLeads.insertOne(lead);
  return { ok: true, id: result.insertedId.toString() };
}

/**
 * Start MongoDB change streams on all source databases.
 * Each insert/replace into users/leads/contacts triggers an immediate crm_leads insert.
 */
export async function watchChanges(): Promise<void> {
  if (watcherRunning) return;
  watcherRunning = true;

  const client = await getSyncClient();
  const crmDb = getCrmDb(client);
  const crmLeads = crmDb.collection("crm_leads");

  // Ensure indexes
  await crmLeads.createIndex({ sourceKey: 1 }, { unique: true, background: true }).catch(() => {});

  for (const source of DB_SOURCES) {
    try {
      const sourceDb = client.db(source.db);
      for (const colName of source.collections) {
        try {
          const col = sourceDb.collection(colName);
          const pipeline = [{ $match: { operationType: { $in: ["insert", "replace", "update"] } } }];
          const stream = col.watch(pipeline, { fullDocument: "updateLookup" });

          stream.on("change", async (change) => {
            try {
              const doc = (change as unknown as { fullDocument?: Record<string, unknown> }).fullDocument;
              if (!doc) return;

              const lead = normalizeLead(doc, source.name, source.db, colName);
              await crmLeads.insertOne(lead).catch((e: unknown) => {
                if ((e as { code?: number }).code !== 11000) {
                  console.error(`[crm-sync] Error inserting change stream doc:`, e);
                }
              });
            } catch (e) {
              console.error(`[crm-sync] Change stream handler error:`, e);
            }
          });

          stream.on("error", (err) => {
            console.error(`[crm-sync] Change stream error on ${source.db}.${colName}:`, err);
          });

          changeStreams.push(stream);
          console.log(`[crm-sync] Watching ${source.db}.${colName}`);
        } catch {
          // Collection may not exist — that's fine
        }
      }
    } catch (err) {
      console.error(`[crm-sync] Could not connect to ${source.db}:`, err);
    }
  }
}

/**
 * Stop all change stream watchers.
 */
export async function stopWatchers(): Promise<void> {
  for (const stream of changeStreams) {
    await stream.close().catch(() => {});
  }
  changeStreams = [];
  watcherRunning = false;
}

/**
 * Check if watcher is running.
 */
export function isWatcherRunning(): boolean {
  return watcherRunning;
}
