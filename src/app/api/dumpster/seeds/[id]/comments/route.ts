import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { auth } from "@/lib/auth";
import { getCollections } from "@/lib/dumpster-db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { comments } = await getCollections();
  const docs = await comments.find({ seedId: id }).sort({ createdAt: 1 }).toArray();
  return NextResponse.json(docs);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;
  const userName = session.user.name || session.user.email || "Unknown";
  const { id } = await params;
  if (!ObjectId.isValid(id)) return NextResponse.json({ error: "Bad id" }, { status: 400 });

  const { body } = await req.json();
  const text = (body || "").toString().trim();
  if (!text) return NextResponse.json({ error: "Empty comment" }, { status: 400 });

  const { comments, seeds } = await getCollections();
  const exists = await seeds.findOne({ _id: new ObjectId(id) }, { projection: { _id: 1 } });
  if (!exists) return NextResponse.json({ error: "Seed not found" }, { status: 404 });

  const doc = { seedId: id, userId, userName, body: text, createdAt: new Date() };
  const result = await comments.insertOne(doc);
  return NextResponse.json({ _id: result.insertedId, ...doc }, { status: 201 });
}
