import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";

const JWT_SECRET = "jc-sports-2026-secret";

// Get user's credit balance
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("sports_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    const db = await getDb();
    const user = await db.collection("sports_users").findOne(
      { _id: new ObjectId(decoded.userId) },
      { projection: { credits: 1, plan: 1, name: 1 } }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      credits: user.credits || 0,
      plan: user.plan || "free",
      name: user.name
    });

  } catch (error) {
    console.error("Credits check error:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

// Admin route to add/remove credits
export async function POST(request: NextRequest) {
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

    // Check if user is admin
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { userId, credits, action } = await request.json();

    if (!userId || typeof credits !== "number") {
      return NextResponse.json({ error: "User ID and credits amount required" }, { status: 400 });
    }

    let updateOperation;
    if (action === "set") {
      updateOperation = { $set: { credits: Math.max(0, credits) } };
    } else if (action === "add") {
      updateOperation = { $inc: { credits: credits } };
    } else if (action === "subtract") {
      updateOperation = { $inc: { credits: -credits } };
    } else {
      return NextResponse.json({ error: "Invalid action. Use 'set', 'add', or 'subtract'" }, { status: 400 });
    }

    const result = await db.collection("sports_users").updateOne(
      { _id: new ObjectId(userId) },
      updateOperation
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get updated user
    const updatedUser = await db.collection("sports_users").findOne(
      { _id: new ObjectId(userId) },
      { projection: { credits: 1, name: 1, email: 1 } }
    );

    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        name: updatedUser?.name,
        email: updatedUser?.email,
        credits: updatedUser?.credits || 0
      }
    });

  } catch (error) {
    console.error("Credits update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Deduct credits when user consumes a pick
export async function PATCH(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("sports_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    const { creditsToDeduct = 1 } = await request.json();

    const db = await getDb();
    
    // Check current credits first
    const user = await db.collection("sports_users").findOne({ 
      _id: new ObjectId(decoded.userId) 
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.plan === "unlimited") {
      // Unlimited users don't consume credits
      return NextResponse.json({ 
        success: true, 
        credits: "unlimited",
        message: "Unlimited plan - no credits deducted" 
      });
    }

    if ((user.credits || 0) < creditsToDeduct) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
    }

    // Deduct credits
    const result = await db.collection("sports_users").updateOne(
      { _id: new ObjectId(decoded.userId) },
      { $inc: { credits: -creditsToDeduct } }
    );

    const updatedUser = await db.collection("sports_users").findOne(
      { _id: new ObjectId(decoded.userId) },
      { projection: { credits: 1 } }
    );

    return NextResponse.json({
      success: true,
      credits: updatedUser?.credits || 0,
      deducted: creditsToDeduct
    });

  } catch (error) {
    console.error("Credits deduction error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}