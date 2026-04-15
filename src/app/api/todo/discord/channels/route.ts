import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/todo-auth";
import { getTodoDb } from "@/lib/todo-db";

const BOT_TOKEN = "MTQ3MDE1ODU4OTg4NzkwNTg2Mw.G33682.q1wbp9o0q8AofkYa08DKum7X6t9OS6T3mUgkPA";
const GUILD_ID = "1470166078415049000";
const DISCORD_API = "https://discord.com/api/v10";

function auth(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

async function ensureDiscordChannels(db: ReturnType<Awaited<ReturnType<typeof getTodoDb>>["collection"]> extends never ? never : Awaited<ReturnType<typeof getTodoDb>>) {
  const defaults: Record<string, string[]> = {
    "jeff.cline@me.com": ["*"],
    "krystalore@thecrewscoach.com": ["*"],
  };
  for (const [email, channels] of Object.entries(defaults)) {
    await db.collection("todo_users").updateOne(
      { email, discordChannels: { $exists: false } },
      { $set: { discordChannels: channels } }
    );
  }
}

export async function GET(req: NextRequest) {
  const session = auth(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = await getTodoDb();
  await ensureDiscordChannels(db);

  const user = await db.collection("todo_users").findOne({ email: session.email });
  const allowedChannels: string[] = user?.discordChannels || [];

  if (allowedChannels.length === 0) {
    return NextResponse.json([]);
  }

  const res = await fetch(`${DISCORD_API}/guilds/${GUILD_ID}/channels`, {
    headers: { Authorization: `Bot ${BOT_TOKEN}` },
  });
  if (!res.ok) return NextResponse.json({ error: "Discord API error" }, { status: 502 });

  const channels = await res.json();
  // Filter to text channels (type 0) the user has access to
  const textChannels = channels
    .filter((c: { type: number }) => c.type === 0)
    .filter((c: { id: string }) => allowedChannels.includes("*") || allowedChannels.includes(c.id))
    .map((c: { id: string; name: string; position: number }) => ({ id: c.id, name: c.name, position: c.position }))
    .sort((a: { position: number }, b: { position: number }) => a.position - b.position);

  // Cache channel names for inbox
  try {
    const bulk = textChannels.map((c: { id: string; name: string }) => ({
      updateOne: { filter: { channelId: c.id }, update: { $set: { channelId: c.id, name: c.name } }, upsert: true }
    }));
    if (bulk.length > 0) await db.collection("discord_channels_cache").bulkWrite(bulk);
  } catch (e) { console.error("[channels cache]", e); }

  return NextResponse.json(textChannels);
}
