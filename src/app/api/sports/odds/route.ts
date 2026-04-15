import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.ODDS_API_KEY || "";
const BASE_URL = "https://api.the-odds-api.com/v4";

// Cache odds for 60 seconds to conserve API credits
let oddsCache: Record<string, { data: any; ts: number }> = {};
const CACHE_TTL = 60_000;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sport = searchParams.get("sport") || "basketball_ncaab";
    const markets = searchParams.get("markets") || "h2h,spreads,totals";
    const regions = searchParams.get("regions") || "us";

    const cacheKey = `${sport}:${markets}:${regions}`;
    const cached = oddsCache[cacheKey];
    if (cached && Date.now() - cached.ts < CACHE_TTL) {
      return NextResponse.json({ ...cached.data, cached: true });
    }

    if (!API_KEY) {
      // Return mock data if no API key configured yet
      return NextResponse.json({
        live: false,
        message: "API key not configured - showing sample data",
        games: [],
        remaining: null,
      });
    }

    const url = `${BASE_URL}/sports/${sport}/odds/?apiKey=${API_KEY}&regions=${regions}&markets=${markets}&oddsFormat=american`;
    const res = await fetch(url, { next: { revalidate: 60 } });

    if (!res.ok) {
      const text = await res.text();
      console.error("Odds API error:", res.status, text);
      return NextResponse.json({ live: false, error: "API error", games: [] }, { status: 502 });
    }

    const games = await res.json();
    const remaining = res.headers.get("x-requests-remaining");
    const used = res.headers.get("x-requests-used");

    const result = {
      live: true,
      sport,
      games,
      remaining: remaining ? parseInt(remaining) : null,
      used: used ? parseInt(used) : null,
      timestamp: new Date().toISOString(),
    };

    oddsCache[cacheKey] = { data: result, ts: Date.now() };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Odds API route error:", error);
    return NextResponse.json({ live: false, error: "Failed to fetch odds", games: [] }, { status: 500 });
  }
}
