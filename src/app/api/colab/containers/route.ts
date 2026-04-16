import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getTodoDb } from "@/lib/todo-db";
import { requireColabUser } from "@/lib/colab-auth";

export async function GET(req: NextRequest) {
  try {
    const session = await requireColabUser(req);
    const db = await getTodoDb();

    const query =
      session.role === "admin"
        ? {}
        : {
            $or: [{ ownerId: session.userId }, { memberIds: session.userId }],
          };

    const containers = await db.collection("colab_containers").find(query).sort({ createdAt: 1 }).toArray();

    return NextResponse.json({
      containers: containers.map((c) => ({
        id: c._id.toString(),
        name: c.name,
        ownerId: c.ownerId,
        ownerName: c.ownerName,
        createdAt: c.createdAt,
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
    const name = String(body?.name || "").trim();

    if (!name) {
      return NextResponse.json({ error: "Container name is required" }, { status: 400 });
    }

    const db = await getTodoDb();
    const existing = await db.collection("colab_containers").findOne({ ownerId: session.userId, name });
    if (existing) {
      return NextResponse.json({ error: "Container already exists" }, { status: 409 });
    }

    const created = await db.collection("colab_containers").insertOne({
      name,
      ownerId: session.userId,
      ownerName: session.name,
      memberIds: [session.userId],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await db.collection("colab_users").updateOne(
      { _id: new ObjectId(session.userId) },
      { $set: { lastActiveAt: new Date() } }
    );

    return NextResponse.json({
      id: created.insertedId.toString(),
      name,
      ownerId: session.userId,
      ownerName: session.name,
    });
  } catch (error) {
    if (String(error).includes("UNAUTHORIZED")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
