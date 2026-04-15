import { NextRequest, NextResponse } from "next/server";
import { getTodoDb } from "@/lib/todo-db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sort = searchParams.get("sort") || "name"; // name, rating
    const filter = searchParams.get("filter"); // 1-5 for money rating
    const search = searchParams.get("search");

    const db = await getTodoDb();
    
    // Build query
    const query: Record<string, unknown> = {};
    
    // Filter by rating if specified
    if (filter && filter !== "all") {
      const ratingValue = parseInt(filter);
      if (ratingValue >= 1 && ratingValue <= 5) {
        query.rating = { $gte: ratingValue, $lt: ratingValue + 1 };
      }
    }
    
    // Search by name if specified
    if (search && search.trim()) {
      query.name = { $regex: search.trim(), $options: "i" };
    }

    // Build sort criteria
    let sortCriteria: Record<string, 1 | -1> = { name: 1 };
    if (sort === "rating") {
      sortCriteria = { rating: -1, name: 1 }; // Rating high to low, then name
    }

    const profiles = await db.collection("sjsc_directory")
      .find(query, {
        projection: {
          name: 1,
          title: 1,
          bio: 1,
          email: 1,
          website: 1,
          expertise: 1,
          photo: 1,
          rating: 1,
          notes: { $size: "$notes" } // Just count of notes, not the notes themselves
        }
      })
      .sort(sortCriteria)
      .toArray();

    const profilesWithNotesCount = profiles.map(profile => ({
      ...profile,
      _id: profile._id.toString(),
      notesCount: profile.notes || 0
    }));

    return NextResponse.json(profilesWithNotesCount);
  } catch (error) {
    console.error("SJSC API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}