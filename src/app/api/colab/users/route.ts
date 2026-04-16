import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { getTodoDb } from "@/lib/todo-db";
import { normalizeEmail, requireColabUser } from "@/lib/colab-auth";

export async function GET(req: NextRequest) {
  try {
    const session = await requireColabUser(req);
    const db = await getTodoDb();
    const scope = req.nextUrl.searchParams.get("scope");

    if (scope === "share") {
      const boardId = String(req.nextUrl.searchParams.get("boardId") || "");
      if (!ObjectId.isValid(boardId)) {
        return NextResponse.json({ error: "boardId is required" }, { status: 400 });
      }

      const board = await db.collection("colab_boards").findOne({ _id: new ObjectId(boardId), isArchived: { $ne: true } });
      if (!board) return NextResponse.json({ error: "Board not found" }, { status: 404 });
      if (board.ownerId !== session.userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

      const memberIds = Array.isArray(board.memberIds) ? board.memberIds.filter((id: unknown): id is string => typeof id === "string") : [];
      const users = await db
        .collection("colab_users")
        .find({})
        .project({ email: 1, name: 1, role: 1, color: 1 })
        .sort({ name: 1 })
        .toArray();

      return NextResponse.json({
        users: users
          .map((u) => ({
            userId: u._id.toString(),
            email: u.email,
            name: u.name,
            role: u.role,
            color: u.color,
          }))
          .filter((u) => !memberIds.includes(u.userId)),
      });
    }

    if (session.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const users = await db
      .collection("colab_users")
      .find({})
      .project({ email: 1, name: 1, role: 1, color: 1, createdAt: 1, lastBoardId: 1, lastActiveAt: 1 })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      users: users.map((u) => ({
        userId: u._id.toString(),
        email: u.email,
        name: u.name,
        role: u.role,
        color: u.color,
        createdAt: u.createdAt,
        lastBoardId: u.lastBoardId || null,
        lastActiveAt: u.lastActiveAt || null,
      })),
    });
  } catch (error) {
    if (String(error).includes("UNAUTHORIZED")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireColabUser(req);
    if (session.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const name = String(body?.name || "").trim();
    const email = normalizeEmail(String(body?.email || ""));
    const password = String(body?.password || "").trim();
    const role = body?.role === "admin" ? "admin" : "member";

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
    }

    const db = await getTodoDb();
    const existing = await db.collection("colab_users").findOne({ email });
    if (existing) return NextResponse.json({ error: "User already exists" }, { status: 409 });

    const hash = await bcrypt.hash(password, 10);
    const created = await db.collection("colab_users").insertOne({
      name,
      email,
      password: hash,
      role,
      color: body?.color || session.color,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ userId: created.insertedId.toString(), email, name, role });
  } catch (error) {
    if (String(error).includes("UNAUTHORIZED")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
