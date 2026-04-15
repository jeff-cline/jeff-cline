import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { canManageCompanies, COLORS, FRAME_STYLES } from "@/lib/dumpster";
import { getCollections } from "@/lib/dumpster-db";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { companies } = await getCollections();
  const docs = await companies.find({}).sort({ name: 1 }).toArray();
  return NextResponse.json(docs);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const role = (session.user as any).role;
  if (!canManageCompanies(role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const name = (body.name || "").toString().trim();
  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });
  const color = COLORS.includes(body.color) ? body.color : "purple";
  const frameStyle = FRAME_STYLES.includes(body.frameStyle) ? body.frameStyle : "solid";

  const { companies } = await getCollections();
  const existing = await companies.findOne({ name });
  if (existing) return NextResponse.json(existing);

  const doc = { name, color, frameStyle, createdAt: new Date() };
  const result = await companies.insertOne(doc as any);
  return NextResponse.json({ _id: result.insertedId, ...doc }, { status: 201 });
}
