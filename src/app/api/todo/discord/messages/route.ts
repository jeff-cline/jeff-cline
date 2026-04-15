import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/todo-auth";
import { getTodoDb } from "@/lib/todo-db";

const BOT_TOKEN = "MTQ3MDE1ODU4OTg4NzkwNTg2Mw.G33682.q1wbp9o0q8AofkYa08DKum7X6t9OS6T3mUgkPA";
const DISCORD_API = "https://discord.com/api/v10";

function auth(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function GET(req: NextRequest) {
  const session = auth(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const channelId = searchParams.get("channelId");
  const before = searchParams.get("before");
  const after = searchParams.get("after");

  if (!channelId) return NextResponse.json({ error: "Missing channelId" }, { status: 400 });

  // Verify user has access to this channel
  const db = await getTodoDb();
  const user = await db.collection("todo_users").findOne({ email: session.email });
  const allowed: string[] = user?.discordChannels || [];
  if (!allowed.includes("*") && !allowed.includes(channelId)) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const params = new URLSearchParams({ limit: "50" });
  if (before) params.set("before", before);
  if (after) params.set("after", after);

  const res = await fetch(`${DISCORD_API}/channels/${channelId}/messages?${params}`, {
    headers: { Authorization: `Bot ${BOT_TOKEN}` },
  });
  if (!res.ok) return NextResponse.json({ error: "Discord API error" }, { status: 502 });

  const messages = await res.json();
  return NextResponse.json(messages);
}
