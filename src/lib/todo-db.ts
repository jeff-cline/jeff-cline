import { MongoClient, Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";

const clientCache: { client: MongoClient | null } = { client: null };

async function getMongoClient(): Promise<MongoClient> {
  if (clientCache.client) return clientCache.client;
  const client = await MongoClient.connect(MONGODB_URI, {
    connectTimeoutMS: 5000,
    serverSelectionTimeoutMS: 5000,
  });
  clientCache.client = client;
  return client;
}

export async function getTodoDb(): Promise<Db> {
  const client = await getMongoClient();
  return client.db("jeff-cline");
}

export async function getMultiDb(dbName: string): Promise<Db> {
  const client = await getMongoClient();
  return client.db(dbName);
}

export const DB_SOURCES = [
  { db: "jeff-cline", name: "Jeff Cline", collections: ["users", "leads", "contacts"] },
  { db: "multifamilyoffice-ai", name: "MultiFamilyOffice.ai", collections: ["users", "leads", "contacts"] },
  { db: "agents-biz", name: "agents.biz", collections: ["users", "leads", "contacts"] },
  { db: "moneywords", name: "MoneyWords", collections: ["users", "leads"] },
  { db: "elag", name: "el.ag", collections: ["users", "leads", "visitors"] },
];
