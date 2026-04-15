import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = "jc-sports-2026-secret";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const db = await getDb();
    const user = await db.collection("sports_users").findOne({ 
      email: email.toLowerCase() 
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Update last login
    await db.collection("sports_users").updateOne(
      { _id: user._id },
      { $set: { lastLogin: new Date() } }
    );

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: user._id.toString(), 
        email: user.email,
        role: user.role || "user"
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set("sports_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role || "user",
        plan: user.plan || "free",
        credits: user.credits || 0
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}