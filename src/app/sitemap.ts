import type { MetadataRoute } from "next";
import { silos } from "@/lib/silo-data";
import { blogPosts } from "@/lib/blog-data";
import { tryGetDb } from "@/lib/mongodb";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://jeff-cline.com";

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/portfolio`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/quiz`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/tools`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/resources`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  const siloPages: MetadataRoute.Sitemap = silos.map((silo) => ({
    url: `${base}/${silo.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const subPages: MetadataRoute.Sitemap = silos.flatMap((silo) =>
    silo.subPages.map((sub) => ({
      url: `${base}/${silo.slug}/${sub.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
  );

  const resourcePages: MetadataRoute.Sitemap = silos.map((silo) => ({
    url: `${base}/resources/${silo.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Demo sites from MongoDB
  let demoPages: MetadataRoute.Sitemap = [];
  try {
    const db = await tryGetDb();
    
    // If database is not available (e.g., during build), skip demo pages
    if (!db) {
      console.warn('Database not available for sitemap generation, skipping demo pages');
    } else {
      // V1 Demo sites (legacy /demo/ structure)
      const demosV1 = await db.collection("demo_sites").find({}).toArray();
    for (const demo of demosV1) {
      demoPages.push({
        url: `${base}/demo/${demo.slug}`,
        lastModified: demo.createdAt || new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      });
      for (const silo of demo.silos || []) {
        demoPages.push({
          url: `${base}/demo/${demo.slug}/${silo.slug}`,
          lastModified: demo.createdAt || new Date(),
          changeFrequency: "monthly",
          priority: 0.5,
        });
        for (const page of silo.subPages || []) {
          demoPages.push({
            url: `${base}/demo/${demo.slug}/${silo.slug}/${page.slug}`,
            lastModified: demo.createdAt || new Date(),
            changeFrequency: "monthly",
            priority: 0.4,
          });
        }
      }
    }

    // V2 Demo sites (new clean URL structure)
    const demosV2 = await db.collection("demo_sites_v2").find({}).toArray();
    for (const demo of demosV2) {
      for (const topLevelPage of demo.topLevelPages || []) {
        // Top-level keyword pages
        demoPages.push({
          url: `${base}/${topLevelPage.slug}`,
          lastModified: demo.createdAt || new Date(),
          changeFrequency: "weekly",
          priority: 0.8,
        });
        
        // Silo pages
        for (const silo of topLevelPage.silos || []) {
          demoPages.push({
            url: `${base}/${topLevelPage.slug}/${silo.slug}`,
            lastModified: demo.createdAt || new Date(),
            changeFrequency: "weekly",
            priority: 0.7,
          });
          
          // Deep pages
          for (const page of silo.subPages || []) {
            demoPages.push({
              url: `${base}/${topLevelPage.slug}/${silo.slug}/${page.slug}`,
              lastModified: demo.createdAt || new Date(),
              changeFrequency: "monthly",
              priority: 0.6,
            });
          }
        }
      }
    }
    }
  } catch {
    // MongoDB not available at build time, skip demo pages
  }

  return [...staticPages, ...siloPages, ...subPages, ...resourcePages, ...blogPages, ...demoPages];
}
