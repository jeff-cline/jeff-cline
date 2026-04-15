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
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const channelId = formData.get("channelId") as string;
  const file = formData.get("file") as File | null;
  const message = (formData.get("message") as string) || "";

  if (!channelId) return NextResponse.json({ error: "Missing channelId" }, { status: 400 });
  if (!file && !message) return NextResponse.json({ error: "No file or message" }, { status: 400 });

  // Verify access
  const db = await getTodoDb();
  const user = await db.collection("todo_users").findOne({ email: session.email });
  const allowed: string[] = user?.discordChannels || [];
  if (!allowed.includes("*") && !allowed.includes(channelId)) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  let fileContent = "";
  let fileName = "";

  if (file) {
    fileName = file.name;
    const ext = fileName.split(".").pop()?.toLowerCase() || "";
    const textExts = ["txt", "md", "csv", "json", "html", "xml", "rtf", "log", "yml", "yaml", "ini", "conf", "cfg"];
    const docExts = ["doc", "docx"];
    const isImage = file.type.startsWith("image/");
    const isPdf = ext === "pdf" || file.type === "application/pdf";

    if (textExts.includes(ext)) {
      // Plain text -- read directly
      fileContent = await file.text();
    } else if (docExts.includes(ext)) {
      // .doc/.docx -- extract text (basic: read as text, strip binary)
      const buf = Buffer.from(await file.arrayBuffer());
      // For .docx, extract from word/document.xml
      if (ext === "docx") {
        try {
          const JSZip = (await import("jszip")).default;
          const zip = await JSZip.loadAsync(buf);
          const docXml = await zip.file("word/document.xml")?.async("string");
          if (docXml) {
            // Strip XML tags to get plain text
            fileContent = docXml
              .replace(/<w:br[^>]*\/>/g, "\n")
              .replace(/<\/w:p>/g, "\n")
              .replace(/<[^>]+>/g, "")
              .replace(/&amp;/g, "&")
              .replace(/&lt;/g, "<")
              .replace(/&gt;/g, ">")
              .replace(/&quot;/g, '"')
              .replace(/&apos;/g, "'")
              .replace(/\n{3,}/g, "\n\n")
              .trim();
          }
        } catch (e) {
          console.error("[vault-upload] docx parse error:", e);
          fileContent = `[Could not parse ${fileName}]`;
        }
      } else {
        // .doc (old format) -- best effort, strip binary
        const text = buf.toString("utf-8").replace(/[^\x20-\x7E\n\r\t]/g, " ").replace(/ {3,}/g, " ").trim();
        fileContent = text.substring(0, 50000);
      }
    } else if (isImage || isPdf) {
      // For images and PDFs, upload as Discord attachment
      const discordForm = new FormData();
      discordForm.append("payload_json", JSON.stringify({
        content: `**[${session.name}]** ${message || `[Uploaded: ${fileName}]`}`,
      }));
      const blob = new Blob([await file.arrayBuffer()], { type: file.type });
      discordForm.append("files[0]", blob, fileName);

      const res = await fetch(`${DISCORD_API}/channels/${channelId}/messages`, {
        method: "POST",
        headers: { Authorization: `Bot ${BOT_TOKEN}` },
        body: discordForm,
      });

      if (!res.ok) {
        const err = await res.text();
        console.log("[vault-upload] Discord file upload error:", err);
        return NextResponse.json({ error: "Discord upload failed" }, { status: 502 });
      }

      const msg = await res.json();

      // Write to inbox with file reference
      try {
        const channelName = (await db.collection("discord_channels_cache").findOne({ channelId }))?.name || channelId;
        await db.collection("vault_inbox").insertOne({
          channelId, channelName,
          senderName: session.name,
          senderEmail: session.email,
          content: message || `[Uploaded: ${fileName}]`,
          fileName,
          fileType: file.type,
          discordMessageId: msg.id,
          processed: false,
          createdAt: new Date(),
        });
      } catch (e) { console.error("[vault-upload] inbox write error:", e); }

      return NextResponse.json(msg);
    } else {
      // Unknown file type -- try as text
      try {
        fileContent = await file.text();
      } catch {
        return NextResponse.json({ error: `Unsupported file type: ${ext}` }, { status: 400 });
      }
    }
  }

  // Combine message + file content
  const fullText = fileContent
    ? (message ? `${message}\n\n--- ${fileName} ---\n${fileContent}` : `--- ${fileName} ---\n${fileContent}`)
    : message;

  if (!fullText.trim()) return NextResponse.json({ error: "Empty content" }, { status: 400 });

  // Send summary to Discord (chunked if needed)
  const prefix = `**[${session.name}]** `;
  const discordText = fileContent
    ? `${prefix}${message || `[Uploaded: ${fileName}]`}\n*(${fileContent.length.toLocaleString()} chars — full content stored in Vault inbox)*`
    : `${prefix}${message}`;

  const chunks: string[] = [];
  if (discordText.length <= 2000) {
    chunks.push(discordText);
  } else {
    let remaining = discordText;
    let first = true;
    while (remaining.length > 0) {
      const pfx = first ? "" : "";
      const maxLen = 2000;
      chunks.push(remaining.substring(0, maxLen));
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
      return NextResponse.json({ error: "Discord API error", details: err }, { status: 502 });
    }
    lastMsg = await res.json();
  }

  // Write FULL content to vault_inbox (not truncated)
  try {
    const channelName = (await db.collection("discord_channels_cache").findOne({ channelId }))?.name || channelId;
    await db.collection("vault_inbox").insertOne({
      channelId, channelName,
      senderName: session.name,
      senderEmail: session.email,
      content: fullText.trim(),
      fileName: fileName || undefined,
      fileType: file?.type || undefined,
      discordMessageId: lastMsg.id,
      processed: false,
      createdAt: new Date(),
    });
    console.log("[vault-upload] inbox write OK, content length:", fullText.length);
  } catch (e) { console.error("[vault-upload] inbox write error:", e); }

  return NextResponse.json(lastMsg);
}
