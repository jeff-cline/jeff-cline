import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { subject, body: emailBody, senderName, senderEmail } = body;

    if (!subject) {
      return NextResponse.json(
        { error: "subject is required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    await db.collection("todo_items").insertOne({
      title: subject,
      description: emailBody || "",
      assignedTo: "jeff.cline@me.com",
      status: "pending",
      priority: "medium",
      source: "email-tool",
      metadata: {
        senderName: senderName || "",
        senderEmail: senderEmail || "",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("[email/add-todo] Error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
