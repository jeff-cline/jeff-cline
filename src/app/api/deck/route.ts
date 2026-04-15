import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, business } = body;

    if (!email || !name) {
      return NextResponse.json({ error: "Name and email required" }, { status: 400 });
    }

    const db = await getDb();

    // Save locally
    await db.collection("leads").updateOne(
      { email, type: "DECK_REQUEST" },
      {
        $set: {
          name,
          email,
          phone: phone || "",
          businessName: business || "",
          source: "jeff-cline.com/deck",
          type: "DECK_REQUEST",
          interest: "Deck Request",
          status: "new",
          quizTitle: "DECK REQUEST",
          silo: "deck",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    // Sync to CRM leads tab
    try {
      await fetch("http://127.0.0.1:3000/api/todo/webhook/lead-ingest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CRM-Key": "jc-crm-2024",
        },
        body: JSON.stringify({
          name,
          email,
          phone: phone || "",
          company: business || "",
          source: "jeff-cline.com/deck",
          type: "deck_request",
          status: "new",
          data: { interest: "Deck Request" },
        }),
      });
    } catch {
      // ignore webhook errors
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (e) {
    console.error("[deck] Lead capture error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
