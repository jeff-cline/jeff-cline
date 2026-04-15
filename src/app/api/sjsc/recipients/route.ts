import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/todo-auth";
import { getTodoDb } from "@/lib/todo-db";

function auth(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function GET(req: NextRequest) {
  const session = auth(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const db = await getTodoDb();
    
    // Count SJSC deck request leads with phone numbers
    const count = await db.collection("crm_leads").countDocuments({ 
      type: "SJSC_DECK_REQUEST",
      phone: { $exists: true, $ne: "" }
    });

    return NextResponse.json({ count });

  } catch (error) {
    console.error("Error fetching recipient count:", error);
    return NextResponse.json({ error: "Failed to fetch recipient count" }, { status: 500 });
  }
}