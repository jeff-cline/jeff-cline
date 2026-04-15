import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDb();
    const users = await db.collection("users")
      .find({}, { projection: { password: 0 } })
      .sort({ createdAt: -1 })
      .limit(200)
      .toArray();

    return NextResponse.json(users);
  } catch (err) {
    console.error("Users fetch error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { name, phone, company, siloInterest } = body;

    const db = await getDb();
    await db.collection("users").updateOne(
      { email: session.user.email },
      { $set: { name, phone, company, siloInterest, updatedAt: new Date() } }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("User update error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
