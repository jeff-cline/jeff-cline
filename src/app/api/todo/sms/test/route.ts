import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/todo-auth";

const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID || "AC34a39ce34206b2f8145c23b0e3c99981";
const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN || "437a34c5ca55d84c956ac840a4f9592d";
const MESSAGING_SERVICE_SID = process.env.TWILIO_MESSAGING_SERVICE_SID || "MG851df906936157a37dd723223a473e05";

function auth(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function POST(req: NextRequest) {
  const session = auth(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "admin") return NextResponse.json({ error: "Admin only" }, { status: 403 });

  const { phone } = await req.json();
  if (!phone) return NextResponse.json({ error: "Missing phone" }, { status: 400 });

  let normalized = phone.replace(/[^\d+]/g, "");
  if (!normalized.startsWith("+")) {
    if (normalized.length === 10) normalized = "+1" + normalized;
    else if (normalized.length === 11 && normalized.startsWith("1")) normalized = "+" + normalized;
    else normalized = "+" + normalized;
  }

  try {
    const authHeader = Buffer.from(`${TWILIO_SID}:${TWILIO_TOKEN}`).toString("base64");
    const params = new URLSearchParams();
    params.set("To", normalized);
    params.set("MessagingServiceSid", MESSAGING_SERVICE_SID);
    params.set("Body", "This is a test from The Vault. SMS reminders are working.");

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
    if (!res.ok) return NextResponse.json({ error: data.message || "Twilio error" }, { status: 500 });
    return NextResponse.json({ success: true, messageSid: data.sid });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
