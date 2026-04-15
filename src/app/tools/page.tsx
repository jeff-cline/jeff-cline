import Breadcrumbs from "@/components/Breadcrumbs";
import Link from "next/link";
import type { Metadata } from "next";
import { SILO_LABELS, SILO_ICONS } from "@/lib/types";

export const metadata: Metadata = {
  title: "Tools & Frameworks | Jeff Cline",
  description: "Technology tools, frameworks, and calculators to help you weaponize technology and profit at scale.",
  openGraph: {
    title: "Tools & Frameworks | Jeff Cline",
    description: "Technology tools, frameworks, and calculators to profit at scale.",
    url: "https://jeff-cline.com/tools",
    siteName: "Jeff Cline",
    type: "website",
    images: [{ url: "/favicon-192x192.png", width: 192, height: 192, alt: "Jeff Cline" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tools & Frameworks | Jeff Cline",
    description: "Technology tools, frameworks, and calculators to profit at scale.",
  },
};

const tools = [
  {
    name: "Disruption Quiz",
    description: "Take the 2-minute quiz to discover where technology can transform your business and how fast.",
    icon: "🎯",
    href: "/quiz",
    featured: true,
  },
  {
    name: "Automation ROI Calculator",
    description: "Calculate the exact ROI of automating your business processes. See projected savings instantly.",
    icon: "🧮",
    href: "/resources/business",
    silo: "business",
  },
  {
    name: "Exit Valuation Estimator",
    description: "Estimate your business valuation and identify levers to increase your exit multiple.",
    icon: "💰",
    href: "/resources/entrepreneur",
    silo: "entrepreneur",
  },
  {
    name: "MVP Planning Canvas",
    description: "Plan your MVP with precision. Core features, validation metrics, and build timeline.",
    icon: "📐",
    href: "/resources/start-ups",
    silo: "start-ups",
  },
  {
    name: "Deal Flow Scoring Model",
    description: "Score and rank investment opportunities systematically with customizable criteria.",
    icon: "📊",
    href: "/resources/investors",
    silo: "investors",
  },
  {
    name: "Cybersecurity Assessment",
    description: "Assess your family office cybersecurity posture against high-net-worth threat profiles.",
    icon: "🔒",
    href: "/resources/family-offices",
    silo: "family-offices",
  },
  {
    name: "Tech Stack Auditor",
    description: "Audit your current tech stack. Find redundancies, integrations gaps, and cost savings.",
    icon: "🔧",
    href: "/resources/entrepreneur",
    silo: "entrepreneur",
  },
  {
    name: "AI Readiness Assessment",
    description: "Evaluate your organization's readiness for AI adoption and identify high-impact applications.",
    icon: "🤖",
    href: "/resources/family-offices",
    silo: "family-offices",
  },
  {
    name: "Growth Experiment Framework",
    description: "Systematic framework for running growth experiments. Hypothesis, test, measure, iterate.",
    icon: "🧪",
    href: "/resources/start-ups",
    silo: "start-ups",
  },
];

export default function ToolsPage() {
  return (
    <><Breadcrumbs items={[{ label: "Tools" }]} /><section className="min-h-screen pt-8 pb-20 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Tools & Frameworks — PROFIT AT SCALE",
            url: "https://jeff-cline.com/tools",
            description: "Technology tools, frameworks, and calculators to help businesses weaponize technology and profit at scale.",
            mainEntity: {
              "@type": "ItemList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Disruption Quiz", url: "https://jeff-cline.com/quiz" },
                { "@type": "ListItem", position: 2, name: "Best Investment Calculator", url: "https://jeff-cline.com/investment-calculator" },
              ],
            },
          }),
        }}
      />
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <p className="text-[#DC2626] font-bold text-sm tracking-[0.3em] uppercase mb-4">ARSENAL</p>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Tools That <span className="text-[#FF8900]">Print Money</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Frameworks, calculators, and assessments designed to identify exactly where technology can transform your business.
          </p>
        </div>

        {/* Featured Tool */}
        <Link href="/quiz" className="block mb-12 animate-fade-in-up">
          <div className="bg-gradient-to-r from-[#FF8900]/10 to-[#DC2626]/10 border border-[#FF8900]/30 rounded-2xl p-8 md:p-12 card-hover">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <span className="text-6xl">🎯</span>
              <div className="text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-black mb-2">The Disruption Quiz</h2>
                <p className="text-gray-400 text-lg mb-4">
                  2 minutes. 5 questions. One roadmap to weaponize technology for your specific situation.
                </p>
                <span className="btn-primary">Take the Quiz →</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.filter(t => !t.featured).map((tool) => (
            <Link key={tool.name} href={tool.href}
              className="card-hover bg-[#1a1a1a] border border-white/5 rounded-xl p-6 group">
              <div className="flex items-start gap-4">
                <span className="text-3xl">{tool.icon}</span>
                <div>
                  <h3 className="font-bold group-hover:text-[#FF8900] transition-colors mb-2">{tool.name}</h3>
                  <p className="text-gray-500 text-sm">{tool.description}</p>
                  {tool.silo && (
                    <span className="mt-3 inline-block text-xs bg-white/5 text-gray-400 px-2 py-1 rounded">
                      {SILO_ICONS[tool.silo]} {SILO_LABELS[tool.silo]}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* By Silo */}
        <div className="mt-20">
          <h2 className="text-2xl font-black mb-8 text-center">
            Browse by <span className="text-[#FF8900]">Path</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(SILO_LABELS).map(([slug, label]) => (
              <Link key={slug} href={`/resources/${slug}`}
                className="card-hover bg-[#1a1a1a] border border-white/5 rounded-xl p-4 text-center group">
                <span className="text-3xl block mb-2">{SILO_ICONS[slug]}</span>
                <span className="text-sm font-semibold group-hover:text-[#FF8900] transition-colors">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
