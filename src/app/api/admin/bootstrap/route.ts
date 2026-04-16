import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/mongodb";

export async function POST() {
  const email = (process.env.BOOTSTRAP_ADMIN_EMAIL || "").toLowerCase();
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD || "";
  if (!email || !password) {
    return NextResponse.json(
      { error: "Set BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD env vars" },
      { status: 400 }
    );
  }

  const db = await getDb();
  const users = db.collection("users");
  const hashed = await bcrypt.hash(password, 12);

  const existing = await users.findOne({ email });
  if (existing) {
    await users.updateOne(
      { email },
      { $set: { password: hashed, role: "admin", updatedAt: new Date() } }
    );
    return NextResponse.json({ ok: true, action: "updated", email });
  }

  await users.insertOne({
    email,
    password: hashed,
    name: "Jeff Cline",
    role: "admin",
    createdAt: new Date(),
  });
  return NextResponse.json({ ok: true, action: "created", email });
}
