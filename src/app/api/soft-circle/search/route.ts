import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const db = await getDb();
    const body = await req.json();
    const { description = "", tags = "", stage = "", raiseAmount = 0 } = body;

    const tagList = tags.split(",").map((t: string) => t.trim().toLowerCase()).filter(Boolean);

    // Local search: score investors based on text overlap
    const investors = await db.collection("soft_circle_investors").find({}).toArray();

    const scored = investors.map((inv: any) => {
      let score = 0;
      const invText = `${inv.name} ${inv.sector} ${inv.thesis} ${inv.stage} ${(inv.tags || []).join(" ")}`.toLowerCase();

      // Description keyword matching
      const descWords = description.toLowerCase().split(/\s+/).filter((w: string) => w.length > 3);
      for (const word of descWords) {
        if (invText.includes(word)) score += 5;
      }

      // Tag matching
      for (const tag of tagList) {
        if (invText.includes(tag)) score += 15;
      }

      // Stage matching
      if (stage && inv.stage && inv.stage.toLowerCase().includes(stage.toLowerCase())) {
        score += 20;
      }

      // Normalize to 0-100
      const maxPossible = descWords.length * 5 + tagList.length * 15 + 20;
      const normalized = maxPossible > 0 ? Math.round((score / maxPossible) * 100) : 0;

      return {
        ...inv,
        score: normalized,
        matchReasoning: score > 0
          ? `Matched on ${descWords.filter((w: string) => invText.includes(w)).length} keywords, ${tagList.filter((t: string) => invText.includes(t)).length} tags${stage && inv.stage?.toLowerCase().includes(stage.toLowerCase()) ? ", stage" : ""}`
          : "No strong match",
      };
    });

    const results = scored
      .filter((r: any) => r.score > 0)
      .sort((a: any, b: any) => b.score - a.score);

    // Log search
    await db.collection("soft_circle_searches").insertOne({
      userId: "admin",
      description,
      tags,
      stage,
      raiseAmount,
      resultsCount: results.length,
      dataSource: "local",
      createdAt: new Date(),
    });

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Soft circle search error:", error);
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}
