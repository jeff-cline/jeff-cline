import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, message, source } = body;

    if (!email) {
      return NextResponse.json({ error: "email is required" }, { status: 400 });
    }

    const db = await getDb();
    await db.collection("talk_tech_leads").insertOne({
      name: name || "",
      email: email.toLowerCase(),
      phone: phone || "",
      message: message || "",
      source: source || "talk-tech-general",
      createdAt: new Date(),
    });

    // Sync to CRM
    try {
      await fetch("http://127.0.0.1:3000/api/todo/webhook/lead-ingest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CRM-Key": "jc-crm-2024",
        },
        body: JSON.stringify({
          source: "jeff-cline.com/talk-tech",
          name: name || "",
          email: email.toLowerCase(),
          phone: phone || "",
          type: "speaker-platform",
          message: message || "",
        }),
      });
    } catch (crmErr) {
      console.warn("[talk-tech/lead] CRM sync failed:", crmErr);
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("[talk-tech/lead] Error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
