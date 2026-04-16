import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/mongodb";

// POST: Seed the initial super admin account (only if none exists)
export async function POST() {
  try {
    const email = (process.env.SUPERADMIN_EMAIL || process.env.BOOTSTRAP_ADMIN_EMAIL)?.trim();
    const password = (process.env.SUPERADMIN_PASSWORD || process.env.BOOTSTRAP_ADMIN_PASSWORD)?.trim();
    const name = (process.env.SUPERADMIN_NAME || process.env.BOOTSTRAP_ADMIN_NAME || "Super Admin").trim();

    if (!email || !password) {
      return NextResponse.json(
        { error: "SUPERADMIN_EMAIL and SUPERADMIN_PASSWORD environment variables must be set" },
        { status: 500 }
      );
    }

    const db = await getDb();

    // Check if a superadmin already exists
    const existing = await db.collection("users").findOne({ role: "superadmin" });
    if (existing) {
      return NextResponse.json({ message: "Super admin already exists", exists: true });
    }

    // Create the super admin account
    const hashed = await bcrypt.hash(password, 12);
    await db.collection("users").insertOne({
      email: email.toLowerCase(),
      password: hashed,
      name,
      role: "superadmin",
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, message: "Super admin account created" });
  } catch (err) {
    console.error("Setup error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET: Check setup status
export async function GET() {
  try {
    const db = await getDb();
    const superadmin = await db.collection("users").findOne({ role: "superadmin" });
    return NextResponse.json({ 
      setupComplete: !!superadmin,
      hasSuperAdmin: !!superadmin 
    });
  } catch {
    return NextResponse.json({ setupComplete: false, hasSuperAdmin: false });
  }
}
