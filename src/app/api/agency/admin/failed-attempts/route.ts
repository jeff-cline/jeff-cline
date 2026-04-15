import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getDb } from "@/lib/mongodb";

const SECRET = process.env.NEXTAUTH_SECRET || "change-me-to-a-real-secret-in-production";

function verifyToken(req: NextRequest): { id: string; email: string; role: string } | null {
  const token = req.cookies.get("agency_session")?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, SECRET) as { id: string; email: string; role: string };
  } catch {
    return null;
  }
}

// GET: Retrieve all failed tool attempts (superadmin only)
export async function GET(req: NextRequest) {
  const user = verifyToken(req);
  if (!user || user.role !== "superadmin") {
    return NextResponse.json({ error: "Unauthorized - Super Admin access required" }, { status: 401 });
  }

  const db = await getDb();
  const attempts = await db
    .collection("failed_tool_attempts")
    .find({})
    .sort({ timestamp: -1 })
    .limit(200)
    .toArray();

  return NextResponse.json(attempts);
}

// POST: Log a failed tool attempt (any authenticated user)
export async function POST(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { tool, formData, userEmail, userName } = await req.json();

  const db = await getDb();
  await db.collection("failed_tool_attempts").insertOne({
    tool: tool || "unknown",
    formData: formData || {},
    userEmail: userEmail || user.email,
    userName: userName || "",
    userId: user.id,
    timestamp: new Date(),
  });

  return NextResponse.json({ success: true });
}
