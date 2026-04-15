import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const db = await getDb();
    const { investors } = await req.json();
    if (!Array.isArray(investors)) return NextResponse.json({ error: "Expected investors array" }, { status: 400 });

    const now = new Date();
    let imported = 0, skipped = 0;

    for (const inv of investors) {
      const result = await db.collection("soft_circle_investors").updateOne(
        { name: inv.name },
        {
          $setOnInsert: { createdAt: now },
          $set: { ...inv, updatedAt: now },
        },
        { upsert: true }
      );
      if (result.upsertedCount > 0) imported++; else skipped++;
    }

    return NextResponse.json({ success: true, imported, skipped });
  } catch (error) {
    console.error("Soft circle import error:", error);
    return NextResponse.json({ error: "Import failed" }, { status: 500 });
  }
}
