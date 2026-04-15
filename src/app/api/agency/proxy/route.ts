import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getDb } from "@/lib/mongodb";

const SECRET = process.env.NEXTAUTH_SECRET || "change-me-to-a-real-secret-in-production";
const DFS_BASE_URL = "https://api.dataforseo.com/v3";

export async function POST(req: NextRequest) {
  // Verify session
  const token = req.cookies.get("agency_session")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    jwt.verify(token, SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  // Get global SEO API credentials from database
  const db = await getDb();
  const settings = await db.collection("globalSettings").findOne({ key: "seo_api_credentials" });
  if (!settings || !settings.login || !settings.password) {
    return NextResponse.json(
      { error: "SEO API not configured. Please contact your administrator to set up API credentials." },
      { status: 503 }
    );
  }

  try {
    const { endpoint, body } = await req.json();
    if (!endpoint) {
      return NextResponse.json({ error: "Endpoint is required" }, { status: 400 });
    }

    // Build auth header from server-side credentials
    const authHeader = "Basic " + Buffer.from(`${settings.login}:${settings.password}`).toString("base64");

    // Proxy to SEO API
    const apiResponse = await fetch(`${DFS_BASE_URL}${endpoint}`, {
      method: body ? "POST" : "GET",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await apiResponse.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Proxy error:", err);
    return NextResponse.json({ error: "Failed to proxy request" }, { status: 500 });
  }
}
