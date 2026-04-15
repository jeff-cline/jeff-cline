import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

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
    const { email, password, name, role, monthlyCredits } = await req.json();
    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 });
    }

    // Validate role
    const allowedRoles = ["user", "admin", "superadmin"];
    const userRole = allowedRoles.includes(role) ? role : "user";

    // Validate monthly credits if provided
    let userCredits: number | undefined;
    if (monthlyCredits !== undefined) {
      const mc = parseInt(monthlyCredits);
      if (isNaN(mc) || mc < 1 || mc > 10000) {
        return NextResponse.json({ error: "Monthly dollar budget must be between $1 and $10,000" }, { status: 400 });
      }
      userCredits = mc;
    }

    const db = await getDb();
    const existing = await db.collection("users").findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);
    const user: Record<string, unknown> = {
      email: email.toLowerCase(),
      password: hashed,
      name,
      role: userRole,
      creditsUsed: 0,
      creditResetDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      createdAt: new Date(),
      createdBy: admin.id,
    };

    // Only set monthlyCredits if explicitly provided (otherwise uses global default)
    if (userCredits !== undefined) {
      user.monthlyCredits = userCredits;
    }

    await db.collection("users").insertOne(user);
    return NextResponse.json({
      success: true,
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
        monthlyCredits: userCredits,
      },
    });
  } catch (err) {
    console.error("Create user error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET: List all users (super admin only) - includes credit info
export async function GET(req: NextRequest) {
  const admin = verifyAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized - Super Admin access required" }, { status: 401 });
  }

  const db = await getDb();

  // Get default monthly credits from global config
  const creditConfig = await db.collection("globalSettings").findOne({ key: "credit_config" });
  const defaultMonthlyCredits = creditConfig?.defaultMonthlyCredits || 100;

  const users = await db
    .collection("users")
    .find({}, { projection: { password: 0 } })
    .sort({ createdAt: -1 })
    .toArray();

  // Enrich users with effective credit info
  const enriched = users.map((u) => ({
    ...u,
    effectiveMonthlyCredits: u.monthlyCredits ?? defaultMonthlyCredits,
    creditsUsed: u.creditsUsed || 0,
    creditsRemaining: (u.monthlyCredits ?? defaultMonthlyCredits) - (u.creditsUsed || 0),
    isUnlimited: u.role === "superadmin",
  }));

  return NextResponse.json(enriched);
}

// PATCH: Update a user's credit limit (super admin only)
export async function PATCH(req: NextRequest) {
  const admin = verifyAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized - Super Admin access required" }, { status: 401 });
  }

  const { email, monthlyCredits, resetCredits } = await req.json();
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const db = await getDb();
  const updateData: Record<string, unknown> = {};

  if (monthlyCredits !== undefined) {
    const mc = parseInt(monthlyCredits);
    if (isNaN(mc) || mc < 1 || mc > 10000) {
      return NextResponse.json({ error: "Monthly dollar budget must be between $1 and $10,000" }, { status: 400 });
    }
    updateData.monthlyCredits = mc;
  }

  // Allow admin to manually reset a user's credits
  if (resetCredits) {
    updateData.creditsUsed = 0;
    updateData.creditResetDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const result = await db.collection("users").updateOne(
    { email: email.toLowerCase() },
    { $set: updateData }
  );

  if (result.matchedCount === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
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
