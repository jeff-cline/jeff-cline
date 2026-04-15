import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const [totalInvestors, totalSearches, withPhone, withEmail, searches] = await Promise.all([
      db.collection("soft_circle_investors").countDocuments(),
      db.collection("soft_circle_searches").countDocuments(),
      db.collection("soft_circle_investors").countDocuments({ "contacts.phone": { $exists: true, $ne: "" } }),
      db.collection("soft_circle_investors").countDocuments({ "contacts.email": { $exists: true, $ne: "" } }),
      db.collection("soft_circle_searches").find({}).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).toArray(),
    ]);

    // Growth data: investors per day for last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const growth = await db.collection("soft_circle_investors").aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]).toArray();

    return NextResponse.json({
      stats: { totalInvestors, totalSearches, withPhone, withEmail },
      searches,
      growth,
    });
  } catch (error) {
    console.error("Soft circle reports error:", error);
    return NextResponse.json({ stats: {}, searches: [], growth: [] }, { status: 500 });
  }
}
