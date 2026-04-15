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
const TWILIO_FROM = process.env.TWILIO_FROM_NUMBER || "+17245733737";
const JEFF_PHONE = process.env.JEFF_PHONE || "+19728006670";
const CALLBACK_URL = "https://jeff-cline.com/api/todo/call/webhook";

function normalizePhone(raw: string): string {
  let n = raw.replace(/[^\d+]/g, "");
  if (!n.startsWith("+")) {
    if (n.length === 10) n = "+1" + n;
    else if (n.length === 11 && n.startsWith("1")) n = "+" + n;
    else n = "+" + n;
  }
  return n;
}

// POST - initiate click-to-call
export async function POST(req: NextRequest) {
  const session = auth(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "admin") return NextResponse.json({ error: "Admin only" }, { status: 403 });

  const body = await req.json();
  const { to, leadName, leadSource, leadId } = body;
  if (!to) return NextResponse.json({ error: "Missing 'to' phone number" }, { status: 400 });

  const normalized = normalizePhone(to);
  const whisperText = `Connecting you to ${leadName || "a lead"}${leadSource ? ` from ${leadSource}` : ""}. Medigap line.`;
  const connectTwiml = `<Response><Say voice="alice">${whisperText}</Say><Dial callerId="${TWILIO_FROM}"><Number>${normalized}</Number></Dial></Response>`;
  const connectUrl = `https://twimlets.com/echo?Twiml=${encodeURIComponent(connectTwiml)}`;

  try {
    const authHeader = Buffer.from(`${TWILIO_SID}:${TWILIO_TOKEN}`).toString("base64");
    const params = new URLSearchParams();
    params.set("To", JEFF_PHONE);
    params.set("From", TWILIO_FROM);
    params.set("Url", connectUrl);
    params.set("StatusCallback", CALLBACK_URL);
    params.set("StatusCallbackEvent", "initiated ringing answered completed");
    params.set("StatusCallbackMethod", "POST");

    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Calls.json`,
      {
        method: "POST",
        headers: { "Authorization": `Basic ${authHeader}`, "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      }
    );

    const data = await res.json();
    if (!res.ok) return NextResponse.json({ error: data.message || "Twilio error", code: data.code }, { status: 500 });

    // Log the call in MongoDB
    const db = await getTodoDb();
    await db.collection("call_logs").insertOne({
      callSid: data.sid,
      direction: "outbound",
      from: TWILIO_FROM,
      to: normalized,
      leadId: leadId || null,
      leadName: leadName || null,
      leadSource: leadSource || null,
      initiatedBy: session.email,
      status: "initiated",
      duration: 0,
      notes: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      callSid: data.sid,
      status: data.status,
      message: `Calling your phone now. Pick up to connect to ${leadName || normalized}.`,
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}

// GET - list call logs (optionally filtered by leadId)
export async function GET(req: NextRequest) {
  const session = auth(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const leadId = searchParams.get("leadId");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 20;

  const db = await getTodoDb();
  const filter: Record<string, unknown> = {};
  if (leadId) filter.leadId = leadId;

  const [logs, total] = await Promise.all([
    db.collection("call_logs").find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).toArray(),
    db.collection("call_logs").countDocuments(filter),
  ]);

  return NextResponse.json({
    logs: logs.map(l => ({ ...l, _id: l._id.toString() })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

// PATCH - update call notes
export async function PATCH(req: NextRequest) {
  const session = auth(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { callId, notes } = body;
  if (!callId) return NextResponse.json({ error: "Missing callId" }, { status: 400 });

  const db = await getTodoDb();
  await db.collection("call_logs").updateOne(
    { _id: new ObjectId(callId) },
    { $set: { notes, updatedAt: new Date() } }
  );

  return NextResponse.json({ success: true });
}
