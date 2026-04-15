import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, zipCode } = body;

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "firstName, lastName, and email are required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const collection = db.collection("talk_tech_users");

    // Check if user already exists
    const existing = await collection.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({
        success: true,
        credits: existing.credits ?? 0,
        message: "Welcome back",
      });
    }

    // Create new user with 500 credits
    const user = {
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone: phone || "",
      zipCode: zipCode || "",
      credits: 500,
      createdAt: new Date(),
      searches: [],
    };

    await collection.insertOne(user);

    // Send lead to CRM webhook
    try {
      await fetch("http://127.0.0.1:3000/api/todo/webhook/lead-ingest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CRM-Key": "jc-crm-2024",
        },
        body: JSON.stringify({
          source: "jeff-cline.com/talk-tech",
          name: `${firstName} ${lastName}`,
          email: email.toLowerCase(),
          phone: phone || "",
          type: "speaker-platform",
          data: { zipCode, leadType: "speaker-platform" },
        }),
      });
    } catch (crmErr) {
      console.warn("[talk-tech/register] CRM sync failed:", crmErr);
    }

    return NextResponse.json({ success: true, credits: 500 }, { status: 201 });
  } catch (error) {
    console.error("[talk-tech/register] Error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
