import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getDb();
  const users = await db.collection("users")
    .find({}, { projection: { password: 0 } })
    .sort({ createdAt: -1 })
    .toArray();

  // Attach quiz results
  const quizResults = await db.collection("quizResults").find().toArray();
  const userMap = users.map((u) => ({
    ...u,
    quizResults: quizResults.filter((q) => q.email === u.email),
  }));

  return NextResponse.json(userMap);
}
