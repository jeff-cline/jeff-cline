import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

const API_BASE = "https://api.dataforseo.com/v3";
const API_AUTH = process.env.SEO_API_AUTH || "";

interface KeywordResult {
  keyword: string;
  volume: number;
  cpc: number;
  value: number;
  competition: string;
}

interface RelatedKeyword {
  keyword: string;
  volume: number;
  cpc: number;
}

async function seoApiFetch(endpoint: string, body: unknown) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${API_AUTH}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }

  return res.json();
}

async function getKeywordData(keywords: string[]): Promise<KeywordResult[]> {
  const data = await seoApiFetch("/keywords_data/google_ads/search_volume/live", [
    { keywords, language_code: "en", location_code: 2840 },
  ]);

  const results: KeywordResult[] = [];

  if (data?.tasks?.[0]?.result) {
    for (const item of data.tasks[0].result) {
      if (item?.keyword) {
        const vol = item.search_volume || 0;
        const cpc = item.cpc || 0;
        results.push({
          keyword: item.keyword,
          volume: vol,
          cpc,
          value: vol * cpc,
          competition: item.competition || "UNKNOWN",
        });
      }
    }
  }

  return results;
}

async function getRelatedKeywords(keyword: string): Promise<RelatedKeyword[]> {
  const data = await seoApiFetch("/keywords_data/google_ads/keywords_for_keywords/live", [
    { keyword, language_code: "en", location_code: 2840, include_seed_keyword: false, limit: 50 },
  ]);

  const results: RelatedKeyword[] = [];

  if (data?.tasks?.[0]?.result) {
    for (const item of data.tasks[0].result) {
      if (item?.keyword) {
        results.push({
          keyword: item.keyword,
          volume: item.search_volume || 0,
          cpc: item.cpc || 0,
        });
      }
    }
  }

  return results.sort((a, b) => b.volume * b.cpc - a.volume * a.cpc);
}

async function getQuestions(keyword: string): Promise<string[]> {
  try {
    const data = await seoApiFetch("/serp/google/organic/live/regular", [
      { keyword, language_code: "en", location_code: 2840 },
    ]);

    const questions: string[] = [];

    if (data?.tasks?.[0]?.result?.[0]?.items) {
      for (const item of data.tasks[0].result[0].items) {
        if (item.type === "people_also_ask" && item.items) {
          for (const q of item.items) {
            if (q.title) questions.push(q.title);
          }
        }
      }
    }

    return questions.slice(0, 8);
  } catch {
    return [];
  }
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function capitalize(text: string): string {
  return text.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function buildDemoSite(
  websiteName: string,
  websiteUrl: string,
  primaryKeyword: KeywordResult,
  allKeywordData: KeywordResult[],
  relatedKeywords: RelatedKeyword[],
  questions: string[],
  businessContext: string,
  phoneNumber: string
) {
  const slug = slugify(primaryKeyword.keyword);
  const primaryCap = capitalize(primaryKeyword.keyword);

  const siloKeywords = relatedKeywords
    .filter((k) => k.keyword !== primaryKeyword.keyword)
    .slice(0, 5);

  const siloStructure = siloKeywords.map((siloKw, i) => {
    const siloSlug = slugify(siloKw.keyword);

    const startIdx = 5 + i * 5;
    const supportingKws = relatedKeywords.slice(startIdx, startIdx + 5);

    while (supportingKws.length < 5) {
      supportingKws.push({
        keyword: `${siloKw.keyword} ${["guide", "tips", "services", "cost", "near me"][supportingKws.length]}`,
        volume: Math.floor(siloKw.volume * 0.3),
        cpc: siloKw.cpc * 0.8,
      });
    }

    const siloFaqs = questions.slice(i, i + 3).map((q) => ({
      question: q,
      answer: `${capitalize(siloKw.keyword)} is a critical aspect of ${primaryCap.toLowerCase()}. ${websiteName} provides expert solutions tailored to your specific needs, backed by data-driven strategies and proven results.`,
    }));

    while (siloFaqs.length < 3) {
      const genericQs = [
        `What does ${siloKw.keyword} involve?`,
        `How much does ${siloKw.keyword} cost?`,
        `Why choose ${websiteName} for ${siloKw.keyword}?`,
      ];
      siloFaqs.push({
        question: genericQs[siloFaqs.length],
        answer: `${websiteName} delivers top-tier ${siloKw.keyword} solutions with measurable results. Contact us to discuss your specific requirements and get a customized strategy.`,
      });
    }

    return {
      slug: siloSlug,
      name: capitalize(siloKw.keyword),
      keyword: siloKw.keyword,
      volume: siloKw.volume,
      cpc: siloKw.cpc,
      metaTitle: `${capitalize(siloKw.keyword)} | ${websiteName}`,
      metaDescription: `Expert ${siloKw.keyword} services from ${websiteName}. Proven strategies, measurable results. Get started today.`,
      heroHeadline: `${capitalize(siloKw.keyword)} That Delivers Results`,
      heroSub: `${websiteName} brings data-driven ${siloKw.keyword} strategies that outperform the competition.`,
      intro: `In today's competitive landscape, ${siloKw.keyword} isn't optional — it's essential. ${websiteName} combines deep industry expertise with cutting-edge technology to deliver ${siloKw.keyword} solutions that drive real business outcomes. Whether you're scaling up or optimizing existing operations, our approach is built on data, not guesswork.`,
      faqs: siloFaqs,
      subPages: supportingKws.map((spKw) => {
        const spSlug = slugify(spKw.keyword);
        return {
          slug: spSlug,
          title: capitalize(spKw.keyword),
          keyword: spKw.keyword,
          volume: spKw.volume,
          cpc: spKw.cpc,
          metaTitle: `${capitalize(spKw.keyword)} | ${websiteName}`,
          metaDescription: `Learn about ${spKw.keyword} from ${websiteName}. Expert insights, actionable strategies, and proven results.`,
          heroHeadline: capitalize(spKw.keyword),
          heroSub: `Everything you need to know about ${spKw.keyword} — from strategy to execution.`,
          bodyContent: buildPageContent(spKw.keyword, siloKw.keyword, primaryKeyword.keyword, websiteName),
          faqs: [
            { question: `What is ${spKw.keyword}?`, answer: `${capitalize(spKw.keyword)} refers to the strategies and practices involved in ${spKw.keyword.toLowerCase()}. ${websiteName} specializes in delivering expert ${spKw.keyword} solutions tailored to your business goals.` },
            { question: `How does ${spKw.keyword} benefit my business?`, answer: `Effective ${spKw.keyword} drives measurable improvements in performance, revenue, and competitive positioning. ${websiteName} uses data-driven approaches to maximize ROI.` },
            { question: `Why choose ${websiteName} for ${spKw.keyword}?`, answer: `${websiteName} combines industry expertise with proven methodologies to deliver ${spKw.keyword} results that matter. Our track record speaks for itself.` },
          ],
          schema: { "@context": "https://schema.org", "@type": "WebPage", name: capitalize(spKw.keyword), description: `Expert ${spKw.keyword} services from ${websiteName}.`, isPartOf: { "@type": "WebSite", name: websiteName } },
        };
      }),
    };
  });

  return {
    slug,
    websiteName,
    websiteUrl,
    businessContext,
    phoneNumber: phoneNumber || "",
    primaryKeyword: primaryKeyword.keyword,
    primaryVolume: primaryKeyword.volume,
    primaryCpc: primaryKeyword.cpc,
    primaryValue: primaryKeyword.value,
    allKeywords: allKeywordData,
    createdAt: new Date(),
    metaTitle: `${primaryCap} | ${websiteName} — Expert Solutions`,
    metaDescription: `${websiteName} delivers top-tier ${primaryKeyword.keyword} services. Data-driven strategies, proven results, and expert guidance for your business.`,
    heroHeadline: `${primaryCap}: The ${websiteName} Advantage`,
    heroSub: `Dominate your market with expert ${primaryKeyword.keyword} strategies backed by real data.`,
    intro: `${websiteName} is your partner in ${primaryKeyword.keyword}. We don't guess — we analyze real search data, market trends, and competitive intelligence to build strategies that win. With ${primaryKeyword.volume.toLocaleString()} monthly searches and a CPC of $${primaryKeyword.cpc.toFixed(2)}, this market is worth fighting for. Here's how we help you win it.`,
    silos: siloStructure,
    siteSchema: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: websiteName,
      url: `https://jeff-cline.com/demo/${slug}`,
      description: `${websiteName} — Expert ${primaryKeyword.keyword} solutions.`,
      publisher: { "@type": "Organization", name: websiteName, url: websiteUrl },
    },
    breadcrumbBase: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Jeff Cline", item: "https://jeff-cline.com" },
        { "@type": "ListItem", position: 2, name: "Demos", item: "https://jeff-cline.com/demo" },
        { "@type": "ListItem", position: 3, name: websiteName, item: `https://jeff-cline.com/demo/${slug}` },
      ],
    },
  };
}

function buildPageContent(keyword: string, siloKeyword: string, primaryKeyword: string, websiteName: string): string {
  const kw = capitalize(keyword);
  const silo = capitalize(siloKeyword);
  const primary = capitalize(primaryKeyword);

  return `## Understanding ${kw}

${kw} is a critical component of any successful ${silo.toLowerCase()} strategy. In the context of ${primary.toLowerCase()}, businesses that invest in ${keyword} consistently outperform those that don't.

${websiteName} takes a data-first approach to ${keyword}. Every recommendation is backed by real search data, competitive analysis, and proven frameworks.

## Why ${kw} Matters

The market for ${keyword} is growing. Businesses that establish authority in this space now will capture disproportionate market share as demand increases.

Key benefits include:
- **Increased visibility** in search engines and AI answer engines
- **Higher conversion rates** from qualified, intent-driven traffic
- **Competitive moat** that compounds over time
- **Measurable ROI** with clear attribution

## Our Approach to ${kw}

${websiteName} doesn't do cookie-cutter strategies. Every ${keyword} engagement starts with:

1. **Data analysis** — Real search volume, CPC, and competitive landscape
2. **Strategy development** — Custom roadmap based on your business goals
3. **Execution** — Implementation with ongoing optimization
4. **Measurement** — Clear reporting and accountability

## ${kw} and ${silo}

${kw} sits within the broader discipline of ${silo.toLowerCase()}. Understanding how these pieces fit together is essential for building a cohesive strategy that drives results across all channels.

When ${keyword} is aligned with your overall ${siloKeyword} strategy, the results compound — each piece reinforces the others, creating a flywheel of growth.

## Key Takeaways

- ${kw} is essential for businesses competing in the ${primary.toLowerCase()} space
- Data-driven strategies outperform guesswork every time
- ${websiteName} combines expertise with technology for measurable results
- Start with analysis, execute with precision, measure everything`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { websiteUrl, websiteName, keyword1, keyword2, keyword3, businessContext, phoneNumber } = body;

    if (!websiteUrl || !websiteName || !keyword1 || !keyword2 || !keyword3 || !businessContext) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (!API_AUTH) {
      console.error("SEO_API_AUTH environment variable is not set");
      return NextResponse.json({ error: "Service configuration error. Please contact support." }, { status: 500 });
    }

    const keywords = [keyword1.trim(), keyword2.trim(), keyword3.trim()];

    // Get keyword data
    let keywordData: KeywordResult[];
    try {
      keywordData = await getKeywordData(keywords);
    } catch (err) {
      console.error("Keyword data fetch failed:", err);
      return NextResponse.json({ error: "Failed to retrieve keyword data. Please try again." }, { status: 502 });
    }

    if (keywordData.length === 0) {
      return NextResponse.json(
        { error: "No data found for those keywords. Try broader or more common keywords." },
        { status: 422 }
      );
    }

    // Find highest value keyword (volume x CPC)
    const primaryKeyword = keywordData.reduce((best, current) =>
      current.value > best.value ? current : best
    );

    // Get related keywords
    let relatedKeywords: RelatedKeyword[] = [];
    try {
      relatedKeywords = await getRelatedKeywords(primaryKeyword.keyword);
    } catch (err) {
      console.error("Related keywords fetch failed:", err);
    }

    // Get People Also Ask questions
    const questions = await getQuestions(primaryKeyword.keyword);

    // Build the demo site structure
    const demoSite = buildDemoSite(
      websiteName,
      websiteUrl,
      primaryKeyword,
      keywordData,
      relatedKeywords,
      questions,
      businessContext || "",
      phoneNumber || ""
    );

    // Store in MongoDB
    const db = await getDb();
    const existing = await db.collection("demo_sites").findOne({ slug: demoSite.slug });
    if (existing) {
      await db.collection("demo_sites").replaceOne({ slug: demoSite.slug }, demoSite);
    } else {
      await db.collection("demo_sites").insertOne(demoSite);
    }

    return NextResponse.json({
      success: true,
      demoUrl: `/demo/${demoSite.slug}`,
      primaryKeyword: primaryKeyword.keyword,
      volume: primaryKeyword.volume,
      cpc: primaryKeyword.cpc,
      value: primaryKeyword.value,
      siloCount: demoSite.silos.length,
      totalPages: demoSite.silos.reduce((sum, s) => sum + 1 + s.subPages.length, 1),
    });
  } catch (err) {
    console.error("One-click demo error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
