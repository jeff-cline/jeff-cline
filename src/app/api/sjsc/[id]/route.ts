import { NextRequest, NextResponse } from "next/server";
import { getTodoDb } from "@/lib/todo-db";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const db = await getTodoDb();
    
    const profile = await db.collection("sjsc_directory")
      .findOne({ _id: new ObjectId(id) });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...profile,
      _id: profile._id.toString()
    });
  } catch (error) {
    console.error("SJSC profile API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}