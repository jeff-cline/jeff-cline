import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/todo-auth";
import { getTodoDb } from "@/lib/todo-db";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token || !verifyToken(token)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = await getTodoDb();
  const reminders = await db.collection("todo_reminders")
    .find({ sent: false, followUpDate: { $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } })
    .sort({ followUpDate: 1 })
    .limit(50)
    .toArray();

  return NextResponse.json(reminders.map((r) => ({ ...r, _id: r._id.toString(), todoId: r.todoId.toString() })));
}
