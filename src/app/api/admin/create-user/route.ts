import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
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

// POST: Create a new user (super admin only)
export async function POST(req: NextRequest) {
  const admin = verifyAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized - Super Admin access required" }, { status: 401 });
  }

  try {
    const { email, password, name, role } = await req.json();
    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 });
    }

    // Validate role
    const allowedRoles = ["user", "admin", "superadmin"];
    const userRole = allowedRoles.includes(role) ? role : "user";

    const db = await getDb();
    const existing = await db.collection("users").findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = {
      email: email.toLowerCase(),
      password: hashed,
      name,
      role: userRole,
      createdAt: new Date(),
      createdBy: admin.id,
    };

    await db.collection("users").insertOne(user);
    return NextResponse.json({ success: true, user: { email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    console.error("Create user error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET: List all users (super admin only)
export async function GET(req: NextRequest) {
  const admin = verifyAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized - Super Admin access required" }, { status: 401 });
  }

  const db = await getDb();
  const users = await db
    .collection("users")
    .find({}, { projection: { password: 0 } })
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json(users);
}

// DELETE: Delete a user (super admin only)
export async function DELETE(req: NextRequest) {
  const admin = verifyAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized - Super Admin access required" }, { status: 401 });
  }

  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const db = await getDb();

  // Prevent deleting yourself
  const token = req.cookies.get("agency_session")?.value;
  const payload = jwt.verify(token!, SECRET) as { email: string };
  if (payload.email === email.toLowerCase()) {
    return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
  }

  await db.collection("users").deleteOne({ email: email.toLowerCase() });
  return NextResponse.json({ success: true });
}
