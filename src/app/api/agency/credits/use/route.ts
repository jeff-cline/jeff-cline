import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

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
};

/**
 * Check if credits need to be reset for a new month.
 * Returns true if reset was performed.
 */
function shouldReset(creditResetDate: Date | undefined): boolean {
  if (!creditResetDate) return true;
  const now = new Date();
  const resetDate = new Date(creditResetDate);
  // Reset if we're in a different month or year
  return now.getFullYear() > resetDate.getFullYear() ||
    (now.getFullYear() === resetDate.getFullYear() && now.getMonth() > resetDate.getMonth());
}

function getFirstOfCurrentMonth(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

// POST: Use credits for a tool action
export async function POST(req: NextRequest) {
  const token = req.cookies.get("agency_session")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: { id: string; email: string; role: string };
  try {
    payload = jwt.verify(token, SECRET) as { id: string; email: string; role: string };
  } catch {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  const { tool } = await req.json();
  if (!tool) {
    return NextResponse.json({ error: "Tool identifier is required" }, { status: 400 });
  }

  const db = await getDb();

  // Get tool credit costs (admin-configured or defaults)
  const creditConfig = await db.collection("globalSettings").findOne({ key: "credit_config" });
  const costs = creditConfig?.costs || DEFAULT_COSTS;
  const cost = costs[tool] ?? DEFAULT_COSTS[tool] ?? 0;

  // Superadmin users have unlimited credits
  if (payload.role === "superadmin") {
    return NextResponse.json({
      success: true,
      cost,
      creditsUsed: 0,
      monthlyLimit: -1,
      creditsRemaining: -1,
      isUnlimited: true,
    });
  }

  // Get user from database
  let user;
  try {
    user = await db.collection("users").findOne({ _id: new ObjectId(payload.id) });
  } catch {
    user = await db.collection("users").findOne({ email: payload.email });
  }

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Auto-reset credits if new month
  if (shouldReset(user.creditResetDate)) {
    await db.collection("users").updateOne(
      { _id: user._id },
      {
        $set: {
          creditsUsed: 0,
          creditResetDate: getFirstOfCurrentMonth(),
        },
      }
    );
    user.creditsUsed = 0;
    user.creditResetDate = getFirstOfCurrentMonth();
  }

  // Determine user's monthly limit
  const defaultMonthlyCredits = creditConfig?.defaultMonthlyCredits || 100;
  const monthlyLimit = user.monthlyCredits ?? defaultMonthlyCredits;
  const creditsUsed = user.creditsUsed || 0;
  const creditsRemaining = monthlyLimit - creditsUsed;

  // If tool costs 0, always allow
  if (cost === 0) {
    return NextResponse.json({
      success: true,
      cost: 0,
      creditsUsed,
      monthlyLimit,
      creditsRemaining,
      isUnlimited: false,
    });
  }

  // Check if user has enough credits
  if (creditsRemaining < cost) {
    return NextResponse.json(
      {
        error: "Insufficient funds",
        creditsUsed,
        monthlyLimit,
        creditsRemaining,
        cost,
        resetDate: getNextResetDate(),
      },
      { status: 402 }
    );
  }

  // Deduct credits atomically
  await db.collection("users").updateOne(
    { _id: user._id },
    { $inc: { creditsUsed: cost } }
  );

  const newCreditsUsed = creditsUsed + cost;
  return NextResponse.json({
    success: true,
    cost,
    creditsUsed: newCreditsUsed,
    monthlyLimit,
    creditsRemaining: monthlyLimit - newCreditsUsed,
    isUnlimited: false,
  });
}

function getNextResetDate(): string {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return next.toISOString();
}
