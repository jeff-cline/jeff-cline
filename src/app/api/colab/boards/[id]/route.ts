import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getTodoDb } from "@/lib/todo-db";
import { requireColabUser } from "@/lib/colab-auth";

type Params = { params: Promise<{ id: string }> };

async function canAccessBoard(boardId: string, userId: string, _role: string) {
  const db = await getTodoDb();
  const boards = db.collection("colab_boards");
  const board = await boards.findOne({ _id: new ObjectId(boardId), isArchived: { $ne: true } });
  if (!board) return { allowed: false, board: null };

  const allowed = board.ownerId === userId || (board.memberIds || []).includes(userId);
  return { allowed, board };
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const session = await requireColabUser(req);
    const { id } = await params;
    const since = req.nextUrl.searchParams.get("since");

    const { allowed, board } = await canAccessBoard(id, session.userId, session.role);
    if (!allowed || !board) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = await getTodoDb();

    const eventQuery: Record<string, unknown> = { boardId: id, isArchived: { $ne: true } };
    if (since && ObjectId.isValid(since)) {
      eventQuery._id = { $gt: new ObjectId(since) };
    }

    const events = await db
      .collection("colab_board_events")
      .find(eventQuery)
      .sort({ _id: 1 })
      .limit(800)
      .toArray();

    const memberDocs = await db
      .collection("colab_board_members")
      .aggregate([
        { $match: { boardId: id } },
        {
          $lookup: {
            from: "colab_users",
            let: { uid: "$userId" },
            pipeline: [
              { $match: { $expr: { $eq: [{ $toString: "$_id" }, "$$uid"] } } },
              { $project: { name: 1, email: 1, color: 1, role: 1 } },
            ],
            as: "user",
          },
        },
        { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      ])
      .toArray();

    const members = memberDocs.map((m) => ({
      userId: m.userId,
      accessRole: m.role,
      name: m.user?.name || "Unknown",
      email: m.user?.email || "",
      color: m.user?.color || "#64748b",
      globalRole: m.user?.role || "member",
    }));

    const presenceCutoff = new Date(Date.now() - 30_000);
    const presenceDocs = await db
      .collection("colab_presence")
      .find({ boardId: id, lastSeenAt: { $gte: presenceCutoff } })
      .toArray();

    return NextResponse.json({
      board: {
        id: board._id.toString(),
        title: board.title,
        category: board.category === "business" ? "business" : "project",
        baseImageUrl: typeof board.baseImageUrl === "string" ? board.baseImageUrl : null,
        ownerId: board.ownerId,
        ownerName: board.ownerName,
        containerId: board.containerId || null,
        containerName: board.containerName || null,
        containerOwnerId: board.containerOwnerId || null,
        updatedAt: board.updatedAt,
        lastEditedByName: board.lastEditedByName || null,
      },
      members,
      presence: presenceDocs.map((p) => ({
        userId: p.userId,
        name: p.name,
        color: p.color,
        lastSeenAt: p.lastSeenAt,
      })),
      events: events.map((e) => ({
        id: e._id.toString(),
        boardId: e.boardId,
        type: e.type,
        payload: e.payload,
        userId: e.userId,
        userName: e.userName,
        userColor: e.userColor,
        createdAt: e.createdAt,
      })),
    });
  } catch (error) {
    if (String(error).includes("UNAUTHORIZED")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const session = await requireColabUser(req);
    const { id } = await params;

    const { allowed, board } = await canAccessBoard(id, session.userId, session.role);
    if (!allowed || !board) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = await getTodoDb();

    const member = await db.collection("colab_board_members").findOne({ boardId: id, userId: session.userId });
    if (session.role !== "admin" && member?.role === "viewer") {
      return NextResponse.json({ error: "Viewer cannot edit" }, { status: 403 });
    }

    const body = await req.json();
    const action = body?.action;

    if (action === "event") {
      const type = String(body?.type || "");
      const payload = body?.payload || {};
      if (!type) return NextResponse.json({ error: "Event type is required" }, { status: 400 });

      const inserted = await db.collection("colab_board_events").insertOne({
        boardId: id,
        type,
        payload,
        userId: session.userId,
        userName: session.name,
        userColor: session.color,
        createdAt: new Date(),
      });

      if (type === "stroke" || type === "clear" || type === "shape" || type === "text") {
        await db.collection("colab_boards").updateOne(
          { _id: new ObjectId(id) },
          {
            $set: {
              updatedAt: new Date(),
              lastEditedByName: session.name,
              thumbnail: typeof payload?.thumbnail === "string" ? payload.thumbnail : board.thumbnail || null,
            },
          }
        );
      }

      await db.collection("colab_users").updateOne(
        { _id: new ObjectId(session.userId) },
        { $set: { lastBoardId: id, lastActiveAt: new Date() } }
      );

      return NextResponse.json({ id: inserted.insertedId.toString(), ok: true });
    }

    if (action === "presence") {
      await db.collection("colab_presence").updateOne(
        { boardId: id, userId: session.userId },
        {
          $set: {
            boardId: id,
            userId: session.userId,
            name: session.name,
            color: session.color,
            lastSeenAt: new Date(),
          },
          $setOnInsert: { createdAt: new Date() },
        },
        { upsert: true }
      );

      await db.collection("colab_users").updateOne(
        { _id: new ObjectId(session.userId) },
        { $set: { lastBoardId: id, lastActiveAt: new Date() } }
      );

      return NextResponse.json({ ok: true });
    }

    if (action === "undo") {
      const lastEvent = await db
        .collection("colab_board_events")
        .find({
          boardId: id,
          isArchived: { $ne: true },
          type: { $in: ["stroke", "shape", "text", "image", "item_update", "clear"] },
        })
        .sort({ _id: -1 })
        .limit(1)
        .next();

      if (!lastEvent?._id) return NextResponse.json({ ok: true, removed: false });

      await db.collection("colab_board_events").updateOne(
        { _id: lastEvent._id },
        {
          $set: {
            isArchived: true,
            archivedAt: new Date(),
            archivedBy: session.userId,
          },
        }
      );

      await db.collection("colab_boards").updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            updatedAt: new Date(),
            lastEditedByName: session.name,
          },
        }
      );

      return NextResponse.json({ ok: true, removed: true, removedType: lastEvent.type });
    }

    if (action === "redo") {
      const archivedEvent = await db
        .collection("colab_board_events")
        .find({
          boardId: id,
          isArchived: true,
          type: { $in: ["stroke", "shape", "text", "image", "item_update", "clear"] },
        })
        .sort({ _id: -1 })
        .limit(1)
        .next();

      if (!archivedEvent?._id) return NextResponse.json({ ok: true, restored: false });

      await db.collection("colab_board_events").updateOne(
        { _id: archivedEvent._id },
        {
          $set: {
            isArchived: false,
            restoredAt: new Date(),
            restoredBy: session.userId,
          },
        }
      );

      await db.collection("colab_boards").updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            updatedAt: new Date(),
            lastEditedByName: session.name,
          },
        }
      );

      return NextResponse.json({ ok: true, restored: true, restoredType: archivedEvent.type });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    if (String(error).includes("UNAUTHORIZED")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const session = await requireColabUser(req);
    const { id } = await params;

    const { allowed, board } = await canAccessBoard(id, session.userId, session.role);
    if (!allowed || !board) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const isContainerBoard = typeof board.containerId === "string" && !!board.containerId;
    const canDelete = isContainerBoard
      ? board.containerOwnerId === session.userId
      : session.role === "admin" || board.ownerId === session.userId;

    if (!canDelete) {
      return NextResponse.json(
        { error: isContainerBoard ? "Only container creator can delete boards in this container" : "Only owner/admin can delete" },
        { status: 403 }
      );
    }

    const db = await getTodoDb();

    await db.collection("colab_boards").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          isArchived: true,
          updatedAt: new Date(),
          archivedAt: new Date(),
          archivedBy: session.userId,
          archivedByName: session.name,
        },
      }
    );

    await db.collection("colab_board_events").insertOne({
      boardId: id,
      type: "board_deleted",
      payload: { title: board.title },
      userId: session.userId,
      userName: session.name,
      userColor: session.color,
      createdAt: new Date(),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (String(error).includes("UNAUTHORIZED")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const session = await requireColabUser(req);
    const { id } = await params;

    const { allowed, board } = await canAccessBoard(id, session.userId, session.role);
    if (!allowed || !board) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const action = body?.action;

    const db = await getTodoDb();

    if (action === "rename") {
      const title = String(body?.title || "").trim();
      if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 });

      await db.collection("colab_boards").updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            title,
            updatedAt: new Date(),
            lastEditedByName: session.name,
          },
        }
      );

      await db.collection("colab_board_events").insertOne({
        boardId: id,
        type: "renamed",
        payload: { title },
        userId: session.userId,
        userName: session.name,
        userColor: session.color,
        createdAt: new Date(),
      });

      return NextResponse.json({ ok: true });
    }

    if (action === "set_base_image") {
      const baseImageUrl = typeof body?.baseImageUrl === "string" ? body.baseImageUrl : null;

      await db.collection("colab_boards").updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            baseImageUrl,
            updatedAt: new Date(),
            lastEditedByName: session.name,
          },
        }
      );

      await db.collection("colab_board_events").insertOne({
        boardId: id,
        type: "base_image_set",
        payload: { baseImageUrl },
        userId: session.userId,
        userName: session.name,
        userColor: session.color,
        createdAt: new Date(),
      });

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    if (String(error).includes("UNAUTHORIZED")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
