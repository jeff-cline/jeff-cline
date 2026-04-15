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

interface FAQItem {
  question: string;
  answer: string;
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
  // Add small delay to respect rate limits
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const data = await seoApiFetch("/keywords_data/google_ads/keywords_for_keywords/live", [
    { keyword, language_code: "en", location_code: 2840, include_seed_keyword: false, limit: 100 },
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
    // Add small delay to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 500));
    
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

    return questions.slice(0, 10);
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

function generateFAQs(keyword: string, websiteName: string, questions: string[], startIndex: number = 0): FAQItem[] {
  const faqs: FAQItem[] = [];
  const availableQuestions = questions.slice(startIndex, startIndex + 3);
  
  for (const question of availableQuestions) {
    faqs.push({
      question,
      answer: `${capitalize(keyword)} is a critical aspect that ${websiteName} specializes in. Our expert team provides data-driven solutions tailored to your specific needs, delivering measurable results and proven ROI. Contact us to discuss how we can help you achieve your goals.`,
    });
  }

  // Fill remaining slots with generic questions
  const genericQuestions = [
    `What does ${keyword} involve?`,
    `How much does ${keyword} cost?`,
    `Why choose ${websiteName} for ${keyword}?`,
    `What makes ${keyword} effective?`,
    `How long does ${keyword} take?`,
  ];

  while (faqs.length < 3 && faqs.length < genericQuestions.length) {
    faqs.push({
      question: genericQuestions[faqs.length],
      answer: `${websiteName} delivers top-tier ${keyword} solutions with measurable results. Our data-driven approach ensures maximum ROI and competitive advantage. Contact us to discuss your specific requirements and get a customized strategy.`,
    });
  }

  return faqs;
}

function buildPageContent(keyword: string, siloKeyword: string, primaryKeyword: string, websiteName: string, businessContext: string): string {
  const kw = capitalize(keyword);
  const silo = capitalize(siloKeyword);
  const primary = capitalize(primaryKeyword);

  return `## Understanding ${kw}

${kw} is a critical component of any successful ${silo.toLowerCase()} strategy. In the context of ${primary.toLowerCase()}, businesses that invest in ${keyword} consistently outperform those that don't.

${websiteName} takes a data-first approach to ${keyword}. Every recommendation is backed by real search data, competitive analysis, and proven frameworks that align with your business goals.

${businessContext ? `\n## Why This Matters for Your Business\n\n${businessContext} This is exactly why ${keyword} becomes essential - it directly supports your core mission and helps you reach the right audience with the right message at the right time.\n` : ''}

## Why ${kw} Matters

The market for ${keyword} is evolving rapidly. Businesses that establish authority in this space now will capture disproportionate market share as demand increases.

Key benefits include:
- **Increased visibility** in search engines and AI answer engines
- **Higher conversion rates** from qualified, intent-driven traffic  
- **Competitive moat** that compounds over time
- **Measurable ROI** with clear attribution and tracking
- **Long-term asset building** that appreciates in value

## Our Approach to ${kw}

${websiteName} doesn't do cookie-cutter strategies. Every ${keyword} engagement starts with:

1. **Deep data analysis** — Real search volume, CPC data, and competitive landscape mapping
2. **Custom strategy development** — Tailored roadmap based on your specific business goals and market position
3. **Precision execution** — Implementation with ongoing optimization and performance monitoring
4. **Results measurement** — Clear reporting, ROI tracking, and full accountability

## ${kw} and ${silo}

${kw} sits within the broader discipline of ${silo.toLowerCase()}. Understanding how these pieces fit together is essential for building a cohesive strategy that drives results across all channels and touchpoints.

When ${keyword} is properly aligned with your overall ${siloKeyword} strategy, the results compound exponentially — each piece reinforces the others, creating a flywheel of sustainable growth.

## Implementation Strategy

Our proven ${keyword} implementation follows a systematic approach:

- **Phase 1: Foundation** - Data gathering, competitive analysis, and strategic framework development
- **Phase 2: Build** - Content creation, technical implementation, and system integration  
- **Phase 3: Optimize** - Performance monitoring, A/B testing, and continuous improvement
- **Phase 4: Scale** - Expansion planning, advanced tactics, and market domination

## Key Takeaways

- ${kw} is essential for businesses competing in the ${primary.toLowerCase()} space
- Data-driven strategies outperform guesswork every single time
- ${websiteName} combines deep expertise with cutting-edge technology for measurable results
- Early movers in ${keyword} capture disproportionate long-term value
- Integration with broader ${siloKeyword} strategy creates compounding benefits

Contact ${websiteName} today to discuss how ${keyword} can drive meaningful growth for your business.`;
}

function buildDemoSiteV2(
  websiteName: string,
  websiteUrl: string,
  keywordData: KeywordResult[],
  allRelatedKeywords: RelatedKeyword[][],
  allQuestions: string[][],
  businessContext: string,
  phoneNumber: string
) {
  const masterSlug = slugify(websiteName);
  const keywordSlugs: string[] = [];
  
  const topLevelPages = keywordData.map((keywordResult, keywordIndex) => {
    const keywordSlug = slugify(keywordResult.keyword);
    keywordSlugs.push(keywordSlug);
    
    const relatedKeywords = allRelatedKeywords[keywordIndex] || [];
    const questions = allQuestions[keywordIndex] || [];
    
    // Take 5 related keywords for silos
    const siloKeywords = relatedKeywords.slice(0, 5);
    
    const silos = siloKeywords.map((siloKw, siloIndex) => {
      const siloSlug = slugify(siloKw.keyword);
      
      // Get 5 supporting keywords for this silo from the remaining related keywords
      const startIdx = 5 + siloIndex * 5;
      let supportingKws = relatedKeywords.slice(startIdx, startIdx + 5);
      
      // If we don't have enough related keywords, generate some
      while (supportingKws.length < 5) {
        const suffixes = ["guide", "tips", "services", "cost", "near me", "reviews", "comparison", "benefits", "process", "consultation"];
        const suffix = suffixes[supportingKws.length % suffixes.length];
        supportingKws.push({
          keyword: `${siloKw.keyword} ${suffix}`,
          volume: Math.max(10, Math.floor(siloKw.volume * (0.2 + Math.random() * 0.3))),
          cpc: Math.max(0.5, siloKw.cpc * (0.6 + Math.random() * 0.4)),
        });
      }
      
      const siloFaqs = generateFAQs(siloKw.keyword, websiteName, questions, siloIndex * 3);
      
      const subPages = supportingKws.map((subKw, subIndex) => {
        const subSlug = slugify(subKw.keyword);
        const subFaqs = generateFAQs(subKw.keyword, websiteName, questions, (siloIndex * 15) + (subIndex * 3) + 10);
        
        return {
          slug: subSlug,
          title: capitalize(subKw.keyword),
          keyword: subKw.keyword,
          volume: subKw.volume,
          cpc: subKw.cpc,
          metaTitle: `${capitalize(subKw.keyword)} | ${websiteName}`,
          metaDescription: `Expert ${subKw.keyword} services from ${websiteName}. Proven strategies, measurable results, and data-driven solutions. Get started today.`,
          heroHeadline: capitalize(subKw.keyword),
          heroSub: `Comprehensive ${subKw.keyword} solutions designed to drive real business results.`,
          bodyContent: buildPageContent(subKw.keyword, siloKw.keyword, keywordResult.keyword, websiteName, businessContext),
          faqs: subFaqs,
        };
      });
      
      return {
        slug: siloSlug,
        keyword: siloKw.keyword,
        volume: siloKw.volume,
        cpc: siloKw.cpc,
        metaTitle: `${capitalize(siloKw.keyword)} | ${websiteName}`,
        metaDescription: `Professional ${siloKw.keyword} services from ${websiteName}. Data-driven strategies, expert implementation, and measurable ROI. Contact us today.`,
        content: buildPageContent(siloKw.keyword, keywordResult.keyword, keywordResult.keyword, websiteName, businessContext),
        faqs: siloFaqs,
        subPages,
      };
    });
    
    const topLevelFaqs = generateFAQs(keywordResult.keyword, websiteName, questions, 0);
    
    return {
      slug: keywordSlug,
      keyword: keywordResult.keyword,
      volume: keywordResult.volume,
      cpc: keywordResult.cpc,
      value: keywordResult.value,
      metaTitle: `${capitalize(keywordResult.keyword)} | ${websiteName} — Expert Solutions`,
      metaDescription: `${websiteName} delivers top-tier ${keywordResult.keyword} services. Data-driven strategies, proven results, and expert guidance for your business success.`,
      content: buildPageContent(keywordResult.keyword, keywordResult.keyword, keywordResult.keyword, websiteName, businessContext),
      faqs: topLevelFaqs,
      silos,
    };
  });

  return {
    slug: masterSlug,
    websiteName,
    websiteUrl,
    businessContext,
    phoneNumber: phoneNumber || "",
    keywords: keywordData.map(kw => kw.keyword),
    topLevelPages,
    keywordSlugs,
    createdAt: new Date(),
  };
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

    // Get keyword data for all 3 keywords
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

    // Ensure we have data for all 3 keywords (backfill if needed)
    const keywordMap = new Map(keywordData.map(kw => [kw.keyword.toLowerCase(), kw]));
    const completeKeywordData: KeywordResult[] = [];
    
    for (const keyword of keywords) {
      const existing = keywordMap.get(keyword.toLowerCase());
      if (existing) {
        completeKeywordData.push(existing);
      } else {
        // Backfill with estimated data
        completeKeywordData.push({
          keyword,
          volume: 1000,
          cpc: 2.50,
          value: 2500,
          competition: "MEDIUM",
        });
      }
    }

    // Get related keywords for each of the 3 keywords
    const allRelatedKeywords: RelatedKeyword[][] = [];
    const allQuestions: string[][] = [];
    
    for (const keywordResult of completeKeywordData) {
      try {
        console.log(`Fetching related keywords for: ${keywordResult.keyword}`);
        const relatedKeywords = await getRelatedKeywords(keywordResult.keyword);
        allRelatedKeywords.push(relatedKeywords);
        
        console.log(`Fetching questions for: ${keywordResult.keyword}`);
        const questions = await getQuestions(keywordResult.keyword);
        allQuestions.push(questions);
        
      } catch (err) {
        console.error(`Failed to fetch data for ${keywordResult.keyword}:`, err);
        allRelatedKeywords.push([]);
        allQuestions.push([]);
      }
    }

    // Build the v2 demo site structure
    const demoSite = buildDemoSiteV2(
      websiteName,
      websiteUrl,
      completeKeywordData,
      allRelatedKeywords,
      allQuestions,
      businessContext || "",
      phoneNumber || ""
    );

    // Calculate total pages
    const totalPages = demoSite.topLevelPages.reduce((total, topLevel) => {
      return total + 1 + topLevel.silos.reduce((siloTotal, silo) => {
        return siloTotal + 1 + silo.subPages.length;
      }, 0);
    }, 0);

    // Store in MongoDB v2 collection
    const db = await getDb();
    const existing = await db.collection("demo_sites_v2").findOne({ slug: demoSite.slug });
    if (existing) {
      await db.collection("demo_sites_v2").replaceOne({ slug: demoSite.slug }, demoSite);
    } else {
      await db.collection("demo_sites_v2").insertOne(demoSite);
    }

    return NextResponse.json({
      success: true,
      demoUrls: demoSite.keywordSlugs.map(slug => `/d/${slug}`),
      keywords: demoSite.keywords,
      keywordSlugs: demoSite.keywordSlugs,
      totalPages,
      masterSlug: demoSite.slug,
    });
  } catch (err) {
    console.error("One-click demo v2 error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}