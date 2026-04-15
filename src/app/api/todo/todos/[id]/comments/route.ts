import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/todo-auth";
import { getTodoDb } from "@/lib/todo-db";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token || !verifyToken(token)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const db = await getTodoDb();
  const comments = await db.collection("todo_comments")
    .find({ todoId: new ObjectId(id) })
    .sort({ createdAt: 1 })
    .toArray();

  return NextResponse.json(comments.map((c) => ({ ...c, _id: c._id.toString(), todoId: c.todoId.toString() })));
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const session = verifyToken(token);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { text } = await req.json();
  const db = await getTodoDb();

  const comment = {
    todoId: new ObjectId(id),
    author: session.name,
    text,
    createdAt: new Date(),
  };

  await db.collection("todo_comments").insertOne(comment);
  return NextResponse.json({ ok: true });
}
