import { NextRequest, NextResponse } from "next/server";
import { authenticate, verifyToken, COOKIE_NAME, seedUsers } from "@/lib/todo-auth";
import { getTodoDb } from "@/lib/todo-db";

export async function POST(req: NextRequest) {
  try {
    const { action, email, password } = await req.json();

    if (action === "login") {
      await seedUsers();
      const token = await authenticate(email, password);
      if (!token) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }
      const res = NextResponse.json({ ok: true });
      res.cookies.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });
      return res;
    }

    if (action === "logout") {
      const res = NextResponse.json({ ok: true });
      res.cookies.delete(COOKIE_NAME);
      return res;
    }

    if (action === "session") {
      const token = req.cookies.get(COOKIE_NAME)?.value;
      if (!token) return NextResponse.json({ user: null });
      const session = verifyToken(token);
      if (!session) return NextResponse.json({ user: null });
      // Fetch full user record to include discordChannels
      try {
        const db = await getTodoDb();
        const userDoc = await db.collection("todo_users").findOne({ email: session.email });
        if (userDoc?.discordChannels) {
          return NextResponse.json({ user: { ...session, discordChannels: userDoc.discordChannels } });
        }
      } catch { /* fall through to basic session */ }
      return NextResponse.json({ user: session });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
