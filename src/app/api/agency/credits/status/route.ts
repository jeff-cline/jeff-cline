import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const SECRET = process.env.NEXTAUTH_SECRET || "change-me-to-a-real-secret-in-production";

function shouldReset(creditResetDate: Date | undefined): boolean {
  if (!creditResetDate) return true;
  const now = new Date();
  const resetDate = new Date(creditResetDate);
  return now.getFullYear() > resetDate.getFullYear() ||
    (now.getFullYear() === resetDate.getFullYear() && now.getMonth() > resetDate.getMonth());
}

function getFirstOfCurrentMonth(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

// GET: Get current credit status for the logged-in user
export async function GET(req: NextRequest) {
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

  // Superadmin users have unlimited credits
  if (payload.role === "superadmin") {
    return NextResponse.json({
      creditsUsed: 0,
      monthlyLimit: -1,
      creditsRemaining: -1,
      isUnlimited: true,
      resetDate: null,
    });
  }

  const db = await getDb();

  // Get user
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
  }

  // Get default monthly credits from global config
  const creditConfig = await db.collection("globalSettings").findOne({ key: "credit_config" });
  const defaultMonthlyCredits = creditConfig?.defaultMonthlyCredits || 100;
  const monthlyLimit = user.monthlyCredits ?? defaultMonthlyCredits;
  const creditsUsed = user.creditsUsed || 0;

  // Calculate next reset date (1st of next month)
  const now = new Date();
  const nextReset = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  return NextResponse.json({
    creditsUsed,
    monthlyLimit,
    creditsRemaining: monthlyLimit - creditsUsed,
    isUnlimited: false,
    resetDate: nextReset.toISOString(),
  });
}
