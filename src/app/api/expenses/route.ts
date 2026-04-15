import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const db = await getDb();
    const expenses = await db.collection("expenses").find().sort({ date: -1 }).limit(500).toArray();
    return NextResponse.json(expenses);
  } catch (err) {
    console.error("Expenses fetch error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, amount, category, platform, date, recurring, notes } = body;
    if (!name || amount == null || !category || !platform || !date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const db = await getDb();
    const doc = { name, amount: Number(amount), category, platform, date, recurring: !!recurring, notes: notes || "", createdAt: new Date() };
    const result = await db.collection("expenses").insertOne(doc);
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (err) {
    console.error("Expense create error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const db = await getDb();
    await db.collection("expenses").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Expense delete error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
