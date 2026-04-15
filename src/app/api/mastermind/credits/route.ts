import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { applicationId, email, name, phone } = body;

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const db = await getDb();

    // Update lead with credits requested
    await db.collection("leads").updateOne(
      { email, type: "MASTERMIND" },
      {
        $set: {
          creditsRequested: true,
          creditsRequestedAt: new Date(),
          updatedAt: new Date(),
        },
        $push: {
          notes: {
            text: "CREDITS REQUESTED — call " + (phone || "no phone"),
            at: new Date(),
          },
        } as any,
      }
    );

    return NextResponse.json({ success: true, phone: "223-400-8146" });
  } catch (e) {
    console.error("[mastermind/credits] Error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
