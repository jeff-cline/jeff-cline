import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

// Push contact to GoHighLevel
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, phone, source } = body;

    // Get GHL API key from DB or env
    const db = await getDb();
    const apiKeyDoc = await db.collection("apiKeys").findOne({ service: "gohighlevel" });
    const apiKey = apiKeyDoc?.key || process.env.GHL_API_KEY;
    const locationId = process.env.GHL_LOCATION_ID;

    if (!apiKey) {
      console.warn("GHL API key not configured");
      return NextResponse.json({ success: false, message: "GHL not configured" });
    }

    // Push to GHL
    try {
      const res = await fetch("https://rest.gohighlevel.com/v1/contacts/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          email,
          name,
          phone,
          locationId,
          source: source || "jeff-cline.com",
          tags: ["website-lead"],
        }),
      });

      const data = await res.json();
      return NextResponse.json({ success: true, contactId: data.contact?.id });
    } catch (e) {
      console.error("GHL API error:", e);
      return NextResponse.json({ success: false, message: "GHL API error" });
    }
  } catch (err) {
    console.error("GHL contact error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
