import { NextRequest, NextResponse } from "next/server";
import { getTodoDb } from "@/lib/todo-db";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const body = await req.json();
    const { author, text, rating } = body;

    // Validate input
    if (!author || !text || typeof rating !== "number") {
      return NextResponse.json({ 
        error: "Missing required fields: author, text, rating" 
      }, { status: 400 });
    }

    if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      return NextResponse.json({ 
        error: "Rating must be an integer between 1 and 5" 
      }, { status: 400 });
    }

    const db = await getTodoDb();
    
    // Check if profile exists
    const profile = await db.collection("sjsc_directory")
      .findOne({ _id: new ObjectId(id) });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Create the new note
    const newNote = {
      author: author.trim(),
      text: text.trim(),
      rating,
      createdAt: new Date()
    };

    // Add note to the profile
    await db.collection("sjsc_directory").updateOne(
      { _id: new ObjectId(id) },
      { $push: { notes: newNote } as any }
    );

    // Recalculate average rating
    const updatedProfile = await db.collection("sjsc_directory")
      .findOne({ _id: new ObjectId(id) });

    if (updatedProfile && updatedProfile.notes && updatedProfile.notes.length > 0) {
      const totalRating = updatedProfile.notes.reduce((sum: number, note: any) => sum + note.rating, 0);
      const averageRating = totalRating / updatedProfile.notes.length;
      
      await db.collection("sjsc_directory").updateOne(
        { _id: new ObjectId(id) },
        { $set: { rating: Math.round(averageRating * 100) / 100 } } // Round to 2 decimal places
      );
    }

    return NextResponse.json({ success: true, note: newNote });
  } catch (error) {
    console.error("SJSC notes API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}