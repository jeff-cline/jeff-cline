import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";

const JWT_SECRET = "jc-sports-2026-secret";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("sports_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Verify and decode token
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    const db = await getDb();
    const user = await db.collection("sports_users").findOne({ 
      _id: new ObjectId(decoded.userId) 
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role || "user",
        plan: user.plan || "free",
        credits: user.credits || 0,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    });

  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

// Logout function
export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("sports_token");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}