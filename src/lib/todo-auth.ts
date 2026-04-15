import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { getTodoDb } from "./todo-db";

const JWT_SECRET = process.env.TODO_JWT_SECRET || "vault-secret-444-crm-todo";
const COOKIE_NAME = "todo_session";

export interface TodoUser {
  _id?: string;
  email: string;
  name: string;
  role: "admin" | "manager" | "member";
  password?: string;
  createdAt: Date;
}

export interface TodoSession {
  userId: string;
  email: string;
  name: string;
  role: string;
}

export async function seedUsers() {
  const db = await getTodoDb();
  const col = db.collection("todo_users");
  const count = await col.countDocuments();
  if (count > 0) return;

  const users = [
    {
      email: "jeff.cline@me.com",
      name: "Jeff",
      role: "admin",
      password: await bcrypt.hash("F!reHors3", 10),
      createdAt: new Date(),
    },
    {
      email: "krystalore@thecrewscoach.com",
      name: "Krystalore",
      role: "manager",
      password: await bcrypt.hash("Magical", 10),
      createdAt: new Date(),
    },
  ];
  await col.insertMany(users);
}

export async function authenticate(email: string, password: string): Promise<string | null> {
  await seedUsers();
  const db = await getTodoDb();
  const user = await db.collection("todo_users").findOne({ email: email.toLowerCase() });
  if (!user) return null;
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return null;
  const token = jwt.sign(
    { userId: user._id.toString(), email: user.email, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
  return token;
}

export async function getSession(): Promise<TodoSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    const decoded = jwt.verify(token, JWT_SECRET) as TodoSession;
    return decoded;
  } catch {
    return null;
  }
}

export function verifyToken(token: string): TodoSession | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TodoSession;
  } catch {
    return null;
  }
}

export { COOKIE_NAME };
