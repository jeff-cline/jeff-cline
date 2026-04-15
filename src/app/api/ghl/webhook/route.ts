import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

// Incoming webhook from GoHighLevel
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = await getDb();

    // Store webhook event
    await db.collection("ghlWebhookEvents").insertOne({
      ...body,
      receivedAt: new Date(),
    });

    // Process based on event type
    if (body.type === "contact.created" || body.type === "contact.updated") {
      const { email, name, phone } = body.contact || body;
      if (email) {
        await db.collection("users").updateOne(
          { email: email.toLowerCase() },
          {
            $set: {
              name: name || undefined,
              phone: phone || undefined,
              ghlContactId: body.contactId || body.id,
              updatedAt: new Date(),
            },
          },
          { upsert: false }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("GHL webhook error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
