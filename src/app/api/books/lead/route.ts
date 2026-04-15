import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, role } = await req.json();

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email, and phone are required" },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Store book download lead
    await db.collection("book_leads").insertOne({
      name,
      email: email.toLowerCase(),
      phone,
      role: role || "not specified",
      book: "success-from-a-geek-lens",
      downloadedAt: new Date(),
      createdAt: new Date(),
    });

    // Send lead to CRM webhook
    try {
      await fetch("http://127.0.0.1:3000/api/todo/webhook/lead-ingest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CRM-Key": "jc-crm-2024",
        },
        body: JSON.stringify({
          source: "jeff-cline.com/books",
          name,
          email: email.toLowerCase(),
          phone,
          leadType: "book-download",
          notes: `Role: ${role || "not specified"} | Book: SUCCESS - From a Geek Lens`,
        }),
      });
    } catch {
      console.warn("CRM webhook failed for book lead:", email);
    }

    return NextResponse.json({
      success: true,
      downloadUrl: "/books/success-from-a-geek-lens.pdf",
    });
  } catch (error) {
    console.error("Book lead error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
