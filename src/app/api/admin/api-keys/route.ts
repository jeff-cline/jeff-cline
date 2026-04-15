import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getDb();
  const keys = await db.collection("apiKeys").find().sort({ createdAt: -1 }).toArray();
  // Mask keys for display
  const masked = keys.map((k) => ({
    ...k,
    key: k.key.slice(0, 8) + "..." + k.key.slice(-4),
    fullKey: undefined,
  }));
  return NextResponse.json(masked);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { service, key } = await req.json();
  if (!service || !key) return NextResponse.json({ error: "Service and key required" }, { status: 400 });

  const db = await getDb();
  await db.collection("apiKeys").updateOne(
    { service },
    { $set: { service, key, createdBy: session.user.email, createdAt: new Date() } },
    { upsert: true }
  );
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();
  const db = await getDb();
  await db.collection("apiKeys").deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json({ success: true });
}
