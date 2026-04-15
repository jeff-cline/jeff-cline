import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

function scoreAnswers(answers: { id: number; category: string; answer: string }[]) {
  const categoryScores: Record<string, number[]> = {};
  const keywords: string[] = [];

  for (const a of answers) {
    if (!categoryScores[a.category]) categoryScores[a.category] = [];

    // Score select-type answers based on position (later = higher)
    const selectScales: Record<number, string[]> = {
      1: ["Pre-revenue", "$0 — $100K", "$100K — $500K", "$500K — $1M", "$1M — $5M", "$5M — $10M", "$10M — $50M", "$50M+"],
      2: ["Less than 1 year", "1-3 years", "3-5 years", "5-10 years", "10+ years"],
      3: ["No process exists", "Informal / ad hoc", "Documented but inconsistently followed", "Documented and consistently executed", "Automated and optimized"],
      4: ["Minimal", "Basic tools", "Moderate", "Advanced", "Enterprise-grade"],
      6: ["0-2 hours", "3-5 hours", "5-10 hours", "10-15 hours", "15+ hours"],
      7: ["No", "Somewhat", "Yes", "Absolutely"],
      8: ["Severely imbalanced", "Somewhat imbalanced", "Moderately balanced", "Well balanced", "Fully integrated"],
      10: ["This is my first", "2-3", "4-6", "7-10", "10+"],
      11: ["No", "Attempted", "Yes — one exit", "Yes — multiple exits", "Yes — and I actively plan exits"],
      12: ["Intuition", "Advice from peers", "Basic data", "Comprehensive data-driven", "Predictive analytics"],
      13: ["None", "Basic", "Moderate", "Advanced", "Expert"],
      14: ["Overwhelmed", "Stressed", "Focused", "Clear-headed", "In flow"],
      15: ["Defensive", "Skeptical", "Open", "Eager", "Adaptive"],
      16: ["Very uncomfortable", "Somewhat uncomfortable", "Neutral", "Comfortable", "Completely comfortable"],
      18: ["Under $100K", "$100K — $250K", "$250K — $500K", "$500K — $1M", "$1M — $5M", "$5M+"],
      19: ["0%", "1-25%", "25-50%", "50-75%", "75-100%"],
      20: ["I do not know", "rough estimates", "know CAC but not LTV", "know both but not optimized", "know both and optimize"],
    };

    const scale = selectScales[a.id];
    if (scale) {
      const idx = scale.findIndex(s => a.answer.toLowerCase().includes(s.toLowerCase().substring(0, 10)));
      const score = idx >= 0 ? ((idx + 1) / scale.length) * 100 : 60;
      categoryScores[a.category].push(score);
      if (score >= 75) keywords.push(a.answer.split(" — ")[0].replace(/[^a-zA-Z0-9\s]/g, "").trim().substring(0, 30));
    } else {
      // Text answers - score based on length/depth
      const len = (a.answer || "").length;
      const score = Math.min(95, 40 + len * 0.3);
      categoryScores[a.category].push(score);
      // Extract keywords from text
      const words = (a.answer || "").split(/\s+/).filter(w => w.length > 5);
      if (words.length > 0) keywords.push(words.slice(0, 2).join(" "));
    }
  }

  const scores: Record<string, number> = {};
  for (const [cat, vals] of Object.entries(categoryScores)) {
    scores[cat] = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  }

  const overall = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length);

  // Ensure scores are respectable (min 62)
  for (const k of Object.keys(scores)) {
    scores[k] = Math.max(62, Math.min(98, scores[k]));
  }

  const cleanKeywords = [...new Set(keywords.filter(k => k.length > 2))].slice(0, 8);
  if (cleanKeywords.length < 5) {
    const defaults = ["Growth-Oriented", "Technology-Ready", "Strategic Thinker", "Execution-Focused", "Scale-Minded"];
    for (const d of defaults) { if (cleanKeywords.length < 8 && !cleanKeywords.includes(d)) cleanKeywords.push(d); }
  }

  const rec = overall >= 80
    ? "Based on your assessment profile, you are an exceptional fit for the 90-Day Cohort. Your combination of business maturity, personal development orientation, and strategic clarity positions you to extract maximum value from the full immersion experience."
    : overall >= 65
    ? "Your assessment indicates strong readiness for the Mastermind program. We recommend starting with the 1-Week Immersion to establish foundations, with the option to transition into the 90-Day Cohort based on mutual alignment."
    : "Your profile shows significant potential. The 1-Week Immersion is designed to accelerate founders at exactly your stage, providing the frameworks and technology infrastructure to catalyze your next growth phase.";

  return { scores, overall: Math.max(68, Math.min(96, overall)), recommendation: rec, keywords: cleanKeywords };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, company, answers } = body;

    if (!email || !answers?.length) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 });
    }

    const { scores, overall, recommendation, keywords } = scoreAnswers(answers);

    const db = await getDb();
    const application = {
      name, email, phone, company, answers,
      scores, overall, recommendation, keywords,
      status: "assessed",
      createdAt: new Date(),
    };

    const result = await db.collection("mastermind_applications").insertOne(application);

    // Update the lead record
    await db.collection("leads").updateOne(
      { email, type: "MASTERMIND" },
      {
        $set: {
          status: "qualified",
          score: overall,
          report: recommendation,
          answers: answers.map((a: any) => ({ question: a.question, answer: a.answer })),
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      applicationId: result.insertedId.toString(),
      scores, overall, recommendation, keywords,
    });
  } catch (e) {
    console.error("[mastermind/apply] Error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const db = await getDb();
    const app = await db.collection("mastermind_applications").findOne({ _id: new ObjectId(id) });
    if (!app) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({
      name: app.name, email: app.email, phone: app.phone, company: app.company,
      answers: app.answers, scores: app.scores, overall: app.overall,
      recommendation: app.recommendation, keywords: app.keywords,
    });
  } catch (e) {
    console.error("[mastermind/apply GET] Error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
