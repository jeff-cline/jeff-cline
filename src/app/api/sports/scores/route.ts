import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.ODDS_API_KEY || "";
const BASE_URL = "https://api.the-odds-api.com/v4";

let scoresCache: Record<string, { data: any; ts: number }> = {};
const CACHE_TTL = 30_000; // 30 second cache for scores

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sport = searchParams.get("sport") || "basketball_ncaab";

    const cacheKey = `scores:${sport}`;
    const cached = scoresCache[cacheKey];
    if (cached && Date.now() - cached.ts < CACHE_TTL) {
      return NextResponse.json({ ...cached.data, cached: true });
    }

    if (!API_KEY) {
      return NextResponse.json({
        live: false,
        message: "API key not configured",
        scores: [],
      });
    }

    const url = `${BASE_URL}/sports/${sport}/scores/?apiKey=${API_KEY}&daysFrom=1`;
    const res = await fetch(url, { next: { revalidate: 30 } });

    if (!res.ok) {
      return NextResponse.json({ live: false, error: "API error", scores: [] }, { status: 502 });
    }

    const scores = await res.json();
    const remaining = res.headers.get("x-requests-remaining");

    const result = {
      live: true,
      sport,
      scores,
      remaining: remaining ? parseInt(remaining) : null,
      timestamp: new Date().toISOString(),
    };

    scoresCache[cacheKey] = { data: result, ts: Date.now() };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Scores API route error:", error);
    return NextResponse.json({ live: false, error: "Failed to fetch scores", scores: [] }, { status: 500 });
  }
}
