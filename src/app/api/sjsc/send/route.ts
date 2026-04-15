import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/todo-auth";
import { getTodoDb } from "@/lib/todo-db";

function auth(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function GET(req: NextRequest) {
  const session = auth(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const db = await getTodoDb();
    const broadcasts = await db.collection("sjsc_broadcasts")
      .find({})
      .sort({ sentAt: -1 })
      .toArray();

    // Add computed counts for each broadcast
    const broadcastsWithCounts = broadcasts.map(broadcast => ({
      ...broadcast,
      recipientCount: broadcast.recipients?.length || 0,
      deliveredCount: broadcast.recipients?.filter((r: any) => r.status === "sent").length || 0,
      respondedCount: broadcast.recipients?.filter((r: any) => r.status === "responded").length || 0,
    }));

    return NextResponse.json(broadcastsWithCounts);
  } catch (error) {
    console.error("Error fetching broadcasts:", error);
    return NextResponse.json({ error: "Failed to fetch broadcasts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = auth(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { message, link } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const db = await getTodoDb();
    
    // Get all SJSC deck request leads with phone numbers
    const crmLeads = await db.collection("crm_leads")
      .find({ 
        type: "SJSC_DECK_REQUEST",
        phone: { $exists: true, $ne: "" }
      })
      .toArray();

    // Create recipients array
    const recipients = crmLeads.map(lead => ({
      name: lead.name || "Unknown",
      phone: lead.phone,
      email: lead.email || "",
      status: "pending",
      sentAt: null,
      respondedAt: null,
      responseText: ""
    }));

    // Create the broadcast record
    const broadcast = {
      message,
      link: link || "",
      sentAt: new Date(),
      recipients,
      createdBy: session.email,
      createdAt: new Date()
    };

    const result = await db.collection("sjsc_broadcasts").insertOne(broadcast);

    return NextResponse.json({ 
      success: true, 
      id: result.insertedId,
      recipientCount: recipients.length 
    });

  } catch (error) {
    console.error("Error creating broadcast:", error);
    return NextResponse.json({ error: "Failed to create broadcast" }, { status: 500 });
  }
}