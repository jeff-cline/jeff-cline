import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

const ADMIN_EMAIL = "jeff.cline@me.com";

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get("email");
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const db = await getDb();
    const user = await db.collection("launch_users").findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      email: user.email,
      credits: user.credits,
      active: user.active,
    });
  } catch (error) {
    console.error("Credits GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { adminEmail, email, amount, description } = await req.json();

    if (adminEmail !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (!email || amount === undefined) {
      return NextResponse.json({ error: "Email and amount are required" }, { status: 400 });
    }

    const delta = Number(amount);
    if (Number.isNaN(delta)) {
      return NextResponse.json({ error: "Amount must be a number" }, { status: 400 });
    }

    const db = await getDb();
    const user = await db.collection("launch_users").findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newBalance = user.credits + delta;
    if (newBalance < 0) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 400 });
    }

    await db.collection("launch_users").updateOne(
      { email: email.toLowerCase() },
      { $set: { credits: newBalance } }
    );

    await db.collection("launch_transactions").insertOne({
      email: email.toLowerCase(),
      type: amount > 0 ? "admin_add" : "admin_subtract",
      userId: user._id,
      amount: delta,
      balance: newBalance,
      description:
        description || `Admin credit ${delta > 0 ? "addition" : "subtraction"}`,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, credits: newBalance });
  } catch (error) {
    console.error("Credits POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
