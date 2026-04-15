import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

const PRODUCT_URLS: Record<string, string> = {
  voicedrips: "https://voicedrips.com",
  kreeper: "https://kreeper.ai",
  intenttriggers: "https://intenttriggers.com",
  moneywords: "https://moneywords.org",
  nicheplatform: "https://jeff-cline.com/fast-start",
  agents: "https://agents.biz",
  keywordcalls: "https://jeff-cline.com/contact",
  faststart: "https://jeff-cline.com/fast-start",
};

export async function GET(req: NextRequest) {
  try {
    const ref = req.nextUrl.searchParams.get("ref");
    const product = req.nextUrl.searchParams.get("product");

    if (!ref) {
      return NextResponse.redirect(new URL("/jv", req.url));
    }

    const db = await getDb();

    // Record the click
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

    await db.collection("jv_clicks").insertOne({
      referralCode: ref.toUpperCase(),
      product: product || "general",
      ip,
      userAgent: req.headers.get("user-agent") || "",
      timestamp: new Date(),
    });

    // Redirect to the product page
    const productKey = (product || "").toLowerCase();
    const redirectUrl = PRODUCT_URLS[productKey] || "https://jeff-cline.com/jv";

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("JV track error:", error);
    return NextResponse.redirect(new URL("/jv", req.url));
  }
}
