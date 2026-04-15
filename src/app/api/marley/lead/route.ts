import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, city, state, zip, phone, email } = await req.json();

    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json(
        { error: "First name, last name, email, and phone are required" },
        { status: 400 }
      );
    }

    const db = await getDb();

    await db.collection("marley_leads").insertOne({
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      email: email.toLowerCase(),
      phone,
      city: city || null,
      state: state || null,
      zip: zip || null,
      createdAt: new Date(),
    });

    // Send lead to CRM webhook
    try {
      await fetch("http://127.0.0.1:3000/api/todo/webhook/lead-ingest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CRM-Key": "jc-crm-2024",
        },
        body: JSON.stringify({
          source: "jeff-cline.com/marley",
          name: `${firstName} ${lastName}`,
          email: email.toLowerCase(),
          phone,
          leadType: "marley-investment",
          notes: `Location: ${city || "N/A"}, ${state || "N/A"} ${zip || ""} | Investment inquiry for The Marley Estate`,
        }),
      });
    } catch {
      console.warn("CRM webhook failed for marley lead:", email);
    }

    return NextResponse.json({
      success: true,
      deckUrl: "/decks/marley-investment-deck.pdf",
    });
  } catch (error) {
    console.error("Marley lead error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
