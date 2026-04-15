import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { canTriage, type DumpsterSeed, type Priority, type SeedColor, PRIORITIES, COLORS } from "@/lib/dumpster";
import { getCollections } from "@/lib/dumpster-db";

const MAX_ATTACHMENT_BYTES = 1_500_000;

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = (session.user as any).role || "user";
  const userId = (session.user as any).id;
  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const companyId = url.searchParams.get("companyId");

  const { seeds } = await getCollections();
  const filter: any = {};
  if (status) filter.status = status;
  if (companyId) filter.companyId = companyId;
  if (!canTriage(role) && role !== "company_owner" && role !== "company_management" && role !== "company_staff") {
    filter.createdBy = userId;
  }

  const docs = await seeds.find(filter).sort({ createdAt: -1 }).limit(500).toArray();
  return NextResponse.json(docs);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const userName = session.user.name || session.user.email || "Unknown";

  const body = await req.json();
  const note: string = (body.note || "").toString().trim();
  const title: string = (body.title || `Seed ${new Date().toLocaleString()}`).toString().trim();
  const priority: Priority = PRIORITIES.includes(body.priority) ? body.priority : "normal";
  const color: SeedColor = COLORS.includes(body.color) ? body.color : "gray";
  const companyId = body.companyId || null;
  const projectId = body.projectId || null;
  const tags = Array.isArray(body.tags) ? body.tags.slice(0, 20).map(String) : [];

  let attachment: DumpsterSeed["attachment"];
  let kind: DumpsterSeed["kind"] = "note";
  if (body.attachment && body.attachment.dataUrl) {
    const size = Number(body.attachment.size) || body.attachment.dataUrl.length;
    if (size > MAX_ATTACHMENT_BYTES) {
      return NextResponse.json({ error: "Attachment too large (1.5MB max in MVP)" }, { status: 413 });
    }
    attachment = {
      mime: String(body.attachment.mime || "application/octet-stream"),
      name: String(body.attachment.name || "upload"),
      dataUrl: String(body.attachment.dataUrl),
      size,
    };
    kind = attachment.mime.startsWith("image/") ? "photo" : attachment.mime.startsWith("audio/") ? "voice" : "file";
  }

  if (!note && !attachment) {
    return NextResponse.json({ error: "Empty seed (need note or attachment)" }, { status: 400 });
  }

  const now = new Date();
  const doc: DumpsterSeed = {
    createdBy: userId,
    createdByName: userName,
    kind,
    title,
    note,
    attachment,
    status: "raw",
    companyId,
    projectId,
    priority,
    color,
    tags,
    createdAt: now,
    updatedAt: now,
  };

  const { seeds } = await getCollections();
  const result = await seeds.insertOne(doc);
  return NextResponse.json({ _id: result.insertedId, ...doc }, { status: 201 });
}
