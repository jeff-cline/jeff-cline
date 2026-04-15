import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, company, interest, status: leadStatus } = body;

    if (!email || !name) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const db = await getDb();

    const isReady = leadStatus === "READY";

    // Save as lead with MASTERMIND type and pink styling
    const lead = {
      name,
      email,
      phone: phone || "",
      businessName: company || "",
      source: "mastermind",
      type: "MASTERMIND",
      interest: interest || "",
      status: isReady ? "READY" : "new",
      quizTitle: "MASTERMIND",
      silo: "mastermind",
      report: "",
      answers: [],
      score: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Upsert by email to avoid duplicates
    await db.collection("leads").updateOne(
      { email, type: "MASTERMIND" },
      { $set: lead },
      { upsert: true }
    );

    // Also sync to CRM leads tab via webhook
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
          company: company || "",
          source: "jeff-cline.com/mastermind",
          type: "mastermind",
          status: isReady ? "READY" : "new",
          data: {
            interest: interest || "mastermind-landing",
            program: isReady ? "I AM READY" : "inquiry",
          },
        }),
      });
    } catch (webhookErr) {
      console.error("[mastermind] CRM webhook error:", webhookErr);
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (e) {
    console.error("[mastermind] Lead capture error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
