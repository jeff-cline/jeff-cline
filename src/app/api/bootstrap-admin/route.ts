import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/mongodb";

async function run(req: NextRequest) {
  const email = (process.env.BOOTSTRAP_ADMIN_EMAIL || "").toLowerCase();
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD || "";
  const secret = process.env.BOOTSTRAP_SECRET || "";

  if (!email || !password || !secret) {
    return NextResponse.json(
      { error: "Set BOOTSTRAP_ADMIN_EMAIL, BOOTSTRAP_ADMIN_PASSWORD, and BOOTSTRAP_SECRET env vars" },
      { status: 400 }
    );
  }

  const url = new URL(req.url);
  const providedSecret =
    url.searchParams.get("secret") ||
    req.headers.get("x-bootstrap-secret") ||
    "";
  if (providedSecret !== secret) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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

export async function POST(req: NextRequest) { return run(req); }
export async function GET(req: NextRequest) { return run(req); }
