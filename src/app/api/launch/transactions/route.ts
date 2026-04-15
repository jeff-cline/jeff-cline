import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

const ADMIN_EMAIL = "jeff.cline@me.com";

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get("email");
    const adminEmail = req.nextUrl.searchParams.get("adminEmail");
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "50");

    const db = await getDb();

    // If admin, can view all or filter by email
    if (adminEmail === ADMIN_EMAIL) {
      const filter = email ? { email: email.toLowerCase() } : {};
      const transactions = await db
        .collection("launch_transactions")
        .find(filter)
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray();
      return NextResponse.json({ transactions });
    }

    // Regular user — must provide email
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const transactions = await db
      .collection("launch_transactions")
      .find({ email: email.toLowerCase() })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error("Transactions GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
