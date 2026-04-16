import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getTodoDb } from "@/lib/todo-db";
import { normalizeEmail, requireColabUser } from "@/lib/colab-auth";

type Params = { params: Promise<{ id: string }> };

async function canManage(boardId: string, userId: string, _role: string) {
  const db = await getTodoDb();
  const board = await db.collection("colab_boards").findOne({ _id: new ObjectId(boardId), isArchived: { $ne: true } });
  if (!board) return { ok: false, board: null };
  return { ok: board.ownerId === userId, board };
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const session = await requireColabUser(req);
    const { id } = await params;

    const access = await canManage(id, session.userId, session.role);
    if (!access.ok || !access.board) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const email = normalizeEmail(String(body?.email || ""));
    const role = body?.role === "viewer" ? "viewer" : "editor";

    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const db = await getTodoDb();
    const user = await db.collection("colab_users").findOne({ email });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const boardId = id;
    const userId = user._id.toString();

    await db.collection("colab_board_members").updateOne(
      { boardId, userId },
      {
        $set: {
          boardId,
          userId,
          role,
          addedBy: session.userId,
          updatedAt: new Date(),
        },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true }
    );

    await db.collection("colab_boards").updateOne(
      { _id: new ObjectId(boardId) },
      { $addToSet: { memberIds: userId }, $set: { updatedAt: new Date() } }
    );

    await db.collection("colab_board_events").insertOne({
      boardId,
      type: "member_added",
      payload: { email: user.email, name: user.name, role },
      userId: session.userId,
      userName: session.name,
      userColor: session.color,
      createdAt: new Date(),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (String(error).includes("UNAUTHORIZED")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
