import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { senderName, senderEmail, subject, body: emailBody, labels } = body;

    if (!senderEmail || !senderName) {
      return NextResponse.json(
        { error: "senderName and senderEmail are required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    await db.collection("email_tool_leads").insertOne({
      senderName,
      senderEmail,
      subject: subject || "",
      emailBody: emailBody || "",
      labels: labels || [],
      savedFrom: "dashboard",
      createdAt: new Date(),
    });

    // Sync to CRM with full email body in notes
    try {
      await fetch("http://127.0.0.1:3000/api/todo/webhook/lead-ingest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CRM-Key": "jc-crm-2024",
        },
        body: JSON.stringify({
          source: "jeff-cline.com/email",
          leadType: "email-tool",
          name: senderName,
          email: senderEmail,
          notes: `Subject: ${subject || "N/A"}\n\n${emailBody || ""}`,
          labels: labels || [],
        }),
      });
    } catch (crmErr) {
      console.warn("[email/save-lead] CRM sync failed:", crmErr);
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("[email/save-lead] Error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
