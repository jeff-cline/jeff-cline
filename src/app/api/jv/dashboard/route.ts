import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const partner = await db
      .collection("jv_partners")
      .findOne({ email: email.toLowerCase() });

    if (!partner) {
      return NextResponse.json(
        { error: "Partner not found" },
        { status: 404 }
      );
    }

    // Get real clicks count
    const clicksCount = await db
      .collection("jv_clicks")
      .countDocuments({ referralCode: partner.referralCode });

    // Get real referrals
    const referrals = await db
      .collection("jv_referrals")
      .find({ referralCode: partner.referralCode })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    const totalReferrals = clicksCount;
    const activeCustomers = referrals.filter(
      (r) => r.status === "paid" || r.status === "pending"
    ).length;
    const pendingCommissions = referrals
      .filter((r) => r.status === "pending")
      .reduce((sum, r) => sum + (r.commissionAmount || 0), 0);
    const totalEarned = referrals
      .filter((r) => r.status === "paid")
      .reduce((sum, r) => sum + (r.commissionAmount || 0), 0);

    // If no real data exists yet, return seed/mock data
    const hasRealData = referrals.length > 0 || clicksCount > 0;

    const commissions = hasRealData
      ? referrals.map((r) => ({
          date: r.createdAt,
          customerEmail: maskEmail(r.customerEmail || ""),
          product: r.product,
          revenue: r.revenue || 0,
          commissionRate: r.commissionRate || 0,
          commissionAmount: r.commissionAmount || 0,
          status: r.status,
          paidAt: r.paidAt || null,
        }))
      : [];

    return NextResponse.json({
      success: true,
      stats: {
        totalReferrals: hasRealData ? totalReferrals : 0,
        activeCustomers: hasRealData ? activeCustomers : 0,
        pendingCommissions: hasRealData ? pendingCommissions : 0,
        totalEarned: hasRealData ? totalEarned : 0,
      },
      commissions,
      referralCode: partner.referralCode,
      partnerName: `${partner.firstName} ${partner.lastName}`,
      status: partner.status,
    });
  } catch (error) {
    console.error("JV dashboard error:", error);
    return NextResponse.json(
      { error: "Failed to load dashboard data" },
      { status: 500 }
    );
  }
}

function maskEmail(email: string): string {
  if (!email || !email.includes("@")) return "***";
  const [local, domain] = email.split("@");
  const masked = local.charAt(0) + "***" + local.charAt(local.length - 1);
  return `${masked}@${domain}`;
}
