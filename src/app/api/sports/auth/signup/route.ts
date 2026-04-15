import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = "jc-sports-2026-secret";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const db = await getDb();
    
    // Check if user already exists
    const existingUser = await db.collection("sports_users").findOne({ 
      email: email.toLowerCase() 
    });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists with this email" }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      plan: "free",
      credits: 50, // Free signup credits
      role: "user",
      createdAt: new Date(),
      lastLogin: new Date()
    };

    const result = await db.collection("sports_users").insertOne(newUser);

    // Seed admin user if this is jeff.cline@me.com
    if (email.toLowerCase() === "jeff.cline@me.com") {
      await seedAdminUser(db);
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: result.insertedId.toString(), 
        email: newUser.email,
        role: newUser.role
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set("sports_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return NextResponse.json({
      success: true,
      user: {
        id: result.insertedId.toString(),
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        plan: newUser.plan,
        credits: newUser.credits
      }
    });

  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function seedAdminUser(db: any) {
  try {
    // Check if admin user already exists
    const adminExists = await db.collection("sports_users").findOne({ 
      email: "jeff.cline@me.com" 
    });

    if (!adminExists) {
      const hashedAdminPassword = await bcrypt.hash("F!reHors3", 12);
      
      await db.collection("sports_users").insertOne({
        name: "Jeff Cline",
        email: "jeff.cline@me.com",
        password: hashedAdminPassword,
        plan: "unlimited",
        credits: 999999,
        role: "admin",
        createdAt: new Date(),
        lastLogin: new Date()
      });
      
      console.log("Admin user seeded successfully");
    }
  } catch (error) {
    console.error("Error seeding admin user:", error);
  }
}