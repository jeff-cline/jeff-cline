import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";

const SOURCES = [
  { db: "jeff-cline", name: "jeff-cline.com", url: "https://jeff-cline.com" },
  { db: "agents-biz", name: "agents.biz", url: "https://agents.biz" },
  { db: "multifamilyoffice-ai", name: "multifamilyoffice.ai", url: "https://multifamilyoffice.ai" },
  { db: "moneywords", name: "moneywords.org", url: "https://moneywords.org" },
  { db: "elag", name: "el.ag", url: "https://el.ag" },
];

let client: MongoClient | null = null;
async function getClient() {
  if (!client) client = await MongoClient.connect(MONGODB_URI);
  return client;
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const search = (url.searchParams.get("search") || "").trim();
    const perPage = 20;

    const mc = await getClient();
    const allMembers: Array<{
      name: string;
      email: string;
      source: string;
      sourceUrl: string;
      sourceDb: string;
      createdAt: Date;
      rawId: string;
    }> = [];

    for (const src of SOURCES) {
      try {
        const db = mc.db(src.db);
        const users = db.collection("users");
        const cursor = users.find({});
        for await (const doc of cursor) {
          const name =
            (doc.name as string) ||
            ((doc.firstName || "") + " " + (doc.lastName || "")).trim() ||
            (doc.username as string) ||
            "(no name)";
          const email = ((doc.email as string) || "").toLowerCase().trim();
          let createdAt: Date;
          if (doc.createdAt instanceof Date) createdAt = doc.createdAt;
          else if (doc.createdAt) createdAt = new Date(doc.createdAt);
          else createdAt = doc._id.getTimestamp();

          allMembers.push({
            name,
            email,
            source: src.name,
            sourceUrl: src.url,
            sourceDb: src.db,
            createdAt,
            rawId: doc._id.toString(),
          });
        }
      } catch {
        // DB or collection may not exist
      }
    }

    // Sort newest first
    allMembers.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Search filter
    let filtered = allMembers;
    if (search) {
      const q = search.toLowerCase();
      filtered = allMembers.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.source.toLowerCase().includes(q)
      );
    }

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const start = (page - 1) * perPage;
    const members = filtered.slice(start, start + perPage);

    return NextResponse.json({ members, total, totalPages, page });
  } catch (e) {
    console.error("[members] Error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
