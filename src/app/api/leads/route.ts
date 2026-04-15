import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, businessName, website, geekProblem, quizTitle, answers, score, report } = body;
    if (!name || !email || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const db = await getDb();
    const lead = {
      name,
      email,
      phone,
      businessName: businessName || "",
      website: website || "",
      geekProblem: geekProblem || "",
      quizTitle: quizTitle || "Disruption Quiz",
      answers: answers || [],
      score: score || 0,
      report: report || "",
      status: "new",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await db.collection("leads").insertOne(lead);
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error("Lead POST error:", error);
    return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const sort = searchParams.get("sort");

    const filter: any = {};
    if (status && status !== "all") filter.status = status;

    const sortObj: any = sort === "quiz" ? { quizTitle: 1, createdAt: -1 } : { createdAt: -1 };

    const leads = await db.collection("leads").find(filter).sort(sortObj).toArray();
    return NextResponse.json(leads);
  } catch (error) {
    console.error("Lead GET error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
