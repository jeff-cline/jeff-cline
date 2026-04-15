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

export async function POST(req: NextRequest) {
  const session = auth(req);
  console.log("[vault-send] session:", session ? `${session.name} (${session.email})` : "null");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { channelId, content } = await req.json();
  console.log("[vault-send] channelId:", channelId, "content:", content?.substring(0, 50));
  if (!channelId || !content) return NextResponse.json({ error: "Missing channelId or content" }, { status: 400 });

  // Verify access
  const db = await getTodoDb();
  const user = await db.collection("todo_users").findOne({ email: session.email });
  const allowed: string[] = user?.discordChannels || [];
  if (!allowed.includes("*") && !allowed.includes(channelId)) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const fullContent = `**[${session.name}]** ${content}`;
  
  // Discord has a 2000 char limit -- split into multiple messages if needed
  const chunks: string[] = [];
  if (fullContent.length <= 2000) {
    chunks.push(fullContent);
  } else {
    // First chunk gets the name prefix
    const prefix = `**[${session.name}]** `;
    let remaining = content;
    let first = true;
    while (remaining.length > 0) {
      const pfx = first ? prefix : "";
      const maxLen = 2000 - pfx.length;
      chunks.push(pfx + remaining.substring(0, maxLen));
      remaining = remaining.substring(maxLen);
      first = false;
    }
  }

  let lastMsg: any = null;
  for (const chunk of chunks) {
    const res = await fetch(`${DISCORD_API}/channels/${channelId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bot ${BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: chunk }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.log("[vault-send] Discord API error:", res.status, err);
      return NextResponse.json({ error: "Discord API error", details: err }, { status: 502 });
    }
    lastMsg = await res.json();
  }
  console.log("[vault-send] Discord send OK, chunks:", chunks.length);
  const msg = lastMsg;

  // Write to vault_inbox so AIpril can pick it up and respond
  try {
    const channelName = (await db.collection("discord_channels_cache").findOne({ channelId }))?.name || channelId;
    await db.collection("vault_inbox").insertOne({
      channelId,
      channelName,
      senderName: session.name,
      senderEmail: session.email,
      content: content.trim(),
      discordMessageId: msg.id,
      processed: false,
      createdAt: new Date(),
    });
    console.log("[vault-send] inbox write OK");
  } catch (e) { console.error("[vault-send] inbox write error:", e); }

  return NextResponse.json(msg);
}
