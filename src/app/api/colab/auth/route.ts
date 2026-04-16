import { NextRequest, NextResponse } from "next/server";
import {
  authenticateColab,
  COLAB_COOKIE_NAME,
  getSessionFromRequest,
  seedColabUsers,
} from "@/lib/colab-auth";
import { getTodoDb } from "@/lib/todo-db";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body?.action;

    if (action === "login") {
      await seedColabUsers();
      const token = await authenticateColab(body.email || "", body.password || "");
      if (!token) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

      const res = NextResponse.json({ ok: true });
      // effectively "forever" until logout or secret rotation
      res.cookies.set(COLAB_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 10 * 365 * 24 * 60 * 60,
        path: "/",
      });
      return res;
    }

    if (action === "register") {
      await seedColabUsers();
      const name = String(body?.name || "").trim();
      const email = String(body?.email || "").toLowerCase().trim();
      const password = String(body?.password || "");

      if (!name || !email || !password) {
        return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
      }

      const db = await getTodoDb();
      const existing = await db.collection("colab_users").findOne({ email });
      if (existing) return NextResponse.json({ error: "An account already exists for this email" }, { status: 409 });

      const colorPalette = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6", "#f43f5e"];
      let hashIndex = 0;
      for (let i = 0; i < email.length; i++) hashIndex = (hashIndex << 5) - hashIndex + email.charCodeAt(i);
      const color = colorPalette[Math.abs(hashIndex) % colorPalette.length];

      const passwordHash = await bcrypt.hash(password, 10);
      await db.collection("colab_users").insertOne({
        name,
        email,
        role: "member",
        password: passwordHash,
        color,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const token = await authenticateColab(email, password);
      if (!token) return NextResponse.json({ error: "Unable to sign in after registration" }, { status: 500 });

      const res = NextResponse.json({ ok: true });
      res.cookies.set(COLAB_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 10 * 365 * 24 * 60 * 60,
        path: "/",
      });
      return res;
    }

    if (action === "logout") {
      const res = NextResponse.json({ ok: true });
      res.cookies.delete(COLAB_COOKIE_NAME);
      return res;
    }

    if (action === "session") {
      await seedColabUsers();
      const session = getSessionFromRequest(req);
      if (!session) return NextResponse.json({ user: null });

      const db = await getTodoDb();
      const user = await db.collection("colab_users").findOne({ _id: new ObjectId(session.userId) });
      if (!user) return NextResponse.json({ user: null });

      return NextResponse.json({
        user: {
          userId: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          color: user.color,
          lastBoardId: user.lastBoardId || null,
        },
      });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
