import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getDb } from "@/lib/mongodb";

const SECRET = process.env.NEXTAUTH_SECRET || "change-me-to-a-real-secret-in-production";

function verifyAdmin(req: NextRequest): { id: string; role: string } | null {
  const token = req.cookies.get("agency_session")?.value;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, SECRET) as { id: string; role: string };
    if (payload.role !== "superadmin") return null;
    return payload;
  } catch {
    return null;
  }
}

// GET: Retrieve global settings (super admin only)
export async function GET(req: NextRequest) {
  const admin = verifyAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized - Super Admin access required" }, { status: 401 });
  }

  const db = await getDb();
  const settings = await db.collection("globalSettings").find().toArray();

  // Mask the password for security
  const masked = settings.map((s) => {
    if (s.key === "seo_api_credentials" && s.password) {
      return { ...s, password: s.password.substring(0, 4) + "..." + s.password.slice(-4) };
    }
    return s;
  });

  return NextResponse.json(masked);
}

// POST: Update global settings (super admin only)
export async function POST(req: NextRequest) {
  const admin = verifyAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized - Super Admin access required" }, { status: 401 });
  }

  const { key, ...data } = await req.json();
  if (!key) {
    return NextResponse.json({ error: "Setting key is required" }, { status: 400 });
  }

  const db = await getDb();
  await db.collection("globalSettings").updateOne(
    { key },
    { $set: { key, ...data, updatedAt: new Date(), updatedBy: admin.id } },
    { upsert: true }
  );

  return NextResponse.json({ success: true });
}
