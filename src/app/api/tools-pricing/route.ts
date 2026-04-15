import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

const DEFAULT_COSTS: Record<string, number> = {
  keyword_suggestions: 1,
  related_keywords: 1,
  keyword_questions: 1,
  volume_check: 1,
  difficulty_check: 1,
  keyword_gap: 3,
  backlink_analysis: 5,
  domain_analysis: 3,
  serp_check: 2,
  competitor_analysis: 2,
  site_audit: 10,
  aeo_analysis: 8,
  content_silos: 10,
  instant_analysis: 3,
  website_builder: 4500,
};

const TOOL_LABELS: Record<string, string> = {
  keyword_suggestions: "Keyword Suggestions",
  related_keywords: "Related Keywords",
  keyword_questions: "Keyword Questions / PAA",
  volume_check: "Search Volume Lookup",
  difficulty_check: "Keyword Difficulty",
  keyword_gap: "Keyword Gap Analysis",
  backlink_analysis: "Backlink Analyzer",
  domain_analysis: "Domain Analysis",
  serp_check: "SERP Tracker",
  competitor_analysis: "Competitor Analysis",
  site_audit: "Site Audit",
  aeo_analysis: "AEO Optimization",
  content_silos: "Content Silos",
  instant_analysis: "Instant Page Analysis",
  website_builder: "Optimized Website Builder",
};

const TOOL_DESCRIPTIONS: Record<string, string> = {
  keyword_suggestions: "Get AI-powered keyword ideas based on your seed terms",
  related_keywords: "Discover semantically related keywords to expand your reach",
  keyword_questions: "Find \"People Also Ask\" questions for your target keywords",
  volume_check: "Check monthly search volume for any keyword",
  difficulty_check: "Assess how hard it is to rank for specific keywords",
  keyword_gap: "Find keywords your competitors rank for that you don't",
  backlink_analysis: "Analyze your backlink profile and find link building opportunities",
  domain_analysis: "Get a comprehensive overview of any domain's SEO health",
  serp_check: "Track your rankings across search engines in real-time",
  competitor_analysis: "Deep-dive into competitor strategies and find gaps",
  site_audit: "Full technical SEO audit of your website",
  aeo_analysis: "Optimize your content for AI/Answer Engine visibility",
  content_silos: "Build topic clusters and content architecture",
  instant_analysis: "Quick analysis of any webpage's SEO performance",
  website_builder: "Full SEO-optimized website built from your business details and keywords",
};

const TOOL_CATEGORIES: Record<string, string> = {
  keyword_suggestions: "keyword",
  related_keywords: "keyword",
  keyword_questions: "keyword",
  volume_check: "keyword",
  difficulty_check: "keyword",
  keyword_gap: "analysis",
  backlink_analysis: "analysis",
  domain_analysis: "analysis",
  serp_check: "analysis",
  competitor_analysis: "analysis",
  site_audit: "premium",
  aeo_analysis: "premium",
  content_silos: "premium",
  instant_analysis: "analysis",
  website_builder: "enterprise",
};

export const dynamic = "force-dynamic";

export async function GET() {
  let dbCosts: Record<string, number> = {};
  try {
    const db = await getDb();
    const config = await db.collection("globalSettings").findOne({ key: "credit_config" });
    if (config?.costs) {
      dbCosts = config.costs;
    }
  } catch {
    // DB unavailable, use defaults
  }

  const mergedCosts = { ...DEFAULT_COSTS, ...dbCosts };

  const tools = Object.keys(DEFAULT_COSTS).map((key) => ({
    key,
    label: TOOL_LABELS[key] || key,
    description: TOOL_DESCRIPTIONS[key] || "",
    price: mergedCosts[key] ?? DEFAULT_COSTS[key],
    category: TOOL_CATEGORIES[key] || "other",
  }));

  return NextResponse.json({ tools });
}
