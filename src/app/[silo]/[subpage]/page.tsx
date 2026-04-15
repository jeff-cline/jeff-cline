import { silos } from "@/lib/silo-data";
import { tryGetDb } from "@/lib/mongodb";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";

// Import demo components
// import DemoSiloPage from "./demo-silo-page"; // TODO: Create this component

// Map of cross-silo recommendations keyed by silo slug
// Each entry lists subpage slugs from OTHER silos that are relevant
const crossSiloMap: Record<string, { silo: string; subpage: string }[]> = {
  business: [
    { silo: "entrepreneur", subpage: "revenue-automation" },
    { silo: "start-ups", subpage: "startup-tech-architecture" },
    { silo: "investors", subpage: "technical-due-diligence" },
  ],
  entrepreneur: [
    { silo: "business", subpage: "business-automation-solutions" },
    { silo: "business", subpage: "scaling-business-operations" },
    { silo: "start-ups", subpage: "startup-growth-hacking" },
  ],
  "start-ups": [
    { silo: "investors", subpage: "fundraising-pitch-technology" },
    { silo: "entrepreneur", subpage: "tech-stack-for-entrepreneurs" },
    { silo: "business", subpage: "ai-integration-for-business" },
  ],
  investors: [
    { silo: "family-offices", subpage: "direct-investment-technology" },
    { silo: "start-ups", subpage: "startup-tech-architecture" },
    { silo: "business", subpage: "competitive-market-analysis" },
  ],
  "family-offices": [
    { silo: "investors", subpage: "portfolio-monitoring-technology" },
    { silo: "investors", subpage: "emerging-technology-analysis" },
    { silo: "business", subpage: "ai-integration-for-business" },
  ],
};

export const dynamicParams = false;

export function generateStaticParams() {
  const params: { silo: string; subpage: string }[] = [];
  silos.forEach((s) => s.subPages.forEach((sub) => params.push({ silo: s.slug, subpage: sub.slug })));
  return params;
}

async function getDemoSiteBySilo(keywordSlug: string, siloSlug: string) {
  try {
    const db = await tryGetDb();
    
    // If database is not available (e.g., during build), return null
    if (!db) {
      return null;
    }
    
    // Try v2 structure first
    const siteV2 = await db.collection("demo_sites_v2").findOne({ 
      keywordSlugs: keywordSlug 
    });
    
    if (siteV2) {
      const topLevelPage = siteV2.topLevelPages?.find((p: any) => p.slug === keywordSlug);
      if (topLevelPage) {
        const silo = topLevelPage.silos?.find((s: any) => s.slug === siloSlug);
        if (silo) {
          return { site: siteV2, topLevelPage, silo };
        }
      }
    }
    
    // Fallback to v1 structure for backward compatibility
    const siteV1 = await db.collection("demo_sites").findOne({ slug: keywordSlug });
    if (siteV1) {
      const silo = siteV1.silos?.find((s: any) => s.slug === siloSlug);
      if (silo) {
        // Transform v1 structure to match v2 interface
        const transformedSite = {
          version: 1,
          compositeSlug: siteV1.slug,
          websiteName: siteV1.websiteName,
          websiteUrl: siteV1.websiteUrl,
          businessContext: siteV1.businessContext,
          phoneNumber: siteV1.phoneNumber,
          userKeywords: [siteV1.primaryKeyword],
          keywordSlugs: [siteV1.slug],
          topLevelPages: [{
            slug: siteV1.slug,
            keyword: siteV1.primaryKeyword,
            name: siteV1.primaryKeyword,
            silos: siteV1.silos || [],
          }],
          totalPages: 1 + (siteV1.silos?.length || 0) + (siteV1.silos?.reduce((sum: number, s: any) => sum + (s.subPages?.length || 0), 0) || 0),
          siteSchema: siteV1.siteSchema,
        };
        
        return { 
          site: transformedSite, 
          topLevelPage: transformedSite.topLevelPages[0], 
          silo: silo 
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error checking for demo silo:", error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ silo: string; subpage: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  
  // Check if this is a demo silo page first
  const demoResult = await getDemoSiteBySilo(resolvedParams.silo, resolvedParams.subpage);
  if (demoResult) {
    const { silo } = demoResult;
    const canonicalUrl = `https://jeff-cline.com/${resolvedParams.silo}/${resolvedParams.subpage}`;
    
    return {
      title: silo.metaTitle,
      description: silo.metaDescription,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: silo.metaTitle,
        description: silo.metaDescription,
        url: canonicalUrl,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: silo.metaTitle,
        description: silo.metaDescription,
      },
    };
  }
  
  // Fall back to main site subpages
  const silo = silos.find((s) => s.slug === resolvedParams.silo);
  const sub = silo?.subPages.find((p) => p.slug === resolvedParams.subpage);
  if (!sub) return {};
  return {
    title: sub.metaTitle,
    description: sub.metaDescription,
    openGraph: { title: sub.metaTitle, description: sub.metaDescription, url: `https://jeff-cline.com/${resolvedParams.silo}/${sub.slug}` },
  };
}

function getCrossSiloRecommendations(siloSlug: string) {
  const refs = crossSiloMap[siloSlug] || [];
  return refs
    .map((ref) => {
      const s = silos.find((x) => x.slug === ref.silo);
      const sub = s?.subPages.find((x) => x.slug === ref.subpage);
      if (!s || !sub) return null;
      return { silo: s, sub };
    })
    .filter(Boolean) as { silo: (typeof silos)[0]; sub: (typeof silos)[0]["subPages"][0] }[];
}

export default async function SubPage({ params }: { params: Promise<{ silo: string; subpage: string }> }) {
  const resolvedParams = await params;
  
  // Check if this is a demo silo page first
  const demoResult = await getDemoSiteBySilo(resolvedParams.silo, resolvedParams.subpage);
  if (demoResult) {
    const { site, topLevelPage, silo } = demoResult;
    // return <DemoSiloPage site={site} topLevelPage={topLevelPage} silo={silo} keyword={resolvedParams.silo} siloSlug={resolvedParams.subpage} />; // TODO: Implement demo integration
    // For now, fall through to regular subpage rendering
  }
  
  // Fall back to main site subpages
  const silo = silos.find((s) => s.slug === resolvedParams.silo);
  const sub = silo?.subPages.find((p) => p.slug === resolvedParams.subpage);
  if (!silo || !sub) notFound();

  const siblings = silo.subPages.filter((s) => s.slug !== sub.slug);
  const crossSilo = getCrossSiloRecommendations(silo.slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: sub.metaTitle,
            description: sub.metaDescription,
            author: { "@type": "Person", name: "Jeff Cline" },
            url: `https://jeff-cline.com/${silo.slug}/${sub.slug}`,
          }),
        }}
      />

      {/* Breadcrumb */}
      <Breadcrumbs items={[
        { label: silo.name, href: `/${silo.slug}` },
        { label: sub.title },
      ]} />

      {/* Hero */}
      <section className="pt-8 pb-16 px-4">
        <div className="max-w-4xl mx-auto animate-fade-in-up">
          <p className="text-[#DC2626] font-bold text-sm tracking-[0.3em] uppercase mb-4">{silo.name}</p>
          <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">{sub.heroHeadline}</h1>
          <p className="text-xl text-gray-400">{sub.heroSub}</p>
        </div>
      </section>

      {/* Problems */}
      <section className="py-16 px-4 bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black mb-12 text-center">
            3 Problems <span className="text-[#FF8900]">A Geek</span> Can Fix
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {sub.problems.map((p, i) => (
              <div key={i} className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-8">
                <div className="text-[#FF8900] font-black text-4xl mb-4">0{i + 1}</div>
                <h3 className="text-xl font-bold mb-3">{p.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{p.description}</p>
                <p className="text-[#DC2626] text-sm font-semibold">{p.solution}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Body content */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto prose-custom">
          {sub.bodyContent.split("\n\n").map((paragraph, i) => (
            <p key={i} className="text-gray-300 text-lg leading-relaxed mb-6">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* FAQs */}
      {sub.faqs && sub.faqs.length > 0 && (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: sub.faqs.map((faq) => ({
                  "@type": "Question",
                  name: faq.question,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: faq.answer,
                  },
                })),
              }),
            }}
          />
          <section className="py-16 px-4 bg-[#0a0a0a]">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-black mb-12 text-center">
                Frequently Asked <span className="text-[#FF8900]">Questions</span>
              </h2>
              <div className="space-y-4">
                {sub.faqs.map((faq, i) => (
                  <div key={i} className="bg-[#1a1a1a] border border-white/5 rounded-xl p-6">
                    <h3 className="text-[#FF8900] font-bold text-lg mb-3">{faq.question}</h3>
                    <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* CTA */}
      <section className="py-20 px-4 bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-4">{sub.cta}</h2>
          <p className="text-gray-400 mb-8">Take the 2-minute quiz or reach out directly.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quiz" className="btn-primary">Take the Quiz →</Link>
            <Link href="/contact" className="btn-secondary">Contact Me</Link>
          </div>
        </div>
      </section>

      {/* More from this silo */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-2xl font-black mb-8 text-center">
            More from <span className="text-[#FF8900]">{silo.name}</span>
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {siblings.map((s) => (
              <Link
                key={s.slug}
                href={`/${silo.slug}/${s.slug}`}
                className="bg-[#1a1a1a] border border-white/5 rounded-lg p-4 hover:border-[#FF8900]/30 transition-colors group"
              >
                <h4 className="text-sm font-bold text-gray-300 group-hover:text-[#FF8900] transition-colors">{s.title}</h4>
                <p className="text-gray-600 text-xs mt-1">{s.heroSub}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-silo recommendations */}
      {crossSilo.length > 0 && (
        <section className="py-16 px-4 bg-[#0a0a0a]">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-2xl font-black mb-8 text-center">
              You Might Also Be <span className="text-[#DC2626]">Interested In</span>
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {crossSilo.map((item) => (
                <Link
                  key={`${item.silo.slug}-${item.sub.slug}`}
                  href={`/${item.silo.slug}/${item.sub.slug}`}
                  className="bg-[#1a1a1a] border border-white/5 rounded-xl p-6 hover:border-[#DC2626]/30 transition-colors group"
                >
                  <p className="text-[#DC2626] text-xs font-bold tracking-wider uppercase mb-2">{item.silo.name}</p>
                  <h4 className="text-lg font-bold text-gray-200 group-hover:text-[#FF8900] transition-colors mb-2">{item.sub.title}</h4>
                  <p className="text-gray-500 text-sm">{item.sub.heroSub}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
