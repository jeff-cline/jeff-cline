"use client";

import { useEffect, useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import Link from "next/link";

interface Tool {
  key: string;
  label: string;
  description: string;
  price: number;
  category: string;
}

const CATEGORY_META: Record<string, { title: string; subtitle: string; icon: string }> = {
  keyword: {
    title: "Keyword Tools",
    subtitle: "Research, discover, and validate the keywords that drive traffic",
    icon: "🔑",
  },
  analysis: {
    title: "Analysis Tools",
    subtitle: "Deep insights into domains, competitors, backlinks, and SERPs",
    icon: "📊",
  },
  premium: {
    title: "Premium Tools",
    subtitle: "Comprehensive audits and optimization at scale",
    icon: "⚡",
  },
  enterprise: {
    title: "Enterprise",
    subtitle: "Done-for-you solutions built by our team",
    icon: "🏗️",
  },
};

const CATEGORY_ORDER = ["keyword", "analysis", "premium", "enterprise"];

function formatPrice(price: number): string {
  if (price >= 1000) return `$${price.toLocaleString()}`;
  return `$${price}`;
}

function ToolCard({ tool }: { tool: Tool }) {
  const isEnterprise = tool.category === "enterprise";

  return (
    <div
      className={`relative rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 ${
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
            Get Started →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ToolsALaCartePage() {
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
      <Breadcrumbs items={[{ label: "Tools", href: "/tools" }, { label: "Tools À La Carte" }]} />
      <section className="min-h-screen pt-8 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <p className="text-[#DC2626] font-bold text-sm tracking-[0.3em] uppercase mb-4">
              SEO TOOLKIT
            </p>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Tools <span className="text-[#FF8900]">À La Carte</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Professional SEO tools — pay only for what you use. No subscriptions, no bloat.
              Just results.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#FF8900] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-16">
              {grouped.map((group) => (
                <div key={group.category}>
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

          {/* CTA */}
          <div className="mt-20 text-center bg-[#1a1a1a] border border-white/5 rounded-2xl p-10">
            <h2 className="text-2xl md:text-3xl font-black mb-4">
              Ready to <span className="text-[#FF8900]">Dominate Search</span>?
            </h2>
            <p className="text-gray-400 mb-6 max-w-xl mx-auto">
              Create an account on the agency dashboard to start using these tools. Purchase credits (dollars) and run any tool instantly.
            </p>
            <Link
              href="/agency/dashboard.html"
              className="inline-block bg-[#FF8900] text-black font-bold px-8 py-3 rounded-lg text-lg hover:bg-[#FF8900]/90 transition-all"
            >
              Create Account & Get Credits →
            </Link>
            <p className="text-gray-500 text-sm mt-4">
              Don&apos;t have enough credits?{" "}
              <Link href="/contact" className="text-[#FF8900] hover:underline">
                Contact Jeff directly
              </Link>{" "}
              to discuss your needs and get set up.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
