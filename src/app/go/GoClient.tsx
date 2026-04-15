"use client";

import { useState } from "react";

interface Link {
  label: string;
  url: string;
  desc: string;
  external?: boolean;
}

interface Category {
  name: string;
  icon: string;
  color: string;
  links: Link[];
}

const categories: Category[] = [
  {
    name: "Core Pages",
    icon: "🏠",
    color: "#FF8900",
    links: [
      { label: "Homepage", url: "/", desc: "Profit at Scale — main landing" },
      { label: "About", url: "/about", desc: "About Jeff Cline" },
      { label: "Contact", url: "/contact", desc: "Get in touch" },
      { label: "Portfolio", url: "/portfolio", desc: "Work & projects" },
      { label: "Portfolio Companies", url: "/portfolio-companies", desc: "Company portfolio" },
      { label: "Blog", url: "/blog", desc: "Articles & insights" },
      { label: "Resources", url: "/resources", desc: "Guides & frameworks" },
      { label: "Testimonials", url: "/testimonials", desc: "Referrals & recommendations" },
    ],
  },
  {
    name: "Silos / Audiences",
    icon: "🎯",
    color: "#22c55e",
    links: [
      { label: "Business", url: "/business", desc: "Digital transformation & automation" },
      { label: "Entrepreneur", url: "/entrepreneur", desc: "Solopreneur to CEO" },
      { label: "Start-Ups", url: "/start-ups", desc: "MVP, fundraising, growth" },
      { label: "Investors", url: "/investors", desc: "Due diligence, deal flow" },
      { label: "Family Offices", url: "/family-offices", desc: "Digital infrastructure & AI strategy" },
    ],
  },
  {
    name: "LAUNCH Platform",
    icon: "🚀",
    color: "#FF8900",
    links: [
      { label: "LAUNCH", url: "/launch", desc: "7 tools, one credit system" },
      { label: "LAUNCH Dashboard", url: "/launch/dashboard", desc: "User credit balance & tools" },
      { label: "LAUNCH Admin", url: "/launch/admin", desc: "Manage users, credits, codes" },
    ],
  },
  {
    name: "Books & Content",
    icon: "📖",
    color: "#a855f7",
    links: [
      { label: "Books", url: "/books", desc: "SUCCESS: From a Geek Lens — free download" },
      { label: "Book PDF", url: "/books/success-from-a-geek-lens.pdf", desc: "Direct PDF (81 pages)" },
    ],
  },
  {
    name: "Tools & Pricing",
    icon: "🔧",
    color: "#06b6d4",
    links: [
      { label: "Tools", url: "/tools", desc: "All tools overview" },
      { label: "Tools Pricing", url: "/tools-pricing", desc: "Dynamic pricing table" },
      { label: "Tools A La Carte", url: "/tools-a-la-carte", desc: "Individual tool pricing" },
      { label: "Calculators", url: "/calculators", desc: "Business calculators" },
      { label: "Investment Calculator", url: "/investment-calculator", desc: "Best investment calculator" },
    ],
  },
  {
    name: "Sales & Pitch",
    icon: "💼",
    color: "#eab308",
    links: [
      { label: "Request Deck", url: "/deck", desc: "Request a pitch deck" },
      { label: "Pitch Decks", url: "/pitch-decks", desc: "Tech stack, investments, gallery" },
      { label: "One-Click Demo", url: "/one-click-demo", desc: "Live demo" },
      { label: "Engagement Agreement", url: "/fast-start", desc: "Fast Start Program" },
      { label: "PPC Management", url: "/pay-per-click", desc: "Agency PPC services" },
    ],
  },
  {
    name: "Programs",
    icon: "🎓",
    color: "#ec4899",
    links: [
      { label: "Immersive Mastermind", url: "/mastermind", desc: "Caribbean island mastermind" },
      { label: "Billionaires Club", url: "/billionaires-club", desc: "Exclusive network" },
      { label: "Quiz", url: "/quiz", desc: "Which silo are you?" },
    ],
  },
  {
    name: "Sports Intelligence",
    icon: "🏀",
    color: "#f97316",
    links: [
      { label: "Sports", url: "/sports", desc: "Betting intelligence dashboard" },
      { label: "Sports Dashboard", url: "/sports/dashboard", desc: "Picks & tracking" },
      { label: "Sports Admin", url: "/sports/admin", desc: "Admin panel" },
    ],
  },
  {
    name: "The Vault (CRM)",
    icon: "🔐",
    color: "#ef4444",
    links: [
      { label: "The Vault", url: "/todo", desc: "CRM, leads, todos, calendar" },
      { label: "Quick Add", url: "/todo/add", desc: "Add a todo" },
      { label: "Bulk Add", url: "/todo/add/bulk", desc: "Bulk todo import" },
    ],
  },
  {
    name: "Auth",
    icon: "🔑",
    color: "#6b7280",
    links: [
      { label: "Sign In", url: "/login", desc: "Account login" },
      { label: "Sign Up", url: "/signup", desc: "Create account" },
      { label: "Dashboard", url: "/dashboard", desc: "User dashboard" },
    ],
  },
  {
    name: "Legal",
    icon: "📄",
    color: "#6b7280",
    links: [
      { label: "Privacy Policy", url: "/privacy", desc: "Privacy policy" },
      { label: "Terms of Service", url: "/terms", desc: "Terms of service" },
      { label: "Investment Disclosures", url: "/investment-disclosures", desc: "Investment disclosures" },
    ],
  },
  {
    name: "Marley Investment",
    icon: "🏡",
    color: "#0D9488",
    links: [
      { label: "The Marley", url: "/marley", desc: "Luxury estate investment opportunity" },
      { label: "Investment Deck", url: "/decks/marley-investment-deck.pdf", desc: "15-page confidential memorandum" },
    ],
  },
  {
    name: "External Platforms",
    icon: "🌐",
    color: "#8b5cf6",
    links: [
      { label: "Agents.biz", url: "https://agents.biz", desc: "AI agent tools for C-suite", external: true },
      { label: "MultiFamilyOffice.ai", url: "https://multifamilyoffice.ai", desc: "Real estate, Geek Score, deals", external: true },
      { label: "SoftCircle.ai", url: "https://softcircle.ai", desc: "Investor discovery & soft circling", external: true },
      { label: "MoneyWords", url: "https://moneywords.org", desc: "Keyword intelligence & HIT leads", external: true },
      { label: "PolicyStore", url: "https://policystore.com", desc: "AI multi-insurance marketplace", external: true },
      { label: "Coaches.cloud", url: "https://coaches.cloud", desc: "Coaching ecosystem", external: true },
      { label: "BusinessBootcamps.com", url: "https://businessbootcamps.com", desc: "Startup, Scale, SXXT! programs", external: true },
      { label: "AscendHealthIntelligence.com", url: "https://ascendhealthintelligence.com", desc: "Healthcare marketing intelligence", external: true },
      { label: "C-SuiteMasterminds.com", url: "https://c-suitemasterminds.com", desc: "Mastermind authority site", external: true },
      { label: "C-SuiteRetreats.com", url: "https://c-suiteretreats.com", desc: "Retreat planning & experiences", external: true },
      { label: "el.ag", url: "https://el.ag", desc: "Demand Engine & Visitor Optimization", external: true },
    ],
  },
];

export default function GoClient() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const q = search.toLowerCase();

  const filtered = categories
    .map((cat) => ({
      ...cat,
      links: cat.links.filter(
        (l) =>
          l.label.toLowerCase().includes(q) ||
          l.desc.toLowerCase().includes(q) ||
          l.url.toLowerCase().includes(q) ||
          cat.name.toLowerCase().includes(q)
      ),
    }))
    .filter((cat) => cat.links.length > 0)
    .filter((cat) => !activeCategory || cat.name === activeCategory);

  const totalLinks = categories.reduce((sum, c) => sum + c.links.length, 0);

  return (
    <div className="min-h-screen px-6 py-12" style={{ background: "#0a0a0a" }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">
            <span style={{ color: "#FF8900" }}>GO</span>
          </h1>
          <p className="text-gray-500 text-sm">
            {totalLinks} pages across {categories.length} categories — one click away
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pages, tools, platforms..."
            className="w-full rounded-lg px-5 py-3 text-white outline-none focus:ring-2 ring-[#FF8900] text-center"
            style={{ background: "#1a1a1a" }}
          />
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <button
            onClick={() => setActiveCategory(null)}
            className="px-3 py-1 rounded-full text-xs font-medium transition-all"
            style={{
              background: !activeCategory ? "#FF8900" : "#1a1a1a",
              color: !activeCategory ? "#000" : "#888",
            }}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() =>
                setActiveCategory(activeCategory === cat.name ? null : cat.name)
              }
              className="px-3 py-1 rounded-full text-xs font-medium transition-all"
              style={{
                background: activeCategory === cat.name ? cat.color : "#1a1a1a",
                color: activeCategory === cat.name ? "#000" : "#888",
              }}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Categories & Links */}
        <div className="space-y-8">
          {filtered.map((cat) => (
            <div key={cat.name}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">{cat.icon}</span>
                <h2 className="text-lg font-bold" style={{ color: cat.color }}>
                  {cat.name}
                </h2>
                <span className="text-xs text-gray-600">
                  ({cat.links.length})
                </span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {cat.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="group rounded-lg p-4 border transition-all hover:border-opacity-60 hover:-translate-y-0.5"
                    style={{
                      background: "#111",
                      borderColor: "#222",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = cat.color + "80";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "#222";
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-sm group-hover:text-white transition-colors" style={{ color: cat.color }}>
                          {link.label}
                          {link.external && (
                            <span className="text-gray-600 ml-1 text-xs">↗</span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{link.desc}</p>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-700 mt-2 font-mono truncate">
                      {link.external ? link.url.replace("https://", "") : `jeff-cline.com${link.url}`}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500">No pages match &ldquo;{search}&rdquo;</p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t" style={{ borderColor: "#222" }}>
          <p className="text-xs text-gray-600">
            PROFIT AT SCALE — Every Industry is a Geek Away from Being Uberized
          </p>
        </div>
      </div>
    </div>
  );
}
