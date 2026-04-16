import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getTodoDb } from "@/lib/todo-db";
import { requireColabUser } from "@/lib/colab-auth";

export async function GET(req: NextRequest) {
  try {
    const session = await requireColabUser(req);
    const db = await getTodoDb();
    const boards = db.collection("colab_boards");

    const query = {
      isArchived: { $ne: true },
      $or: [{ ownerId: session.userId }, { memberIds: session.userId }],
    };

    const items = await boards
      .find(query)
      .sort({ updatedAt: -1 })
      .project({
        title: 1,
        category: 1,
        ownerId: 1,
        ownerName: 1,
        containerId: 1,
        containerName: 1,
        containerOwnerId: 1,
        memberIds: 1,
        updatedAt: 1,
        createdAt: 1,
        lastEditedByName: 1,
        thumbnail: 1,
        baseImageUrl: 1,
      })
      .toArray();

    return NextResponse.json({
      boards: items.map((b) => ({
        id: b._id.toString(),
        title: b.title,
        ownerId: b.ownerId,
        ownerName: b.ownerName,
        containerId: b.containerId || null,
        containerName: b.containerName || null,
        containerOwnerId: b.containerOwnerId || null,
        category: b.category === "business" ? "business" : "project",
        memberIds: b.memberIds || [],
        createdAt: b.createdAt,
        updatedAt: b.updatedAt,
        lastEditedByName: b.lastEditedByName || null,
        thumbnail: b.thumbnail || null,
        baseImageUrl: typeof b.baseImageUrl === "string" ? b.baseImageUrl : null,
      })),
    });
  } catch (error) {
    if (String(error).includes("UNAUTHORIZED")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireColabUser(req);
    const body = await req.json();
    const title = String(body?.title || "").trim();
    const category = body?.category === "business" ? "business" : "project";
    const baseImageUrl = typeof body?.baseImageUrl === "string" ? body.baseImageUrl : null;
    const containerId = typeof body?.containerId === "string" && ObjectId.isValid(body.containerId) ? body.containerId : null;

    if (!title) {
      return NextResponse.json({ error: "Board name is required" }, { status: 400 });
    }

    const db = await getTodoDb();
    const boards = db.collection("colab_boards");

    let containerDoc: { _id: ObjectId; name: string; ownerId: string } | null = null;
    if (containerId) {
      const found = await db.collection("colab_containers").findOne({ _id: new ObjectId(containerId) });
      if (!found) {
        return NextResponse.json({ error: "Container not found" }, { status: 404 });
      }
      if (session.role !== "admin" && found.ownerId !== session.userId && !(found.memberIds || []).includes(session.userId)) {
        return NextResponse.json({ error: "No access to container" }, { status: 403 });
      }
      containerDoc = { _id: found._id, name: found.name, ownerId: found.ownerId };
    }

    const created = await boards.insertOne({
      title,
      category,
      ownerId: session.userId,
      ownerName: session.name,
      containerId: containerDoc?._id.toString() || null,
      containerName: containerDoc?.name || null,
      containerOwnerId: containerDoc?.ownerId || null,
      memberIds: [session.userId],
      createdAt: new Date(),
      updatedAt: new Date(),
      lastEditedByName: session.name,
      thumbnail: null,
      baseImageUrl,
      isArchived: false,
    });

    await db.collection("colab_board_members").updateOne(
      { boardId: created.insertedId.toString(), userId: session.userId },
      {
        $set: {
          boardId: created.insertedId.toString(),
          userId: session.userId,
          role: "owner",
          addedBy: session.userId,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    await db.collection("colab_board_events").insertOne({
      boardId: created.insertedId.toString(),
      type: "board_created",
      payload: {
        title,
        category,
        baseImageUrl,
        containerId: containerDoc?._id.toString() || null,
        containerName: containerDoc?.name || null,
      },
      userId: session.userId,
      userName: session.name,
      userColor: session.color,
      createdAt: new Date(),
    });

    await db.collection("colab_users").updateOne(
      { _id: new ObjectId(session.userId) },
      { $set: { lastBoardId: created.insertedId.toString(), lastActiveAt: new Date() } }
    );

    return NextResponse.json({
      id: created.insertedId.toString(),
      title,
      category,
      containerId: containerDoc?._id.toString() || null,
      containerName: containerDoc?.name || null,
    });
  } catch (error) {
    if (String(error).includes("UNAUTHORIZED")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
