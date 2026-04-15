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
          metaTitle: silo.metaTitle,
          metaDescription: silo.metaDescription,
          heroHeadline: silo.keyword.split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
          heroSub: `Professional ${silo.keyword} services from ${v2Site.websiteName}.`,
          intro: silo.content.split('\n\n')[0] || `Expert ${silo.keyword} solutions.`,
          faqs: silo.faqs || [],
          subPages: silo.subPages.map((sub: any) => ({
            slug: sub.slug,
            title: sub.title,
            keyword: sub.keyword,
            volume: sub.volume,
            cpc: sub.cpc,
          })),
        })),
      };
    }
  }
  
  // Fall back to v1 collection
  return db.collection("demo_sites").findOne({ slug });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; silo: string }> }): Promise<Metadata> {
  const { slug, silo: siloSlug } = await params;
  const site = await getDemoSite(slug);
  if (!site) return {};
  const silo = site.silos?.find((s: { slug: string }) => s.slug === siloSlug);
  if (!silo) return {};
  return {
    title: silo.metaTitle,
    description: silo.metaDescription,
    openGraph: { title: silo.metaTitle, description: silo.metaDescription, url: `https://jeff-cline.com/demo/${slug}/${siloSlug}` },
  };
}

export default async function DemoSiloPage({ params }: { params: Promise<{ slug: string; silo: string }> }) {
  const { slug, silo: siloSlug } = await params;
  const site = await getDemoSite(slug);
  if (!site) notFound();
  const silo = site.silos?.find((s: { slug: string }) => s.slug === siloSlug);
  if (!silo) notFound();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: silo.faqs?.map((f: { question: string; answer: string }) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })) || [],
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Jeff Cline", item: "https://jeff-cline.com" },
      { "@type": "ListItem", position: 2, name: site.websiteName, item: `https://jeff-cline.com/demo/${slug}` },
      { "@type": "ListItem", position: 3, name: silo.name, item: `https://jeff-cline.com/demo/${slug}/${siloSlug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Breadcrumbs items={[
        { label: "Demo", href: "/one-click-demo" },
        { label: site.websiteName, href: `/demo/${slug}` },
        { label: silo.name },
      ]} />

      <section className="pt-4 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Demo banner */}
          <div className="mb-6 p-3 bg-[#FF8900]/10 border border-[#FF8900]/30 rounded-lg text-sm">
            <span className="text-[#FF8900] font-bold">DEMO</span>
            <span className="text-gray-400 ml-3">{site.websiteName}</span>
            <span className="text-gray-600 ml-2">/ {silo.name}</span>
            <span className="text-gray-600 float-right">
              Vol: {silo.volume?.toLocaleString()} | CPC: ${silo.cpc?.toFixed(2)}
            </span>
          </div>

          {/* Hero */}
          <h1 className="text-4xl font-black mb-4">{silo.heroHeadline}</h1>
          <p className="text-xl text-gray-400 mb-8">{silo.heroSub}</p>
          <p className="text-gray-300 leading-relaxed mb-12">{silo.intro}</p>

          {/* Supporting Pages Grid */}
          <h2 className="text-2xl font-black mb-6">In This Section</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
            {silo.subPages?.map((page: { slug: string; title: string; keyword: string; volume: number; cpc: number }) => (
              <Link
                key={page.slug}
                href={`/demo/${slug}/${siloSlug}/${page.slug}`}
                className="block p-5 bg-gray-900 border border-gray-800 rounded-lg hover:border-[#FF8900] transition-colors group"
              >
                <h3 className="font-bold text-white group-hover:text-[#FF8900] transition-colors mb-1">
                  {page.title}
                </h3>
                <div className="text-xs text-gray-600">
                  <span>Vol: {page.volume?.toLocaleString()}</span>
                  <span className="ml-3">CPC: ${page.cpc?.toFixed(2)}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* FAQs */}
          {silo.faqs && silo.faqs.length > 0 && (
            <>
              <h2 className="text-2xl font-black mb-6">Frequently Asked Questions</h2>
              <div className="space-y-6 mb-12">
                {silo.faqs.map((faq: { question: string; answer: string }, i: number) => (
                  <div key={i} className="border-b border-gray-800 pb-4">
                    <h3 className="text-lg font-bold text-white mb-2">{faq.question}</h3>
                    <p className="text-gray-400">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            {site.phoneNumber && (
              <a
                href={`tel:${site.phoneNumber.replace(/[^0-9+]/g, "")}`}
                className="flex-1 text-center px-6 py-4 bg-[#FF8900] text-black font-black rounded-lg hover:bg-[#FF9A20] transition-colors"
              >
                Call Now: {site.phoneNumber}
              </a>
            )}
            <a
              href={site.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center px-6 py-4 border-2 border-[#FF8900] text-[#FF8900] font-black rounded-lg hover:bg-[#FF8900] hover:text-black transition-colors"
            >
              Visit {site.websiteName}
            </a>
          </div>

          {/* Cross-links to other silos */}
          <h2 className="text-xl font-black mb-4">Explore Other Areas</h2>
          <div className="flex flex-wrap gap-3 mb-12">
            {site.silos
              .filter((s: { slug: string }) => s.slug !== siloSlug)
              .map((s: { slug: string; name: string }) => (
                <Link
                  key={s.slug}
                  href={`/demo/${slug}/${s.slug}`}
                  className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-400 hover:text-[#FF8900] hover:border-[#FF8900] transition-colors"
                >
                  {s.name}
                </Link>
              ))}
          </div>

          {/* Jeff Cline Credit */}
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-500 text-sm mb-2">
              Built by{" "}
              <Link href="/" className="text-[#FF8900] hover:underline font-bold">Jeff Cline</Link>
              {" "}&amp; Team |{" "}
              <Link href="/business" className="hover:text-[#FF8900]">Business Growth</Link>
              {" "} | {" "}
              <Link href="/one-click-demo" className="hover:text-[#FF8900]">Build Your Own Demo</Link>
              {" "} | {" "}
              <Link href="/contact" className="hover:text-[#FF8900]">Work With Us</Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
