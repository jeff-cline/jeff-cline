import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/todo-auth";

function auth(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID || "AC34a39ce34206b2f8145c23b0e3c99981";
const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN || "437a34c5ca55d84c956ac840a4f9592d";
const TWILIO_FROM = process.env.TWILIO_FROM_NUMBER || "+17245733737";
const MESSAGING_SERVICE_SID = process.env.TWILIO_MESSAGING_SERVICE_SID || "MG851df906936157a37dd723223a473e05";

export async function POST(req: NextRequest) {
  const session = auth(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (session.role !== "admin") {
    return NextResponse.json({ error: "Only admins can send SMS" }, { status: 403 });
  }

  const body = await req.json();
  const { to, message } = body;

  if (!to || !message) {
    return NextResponse.json({ error: "Missing 'to' or 'message'" }, { status: 400 });
  }

  // Normalize
  let normalized = to.replace(/[^\d+]/g, "");
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
    params.set("Body", message);

    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`,
      {
        method: "POST",
        headers: {
          "Authorization": `Basic ${authHeader}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.message || "Twilio error", code: data.code }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      messageSid: data.sid,
      status: data.status,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
