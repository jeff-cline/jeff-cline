import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const sector = searchParams.get("sector") || "";
    const stage = searchParams.get("stage") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const filter: any = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
        { sector: { $regex: search, $options: "i" } },
      ];
    }
    if (sector) filter.sector = { $regex: sector, $options: "i" };
    if (stage) filter.stage = { $regex: stage, $options: "i" };

    const total = await db.collection("soft_circle_investors").countDocuments(filter);
    const investors = await db.collection("soft_circle_investors")
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    return NextResponse.json({ investors, total, page, limit });
  } catch (error) {
    console.error("Soft circle investors GET error:", error);
    return NextResponse.json({ investors: [], total: 0 }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = await getDb();
    const body = await req.json();
    const now = new Date();
    const investor = {
      name: body.name || "",
      website: body.website || "",
      sector: body.sector || "",
      stage: body.stage || "",
      checkSize: body.checkSize || "",
      thesis: body.thesis || "",
      contacts: body.contacts || [],
      score: body.score || 0,
      source: body.source || "manual",
      tags: body.tags || [],
      createdAt: now,
      updatedAt: now,
    };

    // Check for duplicate by name
    const existing = await db.collection("soft_circle_investors").findOne({ name: investor.name });
    if (existing) {
      return NextResponse.json({ error: "Investor already exists", id: existing._id }, { status: 409 });
    }

    const result = await db.collection("soft_circle_investors").insertOne(investor);

    // CRM lead sync
    try {
      const contact = investor.contacts[0] || {};
      await fetch("http://127.0.0.1:3000/api/todo/webhook/lead-ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-CRM-Key": "jc-crm-2024" },
        body: JSON.stringify({
          name: investor.name,
          email: contact.email || "",
          phone: contact.phone || "",
          source: "soft-circle",
          platform: "soft-circle",
        }),
      });
    } catch (e) { /* CRM sync best-effort */ }

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error("Soft circle investors POST error:", error);
    return NextResponse.json({ error: "Failed to save investor" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const db = await getDb();
    const body = await req.json();
    const { _id, ...update } = body;
    if (!_id) return NextResponse.json({ error: "Missing _id" }, { status: 400 });

    update.updatedAt = new Date();
    await db.collection("soft_circle_investors").updateOne(
      { _id: new ObjectId(_id) },
      { $set: update }
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Soft circle investors PUT error:", error);
    return NextResponse.json({ error: "Failed to update investor" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await db.collection("soft_circle_investors").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Soft circle investors DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete investor" }, { status: 500 });
  }
}
