import { silos } from "@/lib/silo-data";
import { tryGetDb } from "@/lib/mongodb";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";

// Import demo site components
// import DemoKeywordPage from "./demo-keyword-page"; // TODO: Create this component

const siloDescriptions: Record<string, string> = {
  business: "Technology-driven business transformation and operational excellence",
  entrepreneur: "Systems and automation that free entrepreneurs from the daily grind",
  "start-ups": "Build fast, scale faster with the right technology foundation",
  investors: "Smarter deals and better returns through technology intelligence",
  "family-offices": "Protect and grow generational wealth with modern technology",
};

export const dynamicParams = false;

export function generateStaticParams() {
  return silos.map((s) => ({ silo: s.slug }));
}

async function getDemoSiteByKeyword(keywordSlug: string) {
  try {
    const db = await tryGetDb();
    
    // If database is not available (e.g., during build), return null
    if (!db) {
      return null;
    }
    
    // First try v2 structure
    const siteV2 = await db.collection("demo_sites_v2").findOne({ 
      keywordSlugs: keywordSlug 
    });
    
    if (siteV2) {
      const page = siteV2.topLevelPages?.find((p: any) => p.slug === keywordSlug);
      if (page) {
        return { site: siteV2, page };
      }
    }
    
    // Fallback to v1 structure for backward compatibility
    const siteV1 = await db.collection("demo_sites").findOne({ slug: keywordSlug });
    if (siteV1) {
      // Transform v1 structure to match v2 interface for rendering
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
          volume: siteV1.primaryVolume,
          cpc: siteV1.primaryCpc,
          value: siteV1.primaryValue,
          metaTitle: siteV1.metaTitle,
          metaDescription: siteV1.metaDescription,
          heroHeadline: siteV1.heroHeadline,
          heroSub: siteV1.heroSub,
          intro: siteV1.intro,
          faqs: [],
          silos: siteV1.silos || [],
        }],
        totalPages: 1 + (siteV1.silos?.length || 0) + (siteV1.silos?.reduce((sum: number, s: any) => sum + (s.subPages?.length || 0), 0) || 0),
        siteSchema: siteV1.siteSchema,
      };
      
      return { site: transformedSite, page: transformedSite.topLevelPages[0] };
    }
    
    return null;
  } catch (error) {
    console.error("Error checking for demo sites:", error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ silo: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  
  // Check if this is a demo site first
  const demoResult = await getDemoSiteByKeyword(resolvedParams.silo);
  if (demoResult) {
    const { page } = demoResult;
    const canonicalUrl = `https://jeff-cline.com/${resolvedParams.silo}`;
    
    return {
      title: page.metaTitle,
      description: page.metaDescription,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: page.metaTitle,
        description: page.metaDescription,
        url: canonicalUrl,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: page.metaTitle,
        description: page.metaDescription,
      },
    };
  }
  
  // Fall back to main site silos
  const silo = silos.find((s) => s.slug === resolvedParams.silo);
  if (!silo) return {};
  return {
    title: silo.metaTitle,
    description: silo.metaDescription,
    openGraph: { title: silo.metaTitle, description: silo.metaDescription, url: `https://jeff-cline.com/${silo.slug}` },
  };
}

export default async function SiloPage({ params }: { params: Promise<{ silo: string }> }) {
  const resolvedParams = await params;
  
  // Check if this is a demo site first
  const demoResult = await getDemoSiteByKeyword(resolvedParams.silo);
  if (demoResult) {
    const { site, page } = demoResult;
    // return <DemoKeywordPage site={site} page={page} keyword={resolvedParams.silo} />; // TODO: Implement demo integration
    // For now, fall through to regular silo page rendering
  }
  
  // Fall back to main site silos
  const silo = silos.find((s) => s.slug === resolvedParams.silo);
  if (!silo) notFound();

  const otherSilos = silos.filter((s) => s.slug !== silo.slug);

  return (
    <>
      {/* JSON-LD WebPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: silo.metaTitle,
            description: silo.metaDescription,
            url: `https://jeff-cline.com/${silo.slug}`,
            author: { "@type": "Person", name: "Jeff Cline" },
          }),
        }}
      />
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: silo.name }]} />
      {/* JSON-LD FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: `How can technology disrupt the ${silo.name.toLowerCase()} space?`,
                acceptedAnswer: { "@type": "Answer", text: silo.intro },
              },
              {
                "@type": "Question",
                name: `What is the biggest challenge for ${silo.name.toLowerCase()}?`,
                acceptedAnswer: { "@type": "Answer", text: silo.problems[0].description + " " + silo.problems[0].solution },
              },
              {
                "@type": "Question",
                name: `How does Jeff Cline help ${silo.name.toLowerCase()}?`,
                acceptedAnswer: { "@type": "Answer", text: "Jeff Cline deploys predictive analytics, AI, and proprietary technology to increase scalable demand, sales efficiency, and IP value while decreasing cost, risk, and operational strain." },
              },
              {
                "@type": "Question",
                name: `What does PROFIT AT SCALE mean for ${silo.name.toLowerCase()}?`,
                acceptedAnswer: { "@type": "Answer", text: "PROFIT AT SCALE means building technology systems that decouple revenue from human effort, creating exponential growth curves where each new dollar costs less to earn than the last." },
              },
              {
                "@type": "Question",
                name: `Why is every industry one geek away from being uberized?`,
                acceptedAnswer: { "@type": "Answer", text: "Every legacy industry has inefficiencies that technology can exploit. The right geek with the right systems can create unfair competitive advantages that disrupt entire markets—just like Uber did to taxis." },
              },
            ],
          }),
        }}
      />

      {/* Hero */}
      <section className="pt-8 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
          <p className="text-[#DC2626] font-bold text-sm tracking-[0.3em] uppercase mb-4">{silo.name}</p>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">{silo.heroHeadline}</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">{silo.heroSub}</p>
        </div>
      </section>

      {/* Intro */}
      <section className="pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-lg text-gray-300 leading-relaxed">{silo.intro}</p>
        </div>
      </section>

      {/* Problems */}
      <section className="py-16 px-4 bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black mb-12 text-center">
            3 Problems <span className="text-[#FF8900]">A Geek</span> Can Fix
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {silo.problems.map((p, i) => (
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

      {/* PROFIT AT SCALE Framework */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-4 text-center">
            How We Create <span className="text-[#FF8900]">PROFIT AT SCALE</span>
          </h2>
          <p className="text-gray-400 text-center mb-14 max-w-2xl mx-auto">
            Every engagement is built on a simple framework: increase what drives revenue and value, decrease what drains it.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            {/* INCREASE Column */}
            <div className="bg-[#1a1a1a] border border-[#FF8900]/20 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF8900] to-[#22c55e]" />
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-[#FF8900]/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#FF8900]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-[#FF8900]">INCREASE</h3>
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="mt-1 w-8 h-8 rounded-lg bg-[#FF8900]/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[#FF8900]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Scalable Demand Engine</h4>
                    <p className="text-gray-400 text-sm">Using predictive analytics and big data to build demand systems that compound over time.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 w-8 h-8 rounded-lg bg-[#22c55e]/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Highly Efficient Sales Teams</h4>
                    <p className="text-gray-400 text-sm">AI-powered tools that make every salesperson 3x more productive.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 w-8 h-8 rounded-lg bg-[#FF8900]/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[#FF8900]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">IP &amp; Technology Value</h4>
                    <p className="text-gray-400 text-sm">Proprietary technology that increases IP value and exit multiples.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* DECREASE Column */}
            <div className="bg-[#1a1a1a] border border-[#DC2626]/20 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#DC2626] to-[#991b1b]" />
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-[#DC2626]/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#DC2626]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-[#DC2626]">DECREASE</h3>
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="mt-1 w-8 h-8 rounded-lg bg-[#DC2626]/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[#DC2626]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Reduction in Cost</h4>
                    <p className="text-gray-400 text-sm">Automation and AI that eliminate waste and slash operational expenses.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 w-8 h-8 rounded-lg bg-[#DC2626]/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[#DC2626]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Reduction in Risk</h4>
                    <p className="text-gray-400 text-sm">Data-driven decisions that remove guesswork and protect against costly mistakes.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 w-8 h-8 rounded-lg bg-[#DC2626]/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[#DC2626]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Reduction in Operational Strain</h4>
                    <p className="text-gray-400 text-sm">Systems that scale without proportional headcount growth.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sub-pages */}
      <section className="py-20 px-4 bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black mb-12 text-center">
            Deep Dives
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {silo.subPages.map((sub) => (
              <Link
                key={sub.slug}
                href={`/${silo.slug}/${sub.slug}`}
                className="card-hover bg-[#1a1a1a] border border-white/5 rounded-xl p-6 group"
              >
                <h3 className="text-lg font-bold mb-2 group-hover:text-[#FF8900] transition-colors">
                  {sub.title}
                </h3>
                <p className="text-gray-500 text-sm mb-4">{sub.heroSub}</p>
                <span className="text-[#DC2626] text-sm font-semibold group-hover:translate-x-1 inline-block transition-transform">
                  Read more →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black mb-12 text-center">
            Frequently Asked <span className="text-[#FF8900]">Questions</span>
          </h2>
          <div className="space-y-6">
            {[
              { q: `How can technology disrupt the ${silo.name.toLowerCase()} space?`, a: silo.intro },
              { q: `What is the biggest challenge for ${silo.name.toLowerCase()}?`, a: `${silo.problems[0].description} ${silo.problems[0].solution}` },
              { q: `How does Jeff Cline help ${silo.name.toLowerCase()}?`, a: "Jeff Cline deploys predictive analytics, AI, and proprietary technology to increase scalable demand, sales efficiency, and IP value while decreasing cost, risk, and operational strain." },
              { q: `What does PROFIT AT SCALE mean for ${silo.name.toLowerCase()}?`, a: "PROFIT AT SCALE means building technology systems that decouple revenue from human effort, creating exponential growth curves where each new dollar costs less to earn than the last." },
              { q: "Why is every industry one geek away from being uberized?", a: "Every legacy industry has inefficiencies that technology can exploit. The right geek with the right systems can create unfair competitive advantages that disrupt entire markets—just like Uber did to taxis." },
            ].map((faq, i) => (
              <div key={i} className="bg-[#1a1a1a] border border-white/5 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-3 text-[#FF8900]">{faq.q}</h3>
                <p className="text-gray-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-4">
            Ready to Get <span className="text-[#FF8900]">Started</span>?
          </h2>
          <p className="text-gray-400 mb-8">Take the quiz or reach out directly. Either way, let&apos;s talk profit.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quiz" className="btn-primary">Take the Quiz →</Link>
            <Link href="/contact" className="btn-secondary">Contact Me</Link>
          </div>
        </div>
      </section>

      {/* Related Resources */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black mb-12 text-center">
            Related <span className="text-[#FF8900]">Resources</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {otherSilos.map((s) => (
              <Link
                key={s.slug}
                href={`/${s.slug}`}
                className="bg-[#1a1a1a] border border-white/5 rounded-xl p-6 hover:border-[#FF8900]/30 transition-colors group"
              >
                <h3 className="text-lg font-bold mb-2 group-hover:text-[#FF8900] transition-colors">{s.name}</h3>
                <p className="text-gray-500 text-sm">{siloDescriptions[s.slug]}</p>
              </Link>
            ))}
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            <Link
              href="/quiz"
              className="bg-[#1a1a1a] border border-[#FF8900]/20 rounded-xl p-6 hover:border-[#FF8900]/50 transition-colors text-center"
            >
              <h3 className="text-lg font-bold text-[#FF8900] mb-2">Take the Quiz</h3>
              <p className="text-gray-500 text-sm">Find out where technology can unlock your biggest gains</p>
            </Link>
            <Link
              href="/contact"
              className="bg-[#1a1a1a] border border-[#DC2626]/20 rounded-xl p-6 hover:border-[#DC2626]/50 transition-colors text-center"
            >
              <h3 className="text-lg font-bold text-[#DC2626] mb-2">Contact Jeff</h3>
              <p className="text-gray-500 text-sm">Ready to talk? Let&apos;s discuss your specific situation</p>
            </Link>
            <Link
              href="/portfolio"
              className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6 hover:border-white/30 transition-colors text-center"
            >
              <h3 className="text-lg font-bold text-white mb-2">Portfolio</h3>
              <p className="text-gray-500 text-sm">See real results from past engagements</p>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
