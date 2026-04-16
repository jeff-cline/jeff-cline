import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { ObjectId } from "mongodb";
import { getTodoDb } from "@/lib/todo-db";
import { normalizeEmail, requireColabUser } from "@/lib/colab-auth";

type Params = { params: Promise<{ id: string }> };

async function canManageBoard(boardId: string, userId: string, _globalRole: string) {
  const db = await getTodoDb();
  const board = await db.collection("colab_boards").findOne({ _id: new ObjectId(boardId), isArchived: { $ne: true } });
  if (!board) return { ok: false, board: null };

  return { ok: board.ownerId === userId, board };
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const session = await requireColabUser(req);
    const { id } = await params;

    const access = await canManageBoard(id, session.userId, session.role);
    if (!access.ok || !access.board) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const email = normalizeEmail(String(body?.email || ""));
    const inviteRole = body?.role === "viewer" ? "viewer" : "editor";

    if (!email) return NextResponse.json({ error: "Invite email required" }, { status: 400 });

    const db = await getTodoDb();
    const rawToken = crypto.randomBytes(24).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    await db.collection("colab_invites").insertOne({
      boardId: id,
      boardTitle: access.board.title,
      email,
      role: inviteRole,
      tokenHash,
      createdBy: session.userId,
      createdByName: session.name,
      createdAt: new Date(),
      expiresAt,
      usedAt: null,
      usedBy: null,
    });

    await db.collection("colab_board_events").insertOne({
      boardId: id,
      type: "invite_created",
      payload: { email, role: inviteRole },
      userId: session.userId,
      userName: session.name,
      userColor: session.color,
      createdAt: new Date(),
    });

    const forwardedProto = req.headers.get("x-forwarded-proto") || "https";
    const forwardedHost = req.headers.get("x-forwarded-host") || req.headers.get("host");
    const envPublicUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || process.env.PUBLIC_APP_URL;
    const normalizedEnvOrigin = envPublicUrl ? envPublicUrl.replace(/\/$/, "") : null;
    const origin = normalizedEnvOrigin || (forwardedHost ? `${forwardedProto}://${forwardedHost}` : req.nextUrl.origin);
    const inviteUrl = `${origin}/colab?invite=${rawToken}`;

    return NextResponse.json({ ok: true, inviteUrl, expiresAt });
  } catch (error) {
    if (String(error).includes("UNAUTHORIZED")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
