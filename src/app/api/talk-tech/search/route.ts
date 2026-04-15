import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

const MOCK_EVENTS = [
  { name: "CES 2026", type: "conference", date: "2026-01-06", location: "Las Vegas, NV", attendance: 115000, speakingOpp: "apply", sellFromStage: false, cost: "$2,500", fitScore: 9, link: "https://ces.tech" },
  { name: "Web Summit 2026", type: "conference", date: "2026-11-03", location: "Lisbon, Portugal", attendance: 70000, speakingOpp: "apply", sellFromStage: false, cost: "$3,200", fitScore: 8, link: "https://websummit.com" },
  { name: "SXSW Interactive", type: "conference", date: "2026-03-13", location: "Austin, TX", attendance: 30000, speakingOpp: "apply", sellFromStage: false, cost: "$1,800", fitScore: 9, link: "https://sxsw.com" },
  { name: "Inc. 5000 Conference", type: "convention", date: "2026-10-14", location: "Palm Desert, CA", attendance: 2500, speakingOpp: "apply", sellFromStage: true, cost: "$1,500", fitScore: 8, link: "https://inc.com/inc5000" },
  { name: "Mastermind.com Live", type: "convention", date: "2026-05-20", location: "Scottsdale, AZ", attendance: 1200, speakingOpp: "pay", sellFromStage: true, cost: "$997", fitScore: 7, link: "https://mastermind.com" },
  { name: "Investor Summit at Sea", type: "cruise", date: "2026-04-12", location: "Miami, FL (Caribbean)", attendance: 300, speakingOpp: "invite", sellFromStage: true, cost: "$4,500", fitScore: 10, link: "https://investorsummitatsea.com" },
  { name: "Wealth Retreat Cruise", type: "cruise", date: "2026-09-08", location: "Fort Lauderdale, FL (Mediterranean)", attendance: 200, speakingOpp: "apply", sellFromStage: true, cost: "$5,200", fitScore: 9, link: "#" },
  { name: "TechCrunch Disrupt", type: "conference", date: "2026-10-20", location: "San Francisco, CA", attendance: 10000, speakingOpp: "apply", sellFromStage: false, cost: "$2,000", fitScore: 8, link: "https://techcrunch.com/events" },
  { name: "Grant Cardone 10X Growth Conference", type: "convention", date: "2026-02-17", location: "Las Vegas, NV", attendance: 35000, speakingOpp: "pay", sellFromStage: true, cost: "$997", fitScore: 7, link: "https://10xgrowthcon.com" },
  { name: "Family Office Club Summit", type: "convention", date: "2026-06-10", location: "New York, NY", attendance: 450, speakingOpp: "invite", sellFromStage: true, cost: "$3,000", fitScore: 10, link: "https://familyoffices.com" },
  { name: "Collision Conference", type: "conference", date: "2026-06-23", location: "Toronto, Canada", attendance: 40000, speakingOpp: "apply", sellFromStage: false, cost: "$1,200", fitScore: 7, link: "https://collisionconf.com" },
  { name: "Money20/20 USA", type: "conference", date: "2026-10-27", location: "Las Vegas, NV", attendance: 13000, speakingOpp: "apply", sellFromStage: false, cost: "$2,800", fitScore: 8, link: "https://money2020.com" },
  { name: "Entrepreneurs' Organization Global", type: "convention", date: "2026-04-05", location: "Dubai, UAE", attendance: 2000, speakingOpp: "invite", sellFromStage: false, cost: "$2,500", fitScore: 8, link: "https://eonetwork.org" },
  { name: "Insurance Innovation Summit", type: "conference", date: "2026-03-25", location: "Nashville, TN", attendance: 800, speakingOpp: "apply", sellFromStage: true, cost: "$1,200", fitScore: 9, link: "#" },
  { name: "Chamber of Commerce Tech Breakfast", type: "meetup", date: "2026-04-15", location: "Dallas, TX", attendance: 75, speakingOpp: "open", sellFromStage: true, cost: "$0", fitScore: 6, link: "#" },
  { name: "Startup Grind Global", type: "conference", date: "2026-05-12", location: "Redwood City, CA", attendance: 5000, speakingOpp: "apply", sellFromStage: false, cost: "$800", fitScore: 7, link: "https://startupgrind.com" },
  { name: "AI & Big Data Expo", type: "conference", date: "2026-09-30", location: "Santa Clara, CA", attendance: 8000, speakingOpp: "apply", sellFromStage: true, cost: "$1,500", fitScore: 9, link: "https://ai-expo.net" },
  { name: "Real Estate Wealth Expo", type: "convention", date: "2026-07-18", location: "Los Angeles, CA", attendance: 20000, speakingOpp: "pay", sellFromStage: true, cost: "$497", fitScore: 6, link: "#" },
  { name: "Fintech Founders Cruise", type: "cruise", date: "2026-11-15", location: "San Juan, PR (Caribbean)", attendance: 150, speakingOpp: "invite", sellFromStage: true, cost: "$3,800", fitScore: 9, link: "#" },
  { name: "Local SaaS Meetup", type: "meetup", date: "2026-04-22", location: "Chicago, IL", attendance: 50, speakingOpp: "open", sellFromStage: false, cost: "$0", fitScore: 5, link: "#" },
  { name: "National Small Business Week Summit", type: "convention", date: "2026-05-04", location: "Washington, D.C.", attendance: 3000, speakingOpp: "apply", sellFromStage: false, cost: "$350", fitScore: 7, link: "#" },
  { name: "HNWI Networking Retreat", type: "cruise", date: "2026-08-03", location: "Monaco (Riviera)", attendance: 100, speakingOpp: "invite", sellFromStage: true, cost: "$6,500", fitScore: 10, link: "#" },
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, mode, query } = body;

    if (!email || !query) {
      return NextResponse.json(
        { error: "email and query are required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const collection = db.collection("talk_tech_users");

    const user = await collection.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { error: "User not found. Please register first." },
        { status: 404 }
      );
    }

    if ((user.credits ?? 0) < 500) {
      return NextResponse.json(
        {
          error: "Insufficient credits",
          creditsRemaining: user.credits ?? 0,
          needMore: true,
        },
        { status: 402 }
      );
    }

    // Deduct credits
    await collection.updateOne(
      { email: email.toLowerCase() },
      {
        $inc: { credits: -500 },
        $push: {
          searches: {
            mode,
            query,
            timestamp: new Date(),
          } as any,
        },
      }
    );

    // Simple keyword-based filtering for mock data
    const queryLower = query.toLowerCase();
    let results = [...MOCK_EVENTS];

    // Score results based on query relevance (simple keyword matching)
    results = results.map((event) => {
      let score = event.fitScore;
      const eventText =
        `${event.name} ${event.type} ${event.location}`.toLowerCase();
      if (
        queryLower.split(/\s+/).some((word: string) => eventText.includes(word))
      ) {
        score = Math.min(10, score + 1);
      }
      return { ...event, fitScore: score };
    });

    // Sort by fit score descending
    results.sort((a, b) => b.fitScore - a.fitScore);

    const updatedUser = await collection.findOne({ email: email.toLowerCase() });

    return NextResponse.json({
      results,
      creditsRemaining: updatedUser?.credits ?? 0,
      query,
      mode,
    });
  } catch (error) {
    console.error("[talk-tech/search] Error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
