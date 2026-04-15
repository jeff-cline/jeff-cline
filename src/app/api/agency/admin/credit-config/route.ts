import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getDb } from "@/lib/mongodb";

const SECRET = process.env.NEXTAUTH_SECRET || "change-me-to-a-real-secret-in-production";

// Default credit costs per tool action
const DEFAULT_COSTS: Record<string, number> = {
  keyword_suggestions: 1,
  related_keywords: 1,
  keyword_questions: 1,
  volume_check: 1,
  difficulty_check: 1,
  keyword_gap: 3,
  backlink_analysis: 5,
  domain_analysis: 3,
  serp_check: 2,
  competitor_analysis: 2,
  site_audit: 10,
  aeo_analysis: 8,
  content_silos: 10,
  instant_analysis: 3,
  overview_kpis: 0,
  api_test: 0,
  website_builder: 4500,
  marketing_site_builder: 4500,
};

// Human-readable tool names for the admin UI
const TOOL_LABELS: Record<string, string> = {
  keyword_suggestions: "Keyword Suggestions",
  related_keywords: "Related Keywords",
  keyword_questions: "Keyword Questions (PAA)",
  volume_check: "Search Volume Lookup",
  difficulty_check: "Keyword Difficulty",
  keyword_gap: "Keyword Gap Analysis",
  backlink_analysis: "Backlink Analyzer",
  domain_analysis: "Domain Analysis",
  serp_check: "SERP Tracker",
  competitor_analysis: "Competitor Analysis",
  site_audit: "Site Audit",
  aeo_analysis: "AEO Optimization",
  content_silos: "Content Silos",
  instant_analysis: "Instant Page Analysis",
  overview_kpis: "Overview Dashboard KPIs",
  api_test: "API Connection Test",
  website_builder: "Optimized Website Builder",
  marketing_site_builder: "Marketing Site Builder",
};

function verifyAdmin(req: NextRequest): { id: string; role: string } | null {
  const token = req.cookies.get("agency_session")?.value;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, SECRET) as { id: string; role: string };
    if (payload.role !== "superadmin") return null;
    return payload;
  } catch {
    return null;
  }
}

// GET: Retrieve current credit configuration
export async function GET(req: NextRequest) {
  const admin = verifyAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized - Super Admin access required" }, { status: 401 });
  }

  const db = await getDb();
  const config = await db.collection("globalSettings").findOne({ key: "credit_config" });

  return NextResponse.json({
    defaultMonthlyCredits: config?.defaultMonthlyCredits ?? 100,
    costs: config?.costs ?? DEFAULT_COSTS,
    defaults: DEFAULT_COSTS,
    labels: TOOL_LABELS,
  });
}

// POST: Update credit configuration
export async function POST(req: NextRequest) {
  const admin = verifyAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized - Super Admin access required" }, { status: 401 });
  }

  const { defaultMonthlyCredits, costs } = await req.json();

  // Validate
  if (defaultMonthlyCredits !== undefined && (typeof defaultMonthlyCredits !== "number" || defaultMonthlyCredits < 1 || defaultMonthlyCredits > 10000)) {
    return NextResponse.json({ error: "Default monthly dollar budget must be between $1 and $10,000" }, { status: 400 });
  }

  if (costs !== undefined && typeof costs !== "object") {
    return NextResponse.json({ error: "Costs must be an object" }, { status: 400 });
  }

  // Validate individual cost values
  if (costs) {
    for (const [key, value] of Object.entries(costs)) {
      if (typeof value !== "number" || (value as number) < 0 || (value as number) > 10000) {
        return NextResponse.json({ error: `Invalid cost for ${key}: must be 0-10000` }, { status: 400 });
      }
    }
  }

  const db = await getDb();
  const updateData: Record<string, unknown> = {
    key: "credit_config",
    updatedAt: new Date(),
    updatedBy: admin.id,
  };

  if (defaultMonthlyCredits !== undefined) {
    updateData.defaultMonthlyCredits = defaultMonthlyCredits;
  }

  if (costs !== undefined) {
    // Merge with existing costs (so partial updates work)
    const existing = await db.collection("globalSettings").findOne({ key: "credit_config" });
    updateData.costs = { ...(existing?.costs || DEFAULT_COSTS), ...costs };
  }

  await db.collection("globalSettings").updateOne(
    { key: "credit_config" },
    { $set: updateData },
    { upsert: true }
  );

  return NextResponse.json({ success: true });
}
