import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import { getTodoDb } from "./todo-db";

const JWT_SECRET = process.env.COLAB_JWT_SECRET || process.env.JWT_SECRET || "colab-secret-444";
export const COLAB_COOKIE_NAME = "colab_session";

export type ColabRole = "admin" | "member";

export interface ColabSession {
  userId: string;
  email: string;
  name: string;
  role: ColabRole;
  color: string;
}

const USER_COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f43f5e",
];

function colorForEmail(email: string) {
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = (hash << 5) - hash + email.charCodeAt(i);
    hash |= 0;
  }
  return USER_COLORS[Math.abs(hash) % USER_COLORS.length];
}

export async function seedColabUsers() {
  const db = await getTodoDb();
  const users = db.collection("colab_users");

  const seed = [
    {
      email: "jeff.cline@me.com",
      name: "Jeff Cline",
      role: "admin" as ColabRole,
      password: "F!reHors3",
      color: "#FF8900",
    },
    {
      email: "krystalore@thecrewscoach.com",
      name: "Krystalore",
      role: "admin" as ColabRole,
      password: "B!astOff",
      color: "#14b8a6",
    },
  ];

  for (const user of seed) {
    const email = user.email.toLowerCase();
    const passwordHash = await bcrypt.hash(user.password, 10);
    await users.updateOne(
      { email },
      {
        $set: {
          email,
          name: user.name,
          role: user.role,
          password: passwordHash,
          color: user.color || colorForEmail(email),
          updatedAt: new Date(),
        },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true }
    );
  }
}

export async function authenticateColab(email: string, password: string): Promise<string | null> {
  await seedColabUsers();
  const db = await getTodoDb();
  const users = db.collection("colab_users");
  const normalized = email.toLowerCase().trim();
  const user = await users.findOne({ email: normalized });
  if (!user?.password) return null;

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return null;

  const token = jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      color: user.color || colorForEmail(user.email),
    } satisfies ColabSession,
    JWT_SECRET
  );

  return token;
}

export function verifyColabToken(token: string): ColabSession | null {
  try {
    return jwt.verify(token, JWT_SECRET) as ColabSession;
  } catch {
    return null;
  }
}

export function getSessionFromRequest(req: NextRequest): ColabSession | null {
  const token = req.cookies.get(COLAB_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyColabToken(token);
}

export async function requireColabUser(req: NextRequest): Promise<ColabSession> {
  const session = getSessionFromRequest(req);
  if (!session) throw new Error("UNAUTHORIZED");
  return session;
}

export async function isColabAdmin(userId: string) {
  const db = await getTodoDb();
  const user = await db.collection("colab_users").findOne({ _id: new ObjectId(userId) });
  return user?.role === "admin";
}

export function normalizeEmail(email: string) {
  return email.toLowerCase().trim();
}
