import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, phone, company, siloInterest } = await req.json();
    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 });
    }

    const db = await getDb();
    const existing = await db.collection("users").findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = {
      email: email.toLowerCase(),
      password: hashed,
      name,
      phone: phone || null,
      company: company || null,
      siloInterest: siloInterest || null,
      role: "user",
      createdAt: new Date(),
    };

    await db.collection("users").insertOne(user);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
