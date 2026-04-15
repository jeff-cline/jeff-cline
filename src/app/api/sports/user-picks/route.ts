import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";

const JWT_SECRET = "jc-sports-2026-secret";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("sports_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    const db = await getDb();
    const user = await db.collection("sports_users").findOne({ 
      _id: new ObjectId(decoded.userId) 
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Get available picks based on user's plan
    let query: any = { published: true };
    
    // Plan-based filtering
    const planLimits = {
      free: { daily: 1, includePremium: false },
      starter: { daily: 3, includePremium: false },
      pro: { daily: Infinity, includePremium: true },
      elite: { daily: Infinity, includePremium: true },
      unlimited: { daily: Infinity, includePremium: true }
    };

    const userPlan = user.plan || "free";
    const planLimit = planLimits[userPlan as keyof typeof planLimits];

    if (!planLimit.includePremium) {
      query.premium = { $ne: true };
    }

    // Get today's picks count for user
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayConsumptionCount = await db.collection("user_picks_consumed").countDocuments({
      userId: new ObjectId(decoded.userId),
      consumedAt: { $gte: today, $lt: tomorrow }
    });

    // Check if user can consume more picks today
    const canConsumeMore = userPlan === "unlimited" || todayConsumptionCount < planLimit.daily;

    // Get picks
    const picks = await db.collection("sports_picks")
      .find(query)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .toArray();

    // Get user's consumed picks to mark which ones they've already seen
    const consumedPicks = await db.collection("user_picks_consumed")
      .find({ userId: new ObjectId(decoded.userId) })
      .project({ pickId: 1 })
      .toArray();

    const consumedPickIds = new Set(consumedPicks.map(p => p.pickId.toString()));

    // Enhance picks with consumption status
    const enhancedPicks = picks.map(pick => ({
      ...pick,
      _id: pick._id.toString(),
      consumed: consumedPickIds.has(pick._id.toString()),
      requiresCredits: !consumedPickIds.has(pick._id.toString())
    }));

    return NextResponse.json({
      picks: enhancedPicks,
      user: {
        plan: userPlan,
        credits: user.credits || 0,
        todayPicksConsumed: todayConsumptionCount,
        dailyLimit: planLimit.daily,
        canConsumeMore: canConsumeMore
      },
      pagination: {
        limit,
        offset,
        total: await db.collection("sports_picks").countDocuments(query)
      }
    });

  } catch (error) {
    console.error("User picks error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Consume a pick (deduct credit)
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("sports_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const { pickId } = await request.json();

    if (!pickId) {
      return NextResponse.json({ error: "Pick ID required" }, { status: 400 });
    }

    const db = await getDb();
    
    // Check if user exists and get their plan/credits
    const user = await db.collection("sports_users").findOne({ 
      _id: new ObjectId(decoded.userId) 
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if pick exists
    const pick = await db.collection("sports_picks").findOne({ 
      _id: new ObjectId(pickId) 
    });

    if (!pick) {
      return NextResponse.json({ error: "Pick not found" }, { status: 404 });
    }

    // Check if already consumed
    const alreadyConsumed = await db.collection("user_picks_consumed").findOne({
      userId: new ObjectId(decoded.userId),
      pickId: new ObjectId(pickId)
    });

    if (alreadyConsumed) {
      return NextResponse.json({ error: "Pick already consumed" }, { status: 409 });
    }

    // Check plan limits and credits
    const userPlan = user.plan || "free";
    
    if (userPlan === "unlimited") {
      // Unlimited users don't use credits
    } else {
      // Check daily limits
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayConsumptionCount = await db.collection("user_picks_consumed").countDocuments({
        userId: new ObjectId(decoded.userId),
        consumedAt: { $gte: today, $lt: tomorrow }
      });

      const planLimits = {
        free: 1,
        starter: 3,
        pro: Infinity,
        elite: Infinity
      };

      const dailyLimit = planLimits[userPlan as keyof typeof planLimits];
      
      if (todayConsumptionCount >= dailyLimit) {
        return NextResponse.json({ error: "Daily pick limit reached for your plan" }, { status: 429 });
      }

      // Check credits
      if ((user.credits || 0) < 1) {
        return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
      }

      // Deduct credit
      await db.collection("sports_users").updateOne(
        { _id: new ObjectId(decoded.userId) },
        { $inc: { credits: -1 } }
      );
    }

    // Record consumption
    await db.collection("user_picks_consumed").insertOne({
      userId: new ObjectId(decoded.userId),
      pickId: new ObjectId(pickId),
      consumedAt: new Date()
    });

    // Return the pick data
    return NextResponse.json({
      success: true,
      pick: {
        ...pick,
        _id: pick._id.toString()
      },
      creditsRemaining: userPlan === "unlimited" ? "unlimited" : Math.max(0, (user.credits || 0) - 1)
    });

  } catch (error) {
    console.error("Pick consumption error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}