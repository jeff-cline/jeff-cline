import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/todo-auth";
import { getTodoDb } from "@/lib/todo-db";
import { ObjectId } from "mongodb";

function auth(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = auth(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const db = await getTodoDb();
  const lead = await db.collection("crm_leads").findOne({ _id: new ObjectId(id) });
  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Non-admins can only see leads assigned to or created by them
  if (session.role !== "admin") {
    const isOwner =
      lead.assignedTo === session.name ||
      lead.createdBy === session.name ||
      lead.createdBy === session.email;
    if (!isOwner) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ ...lead, _id: lead._id.toString() });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = auth(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Only admins can assign leads
  if (session.role !== "admin") {
    return NextResponse.json({ error: "Only admins can assign leads" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const db = await getTodoDb();

  const update: Record<string, unknown> = {};
  if (body.assignedTo !== undefined) update.assignedTo = body.assignedTo;

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  update.updatedAt = new Date();

  const result = await db.collection("crm_leads").updateOne(
    { _id: new ObjectId(id) },
    { $set: update }
  );

  if (result.matchedCount === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
