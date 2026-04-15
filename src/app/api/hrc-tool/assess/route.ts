import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { standard, answers, name, email, company } = body;

    if (!standard || !answers || !name || !email || !company) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Compute scores
    const familyMap: Record<string, { total: number; max: number; gaps: string[] }> = {};
    for (const a of answers) {
      if (!familyMap[a.family]) familyMap[a.family] = { total: 0, max: 0, gaps: [] };
      familyMap[a.family].total += a.score;
      familyMap[a.family].max += 3;
      if (a.score < 2) familyMap[a.family].gaps.push(a.question);
    }

    const families = Object.entries(familyMap).map(([family, d]) => {
      const pct = Math.round((d.total / d.max) * 100);
      let status = "Compliant";
      if (pct < 80) status = "Partial";
      if (pct < 35) status = "Non-Compliant";
      return { family, score: d.total, maxScore: d.max, pct, status, gaps: d.gaps };
    });

    const totalScore = answers.reduce((s: number, a: { score: number }) => s + a.score, 0);
    const totalMax = answers.length * 3;
    const overallPct = Math.round((totalScore / totalMax) * 100);

    // Save to MongoDB
    try {
      const db = await getDb();
      await db.collection("hrc_assessments").insertOne({
        standard,
        name,
        email,
        company,
        overallPct,
        families,
        answers,
        createdAt: new Date(),
      });
    } catch (dbErr) {
      console.error("MongoDB save failed:", dbErr);
      // Continue -- don't fail the request
    }

    // Send lead to CRM webhook
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
          company,
          phone: "",
          source: "jeff-cline.com/hrc-tool",
          leadType: "grc-assessment-completed",
          meta: {
            standard,
            overallPct,
            familyCount: families.length,
            gapCount: families.filter((f) => f.status !== "Compliant").length,
          },
        }),
      });
    } catch (crmErr) {
      console.error("CRM webhook failed:", crmErr);
    }

    return NextResponse.json({
      success: true,
      overallPct,
      families,
    });
  } catch (err) {
    console.error("Assessment API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
