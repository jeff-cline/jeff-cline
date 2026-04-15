import Link from "next/link";
import type { Metadata } from "next";
import { portfolioCompanies } from "@/lib/portfolio-data";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Portfolio Companies | Jeff Cline — A Rising Tide Lifts All Boats",
  description:
    "Explore Jeff Cline's portfolio of technology companies driving disruption across healthcare, AI voice, creative tech, and executive wellness.",
  openGraph: {
    title: "Portfolio Companies | Jeff Cline",
    description: "A Rising Tide Lifts All Boats — technology companies built for PROFIT AT SCALE.",
    url: "https://jeff-cline.com/portfolio",
  },
  twitter: { card: "summary_large_image" },
};

export default function PortfolioPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Jeff Cline Portfolio Companies",
            description: "Technology companies in the Jeff Cline ecosystem.",
            url: "https://jeff-cline.com/portfolio",
          }),
        }}
      />

      <Breadcrumbs items={[{ label: "Portfolio" }]} />

      {/* Hero */}
      <section className="pt-8 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
          <p className="text-[#DC2626] font-bold text-sm tracking-[0.3em] uppercase mb-4">
            The Ecosystem
          </p>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            A Rising Tide Lifts{" "}
            <span className="text-[#FF8900]">All Boats</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-4">
            Every company in this portfolio shares a common thread: technology that creates
            unfair advantages, systems that scale without limits, and a relentless focus on{" "}
            <span className="text-[#FF8900] font-bold">PROFIT AT SCALE</span>.
          </p>
          <p className="text-gray-500 max-w-xl mx-auto">
            When portfolio companies share infrastructure, data, and strategy—everyone wins.
            That&apos;s not theory. That&apos;s math.
          </p>
        </div>
      </section>

      {/* Companies Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioCompanies.map((company) => (
            <div
              key={company.slug}
              className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-8 flex flex-col group hover:border-[#FF8900]/30 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  {company.category}
                </span>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    company.status === "active"
                      ? "bg-[#FF8900]/10 text-[#FF8900]"
                      : "bg-white/5 text-gray-500"
                  }`}
                >
                  {company.status === "active" ? "Active" : "Coming Soon"}
                </span>
              </div>
              <h3 className="text-2xl font-black mb-3 group-hover:text-[#FF8900] transition-colors">
                {company.name}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-1">
                {company.description}
              </p>
              <p className="text-[#DC2626] text-sm font-semibold mb-6 italic">
                &ldquo;{company.brandPromise}&rdquo;
              </p>
              {company.link && company.status === "active" && (
                <a
                  href={company.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FF8900] text-sm font-bold hover:underline"
                >
                  Visit Site →
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-4">
            Want to Join the <span className="text-[#FF8900]">Ecosystem</span>?
          </h2>
          <p className="text-gray-400 mb-8">
            If your company is ready to scale with technology, let&apos;s talk.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-primary">Get in Touch →</Link>
            <Link href="/quiz" className="btn-secondary">Take the Quiz</Link>
          </div>
        </div>
      </section>
    </>
  );
}
