import { tryGetDb } from "@/lib/mongodb";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";

interface DemoSite {
  slug: string;
  websiteName: string;
  websiteUrl: string;
  primaryKeyword: string;
  primaryVolume: number;
  primaryCpc: number;
  primaryValue: number;
  businessContext: string;
  phoneNumber: string;
  metaTitle: string;
  metaDescription: string;
  heroHeadline: string;
  heroSub: string;
  intro: string;
  siteSchema: Record<string, unknown>;
  breadcrumbBase: Record<string, unknown>;
  silos: {
    slug: string;
    name: string;
    keyword: string;
    volume: number;
    cpc: number;
    metaTitle: string;
    heroHeadline: string;
    heroSub: string;
    intro: string;
    subPages: { slug: string; title: string; keyword: string; volume: number; cpc: number }[];
  }[];
}

async function getDemoSite(slug: string): Promise<DemoSite | null> {
  const db = await tryGetDb();
  
  // If database is not available (e.g., during build), return null
  if (!db) {
    return null;
  }
  
  // First check v2 collection by keywordSlugs (for backward compatibility with old URLs)
  const v2Site = await db.collection("demo_sites_v2").findOne({ keywordSlugs: slug });
  if (v2Site) {
    // Convert v2 structure to v1 format for this component
    const topLevelPage = v2Site.topLevelPages.find((p: any) => p.slug === slug);
    if (topLevelPage) {
      return {
        slug,
        websiteName: v2Site.websiteName,
        websiteUrl: v2Site.websiteUrl,
        primaryKeyword: topLevelPage.keyword,
        primaryVolume: topLevelPage.volume,
        primaryCpc: topLevelPage.cpc,
        primaryValue: topLevelPage.value,
        businessContext: v2Site.businessContext,
        phoneNumber: v2Site.phoneNumber,
        metaTitle: topLevelPage.metaTitle,
        metaDescription: topLevelPage.metaDescription,
        heroHeadline: `${topLevelPage.keyword.split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} | ${v2Site.websiteName}`,
        heroSub: `Expert ${topLevelPage.keyword} solutions designed to drive measurable business results.`,
        intro: topLevelPage.content.split('\n\n')[0] || `Professional ${topLevelPage.keyword} services from ${v2Site.websiteName}.`,
        siteSchema: {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: v2Site.websiteName,
          url: `https://jeff-cline.com/demo/${slug}`,
          description: `${v2Site.websiteName} — Expert ${topLevelPage.keyword} solutions.`,
          publisher: { "@type": "Organization", name: v2Site.websiteName, url: v2Site.websiteUrl },
        },
        breadcrumbBase: {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Jeff Cline", item: "https://jeff-cline.com" },
            { "@type": "ListItem", position: 2, name: "Demos", item: "https://jeff-cline.com/demo" },
            { "@type": "ListItem", position: 3, name: v2Site.websiteName, item: `https://jeff-cline.com/demo/${slug}` },
          ],
        },
        silos: topLevelPage.silos.map((silo: any) => ({
          slug: silo.slug,
          name: silo.keyword.split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
          keyword: silo.keyword,
          volume: silo.volume,
          cpc: silo.cpc,
          metaTitle: silo.metaTitle,
          heroHeadline: silo.keyword.split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
          heroSub: `Professional ${silo.keyword} services from ${v2Site.websiteName}.`,
          intro: silo.content.split('\n\n')[0] || `Expert ${silo.keyword} solutions.`,
          subPages: silo.subPages.map((sub: any) => ({
            slug: sub.slug,
            title: sub.title,
            keyword: sub.keyword,
            volume: sub.volume,
            cpc: sub.cpc,
          })),
        })),
      } as DemoSite;
    }
  }
  
  // Fall back to v1 collection
  return db.collection("demo_sites").findOne({ slug }) as unknown as DemoSite | null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const site = await getDemoSite(slug);
  if (!site) return {};
  return {
    title: site.metaTitle,
    description: site.metaDescription,
    openGraph: { title: site.metaTitle, description: site.metaDescription, url: `https://jeff-cline.com/demo/${slug}` },
  };
}

export default async function DemoHomePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const site = await getDemoSite(slug);
  if (!site) notFound();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(site.siteSchema) }} />
      <Breadcrumbs items={[
        { label: "Demo", href: "/one-click-demo" },
        { label: site.websiteName },
      ]} />

      <section className="pt-4 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Demo banner */}
          <div className="mb-8 p-4 bg-[#FF8900]/10 border border-[#FF8900]/30 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-[#FF8900] font-bold text-sm">DEMO SITE</span>
              <span className="text-gray-400 text-sm ml-3">
                Built for <strong className="text-white">{site.websiteName}</strong> using live search data
              </span>
            </div>
            <div className="text-right text-xs text-gray-500">
              Primary: <span className="text-white">{site.primaryKeyword}</span> |
              Vol: <span className="text-green-400">{site.primaryVolume.toLocaleString()}</span> |
              CPC: <span className="text-green-400">${site.primaryCpc.toFixed(2)}</span> |
              Value: <span className="text-[#FF8900]">${site.primaryValue.toLocaleString()}</span>
            </div>
          </div>

          {/* Hero */}
          <h1 className="text-5xl font-black mb-4">{site.heroHeadline}</h1>
          <p className="text-xl text-gray-400 mb-8 max-w-3xl">{site.heroSub}</p>
          <p className="text-gray-300 leading-relaxed mb-8 max-w-3xl">{site.intro}</p>

          {/* Business Context */}
          {site.businessContext && (
            <div className="mb-8 p-6 bg-gray-900 border border-gray-800 rounded-lg max-w-3xl">
              <h2 className="text-lg font-bold text-white mb-2">About {site.websiteName}</h2>
              <p className="text-gray-400 leading-relaxed">{site.businessContext}</p>
            </div>
          )}

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16 max-w-3xl">
            {site.phoneNumber && (
              <a
                href={`tel:${site.phoneNumber.replace(/[^0-9+]/g, "")}`}
                className="flex-1 text-center px-6 py-4 bg-[#FF8900] text-black font-black text-lg rounded-lg hover:bg-[#FF9A20] transition-colors"
              >
                Call Now: {site.phoneNumber}
              </a>
            )}
            <a
              href={site.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center px-6 py-4 border-2 border-[#FF8900] text-[#FF8900] font-black text-lg rounded-lg hover:bg-[#FF8900] hover:text-black transition-colors"
            >
              Visit {site.websiteName}
            </a>
          </div>

          {/* Silo Grid */}
          <h2 className="text-2xl font-black mb-6">Core Service Areas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {site.silos.map((silo) => (
              <Link
                key={silo.slug}
                href={`/demo/${slug}/${silo.slug}`}
                className="block p-6 bg-gray-900 border border-gray-800 rounded-lg hover:border-[#FF8900] transition-colors group"
              >
                <h3 className="text-lg font-bold text-white group-hover:text-[#FF8900] transition-colors mb-2">
                  {silo.name}
                </h3>
                <p className="text-gray-500 text-sm mb-4">{silo.heroSub}</p>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Vol: {silo.volume.toLocaleString()}</span>
                  <span>CPC: ${silo.cpc.toFixed(2)}</span>
                  <span>{silo.subPages.length} pages</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Full site map */}
          <h2 className="text-2xl font-black mb-6">Full Site Architecture</h2>
          <div className="space-y-6">
            {site.silos.map((silo) => (
              <div key={silo.slug} className="p-6 bg-gray-900/50 border border-gray-800 rounded-lg">
                <Link href={`/demo/${slug}/${silo.slug}`} className="text-lg font-bold text-[#FF8900] hover:underline">
                  /{silo.slug}
                </Link>
                <span className="text-gray-500 text-sm ml-3">{silo.name}</span>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {silo.subPages.map((page) => (
                    <Link
                      key={page.slug}
                      href={`/demo/${slug}/${silo.slug}/${page.slug}`}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      /{silo.slug}/{page.slug}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-black text-[#FF8900]">{site.silos.length}</div>
              <div className="text-gray-500 text-sm">Silo Pages</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-[#FF8900]">
                {site.silos.reduce((s, silo) => s + silo.subPages.length, 0)}
              </div>
              <div className="text-gray-500 text-sm">Supporting Pages</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-[#FF8900]">
                {site.silos.reduce((s, silo) => s + 1 + silo.subPages.length, 1)}
              </div>
              <div className="text-gray-500 text-sm">Total Pages</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-green-400">${site.primaryValue.toLocaleString()}</div>
              <div className="text-gray-500 text-sm">Keyword Value</div>
            </div>
          </div>

          {/* Bottom CTAs */}
          <div className="mt-16 p-8 bg-gray-900 border border-gray-800 rounded-lg">
            <h2 className="text-2xl font-black mb-3 text-center">Ready to Get Started?</h2>
            <p className="text-gray-400 mb-6 text-center">
              Connect with {site.websiteName} today.
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
        </div>
      </section>
    </>
  );
}
