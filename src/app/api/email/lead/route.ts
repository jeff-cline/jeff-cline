import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, company, message } = body;

    if (!email || !firstName || !lastName) {
      return NextResponse.json(
        { error: "firstName, lastName, and email are required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    await db.collection("email_tool_leads").insertOne({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone || "",
      company: company || "",
      message: message || "",
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
          source: "jeff-cline.com/email",
          leadType: "email-signup",
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          name: `${firstName.trim()} ${lastName.trim()}`,
          email: email.toLowerCase().trim(),
          phone: phone || "",
          company: company || "",
          message: message || "",
        }),
      });
    } catch (crmErr) {
      console.warn("[email/lead] CRM sync failed:", crmErr);
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("[email/lead] Error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
