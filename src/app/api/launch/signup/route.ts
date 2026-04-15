import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, unlockCode } = await req.json();

    if (!name || !email || !phone) {
      return NextResponse.json({ error: "Name, email, and phone are required" }, { status: 400 });
    }

    const db = await getDb();

    // Check if user already exists
    const existing = await db.collection("launch_users").findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    // Validate unlock code if provided
    let credits = 0;
    let codeUsed: string | null = null;

    if (unlockCode && unlockCode.trim()) {
      const code = await db.collection("launch_codes").findOne({
        code: unlockCode.trim().toUpperCase(),
      });

      if (code) {
        const now = new Date();
        const expired = code.expiresAt && new Date(code.expiresAt) < now;
        const maxedOut = code.maxUses > 0 && code.usedCount >= code.maxUses;

        if (!expired && !maxedOut) {
          credits = code.credits || 50;
          codeUsed = code.code;

          // Update code usage
          await db.collection("launch_codes").updateOne(
            { _id: code._id },
            {
              $inc: { usedCount: 1 },
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              $push: { usedBy: email.toLowerCase() } as any,
            }
          );
        }
      }
      // Invalid or expired code silently ignored — user still signs up with 0 credits
    }

    // Create user
    const user = {
      email: email.toLowerCase(),
      name,
      phone,
      credits,
      unlockCodeUsed: codeUsed,
      active: true,
      createdAt: new Date(),
    };

    const userInsert = await db.collection("launch_users").insertOne(user);

    // Optional: link transaction to this user for richer admin reporting
    const userId = userInsert.insertedId;

    // Record transaction if credits were awarded
    if (credits > 0) {
      await db.collection("launch_transactions").insertOne({
        userId,
        email: email.toLowerCase(),
        type: "signup_bonus",
        amount: credits,
        balance: credits,
        description: `Signup bonus via unlock code ${codeUsed}`,
        createdAt: new Date(),
      });
    }

    // Send lead to CRM webhook (fire and forget)
    try {
      await fetch("http://127.0.0.1:3000/api/todo/webhook/lead-ingest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CRM-Key": "jc-crm-2024",
        },
        body: JSON.stringify({
          source: "jeff-cline.com/launch",
          name,
          email: email.toLowerCase(),
          phone,
          leadType: "launch-signup",
        }),
      });
    } catch {
      // CRM webhook failure shouldn't block signup
      console.warn("CRM webhook failed for launch signup:", email);
    }

    return NextResponse.json({
      success: true,
      credits,
      message: credits > 0
        ? `Welcome! You received ${credits} credits.`
        : "Welcome! Sign up successful.",
    });
  } catch (error) {
    console.error("Launch signup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
