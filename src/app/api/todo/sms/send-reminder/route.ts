import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/todo-auth";
import { getTodoDb } from "@/lib/todo-db";
import { ObjectId } from "mongodb";

function auth(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID || "AC34a39ce34206b2f8145c23b0e3c99981";
const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN || "437a34c5ca55d84c956ac840a4f9592d";
const MESSAGING_SERVICE_SID = process.env.TWILIO_MESSAGING_SERVICE_SID || "MG851df906936157a37dd723223a473e05";

async function sendSms(to: string, body: string) {
  let normalized = to.replace(/[^\d+]/g, "");
  if (!normalized.startsWith("+")) {
    if (normalized.length === 10) normalized = "+1" + normalized;
    else if (normalized.length === 11 && normalized.startsWith("1")) normalized = "+" + normalized;
    else normalized = "+" + normalized;
  }
  const authHeader = Buffer.from(`${TWILIO_SID}:${TWILIO_TOKEN}`).toString("base64");
  const params = new URLSearchParams();
  params.set("To", normalized);
  params.set("MessagingServiceSid", MESSAGING_SERVICE_SID);
  params.set("Body", body);

  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${authHeader}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Twilio error");
  return data;
}

export async function POST(req: NextRequest) {
  const session = auth(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "admin") return NextResponse.json({ error: "Admin only" }, { status: 403 });

  const { todoId, phone } = await req.json();
  if (!todoId) return NextResponse.json({ error: "Missing todoId" }, { status: 400 });

  const db = await getTodoDb();
  const todo = await db.collection("todo_items").findOne({ _id: new ObjectId(todoId) });
  if (!todo) return NextResponse.json({ error: "Todo not found" }, { status: 404 });

  let targetPhone = phone;
  if (!targetPhone && todo.assignedTo) {
    const assignedUser = await db.collection("todo_users").findOne({ name: todo.assignedTo });
    if (assignedUser?.phone) targetPhone = assignedUser.phone;
  }
  if (!targetPhone) {
    return NextResponse.json({ error: "No phone number available for this reminder" }, { status: 400 });
  }

  const followUp = todo.followUpDate
    ? new Date(todo.followUpDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })
    : "N/A";
  const message = `Vault Reminder: ${todo.title} - Follow up on ${followUp}`;

  try {
    const result = await sendSms(targetPhone, message);

    // Mark reminder as sent if one exists
    await db.collection("todo_reminders").updateOne(
      { todoId: new ObjectId(todoId), sent: false },
      { $set: { sent: true, sentAt: new Date(), sentVia: "sms" } }
    );

    return NextResponse.json({ success: true, messageSid: result.sid });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
