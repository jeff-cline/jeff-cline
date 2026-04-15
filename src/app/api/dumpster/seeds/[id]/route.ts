import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { auth } from "@/lib/auth";
import { canTriage, SEED_STATUSES, PRIORITIES, COLORS } from "@/lib/dumpster";
import { getCollections } from "@/lib/dumpster-db";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const role = (session.user as any).role || "user";
  const userId = (session.user as any).id;

  const { id } = await params;
  if (!ObjectId.isValid(id)) return NextResponse.json({ error: "Bad id" }, { status: 400 });

  const { seeds } = await getCollections();
  const existing = await seeds.findOne({ _id: new ObjectId(id) });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isOwner = existing.createdBy === userId;
  if (!canTriage(role) && !isOwner) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const update: any = { updatedAt: new Date() };
  if (body.status && SEED_STATUSES.includes(body.status)) update.status = body.status;
  if (body.priority && PRIORITIES.includes(body.priority)) update.priority = body.priority;
  if (body.color && COLORS.includes(body.color)) update.color = body.color;
  if ("companyId" in body) update.companyId = body.companyId || null;
  if ("projectId" in body) update.projectId = body.projectId || null;
  if (typeof body.title === "string") update.title = body.title;
  if (typeof body.note === "string") update.note = body.note;
  if (Array.isArray(body.tags)) update.tags = body.tags.map(String);

  await seeds.updateOne({ _id: new ObjectId(id) }, { $set: update });
  const fresh = await seeds.findOne({ _id: new ObjectId(id) });
  return NextResponse.json(fresh);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const role = (session.user as any).role || "user";
  if (!canTriage(role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  if (!ObjectId.isValid(id)) return NextResponse.json({ error: "Bad id" }, { status: 400 });

  const { seeds, comments } = await getCollections();
  await seeds.deleteOne({ _id: new ObjectId(id) });
  await comments.deleteMany({ seedId: id });
  return NextResponse.json({ ok: true });
}
