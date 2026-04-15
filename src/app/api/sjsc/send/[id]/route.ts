import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/todo-auth";
import { getTodoDb } from "@/lib/todo-db";
import { ObjectId } from "mongodb";

function auth(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = auth(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid broadcast ID" }, { status: 400 });
    }

    const db = await getTodoDb();
    const broadcast = await db.collection("sjsc_broadcasts")
      .findOne({ _id: new ObjectId(id) });

    if (!broadcast) {
      return NextResponse.json({ error: "Broadcast not found" }, { status: 404 });
    }

    // Add computed counts
    const broadcastWithCounts = {
      ...broadcast,
      recipientCount: broadcast.recipients?.length || 0,
      deliveredCount: broadcast.recipients?.filter((r: any) => r.status === "sent").length || 0,
      respondedCount: broadcast.recipients?.filter((r: any) => r.status === "responded").length || 0,
    };

    return NextResponse.json(broadcastWithCounts);

  } catch (error) {
    console.error("Error fetching broadcast:", error);
    return NextResponse.json({ error: "Failed to fetch broadcast" }, { status: 500 });
  }
}