import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET = process.env.NEXTAUTH_SECRET || "change-me-to-a-real-secret-in-production";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const db = await getDb();
    const user = await db.collection("users").findOne({ email: email.toLowerCase() });
    if (!user || !user.password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password as string, user.password as string);
    if (!valid) {
      console.error("Agency login: bcrypt compare failed", { 
        email: email.toLowerCase(),
        hashPrefix: user.password?.substring(0, 10),
        passwordLength: (password as string).length,
        bcryptType: typeof bcrypt.compare,
      });
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role || "user",
      },
      SECRET,
      { expiresIn: "24h" }
    );

    // Set as HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role || "user",
      },
    });

    response.cookies.set("agency_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 86400, // 24 hours
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Agency login error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
