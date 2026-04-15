import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/todo-auth";
import { getTodoDb } from "@/lib/todo-db";
import { ObjectId } from "mongodb";

function auth(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function POST(
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

    const { phone, status, responseText } = await req.json();

    if (!phone || !status) {
      return NextResponse.json({ error: "Phone and status are required" }, { status: 400 });
    }

    if (!["sent", "failed", "responded"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const db = await getTodoDb();
    
    // Update the specific recipient's status
    const updateData: any = {
      "recipients.$.status": status
    };

    if (status === "sent") {
      updateData["recipients.$.sentAt"] = new Date();
    } else if (status === "responded") {
      updateData["recipients.$.respondedAt"] = new Date();
      if (responseText) {
        updateData["recipients.$.responseText"] = responseText;
      }
    }

    const result = await db.collection("sjsc_broadcasts").updateOne(
      { 
        _id: new ObjectId(id),
        "recipients.phone": phone 
      },
      {
        $set: updateData
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Broadcast or recipient not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error updating recipient status:", error);
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}