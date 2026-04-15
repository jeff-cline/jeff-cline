import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, password, phone, company, website, referralSource } = body;

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: "firstName, lastName, email, and password are required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const collection = db.collection("jv_partners");

    const existing = await collection.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    let referralCode = generateReferralCode();
    while (await collection.findOne({ referralCode })) {
      referralCode = generateReferralCode();
    }

    const partner = {
      firstName,
      lastName,
      email: email.toLowerCase(),
      passwordHash,
      phone: phone || "",
      company: company || "",
      website: website || "",
      referralCode,
      referralSource: referralSource || "",
      createdAt: new Date(),
      status: "pending" as const,
      stripeAccountId: null,
    };

    await collection.insertOne(partner);

    // Send lead to CRM webhook
    try {
      await fetch("http://127.0.0.1:3000/api/todo/webhook/lead-ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "jeff-cline.com/jv",
          leadType: "jv-partner-application",
          firstName,
          lastName,
          email: email.toLowerCase(),
          phone: phone || "",
          company: company || "",
          website: website || "",
          referralSource: referralSource || "",
          referralCode,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (webhookErr) {
      console.warn("CRM webhook failed:", webhookErr);
    }

    return NextResponse.json({
      success: true,
      referralCode,
      message: "Application submitted successfully",
    });
  } catch (error) {
    console.error("JV register error:", error);
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}
