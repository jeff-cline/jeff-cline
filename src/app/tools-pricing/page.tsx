"use client";

import { useEffect, useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import Link from "next/link";
import type { Metadata } from "next";

/* ---------- types ---------- */
interface Tool {
  key: string;
  label: string;
  description: string;
  price: number;
  category: string;
}

/* ---------- category config ---------- */
const CATEGORY_META: Record<string, { title: string; subtitle: string; icon: string; id: string }> = {
  keyword: {
    title: "Keyword Research Tools",
    subtitle: "Enterprise-grade keyword intelligence to find high-value, low-competition opportunities",
    icon: "🔑",
    id: "keyword-tools",
  },
  analysis: {
    title: "SEO Analysis Tools",
    subtitle: "Deep competitive intelligence across domains, backlinks, SERPs, and competitors",
    icon: "📊",
    id: "analysis-tools",
  },
  premium: {
    title: "Premium Audit & Optimization",
    subtitle: "Full-scale technical audits and AI-powered optimization at scale",
    icon: "⚡",
    id: "premium-tools",
  },
  enterprise: {
    title: "Enterprise Solutions",
    subtitle: "Done-for-you marketing frameworks built by our team",
    icon: "🏗️",
    id: "enterprise-solutions",
  },
};

const CATEGORY_ORDER = ["keyword", "analysis", "premium", "enterprise"];

function formatPrice(price: number): string {
  if (price >= 1000) return `$${price.toLocaleString()}`;
  return `$${price}`;
}

/* ---------- tool card ---------- */
function ToolCard({ tool }: { tool: Tool }) {
  const isEnterprise = tool.category === "enterprise";

  return (
    <div
      id={tool.key}
      className={`relative rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 scroll-mt-24 ${
        isEnterprise
          ? "bg-gradient-to-br from-[#FF8900]/15 to-[#FF8900]/5 border-2 border-[#FF8900]/40 col-span-full"
          : "bg-[#1a1a1a] border border-white/5 hover:border-[#FF8900]/30"
      }`}
    >
      {isEnterprise && (
        <span className="absolute -top-3 left-6 bg-[#FF8900] text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Premium Offering
        </span>
      )}
      <div className={isEnterprise ? "flex flex-col md:flex-row md:items-center md:justify-between gap-6" : ""}>
        <div className={isEnterprise ? "flex-1" : ""}>
          <h3
            className={`font-bold mb-2 ${
              isEnterprise ? "text-2xl md:text-3xl text-white" : "text-lg text-white"
            }`}
          >
            {tool.label}
          </h3>
          <p className={`text-gray-400 ${isEnterprise ? "text-lg mb-0" : "text-sm mb-4"}`}>
            {tool.description}
          </p>
        </div>
        <div className={`flex items-center justify-between ${isEnterprise ? "md:flex-col md:items-end gap-4" : ""}`}>
          <span
            className={`font-black ${
              isEnterprise ? "text-4xl text-[#FF8900]" : "text-2xl text-[#FF8900]"
            }`}
          >
            {formatPrice(tool.price)}
          </span>
          <Link
            href="/agency/dashboard.html"
            className={`inline-block font-semibold rounded-lg transition-all duration-200 ${
              isEnterprise
                ? "bg-[#FF8900] text-black px-8 py-3 text-lg hover:bg-[#FF8900]/90"
                : "bg-[#FF8900]/10 text-[#FF8900] px-4 py-2 text-sm hover:bg-[#FF8900]/20"
            }`}
          >
            Use This Tool →
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ---------- page ---------- */
export default function ToolsPricingPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tools-pricing")
      .then((r) => r.json())
      .then((data) => setTools(data.tools || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const grouped = CATEGORY_ORDER.map((cat) => ({
    ...CATEGORY_META[cat],
    category: cat,
    tools: tools.filter((t) => t.category === cat),
  })).filter((g) => g.tools.length > 0);

  return (
    <>
      <Breadcrumbs items={[{ label: "Tools", href: "/tools" }, { label: "Tools & Services Pricing" }]} />
      <section className="min-h-screen pt-8 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* ---- Hero / Title ---- */}
          <div className="text-center mb-12 animate-fade-in-up">
            <p className="text-[#DC2626] font-bold text-sm tracking-[0.3em] uppercase mb-4">
              PROFESSIONAL SEO & AEO TOOLS
            </p>
            <h1 className="text-4xl md:text-5xl font-black mb-6">
              Tools & Services <span className="text-[#FF8900]">Pricing</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
              Jeff Cline&apos;s agency dashboard gives you direct access to enterprise-grade SEO and
              Answer Engine Optimization tools — the same technology stack used by top agencies
              charging $5,000+ per month. From keyword research and backlink analysis to full
              technical site audits, AEO optimization, and done-for-you website builds, every tool
              runs on live data from Google&apos;s index. No subscriptions, no contracts, no bloat.
              You fund your account with credits, pick the tool you need, and get results in
              seconds. Pricing is transparent and updated in real time — what you see below is
              exactly what you pay. Whether you&apos;re an agency managing multiple clients, a
              business owner who wants to stop guessing at SEO, or a marketing team that needs
              competitive intelligence on demand, this toolkit was built for you. Create an account,
              load credits, and start running tools immediately.
            </p>
          </div>

          {/* ---- Table of Contents ---- */}
          {!loading && grouped.length > 0 && (
            <div className="mb-16 bg-[#1a1a1a] border border-white/5 rounded-xl p-6 md:p-8">
              <h2 className="text-xl font-black mb-4 text-white">Jump to a Tool</h2>
              <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                {tools.map((tool) => (
                  <a
                    key={tool.key}
                    href={`#${tool.key}`}
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group"
                  >
                    <span className="text-gray-300 text-sm group-hover:text-[#FF8900] transition-colors">
                      {tool.label}
                    </span>
                    <span className="text-[#FF8900] font-bold text-sm">{formatPrice(tool.price)}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* ---- CTA Banner (top) ---- */}
          <div className="mb-16 bg-gradient-to-r from-[#FF8900]/10 to-[#DC2626]/10 border border-[#FF8900]/20 rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-white mb-2">
                Already a Customer?
              </h2>
              <p className="text-gray-400 text-sm">
                Log in to the agency dashboard to access your tools and remaining credits.
              </p>
            </div>
            <Link
              href="/agency/dashboard.html"
              className="inline-block bg-[#FF8900] text-black font-bold px-8 py-3 rounded-lg text-lg hover:bg-[#FF8900]/90 transition-all whitespace-nowrap"
            >
              Log In to Dashboard →
            </Link>
          </div>

          {/* ---- Tools by Category ---- */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#FF8900] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-16">
              {grouped.map((group) => (
                <div key={group.category} id={group.id}>
                  <div className="mb-8">
                    <h2 className="text-2xl font-black mb-1">
                      <span className="mr-2">{group.icon}</span>
                      {group.title}
                    </h2>
                    <p className="text-gray-500">{group.subtitle}</p>
                  </div>
                  <div
                    className={`grid gap-4 ${
                      group.category === "enterprise"
                        ? "grid-cols-1"
                        : "md:grid-cols-2 lg:grid-cols-3"
                    }`}
                  >
                    {group.tools.map((tool) => (
                      <ToolCard key={tool.key} tool={tool} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ---- Account Required / CTA ---- */}
          <div className="mt-20 text-center bg-[#1a1a1a] border border-white/5 rounded-2xl p-10">
            <h2 className="text-2xl md:text-3xl font-black mb-4">
              Ready to <span className="text-[#FF8900]">Get Started</span>?
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              An account is required to use these tools. Existing customers can log in to the dashboard.
              New customers can create an account and load credits instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                href="/agency/dashboard.html"
                className="inline-block bg-[#FF8900] text-black font-bold px-8 py-3 rounded-lg text-lg hover:bg-[#FF8900]/90 transition-all"
              >
                Log In or Create Account →
              </Link>
            </div>

            {/* Account Required Help */}
            <div className="mt-8 pt-8 border-t border-white/5">
              <div className="inline-block bg-[#DC2626]/10 border border-[#DC2626]/20 rounded-xl px-8 py-6">
                <p className="text-[#DC2626] font-bold text-sm tracking-[0.15em] uppercase mb-3">
                  Account Required
                </p>
                <p className="text-gray-300 text-sm mb-4 max-w-md mx-auto">
                  Need help getting set up? Call the Jeff Cline team or speak to your project team manager.
                </p>
                <a
                  href="tel:2234008146"
                  className="inline-block text-white font-black text-2xl hover:text-[#FF8900] transition-colors"
                >
                  (223) 400-8146
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
