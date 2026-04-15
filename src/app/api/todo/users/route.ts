import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME, seedUsers } from "@/lib/todo-auth";
import { getTodoDb } from "@/lib/todo-db";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";

function auth(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function GET(req: NextRequest) {
  const session = auth(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await seedUsers();
  const db = await getTodoDb();
  const users = await db.collection("todo_users").find({}, { projection: { password: 0 } }).toArray();
  return NextResponse.json(users.map((u) => ({ ...u, _id: u._id.toString() })));
}

export async function POST(req: NextRequest) {
  const session = auth(req);
  if (!session || session.role !== "admin") return NextResponse.json({ error: "Admin only" }, { status: 403 });

  const { email, name, role, password } = await req.json();
  const db = await getTodoDb();

  const existing = await db.collection("todo_users").findOne({ email: email.toLowerCase() });
  if (existing) return NextResponse.json({ error: "User already exists" }, { status: 400 });

  await db.collection("todo_users").insertOne({
    email: email.toLowerCase(),
    name,
    role: role || "member",
    password: await bcrypt.hash(password, 10),
    createdAt: new Date(),
  });

  return NextResponse.json({ ok: true });
}

export async function PUT(req: NextRequest) {
  const session = auth(req);
  if (!session || session.role !== "admin") return NextResponse.json({ error: "Admin only" }, { status: 403 });

  const { userId, discordChannels, phone } = await req.json();
  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  const update: Record<string, unknown> = {};
  if (Array.isArray(discordChannels)) update.discordChannels = discordChannels;
  if (typeof phone === "string") update.phone = phone;

  if (Object.keys(update).length === 0) return NextResponse.json({ error: "Nothing to update" }, { status: 400 });

  const db = await getTodoDb();
  await db.collection("todo_users").updateOne(
    { _id: new ObjectId(userId) },
    { $set: update }
  );
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const session = auth(req);
  if (!session || session.role !== "admin") return NextResponse.json({ error: "Admin only" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const db = await getTodoDb();
  await db.collection("todo_users").deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json({ ok: true });
}
