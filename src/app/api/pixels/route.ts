import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const db = await getDb();
    const pixels = await db.collection("pixels").find().sort({ createdAt: -1 }).toArray();
    return NextResponse.json(pixels);
  } catch (err) {
    console.error("Pixels fetch error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, type, pixelId, status } = body;
    if (!name || !type || !pixelId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const db = await getDb();
    const doc = { name, type, pixelId, status: status || "active", createdAt: new Date() };
    const result = await db.collection("pixels").insertOne(doc);
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (err) {
    console.error("Pixel create error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const db = await getDb();
    await db.collection("pixels").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Pixel delete error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    if (!id || !status) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    const db = await getDb();
    await db.collection("pixels").updateOne({ _id: new ObjectId(id) }, { $set: { status } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Pixel update error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
