import { tryGetDb } from "@/lib/mongodb";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface DemoSiteV2 {
  slug: string;
  websiteName: string;
  websiteUrl: string;
  businessContext: string;
  phoneNumber: string;
  keywords: string[];
  keywordSlugs: string[];
  topLevelPages: TopLevelPage[];
  createdAt: Date;
}

interface TopLevelPage {
  slug: string;
  keyword: string;
  volume: number;
  cpc: number;
  value: number;
  metaTitle: string;
  metaDescription: string;
  content: string;
  faqs: FAQItem[];
  silos: SiloPage[];
}

interface SiloPage {
  slug: string;
  keyword: string;
  volume: number;
  cpc: number;
  metaTitle: string;
  metaDescription: string;
  content: string;
  faqs: FAQItem[];
  subPages: SubPage[];
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
  faqs: FAQItem[];
}

interface FAQItem {
  question: string;
  answer: string;
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

function createBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

function createFAQSchema(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

function createWebPageSchema(name: string, description: string, url: string, websiteName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url,
    isPartOf: {
      "@type": "WebSite",
      name: websiteName,
    },
  };
}

function renderContent(content: string): React.ReactNode[] {
  const sections = content.split("\n\n").filter(Boolean);
  
  return sections.map((section: string, i: number) => {
    if (section.startsWith("## ")) {
      return (
        <h2 key={i} className="text-2xl font-black text-white mt-8 mb-4">
          {section.replace("## ", "")}
        </h2>
      );
    }
    if (section.startsWith("- ")) {
      const items = section.split("\n").filter((l) => l.startsWith("- "));
      return (
        <ul key={i} className="list-disc pl-6 space-y-2 text-gray-300 mb-6">
          {items.map((item, j) => (
            <li key={j} dangerouslySetInnerHTML={{ 
              __html: item.replace(/^- /, "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") 
            }} />
          ))}
        </ul>
      );
    }
    if (section.match(/^\d\./)) {
      const items = section.split("\n").filter((l) => l.match(/^\d/));
      return (
        <ol key={i} className="list-decimal pl-6 space-y-2 text-gray-300 mb-6">
          {items.map((item, j) => (
            <li key={j} dangerouslySetInnerHTML={{ 
              __html: item.replace(/^\d+\.\s*/, "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") 
            }} />
          ))}
        </ol>
      );
    }
    return (
      <p key={i} className="text-gray-300 leading-relaxed mb-4">
        {section}
      </p>
    );
  });
}

export async function generateMetadata({ params }: { params: Promise<{ segments: string[] }> }): Promise<Metadata> {
  const { segments } = await params;
  
  if (segments.length === 1) {
    // Top-level keyword page
    const data = await getDemoSiteV2ByKeywordSlug(segments[0]);
    if (!data) return {};
    
    return {
      title: data.topLevelPage.metaTitle,
      description: data.topLevelPage.metaDescription,
      openGraph: {
        title: data.topLevelPage.metaTitle,
        description: data.topLevelPage.metaDescription,
        url: `https://jeff-cline.com/d/${segments[0]}`,
      },
      twitter: {
        card: "summary_large_image",
        title: data.topLevelPage.metaTitle,
        description: data.topLevelPage.metaDescription,
      },
    };
  }
  
  if (segments.length === 2) {
    // Silo page
    const data = await getDemoSiteV2ByKeywordSlug(segments[0]);
    if (!data) return {};
    
    const silo = data.topLevelPage.silos.find(s => s.slug === segments[1]);
    if (!silo) return {};
    
    return {
      title: silo.metaTitle,
      description: silo.metaDescription,
      openGraph: {
        title: silo.metaTitle,
        description: silo.metaDescription,
        url: `https://jeff-cline.com/d/${segments[0]}/${segments[1]}`,
      },
      twitter: {
        card: "summary_large_image",
        title: silo.metaTitle,
        description: silo.metaDescription,
      },
    };
  }
  
  if (segments.length === 3) {
    // Sub-page
    const data = await getDemoSiteV2ByKeywordSlug(segments[0]);
    if (!data) return {};
    
    const silo = data.topLevelPage.silos.find(s => s.slug === segments[1]);
    if (!silo) return {};
    
    const subPage = silo.subPages.find(p => p.slug === segments[2]);
    if (!subPage) return {};
    
    return {
      title: subPage.metaTitle,
      description: subPage.metaDescription,
      openGraph: {
        title: subPage.metaTitle,
        description: subPage.metaDescription,
        url: `https://jeff-cline.com/d/${segments[0]}/${segments[1]}/${segments[2]}`,
      },
      twitter: {
        card: "summary_large_image",
        title: subPage.metaTitle,
        description: subPage.metaDescription,
      },
    };
  }
  
  return {};
}

export default async function DynamicDemoPage({ params }: { params: Promise<{ segments: string[] }> }) {
  const { segments } = await params;
  
  if (segments.length === 1) {
    // Top-level keyword page
    const data = await getDemoSiteV2ByKeywordSlug(segments[0]);
    if (!data) notFound();
    
    const { site, topLevelPage } = data;
    const baseUrl = "https://jeff-cline.com";
    
    const breadcrumbSchema = createBreadcrumbSchema([
      { name: "Jeff Cline", url: baseUrl },
      { name: site.websiteName, url: `${baseUrl}/d/${segments[0]}` },
    ]);
    
    const faqSchema = createFAQSchema(topLevelPage.faqs);
    const webPageSchema = createWebPageSchema(
      topLevelPage.metaTitle,
      topLevelPage.metaDescription,
      `${baseUrl}/d/${segments[0]}`,
      site.websiteName
    );
    
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
        
        <section className="pt-32 pb-16 px-4">
          <div className="max-w-5xl mx-auto">
            {/* Demo banner */}
            <div className="mb-8 p-4 bg-[#FF8900]/10 border border-[#FF8900]/30 rounded-lg flex items-center justify-between">
              <div>
                <span className="text-[#FF8900] font-bold text-sm">DEMO SITE V2</span>
                <span className="text-gray-400 text-sm ml-3">
                  Built for <strong className="text-white">{site.websiteName}</strong> using live search data
                </span>
              </div>
              <div className="text-right text-xs text-gray-500">
                Keyword: <span className="text-white">{topLevelPage.keyword}</span> |
                Vol: <span className="text-green-400">{topLevelPage.volume.toLocaleString()}</span> |
                CPC: <span className="text-green-400">${topLevelPage.cpc.toFixed(2)}</span> |
                Value: <span className="text-[#FF8900]">${topLevelPage.value.toLocaleString()}</span>
              </div>
            </div>
            
            {/* Breadcrumb navigation */}
            <nav className="text-sm text-gray-500 mb-6">
              <Link href="/" className="hover:text-[#FF8900]">Jeff Cline</Link>
              <span className="mx-2">/</span>
              <span className="text-white">{topLevelPage.keyword}</span>
            </nav>
            
            {/* Hero */}
            <h1 className="text-5xl font-black mb-4">
              {topLevelPage.keyword.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} | {site.websiteName}
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-3xl">
              Expert {topLevelPage.keyword} solutions designed to drive measurable business results.
            </p>
            
            {/* Business Context */}
            {site.businessContext && (
              <div className="mb-8 p-6 bg-gray-900 border border-gray-800 rounded-lg max-w-3xl">
                <h2 className="text-lg font-bold text-white mb-2">About {site.websiteName}</h2>
                <p className="text-gray-400 leading-relaxed">{site.businessContext}</p>
              </div>
            )}
            
            {/* Content */}
            <div className="prose prose-invert max-w-none mb-12">
              {renderContent(topLevelPage.content)}
            </div>
            
            {/* Phone CTA */}
            {site.phoneNumber && (
              <div className="mb-12">
                <a
                  href={`tel:${site.phoneNumber.replace(/[^0-9+]/g, "")}`}
                  className="inline-flex items-center px-8 py-4 bg-[#FF8900] text-black font-black text-xl rounded-lg hover:bg-[#FF9A20] transition-colors"
                >
                  📞 Call Now: {site.phoneNumber}
                </a>
              </div>
            )}
            
            {/* Service Areas (Silos) */}
            <h2 className="text-2xl font-black mb-6">Our {topLevelPage.keyword} Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {topLevelPage.silos.map((silo) => (
                <Link
                  key={silo.slug}
                  href={`/d/${segments[0]}/${silo.slug}`}
                  className="block p-6 bg-gray-900 border border-gray-800 rounded-lg hover:border-[#FF8900] transition-colors group"
                >
                  <h3 className="text-lg font-bold text-white group-hover:text-[#FF8900] transition-colors mb-2">
                    {silo.keyword.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </h3>
                  <div className="flex justify-between text-xs text-gray-600 mb-4">
                    <span>Vol: {silo.volume.toLocaleString()}</span>
                    <span>CPC: ${silo.cpc.toFixed(2)}</span>
                    <span>{silo.subPages.length} pages</span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Comprehensive {silo.keyword} solutions and expertise.
                  </p>
                </Link>
              ))}
            </div>
            
            {/* Other top-level pages cross-links */}
            <h2 className="text-2xl font-black mb-6">Additional Services</h2>
            <div className="flex flex-wrap gap-4 mb-12">
              {site.topLevelPages
                .filter(page => page.slug !== segments[0])
                .map(page => (
                  <Link
                    key={page.slug}
                    href={`/d/${page.slug}`}
                    className="px-6 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white hover:text-[#FF8900] hover:border-[#FF8900] transition-colors font-medium"
                  >
                    {page.keyword.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </Link>
                ))
              }
            </div>
            
            {/* FAQs */}
            {topLevelPage.faqs.length > 0 && (
              <>
                <h2 className="text-2xl font-black mb-6">Frequently Asked Questions</h2>
                <div className="space-y-6 mb-12">
                  {topLevelPage.faqs.map((faq, i) => (
                    <div key={i} className="border-b border-gray-800 pb-6">
                      <h3 className="text-lg font-bold text-white mb-3">{faq.question}</h3>
                      <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
            
            {/* Bottom CTAs */}
            <div className="mt-16 p-8 bg-gray-900 border border-gray-800 rounded-lg">
              <h2 className="text-2xl font-black mb-3 text-center">Ready to Get Started?</h2>
              <p className="text-gray-400 mb-6 text-center">
                Contact {site.websiteName} for expert {topLevelPage.keyword} solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                {site.phoneNumber && (
                  <a
                    href={`tel:${site.phoneNumber.replace(/[^0-9+]/g, "")}`}
                    className="flex-1 text-center px-6 py-4 bg-[#FF8900] text-black font-black rounded-lg hover:bg-[#FF9A20] transition-colors"
                  >
                    Call {site.phoneNumber}
                  </a>
                )}
                <a
                  href={site.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center px-6 py-4 border-2 border-[#FF8900] text-[#FF8900] font-black rounded-lg hover:bg-[#FF8900] hover:text-black transition-colors"
                >
                  Visit Website
                </a>
              </div>
            </div>
            
            {/* Jeff Cline Credit */}
            <div className="mt-12 pt-8 border-t border-gray-800 text-center">
              <p className="text-gray-500 text-sm mb-2">
                This demo site was built by{" "}
                <Link href="/" className="text-[#FF8900] hover:underline font-bold">Jeff Cline</Link>
                {" "}&amp; Team using proprietary SEO silo architecture and real-time search data.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-3 text-xs text-gray-600">
                <Link href="/entrepreneur" className="hover:text-[#FF8900]">Entrepreneur Solutions</Link>
                <Link href="/investors" className="hover:text-[#FF8900]">Investor Strategy</Link>
                <Link href="/family-offices" className="hover:text-[#FF8900]">Family Offices</Link>
                <Link href="/business" className="hover:text-[#FF8900]">Business Growth</Link>
                <Link href="/one-click-demo" className="hover:text-[#FF8900]">Build Your Own Demo</Link>
                <Link href="/contact" className="hover:text-[#FF8900]">Work With Us</Link>
              </div>
            </div>
            
            {/* JC Easter Egg */}
            <div className="text-center mt-4">
              <Link href="https://jeff-cline.com" className="text-gray-900 hover:text-gray-800 transition-colors" style={{ fontSize: '6px', opacity: 0.08 }}>
                JC
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }
  
  if (segments.length === 2) {
    // Silo page
    const data = await getDemoSiteV2ByKeywordSlug(segments[0]);
    if (!data) notFound();
    
    const { site, topLevelPage } = data;
    const silo = topLevelPage.silos.find(s => s.slug === segments[1]);
    if (!silo) notFound();
    
    const baseUrl = "https://jeff-cline.com";
    
    const breadcrumbSchema = createBreadcrumbSchema([
      { name: "Jeff Cline", url: baseUrl },
      { name: topLevelPage.keyword, url: `${baseUrl}/d/${segments[0]}` },
      { name: silo.keyword, url: `${baseUrl}/d/${segments[0]}/${segments[1]}` },
    ]);
    
    const faqSchema = createFAQSchema(silo.faqs);
    const webPageSchema = createWebPageSchema(
      silo.metaTitle,
      silo.metaDescription,
      `${baseUrl}/d/${segments[0]}/${segments[1]}`,
      site.websiteName
    );
    
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
        
        <section className="pt-32 pb-16 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Demo banner */}
            <div className="mb-6 p-3 bg-[#FF8900]/10 border border-[#FF8900]/30 rounded-lg text-sm">
              <span className="text-[#FF8900] font-bold">DEMO</span>
              <span className="text-gray-400 ml-3">{site.websiteName}</span>
              <span className="text-gray-600 ml-2">/ {silo.keyword}</span>
              <span className="text-gray-600 float-right">
                Vol: {silo.volume.toLocaleString()} | CPC: ${silo.cpc.toFixed(2)}
              </span>
            </div>
            
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-500 mb-6">
              <Link href="/" className="hover:text-[#FF8900]">Jeff Cline</Link>
              <span className="mx-2">/</span>
              <Link href={`/d/${segments[0]}`} className="hover:text-[#FF8900]">{topLevelPage.keyword}</Link>
              <span className="mx-2">/</span>
              <span className="text-white">{silo.keyword}</span>
            </nav>
            
            {/* Hero */}
            <h1 className="text-4xl font-black mb-4">
              {silo.keyword.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Professional {silo.keyword} services from {site.websiteName}.
            </p>
            
            {/* Content */}
            <div className="prose prose-invert max-w-none mb-12">
              {renderContent(silo.content)}
            </div>
            
            {/* Supporting Pages Grid */}
            <h2 className="text-2xl font-black mb-6">In This Section</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
              {silo.subPages.map((page) => (
                <Link
                  key={page.slug}
                  href={`/d/${segments[0]}/${segments[1]}/${page.slug}`}
                  className="block p-5 bg-gray-900 border border-gray-800 rounded-lg hover:border-[#FF8900] transition-colors group"
                >
                  <h3 className="font-bold text-white group-hover:text-[#FF8900] transition-colors mb-1">
                    {page.title}
                  </h3>
                  <div className="text-xs text-gray-600">
                    <span>Vol: {page.volume.toLocaleString()}</span>
                    <span className="ml-3">CPC: ${page.cpc.toFixed(2)}</span>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Phone CTA */}
            {site.phoneNumber && (
              <div className="mb-8 text-center">
                <a
                  href={`tel:${site.phoneNumber.replace(/[^0-9+]/g, "")}`}
                  className="inline-flex items-center px-8 py-4 bg-[#FF8900] text-black font-black text-lg rounded-lg hover:bg-[#FF9A20] transition-colors"
                >
                  📞 Call Now: {site.phoneNumber}
                </a>
              </div>
            )}
            
            {/* FAQs */}
            {silo.faqs.length > 0 && (
              <>
                <h2 className="text-2xl font-black mb-6">Frequently Asked Questions</h2>
                <div className="space-y-6 mb-12">
                  {silo.faqs.map((faq, i) => (
                    <div key={i} className="border-b border-gray-800 pb-4">
                      <h3 className="text-lg font-bold text-white mb-2">{faq.question}</h3>
                      <p className="text-gray-400">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
            
            {/* Cross-links to other silos */}
            <h2 className="text-xl font-black mb-4">Related Services</h2>
            <div className="flex flex-wrap gap-3 mb-12">
              {topLevelPage.silos
                .filter(s => s.slug !== segments[1])
                .map(s => (
                  <Link
                    key={s.slug}
                    href={`/d/${segments[0]}/${s.slug}`}
                    className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-400 hover:text-[#FF8900] hover:border-[#FF8900] transition-colors"
                  >
                    {s.keyword.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </Link>
                ))}
            </div>
            
            {/* Cross-links to other top-level pages */}
            <h2 className="text-xl font-black mb-4">Other Services</h2>
            <div className="flex flex-wrap gap-3 mb-8">
              {site.topLevelPages
                .filter(page => page.slug !== segments[0])
                .map(page => (
                  <Link
                    key={page.slug}
                    href={`/d/${page.slug}`}
                    className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-sm text-gray-300 hover:text-[#FF8900] hover:border-[#FF8900] transition-colors"
                  >
                    {page.keyword.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </Link>
                ))
              }
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
              
              {/* JC Easter Egg */}
              <div className="mt-2">
                <Link href="https://jeff-cline.com" className="text-gray-900 hover:text-gray-800 transition-colors" style={{ fontSize: '6px', opacity: 0.08 }}>
                  JC
                </Link>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }
  
  if (segments.length === 3) {
    // Sub-page
    const data = await getDemoSiteV2ByKeywordSlug(segments[0]);
    if (!data) notFound();
    
    const { site, topLevelPage } = data;
    const silo = topLevelPage.silos.find(s => s.slug === segments[1]);
    if (!silo) notFound();
    
    const subPage = silo.subPages.find(p => p.slug === segments[2]);
    if (!subPage) notFound();
    
    const baseUrl = "https://jeff-cline.com";
    
    const breadcrumbSchema = createBreadcrumbSchema([
      { name: "Jeff Cline", url: baseUrl },
      { name: topLevelPage.keyword, url: `${baseUrl}/d/${segments[0]}` },
      { name: silo.keyword, url: `${baseUrl}/d/${segments[0]}/${segments[1]}` },
      { name: subPage.title, url: `${baseUrl}/d/${segments[0]}/${segments[1]}/${segments[2]}` },
    ]);
    
    const faqSchema = createFAQSchema(subPage.faqs);
    const webPageSchema = createWebPageSchema(
      subPage.metaTitle,
      subPage.metaDescription,
      `${baseUrl}/d/${segments[0]}/${segments[1]}/${segments[2]}`,
      site.websiteName
    );
    
    const siblingPages = silo.subPages.filter(p => p.slug !== segments[2]);
    
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
        
        <section className="pt-32 pb-16 px-4">
          <div className="max-w-3xl mx-auto">
            {/* Demo banner */}
            <div className="mb-6 p-3 bg-[#FF8900]/10 border border-[#FF8900]/30 rounded-lg text-sm">
              <span className="text-[#FF8900] font-bold">DEMO</span>
              <span className="text-gray-400 ml-3">{site.websiteName}</span>
              <span className="text-gray-600 float-right">
                Vol: {subPage.volume.toLocaleString()} | CPC: ${subPage.cpc.toFixed(2)}
              </span>
            </div>
            
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-500 mb-6">
              <Link href="/" className="hover:text-[#FF8900]">Jeff Cline</Link>
              <span className="mx-2">/</span>
              <Link href={`/d/${segments[0]}`} className="hover:text-[#FF8900]">{topLevelPage.keyword}</Link>
              <span className="mx-2">/</span>
              <Link href={`/d/${segments[0]}/${segments[1]}`} className="hover:text-[#FF8900]">{silo.keyword}</Link>
              <span className="mx-2">/</span>
              <span className="text-white">{subPage.title}</span>
            </nav>
            
            {/* Hero */}
            <h1 className="text-4xl font-black mb-4">{subPage.heroHeadline}</h1>
            <p className="text-xl text-gray-400 mb-10">{subPage.heroSub}</p>
            
            {/* Phone CTA */}
            {site.phoneNumber && (
              <div className="mb-8">
                <a
                  href={`tel:${site.phoneNumber.replace(/[^0-9+]/g, "")}`}
                  className="inline-flex items-center px-6 py-3 bg-[#FF8900] text-black font-black text-lg rounded-lg hover:bg-[#FF9A20] transition-colors"
                >
                  📞 {site.phoneNumber}
                </a>
              </div>
            )}
            
            {/* Body Content */}
            <div className="prose prose-invert max-w-none mb-16">
              {renderContent(subPage.bodyContent)}
            </div>
            
            {/* FAQs */}
            {subPage.faqs.length > 0 && (
              <>
                <h2 className="text-2xl font-black mb-6">Frequently Asked Questions</h2>
                <div className="space-y-6 mb-12">
                  {subPage.faqs.map((faq, i) => (
                    <div key={i} className="border-b border-gray-800 pb-4">
                      <h3 className="text-lg font-bold text-white mb-2">{faq.question}</h3>
                      <p className="text-gray-400">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
            
            {/* Interlinks to sibling pages */}
            {siblingPages.length > 0 && (
              <>
                <h2 className="text-xl font-black mb-4">Related Pages</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
                  {siblingPages.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/d/${segments[0]}/${segments[1]}/${p.slug}`}
                      className="p-4 bg-gray-900 border border-gray-800 rounded-lg text-sm text-gray-400 hover:text-[#FF8900] hover:border-[#FF8900] transition-colors"
                    >
                      {p.title}
                    </Link>
                  ))}
                </div>
              </>
            )}
            
            {/* Bottom CTAs */}
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
            
            {/* Back navigation */}
            <div className="text-center mt-8 mb-8">
              <Link href={`/d/${segments[0]}/${segments[1]}`} className="text-[#FF8900] hover:underline text-sm">
                ← Back to {silo.keyword}
              </Link>
              <span className="text-gray-700 mx-3">|</span>
              <Link href={`/d/${segments[0]}`} className="text-[#FF8900] hover:underline text-sm">
                ← Back to {topLevelPage.keyword}
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
              
              {/* JC Easter Egg */}
              <div className="mt-2">
                <Link href="https://jeff-cline.com" className="text-gray-900 hover:text-gray-800 transition-colors" style={{ fontSize: '6px', opacity: 0.08 }}>
                  JC
                </Link>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }
  
  notFound();
}