import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getDb();
  const [totalUsers, totalQuizResults, totalResources] = await Promise.all([
    db.collection("users").countDocuments(),
    db.collection("quizResults").countDocuments(),
    db.collection("resources").countDocuments(),
  ]);

  // Silo distribution
  const siloDist = await db.collection("quizResults").aggregate([
    { $group: { _id: "$silo", count: { $sum: 1 } } },
  ]).toArray();

  // Recent activity (last 7 days)
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentUsers = await db.collection("users").countDocuments({ createdAt: { $gte: weekAgo } });
  const recentQuizzes = await db.collection("quizResults").countDocuments({ createdAt: { $gte: weekAgo } });

  return NextResponse.json({
    totalUsers,
    totalQuizResults,
    totalResources,
    siloDist,
    recentUsers,
    recentQuizzes,
  });
}
