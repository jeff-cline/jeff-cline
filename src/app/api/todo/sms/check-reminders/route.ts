import { NextRequest, NextResponse } from "next/server";
import { getTodoDb } from "@/lib/todo-db";

const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID || "AC34a39ce34206b2f8145c23b0e3c99981";
const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN || "437a34c5ca55d84c956ac840a4f9592d";
const MESSAGING_SERVICE_SID = process.env.TWILIO_MESSAGING_SERVICE_SID || "MG851df906936157a37dd723223a473e05";
const CRON_KEY = "jc-crm-2024";

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
  const cronKey = req.headers.get("X-Cron-Key");
  if (cronKey !== CRON_KEY) {
    return NextResponse.json({ error: "Invalid cron key" }, { status: 403 });
  }

  const db = await getTodoDb();
  const now = new Date();
  const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

  const reminders = await db.collection("todo_reminders")
    .find({
      sent: false,
      followUpDate: { $lte: oneHourFromNow },
    })
    .toArray();

  let sentCount = 0;
  const errors: string[] = [];

  for (const reminder of reminders) {
    // Look up the todo to get title and assignedTo
    const todo = await db.collection("todo_items").findOne({ _id: reminder.todoId });
    if (!todo) continue;

    // Look up assigned user's phone
    const assignedUser = todo.assignedTo
      ? await db.collection("todo_users").findOne({ name: todo.assignedTo })
      : null;

    if (!assignedUser?.phone) continue;

    const followUp = todo.followUpDate
      ? new Date(todo.followUpDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })
      : "N/A";
    const message = `Vault Reminder: ${todo.title} - Follow up on ${followUp}`;

    try {
      await sendSms(assignedUser.phone, message);
      await db.collection("todo_reminders").updateOne(
        { _id: reminder._id },
        { $set: { sent: true, sentAt: new Date(), sentVia: "sms-cron" } }
      );
      sentCount++;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown";
      errors.push(`${todo.title}: ${msg}`);
    }
  }

  return NextResponse.json({ sent: sentCount, total: reminders.length, errors });
}
