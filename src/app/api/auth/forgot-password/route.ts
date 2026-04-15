import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const db = await getDb();
    const user = await db.collection("users").findOne({ email: email.toLowerCase() });

    // Always return success to prevent email enumeration
    if (!user) return NextResponse.json({ success: true });

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hour

    await db.collection("passwordResets").insertOne({
      email: email.toLowerCase(),
      token,
      expires,
      createdAt: new Date(),
    });

    // TODO: Send email with reset link
    // For now, log the token (in production, integrate with email service)
    console.log(`Password reset token for ${email}: ${token}`);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
