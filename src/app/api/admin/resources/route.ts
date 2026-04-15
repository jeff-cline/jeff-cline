import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { seedResources } from "@/lib/seed-resources";

export async function GET() {
  const db = await getDb();
  let resources = await db.collection("resources").find().sort({ createdAt: -1 }).toArray();

  // Auto-seed if empty
  if (resources.length === 0) {
    const docs = seedResources.map((r) => ({ ...r, createdAt: new Date() }));
    await db.collection("resources").insertMany(docs);
    resources = await db.collection("resources").find().sort({ createdAt: -1 }).toArray();
  }

  return NextResponse.json(resources);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const db = await getDb();
  await db.collection("resources").insertOne({ ...body, createdAt: new Date() });
  return NextResponse.json({ success: true }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();
  const db = await getDb();
  await db.collection("resources").deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json({ success: true });
}
