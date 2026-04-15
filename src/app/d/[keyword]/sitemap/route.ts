import { tryGetDb } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

interface DemoSiteV2 {
  slug: string;
  websiteName: string;
  keywordSlugs: string[];
  topLevelPages: TopLevelPage[];
}

interface TopLevelPage {
  slug: string;
  keyword: string;
  silos: SiloPage[];
}

interface SiloPage {
  slug: string;
  keyword: string;
  subPages: SubPage[];
}

interface SubPage {
  slug: string;
  title: string;
  keyword: string;
}

async function getDemoSiteV2ByKeywordSlug(keywordSlug: string): Promise<{ site: DemoSiteV2; topLevelPage: TopLevelPage } | null> {
  const db = await tryGetDb();
  
  // If database is not available (e.g., during build), return null
  if (!db) {
    return null;
  }
  
  const site = await db.collection("demo_sites_v2").findOne({ keywordSlugs: keywordSlug }) as unknown as DemoSiteV2 | null;
  if (!site) return null;
  
  const topLevelPage = site.topLevelPages.find(p => p.slug === keywordSlug);
  if (!topLevelPage) return null;
  
  return { site, topLevelPage };
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ keyword: string }> }
): Promise<NextResponse> {
  try {
    const { keyword } = await context.params;
    const data = await getDemoSiteV2ByKeywordSlug(keyword);
    
    if (!data) {
      return new NextResponse("Sitemap not found", { status: 404 });
    }
    
    const { site, topLevelPage } = data;
    const baseUrl = "https://jeff-cline.com";
    
    // Build sitemap entries for this keyword tree
    const urls: string[] = [];
    
    // Top-level keyword page
    urls.push(`${baseUrl}/d/${topLevelPage.slug}`);
    
    // All silo pages for this keyword
    topLevelPage.silos.forEach(silo => {
      urls.push(`${baseUrl}/d/${topLevelPage.slug}/${silo.slug}`);
      
      // All sub-pages for this silo
      silo.subPages.forEach(subPage => {
        urls.push(`${baseUrl}/d/${topLevelPage.slug}/${silo.slug}/${subPage.slug}`);
      });
    });
    
    const currentDate = new Date().toISOString();
    
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;

    return new NextResponse(sitemapXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      },
    });
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}