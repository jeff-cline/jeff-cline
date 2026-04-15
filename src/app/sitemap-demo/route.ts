import { getDb } from "@/lib/mongodb";
import { NextResponse } from "next/server";

interface DemoSiteV2 {
  version: number;
  compositeSlug: string;
  websiteName: string;
  keywordSlugs: string[];
  topLevelPages: Array<{
    slug: string;
    keyword: string;
    silos: Array<{
      slug: string;
      keyword: string;
      subPages: Array<{
        slug: string;
        keyword: string;
      }>;
    }>;
  }>;
  createdAt: Date;
}

async function generateSitemapXml() {
  const db = await getDb();
  
  // Get all demo sites (both v1 and v2)
  const [sitesV2, sitesV1] = await Promise.all([
    db.collection("demo_sites_v2").find({}).toArray(),
    db.collection("demo_sites").find({}).toArray(),
  ]);

  const baseUrl = "https://jeff-cline.com";
  const now = new Date().toISOString();
  
  let urls: string[] = [];

  // Process V2 sites (new structure)
  for (const site of sitesV2 as unknown as DemoSiteV2[]) {
    for (const topLevelPage of site.topLevelPages) {
      // Top-level keyword page
      urls.push(`
    <url>
      <loc>${baseUrl}/${topLevelPage.slug}</loc>
      <lastmod>${site.createdAt ? site.createdAt.toISOString() : now}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`);

      // Silo pages
      for (const silo of topLevelPage.silos) {
        urls.push(`
    <url>
      <loc>${baseUrl}/${topLevelPage.slug}/${silo.slug}</loc>
      <lastmod>${site.createdAt ? site.createdAt.toISOString() : now}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.7</priority>
    </url>`);

        // Deep pages
        for (const subPage of silo.subPages) {
          urls.push(`
    <url>
      <loc>${baseUrl}/${topLevelPage.slug}/${silo.slug}/${subPage.slug}</loc>
      <lastmod>${site.createdAt ? site.createdAt.toISOString() : now}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.6</priority>
    </url>`);
        }
      }
    }
  }

  // Process V1 sites (legacy /demo/ structure for backward compatibility)
  for (const site of sitesV1 as any[]) {
    // Main demo page
    urls.push(`
    <url>
      <loc>${baseUrl}/demo/${site.slug}</loc>
      <lastmod>${site.createdAt ? site.createdAt.toISOString() : now}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`);

    // Silo pages
    if (site.silos) {
      for (const silo of site.silos) {
        urls.push(`
    <url>
      <loc>${baseUrl}/demo/${site.slug}/${silo.slug}</loc>
      <lastmod>${site.createdAt ? site.createdAt.toISOString() : now}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.7</priority>
    </url>`);

        // Sub pages
        if (silo.subPages) {
          for (const subPage of silo.subPages) {
            urls.push(`
    <url>
      <loc>${baseUrl}/demo/${site.slug}/${silo.slug}/${subPage.slug}</loc>
      <lastmod>${site.createdAt ? site.createdAt.toISOString() : now}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.6</priority>
    </url>`);
          }
        }
      }
    }
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>${baseUrl}</loc>
      <lastmod>${now}</lastmod>
      <changefreq>daily</changefreq>
      <priority>1.0</priority>
    </url>
    <url>
      <loc>${baseUrl}/one-click-demo</loc>
      <lastmod>${now}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.9</priority>
    </url>${urls.join("")}
</urlset>`;

  return sitemap;
}

export async function GET() {
  try {
    const sitemap = await generateSitemapXml();
    
    return new NextResponse(sitemap, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return new NextResponse("Error generating sitemap", { status: 500 });
  }
}