import { NextRequest, NextResponse } from "next/server";
import { getTodoDb } from "@/lib/todo-db";

// Secret key for AIpril to poll inbox - not user-facing
const INBOX_KEY = "vault-inbox-aipril-2026";

export async function GET(req: NextRequest) {
  const key = req.headers.get("x-inbox-key") || new URL(req.url).searchParams.get("key");
  if (key !== INBOX_KEY) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = await getTodoDb();
  const messages = await db.collection("vault_inbox")
    .find({ processed: false })
    .sort({ createdAt: 1 })
    .limit(10)
    .toArray();

  return NextResponse.json(messages.map(m => ({ ...m, _id: m._id.toString() })));
}

export async function POST(req: NextRequest) {
  const key = req.headers.get("x-inbox-key") || "";
  if (key !== INBOX_KEY) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { messageIds } = await req.json();
  if (!Array.isArray(messageIds) || messageIds.length === 0) {
    return NextResponse.json({ error: "messageIds required" }, { status: 400 });
  }

  const db = await getTodoDb();
  const { ObjectId } = await import("mongodb");
  await db.collection("vault_inbox").updateMany(
    { _id: { $in: messageIds.map((id: string) => new ObjectId(id)) } },
    { $set: { processed: true, processedAt: new Date() } }
  );

  return NextResponse.json({ ok: true });
}
