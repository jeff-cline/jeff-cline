import { NextRequest, NextResponse } from "next/server";
import { getTodoDb } from "@/lib/todo-db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tier = searchParams.get("tier"); // 1, 2, 3, 4
    
    const db = await getTodoDb();
    
    // Build query
    const query: Record<string, unknown> = {};
    
    // Filter by tier if specified
    if (tier && tier !== "all") {
      const tierNumber = parseInt(tier);
      if (tierNumber >= 1 && tierNumber <= 4) {
        query.tier = `TIER ${tierNumber} ($${getTierRange(tierNumber)})`;
      }
    }

    // Get HITT leads sorted by rank
    const hittLeads = await db.collection("sjsc_hitt")
      .find(query, {
        projection: {
          rank: 1,
          name: 1,
          email: 1,
          company: 1,
          title: 1,
          estimatedNetWorth: 1,
          tier: 1,
          confidence: 1,
          keyFacts: 1,
          photo: 1,
          bio: 1,
          expertise: 1,
          lookingFor: 1,
          linkedin: 1,
          instagram: 1,
          facebook: 1,
          website: 1,
          phone: 1,
          notes: 1,
          rating: 1,
          deckMessage: 1,
          hasProfileMatch: 1,
          sjscProfileId: 1
        }
      })
      .sort({ rank: 1 })
      .toArray();

    const hittLeadsWithStringId = hittLeads.map(lead => ({
      ...lead,
      _id: lead._id.toString(),
      sjscProfileId: lead.sjscProfileId?.toString() || null
    }));

    return NextResponse.json(hittLeadsWithStringId);
  } catch (error) {
    console.error("HITT API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function getTierRange(tierNumber: number): string {
  switch (tierNumber) {
    case 1: return "10M+";
    case 2: return "1M-$10M";
    case 3: return "250K-$1M";
    case 4: return "Unknown";
    default: return "Unknown";
  }
}