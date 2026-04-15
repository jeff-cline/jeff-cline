import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";

const JWT_SECRET = "jc-sports-2026-secret";

// Get all users (admin only)
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("sports_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    const db = await getDb();
    const adminUser = await db.collection("sports_users").findOne({ 
      _id: new ObjectId(decoded.userId) 
    });

    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    // Get all users with basic info
    const users = await db.collection("sports_users")
      .find({})
      .project({ password: 0 }) // Exclude password
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      users: users.map(user => ({
        ...user,
        _id: user._id.toString()
      }))
    });

  } catch (error) {
    console.error("Admin users fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Update user plan (admin only)
export async function PATCH(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("sports_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    const db = await getDb();
    const adminUser = await db.collection("sports_users").findOne({ 
      _id: new ObjectId(decoded.userId) 
    });

    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { userId, plan } = await request.json();

    if (!userId || !plan) {
      return NextResponse.json({ error: "User ID and plan required" }, { status: 400 });
    }

    const validPlans = ["free", "starter", "pro", "elite", "unlimited"];
    if (!validPlans.includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const result = await db.collection("sports_users").updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          plan: plan,
          updatedAt: new Date()
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Admin user update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}