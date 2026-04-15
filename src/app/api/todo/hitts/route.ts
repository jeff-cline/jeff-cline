import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/todo-auth";
import { getTodoDb, getMultiDb } from "@/lib/todo-db";
import { ObjectId } from "mongodb";

async function requireAuth(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

// Sync visitors from el.ag and other sources into crm_hitts
async function syncHitts() {
  const db = await getTodoDb();
  const hitts = db.collection("crm_hitts");

  // Ensure indexes
  await hitts.createIndex({ sourceKey: 1 }, { unique: true, background: true }).catch(() => {});
  await hitts.createIndex({ createdAt: -1 }, { background: true }).catch(() => {});

  // Sources that have visitor/hit data (not form submissions)
  const visitorSources = [
    { db: "elag", name: "el.ag", collections: ["visitors", "pixel_events", "site_visits"] },
    { db: "jeff-cline", name: "Jeff Cline", collections: ["visitors", "analytics", "site_visits"] },
    { db: "multifamilyoffice-ai", name: "MultiFamilyOffice.ai", collections: ["visitors", "site_visits"] },
    { db: "agents-biz", name: "agents.biz", collections: ["visitors", "site_visits"] },
    { db: "moneywords", name: "MoneyWords", collections: ["visitors", "site_visits"] },
  ];

  for (const source of visitorSources) {
    try {
      const sourceDb = await getMultiDb(source.db);
      for (const colName of source.collections) {
        try {
          const col = sourceDb.collection(colName);
          const docs = await col.find({}).sort({ _id: -1 }).limit(500).toArray();
          for (const doc of docs) {
            const sourceKey = `${source.db}:${colName}:${doc._id}`;
            const existing = await hitts.findOne({ sourceKey });
            if (existing) continue;

            const ip = (doc.ip as string) || (doc.ipAddress as string) || "";
            const page = (doc.page as string) || (doc.url as string) || (doc.path as string) || (doc.referrer as string) || "";
            const userAgent = (doc.userAgent as string) || (doc.ua as string) || "";
            const name = (doc.name as string) || (doc.visitor_name as string) || (doc.hostname as string) || ip || "(anonymous)";
            const email = (doc.email as string) || "";

            let createdAt: Date;
            if (doc.createdAt instanceof Date) createdAt = doc.createdAt;
            else if (typeof doc.createdAt === "string") createdAt = new Date(doc.createdAt);
            else if (doc.created_at) createdAt = new Date(doc.created_at as string);
            else if (doc.timestamp) createdAt = new Date(doc.timestamp as string);
            else if (doc.visitedAt) createdAt = new Date(doc.visitedAt as string);
            else if (ObjectId.isValid(doc._id)) createdAt = new ObjectId(doc._id).getTimestamp();
            else createdAt = new Date();

            await hitts.insertOne({
              sourceKey,
              name,
              email,
              ip,
              page,
              userAgent,
              source: source.name,
              sourceDb: source.db,
              sourceCollection: colName,
              createdAt,
              rawData: doc,
              importedAt: new Date(),
            });
          }
        } catch {
          // collection might not exist
        }
      }
    } catch {
      // db might not exist
    }
  }
}

export async function GET(req: NextRequest) {
  const session = await requireAuth(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 20;
  const search = searchParams.get("search") || "";
  const sourceFilter = searchParams.get("source") || "";

  try { await syncHitts(); } catch { /* ignore sync errors */ }

  const db = await getTodoDb();
  const col = db.collection("crm_hitts");

  const query: Record<string, unknown> = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { page: { $regex: search, $options: "i" } },
      { ip: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }
  if (sourceFilter) query.source = sourceFilter;

  const total = await col.countDocuments(query);
  const hitts = await col
    .find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  return NextResponse.json({
    hitts: hitts.map((h) => ({ ...h, _id: h._id.toString() })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
