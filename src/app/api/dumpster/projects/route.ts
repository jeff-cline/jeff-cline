import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { canManageCompanies } from "@/lib/dumpster";
import { getCollections } from "@/lib/dumpster-db";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const url = new URL(req.url);
  const companyId = url.searchParams.get("companyId");
  const { projects } = await getCollections();
  const filter: any = {};
  if (companyId) filter.companyId = companyId;
  const docs = await projects.find(filter).sort({ name: 1 }).toArray();
  return NextResponse.json(docs);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const role = (session.user as any).role;
  if (!canManageCompanies(role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const name = (body.name || "").toString().trim();
  const companyId = (body.companyId || "").toString();
  if (!name || !companyId) return NextResponse.json({ error: "name and companyId required" }, { status: 400 });

  const { projects } = await getCollections();
  const doc = { name, companyId, createdAt: new Date() };
  const result = await projects.insertOne(doc as any);
  return NextResponse.json({ _id: result.insertedId, ...doc }, { status: 201 });
}
