import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/todo-auth";
import { getTodoDb } from "@/lib/todo-db";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token || !verifyToken(token)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const assignedTo = searchParams.get("assignedTo") || "";

  const db = await getTodoDb();
  const query: Record<string, unknown> = {
    followUpDate: { $ne: null },
  };
  if (start && end) {
    query.followUpDate = { $gte: new Date(start), $lte: new Date(end) };
  }
  if (assignedTo && assignedTo !== "ALL") {
    query.assignedTo = assignedTo;
  }

  const todos = await db.collection("todo_items")
    .find(query)
    .sort({ followUpDate: 1 })
    .toArray();

  return NextResponse.json(todos.map((t) => ({ ...t, _id: t._id.toString() })));
}
