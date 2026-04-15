import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

const ADMIN_EMAIL = "jeff.cline@me.com";

function checkAdmin(req: NextRequest): string | null {
  const email = req.nextUrl.searchParams.get("adminEmail") || req.headers.get("x-admin-email");
  if (email !== ADMIN_EMAIL) return null;
  return email;
}

export async function GET(req: NextRequest) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const db = await getDb();
    const users = await db.collection("launch_users").find().sort({ createdAt: -1 }).toArray();
    const codes = await db.collection("launch_codes").find().sort({ createdAt: -1 }).toArray();
    const transactions = await db
      .collection("launch_transactions")
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ users, codes, transactions });
  } catch (error) {
    console.error("Admin GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (body.adminEmail !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { code, credits, maxUses, expiresAt } = body;

    if (!code || !credits) {
      return NextResponse.json({ error: "Code and credits amount are required" }, { status: 400 });
    }

    const db = await getDb();

    const existing = await db.collection("launch_codes").findOne({ code: code.toUpperCase() });
    if (existing) {
      return NextResponse.json({ error: "Code already exists" }, { status: 409 });
    }

    const newCode = {
      code: code.toUpperCase(),
      credits,
      maxUses: maxUses || 0, // 0 = unlimited
      usedCount: 0,
      usedBy: [],
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      createdBy: ADMIN_EMAIL,
      createdAt: new Date(),
    };

    await db.collection("launch_codes").insertOne(newCode);

    return NextResponse.json({ success: true, code: newCode });
  } catch (error) {
    console.error("Admin POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (body.adminEmail !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { email, credits, active } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const db = await getDb();
    const user = await db.collection("launch_users").findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updates: Record<string, unknown> = {};

    if (credits !== undefined) {
      const newBalance = user.credits + credits;
      if (newBalance < 0) {
        return NextResponse.json({ error: "Insufficient credits" }, { status: 400 });
      }
      updates.credits = newBalance;

      await db.collection("launch_transactions").insertOne({
        userId: user._id,
        email: email.toLowerCase(),
        type: credits > 0 ? "admin_add" : "admin_subtract",
        amount: credits,
        balance: newBalance,
        description: `Admin adjustment`,
        createdAt: new Date(),
      });
    }

    if (active !== undefined) {
      updates.active = active;
    }

    if (Object.keys(updates).length > 0) {
      await db.collection("launch_users").updateOne(
        { email: email.toLowerCase() },
        { $set: updates }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
