import { tryGetDb } from "@/lib/mongodb";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";

async function getDemoSite(slug: string) {
  const db = await tryGetDb();
  
  // If database is not available (e.g., during build), return null
  if (!db) {
    return null;
  }
  
  // First check v2 collection by keywordSlugs (for backward compatibility)
  const v2Site = await db.collection("demo_sites_v2").findOne({ keywordSlugs: slug });
  if (v2Site) {
    // Convert v2 structure to v1 format for this component
    const topLevelPage = v2Site.topLevelPages.find((p: any) => p.slug === slug);
    if (topLevelPage) {
      return {
        slug,
        websiteName: v2Site.websiteName,
        websiteUrl: v2Site.websiteUrl,
        businessContext: v2Site.businessContext,
        phoneNumber: v2Site.phoneNumber,
        silos: topLevelPage.silos.map((silo: any) => ({
          slug: silo.slug,
          name: silo.keyword.split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
          keyword: silo.keyword,
          volume: silo.volume,
          cpc: silo.cpc,
          subPages: silo.subPages.map((sub: any) => ({
            slug: sub.slug,
            title: sub.title,
            keyword: sub.keyword,
            volume: sub.volume,
            cpc: sub.cpc,
            metaTitle: sub.metaTitle,
            metaDescription: sub.metaDescription,
            heroHeadline: sub.heroHeadline,
            heroSub: sub.heroSub,
            bodyContent: sub.bodyContent,
            faqs: sub.faqs || [],
            schema: {
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: sub.title,
              description: sub.metaDescription,
              isPartOf: { "@type": "WebSite", name: v2Site.websiteName }
            },
          })),
        })),
      };
    }
  }
  
  // Fall back to v1 collection
  return db.collection("demo_sites").findOne({ slug });
}

interface SubPage {
  slug: string;
  title: string;
  keyword: string;
  volume: number;
  cpc: number;
  metaTitle: string;
  metaDescription: string;
  heroHeadline: string;
  heroSub: string;
  bodyContent: string;
  faqs: { question: string; answer: string }[];
  schema: Record<string, unknown>;
}

interface SiloData {
  slug: string;
  name: string;
  keyword: string;
  subPages: SubPage[];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; silo: string; page: string }>;
}): Promise<Metadata> {
  const { slug, silo: siloSlug, page: pageSlug } = await params;
  const site = await getDemoSite(slug);
  if (!site) return {};
  const silo = site.silos?.find((s: SiloData) => s.slug === siloSlug);
  const sub = silo?.subPages?.find((p: SubPage) => p.slug === pageSlug);
  if (!sub) return {};
  return {
    title: sub.metaTitle,
    description: sub.metaDescription,
    openGraph: {
      title: sub.metaTitle,
      description: sub.metaDescription,
      url: `https://jeff-cline.com/demo/${slug}/${siloSlug}/${pageSlug}`,
    },
  };
}

export default async function DemoSubPage({
  params,
}: {
  params: Promise<{ slug: string; silo: string; page: string }>;
}) {
  const { slug, silo: siloSlug, page: pageSlug } = await params;
  const site = await getDemoSite(slug);
  if (!site) notFound();
  const silo = site.silos?.find((s: SiloData) => s.slug === siloSlug);
  if (!silo) notFound();
  const sub = silo.subPages?.find((p: SubPage) => p.slug === pageSlug);
  if (!sub) notFound();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: sub.faqs?.map((f: { question: string; answer: string }) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Jeff Cline", item: "https://jeff-cline.com" },
      { "@type": "ListItem", position: 2, name: site.websiteName, item: `https://jeff-cline.com/demo/${slug}` },
      { "@type": "ListItem", position: 3, name: silo.name, item: `https://jeff-cline.com/demo/${slug}/${siloSlug}` },
      { "@type": "ListItem", position: 4, name: sub.title, item: `https://jeff-cline.com/demo/${slug}/${siloSlug}/${pageSlug}` },
    ],
  };

  // Parse body content markdown-ish to HTML sections
  const sections = sub.bodyContent?.split("\n\n").filter(Boolean) || [];

  // Other pages in this silo for interlinking
  const siblingPages = silo.subPages.filter((p: SubPage) => p.slug !== pageSlug);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(sub.schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Breadcrumbs items={[
        { label: "Demo", href: "/one-click-demo" },
        { label: site.websiteName, href: `/demo/${slug}` },
        { label: silo.name, href: `/demo/${slug}/${siloSlug}` },
        { label: sub.title },
      ]} />

      <section className="pt-4 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Demo banner */}
          <div className="mb-6 p-3 bg-[#FF8900]/10 border border-[#FF8900]/30 rounded-lg text-sm">
            <span className="text-[#FF8900] font-bold">DEMO</span>
            <span className="text-gray-400 ml-3">{site.websiteName}</span>
            <span className="text-gray-600 float-right">
              Vol: {sub.volume?.toLocaleString()} | CPC: ${sub.cpc?.toFixed(2)}
            </span>
          </div>

          {/* Hero */}
          <h1 className="text-4xl font-black mb-4">{sub.heroHeadline}</h1>
          <p className="text-xl text-gray-400 mb-10">{sub.heroSub}</p>

          {/* Body Content */}
          <div className="prose prose-invert max-w-none mb-16">
            {sections.map((section: string, i: number) => {
              if (section.startsWith("## ")) {
                return (
                  <h2 key={i} className="text-2xl font-black text-white mt-10 mb-4">
                    {section.replace("## ", "")}
                  </h2>
                );
              }
              if (section.startsWith("- ")) {
                const items = section.split("\n").filter((l) => l.startsWith("- "));
                return (
                  <ul key={i} className="list-disc pl-6 space-y-2 text-gray-300 mb-6">
                    {items.map((item, j) => (
                      <li key={j} dangerouslySetInnerHTML={{ __html: item.replace(/^- /, "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
                    ))}
                  </ul>
                );
              }
              if (section.match(/^\d\./)) {
                const items = section.split("\n").filter((l) => l.match(/^\d/));
                return (
                  <ol key={i} className="list-decimal pl-6 space-y-2 text-gray-300 mb-6">
                    {items.map((item, j) => (
                      <li key={j} dangerouslySetInnerHTML={{ __html: item.replace(/^\d+\.\s*/, "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
                    ))}
                  </ol>
                );
              }
              return (
                <p key={i} className="text-gray-300 leading-relaxed mb-4">
                  {section}
                </p>
              );
            })}
          </div>

          {/* FAQs */}
          {sub.faqs && sub.faqs.length > 0 && (
            <>
              <h2 className="text-2xl font-black mb-6">Frequently Asked Questions</h2>
              <div className="space-y-6 mb-12">
                {sub.faqs.map((faq: { question: string; answer: string }, i: number) => (
                  <div key={i} className="border-b border-gray-800 pb-4">
                    <h3 className="text-lg font-bold text-white mb-2">{faq.question}</h3>
                    <p className="text-gray-400">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Interlinks to sibling pages */}
          <h2 className="text-xl font-black mb-4">Related Pages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
            {siblingPages.map((p: SubPage) => (
              <Link
                key={p.slug}
                href={`/demo/${slug}/${siloSlug}/${p.slug}`}
                className="p-4 bg-gray-900 border border-gray-800 rounded-lg text-sm text-gray-400 hover:text-[#FF8900] hover:border-[#FF8900] transition-colors"
              >
                {p.title}
              </Link>
            ))}
          </div>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            {site.phoneNumber && (
              <a
                href={`tel:${site.phoneNumber.replace(/[^0-9+]/g, "")}`}
                className="flex-1 text-center px-5 py-3 bg-[#FF8900] text-black font-black rounded-lg hover:bg-[#FF9A20] transition-colors"
              >
                Call Now: {site.phoneNumber}
              </a>
            )}
            <a
              href={site.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center px-5 py-3 border-2 border-[#FF8900] text-[#FF8900] font-black rounded-lg hover:bg-[#FF8900] hover:text-black transition-colors"
            >
              Visit {site.websiteName}
            </a>
          </div>

          {/* Back to silo */}
          <div className="text-center mt-8 mb-8">
            <Link href={`/demo/${slug}/${siloSlug}`} className="text-[#FF8900] hover:underline text-sm">
              Back to {silo.name}
            </Link>
            <span className="text-gray-700 mx-3">|</span>
            <Link href={`/demo/${slug}`} className="text-[#FF8900] hover:underline text-sm">
              Back to {site.websiteName} Demo Home
            </Link>
          </div>

          {/* Jeff Cline Credit */}
          <div className="pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-500 text-sm mb-2">
              Built by{" "}
              <Link href="/" className="text-[#FF8900] hover:underline font-bold">Jeff Cline</Link>
              {" "}&amp; Team |{" "}
              <Link href="/entrepreneur" className="hover:text-[#FF8900]">Entrepreneurs</Link>
              {" "} | {" "}
              <Link href="/investors" className="hover:text-[#FF8900]">Investors</Link>
              {" "} | {" "}
              <Link href="/one-click-demo" className="hover:text-[#FF8900]">Build Your Own Demo</Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
