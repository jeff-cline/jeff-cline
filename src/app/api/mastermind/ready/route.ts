import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { applicationId, program, email, name, phone, company } = body;

    if (!email || !applicationId) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 });
    }

    const db = await getDb();

    // Update application status
    await db.collection("mastermind_applications").updateOne(
      { _id: new ObjectId(applicationId) },
      { $set: { status: "ready", selectedProgram: program, readyAt: new Date() } }
    );

    // Update lead to READY (green)
    await db.collection("leads").updateOne(
      { email, type: "MASTERMIND" },
      { $set: { status: "READY", selectedProgram: program, updatedAt: new Date() } }
    );

    // Sync to CRM leads tab
    try {
      await fetch("http://127.0.0.1:3000/api/todo/webhook/lead-ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-CRM-Key": "jc-crm-2024" },
        body: JSON.stringify({
          name, email, phone: phone || "", company: company || "",
          source: "jeff-cline.com/mastermind", type: "mastermind",
          status: "READY",
          data: { program, interest: `I AM READY - ${program}` },
        }),
      });
    } catch { /* ignore webhook errors */ }

    // Create user account if doesn't exist
    const existing = await db.collection("users").findOne({ email });
    if (!existing) {
      const password = await bcrypt.hash(email.split("@")[0] + "2025!", 12);
      await db.collection("users").insertOne({
        name: name || email,
        email,
        phone: phone || "",
        company: company || "",
        password,
        role: "mastermind",
        siloInterest: "mastermind",
        toolAccess: "gated", // tools visible but credit-gated
        selectedProgram: program,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } else {
      await db.collection("users").updateOne(
        { email },
        { $set: { role: "mastermind", toolAccess: "gated", selectedProgram: program, updatedAt: new Date() } }
      );
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[mastermind/ready] Error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
