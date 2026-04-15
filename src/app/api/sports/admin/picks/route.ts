import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";

const JWT_SECRET = "jc-sports-2026-secret";

// Get all picks (admin only)
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

    // Get all picks
    const picks = await db.collection("sports_picks")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      picks: picks.map(pick => ({
        ...pick,
        _id: pick._id.toString()
      }))
    });

  } catch (error) {
    console.error("Admin picks fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Create new pick (admin only)
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

    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { game, sport, pick, confidence, notes, premium } = await request.json();

    if (!game || !sport || !pick) {
      return NextResponse.json({ error: "Game, sport, and pick are required" }, { status: 400 });
    }

    const validSports = ["NCAAB", "NFL", "NBA", "MLB", "NHL", "UFC", "Soccer"];
    const validConfidence = ["low", "medium", "high"];

    if (!validSports.includes(sport)) {
      return NextResponse.json({ error: "Invalid sport" }, { status: 400 });
    }

    if (!validConfidence.includes(confidence)) {
      return NextResponse.json({ error: "Invalid confidence level" }, { status: 400 });
    }

    const newPick = {
      game,
      sport,
      pick,
      confidence,
      notes: notes || "",
      premium: Boolean(premium),
      published: true,
      createdBy: new ObjectId(decoded.userId),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection("sports_picks").insertOne(newPick);

    return NextResponse.json({
      success: true,
      pick: {
        ...newPick,
        _id: result.insertedId.toString(),
        createdBy: newPick.createdBy.toString()
      }
    });

  } catch (error) {
    console.error("Admin pick creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Update pick (admin only)
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

    const { pickId, published } = await request.json();

    if (!pickId) {
      return NextResponse.json({ error: "Pick ID required" }, { status: 400 });
    }

    const updateFields: any = {
      updatedAt: new Date()
    };

    if (typeof published === "boolean") {
      updateFields.published = published;
    }

    const result = await db.collection("sports_picks").updateOne(
      { _id: new ObjectId(pickId) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Pick not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Admin pick update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Delete pick (admin only)
export async function DELETE(request: NextRequest) {
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

    const { pickId } = await request.json();

    if (!pickId) {
      return NextResponse.json({ error: "Pick ID required" }, { status: 400 });
    }

    const result = await db.collection("sports_picks").deleteOne({
      _id: new ObjectId(pickId)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Pick not found" }, { status: 404 });
    }

    // Also remove any consumption records for this pick
    await db.collection("user_picks_consumed").deleteMany({
      pickId: new ObjectId(pickId)
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Admin pick deletion error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}