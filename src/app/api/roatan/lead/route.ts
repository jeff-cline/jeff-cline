import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone } = await req.json();
    
    if (!name || !email || !phone) {
      return NextResponse.json({ success: false, error: "All fields required" }, { status: 400 });
    }

    // Save to MongoDB
    try {
      const db = await getDb();
      await db.collection("roatan_leads").insertOne({
        name,
        email,
        phone,
        source: "jeff-cline.com/roatan",
        createdAt: new Date(),
      });
    } catch (e) {
      console.warn("MongoDB save failed:", e);
    }

    // Sync to CRM webhook
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
          phone,
          source: "jeff-cline.com/roatan",
          sourcePage: "/roatan",
        }),
      });
    } catch (e) {
      console.warn("CRM webhook failed:", e);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }
}
