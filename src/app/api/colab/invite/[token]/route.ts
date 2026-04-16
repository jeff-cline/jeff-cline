import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { ObjectId } from "mongodb";
import { getTodoDb } from "@/lib/todo-db";
import { requireColabUser } from "@/lib/colab-auth";

type Params = { params: Promise<{ token: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const session = await requireColabUser(req);
    const { token } = await params;

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const db = await getTodoDb();

    const invite = await db.collection("colab_invites").findOne({ tokenHash });
    if (!invite) return NextResponse.json({ error: "Invalid invite" }, { status: 404 });
    if (invite.usedAt) return NextResponse.json({ error: "Invite already used" }, { status: 410 });
    if (new Date(invite.expiresAt).getTime() < Date.now()) {
      return NextResponse.json({ error: "Invite expired" }, { status: 410 });
    }

    if (invite.email && invite.email.toLowerCase() !== session.email.toLowerCase()) {
      return NextResponse.json({ error: "This invite is tied to another email" }, { status: 403 });
    }

    const boardId = invite.boardId as string;

    await db.collection("colab_board_members").updateOne(
      { boardId, userId: session.userId },
      {
        $set: {
          boardId,
          userId: session.userId,
          role: invite.role || "editor",
          addedBy: invite.createdBy,
          updatedAt: new Date(),
        },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true }
    );

    await db.collection("colab_boards").updateOne(
      { _id: new ObjectId(boardId) },
      {
        $addToSet: { memberIds: session.userId },
        $set: { updatedAt: new Date() },
      }
    );

    await db.collection("colab_invites").updateOne(
      { _id: invite._id },
      {
        $set: {
          usedAt: new Date(),
          usedBy: session.userId,
          usedByEmail: session.email,
        },
      }
    );

    await db.collection("colab_board_events").insertOne({
      boardId,
      type: "member_joined",
      payload: { userId: session.userId, name: session.name, email: session.email },
      userId: session.userId,
      userName: session.name,
      userColor: session.color,
      createdAt: new Date(),
    });

    return NextResponse.json({ ok: true, boardId });
  } catch (error) {
    if (String(error).includes("UNAUTHORIZED")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
