import { NextRequest, NextResponse } from "next/server";
import { getTodoDb } from "@/lib/todo-db";

// Twilio status callback webhook - updates call logs with status, duration, etc.
// Also handles inbound call tracking
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const callSid = formData.get("CallSid") as string;
  const callStatus = formData.get("CallStatus") as string;
  const duration = formData.get("CallDuration") as string;
  const from = formData.get("From") as string;
  const to = formData.get("To") as string;
  const direction = formData.get("Direction") as string;
  const timestamp = formData.get("Timestamp") as string;

  if (!callSid) {
    return new NextResponse("OK", { status: 200 });
  }

  const db = await getTodoDb();

  // Try to find existing call log
  const existing = await db.collection("call_logs").findOne({ callSid });

  if (existing) {
    // Update existing outbound call log
    const update: Record<string, unknown> = {
      status: callStatus || existing.status,
      updatedAt: new Date(),
    };
    if (duration) update.duration = parseInt(duration);
    if (timestamp) update.lastEventAt = new Date(timestamp);

    await db.collection("call_logs").updateOne(
      { callSid },
      { $set: update }
    );
  } else {
    // New call we don't have a record for - likely inbound
    // Try to match the caller to a lead by phone number
    let leadMatch = null;
    if (from) {
      const normalizedFrom = from.replace(/[^\d+]/g, "");
      // Search across all lead databases for matching phone
      leadMatch = await db.collection("crm_leads").findOne({
        $or: [
          { phone: normalizedFrom },
          { phone: normalizedFrom.replace("+1", "") },
          { phone: normalizedFrom.replace("+", "") },
          { "rawData.phone": normalizedFrom },
          { "rawData.phone": normalizedFrom.replace("+1", "") },
        ]
      });
    }

    await db.collection("call_logs").insertOne({
      callSid,
      direction: direction === "inbound" ? "inbound" : (direction || "unknown"),
      from: from || "",
      to: to || "",
      leadId: leadMatch ? leadMatch._id.toString() : null,
      leadName: leadMatch ? leadMatch.name : null,
      leadSource: leadMatch ? leadMatch.source : null,
      initiatedBy: direction === "inbound" ? from : null,
      status: callStatus || "unknown",
      duration: duration ? parseInt(duration) : 0,
      notes: "",
      matchedLead: !!leadMatch,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // Return TwiML empty response (required by Twilio)
  return new NextResponse("<?xml version=\"1.0\" encoding=\"UTF-8\"?><Response/>", {
    status: 200,
    headers: { "Content-Type": "application/xml" },
  });
}
