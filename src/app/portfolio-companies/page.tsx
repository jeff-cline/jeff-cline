"use client";

import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";

const companies = [
  {
    name: "VRTCLS",
    url: "https://vrtcls.com",
    description: "Multi Family Office powered by Geeks",
    label: "HOLDING COMPANY",
    amount: "$██,███,███",
    color: "#FF8900",
  },
  {
    name: "VRTCLS FUND",
    url: "https://vrtcls.fund",
    description: "Scalable Equity Technology Fund",
    label: "FUND OF FUNDS",
    amount: "$1██,███,███",
    color: "#FF8900",
  },
  {
    name: "Cuurio",
    url: "https://cuurio.com",
    description: "Consumer Technology Platform",
    label: "STRATEGIC INVESTMENT",
    amount: "$█,███,███",
    color: "#DC2626",
  },
  {
    name: "Keyword Calls",
    url: "https://keywordcalls.com",
    description: "High-Intent Call Routing Technology",
    label: "PORTFOLIO COMPANY",
    amount: "$██,███,███",
    color: "#FF8900",
  },
  {
    name: "VoiceDrips",
    url: "https://voicedrips.com",
    description: "AI Dialer & Outbound Sales Platform",
    label: "PORTFOLIO COMPANY",
    amount: "$█,███,███",
    color: "#DC2626",
  },
  {
    name: "Refinement.ai",
    url: "https://refinement.ai",
    description: "Eco-System Optimization & Savings Engine",
    label: "PORTFOLIO COMPANY",
    amount: "$██,███,███",
    color: "#FF8900",
  },
  {
    name: "VRTCLS Technology",
    url: "https://vrtcls.com",
    description: "30+ Years Proprietary Tech Stack",
    label: "BUSINESS UNIT",
    amount: "$█,███,███",
    color: "#DC2626",
  },
  {
    name: "VRTCLS Marketing",
    url: "https://vrtcls.com",
    description: "Proprietary Networks & Acquisition",
    label: "BUSINESS UNIT",
    amount: "$██,███,███",
    color: "#FF8900",
  },
  {
    name: "VRTCLS Land",
    url: "https://vrtcls.com",
    description: "Real Estate-Backed Investment Fund",
    label: "LAND FUND",
    amount: "$███,███,███",
    color: "#DC2626",
  },
  {
    name: "1-800-MEDIGAP",
    url: "https://1800medigap.com",
    description: "Medicare Supplement Insurance & Senior Health Solutions",
    label: "PORTFOLIO COMPANY",
    amount: "$██,███,███",
    color: "#FF8900",
  },
  {
    name: "TelMedicine",
    url: "#",
    description: "Virtual Healthcare & Remote Patient Access Platform",
    label: "PORTFOLIO COMPANY",
    amount: "$█,███,███",
    color: "#DC2626",
  },
  {
    name: "Wharton Jelly",
    url: "#",
    description: "Regenerative Medicine & Perinatal Tissue Biologics",
    label: "STRATEGIC INVESTMENT",
    amount: "$██,███,███",
    color: "#FF8900",
  },
  {
    name: "Clear Bridge Biologics",
    url: "#",
    description: "Advanced Biologics & Cellular Therapy Solutions",
    label: "STRATEGIC INVESTMENT",
    amount: "$█,███,███",
    color: "#DC2626",
  },
  {
    name: "iSTEMCELL",
    url: "#",
    description: "Stem Cell Research & Regenerative Treatment Platform",
    label: "PORTFOLIO COMPANY",
    amount: "$██,███,███",
    color: "#FF8900",
  },
  {
    name: "Electrical Medicine",
    url: "#",
    description: "Bioelectric Therapeutics & Neuromodulation Technology",
    label: "STRATEGIC INVESTMENT",
    amount: "$█,███,███",
    color: "#DC2626",
  },
  {
    name: "MoneyWords",
    url: "https://moneywords.org",
    description: "Revenue-Generating Content & Conversion Copy Platform",
    label: "PORTFOLIO COMPANY",
    amount: "$██,███,███",
    color: "#FF8900",
  },
  {
    name: "EyeCyte",
    url: "#",
    description: "Ophthalmic Biologics & Ocular Regenerative Medicine",
    label: "STRATEGIC INVESTMENT",
    amount: "$█,███,███",
    color: "#DC2626",
  },
  {
    name: "Net Patient Foundation",
    url: "#",
    description: "Patient Advocacy & Healthcare Access Nonprofit Initiative",
    label: "FOUNDATION",
    amount: "$█,███,███",
    color: "#FF8900",
  },
  {
    name: "Weightloss Lollipops",
    url: "#",
    description: "Consumer Health & Appetite Management Products",
    label: "PORTFOLIO COMPANY",
    amount: "$██,███,███",
    color: "#DC2626",
  },
  {
    name: "ADS Eyewear",
    url: "#",
    description: "Premium Eyewear Brand & Optical Distribution",
    label: "PORTFOLIO COMPANY",
    amount: "$█,███,███",
    color: "#FF8900",
  },
  {
    name: "Voluigo",
    url: "#",
    description: "Travel Technology & Experience Marketplace Platform",
    label: "STRATEGIC INVESTMENT",
    amount: "$██,███,███",
    color: "#DC2626",
  },
  {
    name: "North American Energy Off Takers Association",
    url: "#",
    description: "Energy Market Infrastructure & Off-Taker Aggregation Network",
    label: "STRATEGIC INVESTMENT",
    amount: "$███,███,███",
    color: "#FF8900",
  },
  {
    name: "OFFTAKERS",
    url: "#",
    description: "Energy Purchase Agreement & Power Contract Marketplace",
    label: "PORTFOLIO COMPANY",
    amount: "$██,███,███",
    color: "#DC2626",
  },
  {
    name: "Multifamily Office AI",
    url: "#",
    description: "AI-Powered Operations Platform for Multi-Family Offices",
    label: "PORTFOLIO COMPANY",
    amount: "$█,███,███",
    color: "#FF8900",
  },
  {
    name: "Whiskey Cask Investments",
    url: "#",
    description: "Alternative Asset Class — Aged Spirits & Cask Appreciation Fund",
    label: "STRATEGIC INVESTMENT",
    amount: "$██,███,███",
    color: "#DC2626",
  },
  {
    name: "2X Investing",
    url: "#",
    description: "Accelerated Capital Deployment & Double-Down Strategy Platform",
    label: "PORTFOLIO COMPANY",
    amount: "$█,███,███",
    color: "#FF8900",
  },
  {
    name: "Investor Discovery Tour",
    url: "https://investordiscoverytour.com",
    description: "Curated Investment Property Tours & Due Diligence Expeditions",
    label: "PORTFOLIO COMPANY",
    amount: "$██,███,███",
    color: "#DC2626",
  },
  {
    name: "2A Network",
    url: "#",
    description: "Strategic Alliance Network & Deal Flow Infrastructure",
    label: "STRATEGIC INVESTMENT",
    amount: "$█,███,███",
    color: "#FF8900",
  },
  {
    name: "2A Fund",
    url: "#",
    description: "Alternative Investment Fund & Capital Allocation Vehicle",
    label: "FUND",
    amount: "$███,███,███",
    color: "#DC2626",
  },
  {
    name: "Retail Investor",
    url: "#",
    description: "Investor Relations & Capital Retention Technology Platform",
    label: "PORTFOLIO COMPANY",
    amount: "$██,███,███",
    color: "#FF8900",
  },
  {
    name: "CSTMRLSS",
    url: "#",
    description: "Customerless Revenue Architecture & Automated Commerce Engine",
    label: "PORTFOLIO COMPANY",
    amount: "$█,███,███",
    color: "#DC2626",
  },
];

export default function PortfolioCompaniesPage() {
  return (
    <><Breadcrumbs items={[{ label: "Portfolio Companies" }]} />
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <section className="pt-8 pb-16 px-4 text-center">
        <p className="font-mono text-xs tracking-[0.3em] text-[#FF8900] mb-4 uppercase">
          Confidential — For Authorized Review Only
        </p>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
          <span className="text-[#FF8900]">PORTFOLIO</span>{" "}
          <span className="text-[#DC2626]">COMPANIES</span>
        </h1>
        <div className="w-24 h-[2px] bg-[#FF8900] mx-auto mb-6" />
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Strategic investments and equity positions across scalable technology businesses.
          Leveraging proprietary Scalable Equity Technology to drive long-term accretive value.
        </p>
        <p className="font-mono text-[10px] text-gray-600 mt-8 tracking-widest uppercase">
          Deal values are confidential and partially redacted
        </p>
      </section>

      {/* Tombstone Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {companies.map((company) => (
            <div
              key={company.name}
              className="border border-white/10 bg-[#111] rounded-none p-0 flex flex-col hover:border-white/20 transition-all duration-300 group"
            >
              {/* Top label bar */}
              <div
                className="px-6 py-2 text-center font-mono text-[10px] tracking-[0.25em] uppercase border-b border-white/10"
                style={{ color: company.color }}
              >
                {company.label}
              </div>

              {/* Logo area */}
              <div className="px-8 pt-10 pb-6 flex items-center justify-center">
                <div
                  className="text-2xl md:text-3xl font-black tracking-tight text-center"
                  style={{ color: company.color }}
                >
                  {company.name}
                </div>
              </div>

              {/* Divider */}
              <div className="mx-8 h-[1px] bg-white/10" />

              {/* Description */}
              <div className="px-8 py-5 text-center">
                <p className="text-gray-400 text-sm leading-relaxed">
                  {company.description}
                </p>
              </div>

              {/* Divider */}
              <div className="mx-8 h-[1px] bg-white/10" />

              {/* Deal amount */}
              <div className="px-8 py-5 text-center">
                <p className="font-mono text-[10px] text-gray-600 tracking-widest mb-2 uppercase">
                  Investment Value
                </p>
                <p className="font-mono text-xl text-white/30 tracking-wider select-none">
                  {company.amount}
                </p>
              </div>

              {/* Bottom link bar */}
              <div className="mt-auto border-t border-white/10 px-6 py-3 text-center">
                <a
                  href={company.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-gray-500 hover:text-[#FF8900] transition-colors tracking-wider"
                >
                  {company.url.replace("https://", "").replace(/\/$/, "")} ↗
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom disclaimer */}
        <div className="mt-20 text-center border-t border-white/5 pt-12">
          <div className="w-16 h-[1px] bg-[#FF8900] mx-auto mb-6" />
          <p className="font-mono text-[10px] text-gray-600 tracking-widest uppercase max-w-xl mx-auto leading-relaxed">
            This page is for informational purposes only and does not constitute an offer to sell
            or a solicitation of an offer to buy any securities. All investment values are
            confidential and have been redacted.
          </p>
        </div>
      </section>
    </main>
    </>
  );
}
