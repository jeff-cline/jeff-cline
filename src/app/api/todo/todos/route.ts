import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/todo-auth";
import { getTodoDb } from "@/lib/todo-db";
import { ObjectId } from "mongodb";

function auth(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function GET(req: NextRequest) {
  const session = auth(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const assignedTo = searchParams.get("assignedTo") || "";
  const status = searchParams.get("status") || "";

  const db = await getTodoDb();
  const query: Record<string, unknown> = {};
  if (assignedTo) query.assignedTo = assignedTo;
  if (status) query.status = status;

  const todos = await db.collection("todo_items")
    .find(query)
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json(todos.map((t) => ({ ...t, _id: t._id.toString() })));
}

export async function POST(req: NextRequest) {
  const session = auth(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const db = await getTodoDb();

  const todo = {
    title: body.title || "",
    notes: body.notes || "",
    status: "open",
    assignedTo: body.assignedTo || session.name,
    assignedBy: session.name,
    fromLead: body.fromLead || null,
    leadId: body.leadId || null,
    followUpDate: body.followUpDate || null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await db.collection("todo_items").insertOne(todo);

  // If follow-up date, create reminder
  if (body.followUpDate) {
    await db.collection("todo_reminders").insertOne({
      todoId: result.insertedId,
      assignedTo: todo.assignedTo,
      followUpDate: new Date(body.followUpDate),
      title: todo.title,
      sent: false,
      createdAt: new Date(),
    });
  }

  return NextResponse.json({ ...todo, _id: result.insertedId.toString() });
}

export async function PUT(req: NextRequest) {
  const session = auth(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { _id, ...updates } = body;
  const db = await getTodoDb();

  const existing = await db.collection("todo_items").findOne({ _id: new ObjectId(_id) });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Auto-comment on reassignment
  if (updates.assignedTo && updates.assignedTo !== existing.assignedTo) {
    await db.collection("todo_comments").insertOne({
      todoId: new ObjectId(_id),
      author: session.name,
      text: `Reassigned from ${existing.assignedTo} to ${updates.assignedTo}. ${updates.reassignNote || ""}`.trim(),
      createdAt: new Date(),
    });
  }

  // Handle follow-up date changes
  if (updates.followUpDate) {
    await db.collection("todo_reminders").updateOne(
      { todoId: new ObjectId(_id) },
      {
        $set: {
          followUpDate: new Date(updates.followUpDate),
          title: updates.title || existing.title,
          assignedTo: updates.assignedTo || existing.assignedTo,
          sent: false,
        },
      },
      { upsert: true }
    );
  }

  updates.updatedAt = new Date();
  delete updates.reassignNote;

  await db.collection("todo_items").updateOne({ _id: new ObjectId(_id) }, { $set: updates });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const session = auth(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const db = await getTodoDb();
  await db.collection("todo_items").deleteOne({ _id: new ObjectId(id) });
  await db.collection("todo_comments").deleteMany({ todoId: new ObjectId(id) });
  await db.collection("todo_reminders").deleteMany({ todoId: new ObjectId(id) });

  return NextResponse.json({ ok: true });
}
