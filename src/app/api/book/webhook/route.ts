import { NextRequest, NextResponse } from "next/server";

const CRM_WEBHOOK_URL = process.env.CRM_WEBHOOK_URL || "http://127.0.0.1:3000/api/todo/webhook/lead-ingest";
const CRM_WEBHOOK_KEY = process.env.CRM_WEBHOOK_KEY || "jc-crm-2024";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const triggerEvent = body.triggerEvent || body.type || "unknown";

    // Cal.com sends various events - we care about bookings
    if (!["BOOKING_CREATED", "BOOKING_RESCHEDULED", "BOOKING_CANCELLED"].includes(triggerEvent)) {
      return NextResponse.json({ ok: true, skipped: true, event: triggerEvent });
    }

    const payload = body.payload || body;
    const attendees = payload.attendees || [];
    const attendee = attendees[0] || {};
    const organizer = payload.organizer || {};

    const name = attendee.name || payload.title || "Unknown";
    const email = attendee.email || "";
    const phone = attendee.phone || attendee.phoneNumber || "";
    const eventTitle = payload.title || payload.eventTitle || "Booking";
    const eventType = payload.type?.title || payload.eventType?.title || eventTitle;
    const startTime = payload.startTime || "";
    const endTime = payload.endTime || "";
    const meetingUrl = payload.metadata?.videoCallUrl || payload.meetingUrl || "";
    const notes = attendee.notes || payload.description || "";
    const rescheduleReason = payload.rescheduleReason || "";

    const isReschedule = triggerEvent === "BOOKING_RESCHEDULED";
    const isCancelled = triggerEvent === "BOOKING_CANCELLED";

    // Push to CRM as a lead
    const crmPayload = {
      source: "cal.com",
      name,
      email,
      phone,
      page: "/book",
      type: isCancelled ? "booking-cancelled" : isReschedule ? "booking-rescheduled" : "booking",
      priority: "hot",
      message: `${isCancelled ? "CANCELLED: " : isReschedule ? "RESCHEDULED: " : ""}${eventType} - ${startTime ? new Date(startTime).toLocaleString("en-US", { timeZone: "America/Chicago" }) : "TBD"}`,
      data: {
        eventType,
        startTime,
        endTime,
        meetingUrl,
        notes,
        rescheduleReason,
        organizerName: organizer.name,
        organizerEmail: organizer.email,
        calcomBookingId: payload.bookingId || payload.uid || "",
        triggerEvent,
        rawPayload: payload,
      },
    };

    const resp = await fetch(CRM_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CRM-Key": CRM_WEBHOOK_KEY,
      },
      body: JSON.stringify(crmPayload),
    });

    const result = await resp.json();

    // Also send Discord notification
    try {
      const discordWebhookUrl = process.env.DISCORD_BOOKING_WEBHOOK;
      if (discordWebhookUrl) {
        const timeStr = startTime
          ? new Date(startTime).toLocaleString("en-US", {
              timeZone: "America/Chicago",
              weekday: "short",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })
          : "TBD";

        await fetch(discordWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: `**${isCancelled ? "CANCELLED" : isReschedule ? "RESCHEDULED" : "NEW BOOKING"}** from cal.com\n**${name}** (${email}${phone ? ` | ${phone}` : ""})\n**${eventType}** - ${timeStr}\n${meetingUrl ? `Video: ${meetingUrl}` : ""}${notes ? `\nNotes: ${notes}` : ""}`,
          }),
        });
      }
    } catch (discordErr) {
      console.error("[book/webhook] Discord notification failed:", discordErr);
    }

    return NextResponse.json({ ok: true, lead: result });
  } catch (e) {
    console.error("[book/webhook] Error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// Cal.com sends a GET to verify the webhook URL
export async function GET() {
  return NextResponse.json({ ok: true, service: "cal.com-webhook" });
}
