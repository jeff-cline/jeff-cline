import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, bettingExperience, primarySport } = body;

    if (!name || !email || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = await getDb();
    const lead = {
      name,
      email,
      phone,
      bettingExperience: bettingExperience || "Not specified",
      primarySport: primarySport || "All Sports",
      source: "jeff-cline.com/sports",
      leadType: "sports-betting",
      status: "new",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection("leads").insertOne(lead);

    // Sync to CRM (The Vault)
    try {
      await fetch("http://127.0.0.1:3000/api/todo/webhook/lead-ingest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CRM-Key": "jc-crm-2024",
        },
        body: JSON.stringify({
          source: "jeff-cline.com/sports",
          name,
          email,
          phone,
          leadType: "sports-betting",
          notes: `Betting Experience: ${bettingExperience || "Not specified"}, Primary Sport: ${primarySport || "All Sports"}`,
          secret: "jc-crm-2024",
        }),
      });
    } catch (crmErr) {
      console.error("CRM sync error (non-fatal):", crmErr);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Sports lead POST error:", error);
    return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
  }
}
