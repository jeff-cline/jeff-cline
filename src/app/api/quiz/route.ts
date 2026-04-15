import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, industry, painPoints, quizAnswers } = body;

    if (!email || !name || !quizAnswers) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Determine silo from first answer
    const siloMap: Record<string, string> = {
      "Business Owner": "business",
      "Entrepreneur": "entrepreneur",
      "Start-Up Founder": "start-ups",
      "Investor": "investors",
      "Family Office": "family-offices",
    };
    const silo = siloMap[quizAnswers[0]] || "business";

    const db = await getDb();
    const result = {
      email: email.toLowerCase(),
      name,
      phone: phone || null,
      industry: industry || null,
      painPoints: painPoints || null,
      silo,
      answers: quizAnswers,
      createdAt: new Date(),
    };

    await db.collection("quizResults").insertOne(result);

    // Also push to GHL if configured
    const ghlWebhook = process.env.GHL_WEBHOOK_URL;
    if (ghlWebhook) {
      try {
        await fetch(ghlWebhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...result, source: "quiz" }),
        });
      } catch (e) {
        console.error("GHL webhook error:", e);
      }
    }

    return NextResponse.json({ success: true, silo });
  } catch (err) {
    console.error("Quiz submission error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  // Return quiz results for authenticated admin
  try {
    const db = await getDb();
    const results = await db.collection("quizResults").find().sort({ createdAt: -1 }).limit(100).toArray();
    return NextResponse.json(results);
  } catch (err) {
    console.error("Quiz fetch error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
