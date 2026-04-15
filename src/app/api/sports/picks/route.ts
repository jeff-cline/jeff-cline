import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET: Fetch all picks with optional filters
export async function GET(req: NextRequest) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status"); // pending, win, loss, push
    const sport = searchParams.get("sport");
    const limit = parseInt(searchParams.get("limit") || "100");

    const filter: any = {};
    if (status && status !== "all") filter.status = status;
    if (sport && sport !== "all") filter.sport = sport;

    const picks = await db
      .collection("sports_picks")
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    // Calculate stats
    const allPicks = await db.collection("sports_picks").find({}).toArray();
    const settled = allPicks.filter((p: any) => p.status === "win" || p.status === "loss" || p.status === "push");
    const wins = allPicks.filter((p: any) => p.status === "win");
    const losses = allPicks.filter((p: any) => p.status === "loss");
    const pushes = allPicks.filter((p: any) => p.status === "push");
    const placed = allPicks.filter((p: any) => p.status === "placed");
    const thinking = allPicks.filter((p: any) => p.status === "thinking");
    const pending = allPicks.filter((p: any) => p.status === "pending" || p.status === "placed");

    const totalWagered = settled.reduce((sum: number, p: any) => sum + (p.stake || 0), 0);
    const pendingWagered = pending.reduce((sum: number, p: any) => sum + (p.stake || 0), 0);
    const pendingPotential = pending.reduce((sum: number, p: any) => sum + (p.potentialPayout || 0), 0);
    const totalReturned = wins.reduce((sum: number, p: any) => sum + (p.payout || 0), 0);
    const totalLost = losses.reduce((sum: number, p: any) => sum + (p.stake || 0), 0);
    const pushReturns = pushes.reduce((sum: number, p: any) => sum + (p.stake || 0), 0);
    const netGain = totalReturned - totalWagered + pushReturns;
    const roi = totalWagered > 0 ? ((netGain / totalWagered) * 100) : 0;

    const winPct = settled.length > 0 ? ((wins.length / settled.length) * 100) : 0;
    const lossPct = settled.length > 0 ? ((losses.length / settled.length) * 100) : 0;

    // Stats by sport
    const sportStats: Record<string, any> = {};
    for (const p of allPicks) {
      const s = p.sport || "Unknown";
      if (!sportStats[s]) sportStats[s] = { wins: 0, losses: 0, pushes: 0, pending: 0, wagered: 0, returned: 0 };
      if (p.status === "win") { sportStats[s].wins++; sportStats[s].returned += (p.payout || 0); }
      if (p.status === "loss") sportStats[s].losses++;
      if (p.status === "push") sportStats[s].pushes++;
      if (p.status === "pending") sportStats[s].pending++;
      if (p.status !== "pending") sportStats[s].wagered += (p.stake || 0);
    }

    // Streak calculation
    const sortedSettled = settled.sort((a: any, b: any) => new Date(b.settledAt || b.createdAt).getTime() - new Date(a.settledAt || a.createdAt).getTime());
    let streak = 0;
    let streakType = "";
    for (const p of sortedSettled) {
      if (!streakType) { streakType = p.status; streak = 1; }
      else if (p.status === streakType) streak++;
      else break;
    }

    return NextResponse.json({
      picks,
      stats: {
        total: allPicks.length,
        wins: wins.length,
        losses: losses.length,
        pushes: pushes.length,
        pending: pending.length,
        settled: settled.length,
        winPct: Math.round(winPct * 10) / 10,
        lossPct: Math.round(lossPct * 10) / 10,
        totalWagered: Math.round(totalWagered * 100) / 100,
        totalReturned: Math.round(totalReturned * 100) / 100,
        netGain: Math.round(netGain * 100) / 100,
        roi: Math.round(roi * 10) / 10,
        placed: placed.length,
        thinking: thinking.length,
        pendingWagered: Math.round(pendingWagered * 100) / 100,
        pendingPotential: Math.round(pendingPotential * 100) / 100,
        allWagered: Math.round((totalWagered + pendingWagered) * 100) / 100,
        streak: streak > 0 ? `${streak}${streakType === "win" ? "W" : "L"}` : "N/A",
        sportStats,
      },
    });
  } catch (error) {
    console.error("Picks GET error:", error);
    return NextResponse.json({ picks: [], stats: {} }, { status: 500 });
  }
}

// POST: Add a new pick
export async function POST(req: NextRequest) {
  try {
    const db = await getDb();
    const body = await req.json();
    const { game, sport, pickType, pick, odds, stake, notes } = body;

    if (!game || !pick || !odds || !stake) {
      return NextResponse.json({ error: "Missing required fields: game, pick, odds, stake" }, { status: 400 });
    }

    const stakeVal = parseFloat(stake);
    if (stakeVal < 1000) {
      return NextResponse.json({ error: "Minimum bet is $1,000" }, { status: 400 });
    }
    if (stakeVal > 5000) {
      return NextResponse.json({ error: "Maximum bet is $5,000" }, { status: 400 });
    }

    // Calculate potential payout based on American odds
    let payout = 0;
    const oddsNum = parseFloat(odds);
    const stakeNum = parseFloat(stake);
    if (oddsNum > 0) {
      payout = stakeNum + (stakeNum * (oddsNum / 100));
    } else {
      payout = stakeNum + (stakeNum * (100 / Math.abs(oddsNum)));
    }

    const pickDoc = {
      game,
      sport: sport || "NCAAB",
      pickType: pickType || "spread", // spread, moneyline, total, prop
      pick,
      odds: oddsNum,
      stake: stakeNum,
      potentialPayout: Math.round(payout * 100) / 100,
      payout: 0,
      status: "pending",
      notes: notes || "",
      createdAt: new Date(),
      settledAt: null,
    };

    const result = await db.collection("sports_picks").insertOne(pickDoc);
    return NextResponse.json({ success: true, id: result.insertedId, pick: pickDoc });
  } catch (error) {
    console.error("Picks POST error:", error);
    return NextResponse.json({ error: "Failed to save pick" }, { status: 500 });
  }
}

// PATCH: Update a pick (settle as win/loss/push)
export async function PATCH(req: NextRequest) {
  try {
    const db = await getDb();
    const body = await req.json();
    const { id, status, actualPayout } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Missing id and status" }, { status: 400 });
    }

    const update: any = {
      status,
      settledAt: new Date(),
    };

    if (status === "win") {
      // Get the pick to calculate payout
      const pick = await db.collection("sports_picks").findOne({ _id: new ObjectId(id) });
      if (pick) {
        update.payout = actualPayout || pick.potentialPayout;
      }
    } else if (status === "push") {
      const pick = await db.collection("sports_picks").findOne({ _id: new ObjectId(id) });
      if (pick) update.payout = pick.stake; // Return stake on push
    } else {
      update.payout = 0;
    }

    await db.collection("sports_picks").updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Picks PATCH error:", error);
    return NextResponse.json({ error: "Failed to update pick" }, { status: 500 });
  }
}
