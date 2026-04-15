"use client";

import { useState } from "react";

const keyMetrics = [
  { val: "$3.35T", label: "U.S. Insurance Premiums", sub: "Annual net premiums written (2025)" },
  { val: "$5.08B", label: "InsurTech Funding (2025)", sub: "Full-year global insurtech investment" },
  { val: "$176B", label: "AI in Insurance by 2035", sub: "32% CAGR from $10.8B in 2025" },
  { val: "10%", label: "Industry ROE", sub: "Projected 2025-2026 (Deloitte)" },
  { val: "$2.6B", label: "NEXT Insurance Acquisition", sub: "Munich Re acquisition (2025)" },
  { val: "70%", label: "AI Adoption by 2028", sub: "From 14% in 2025 (Datagrid)" },
];

const investorDecks = [
  {
    title: "25-Page Pitch Deck",
    desc: "Full color investor presentation with market analysis, technology stack, unit economics, financial projections ($3.2M to $339M), three-method valuation, and path to $3B+ exit.",
    href: "https://policystore.com/decks/pitch-deck.html",
    tag: "PITCH DECK",
    color: "#22c55e",
    pages: "25 slides",
  },
  {
    title: "Technical White Paper",
    desc: "PhD-level actuarial mathematics, predictive analytics framework (Policy Propensity Scoring), risk mitigation modeling, cross-sell optimization equations, and detailed unit economics.",
    href: "https://policystore.com/decks/whitepaper.html",
    tag: "WHITE PAPER",
    color: "#3b82f6",
    pages: "Research paper",
  },
  {
    title: "Executive One-Pager",
    desc: "Single-page executive summary with all key metrics, 5-year financial projections, use of proceeds ($10M allocation), and timeline to 10x+ investor return.",
    href: "https://policystore.com/decks/one-pager.html",
    tag: "ONE PAGER",
    color: "#f59e0b",
    pages: "1 page",
  },
];

const thesisPillars = [
  {
    icon: "🏦",
    title: "Insurance: The Ultimate Recurring Revenue",
    points: [
      "Warren Buffett built Berkshire Hathaway on insurance because premiums create predictable, recurring cash flow — what he calls 'the float'",
      "Insurance is recession-resistant: people must maintain auto, home, and health coverage regardless of economic conditions",
      "The industry generated $3.35 trillion in U.S. premiums in 2025, projected to reach $3.98 trillion by 2031 (6.98% CAGR)",
      "Industry ROE projected at 10% for 2025-2026, driven by investment earnings (Deloitte 2026 Outlook)",
      "Renewal rates of 85-92% create compounding revenue streams — once a customer is acquired, they pay for years",
    ],
  },
  {
    icon: "🤖",
    title: "AI + Insurance: The $176 Billion Convergence",
    points: [
      "AI in insurance is growing at 32% CAGR, from $10.8B (2025) to $176.6B (2035) — one of the fastest-growing AI verticals",
      "71% of underwriting executives believe AI investment is critical for performance (Accenture 2025)",
      "AI-powered fraud detection alone could save insurers $80B to $160B by 2032 (Deloitte)",
      "Agentic AI in insurance projected to reach $18.16B by 2030 at 25.7% CAGR",
      "InsurTech funding surged to $5.08B in 2025, with Q4 jumping 66.8% quarter-over-quarter as AI drove mega-rounds",
    ],
  },
  {
    icon: "📊",
    title: "Big Data + Predictive Analytics: The Competitive Moat",
    points: [
      "Insurance is fundamentally a data business — better data means better risk selection, lower loss ratios, higher profits",
      "Predictive analytics drove a 246% increase in cross-sell conversion rates (LexisNexis case study)",
      "Behavioral data across 10,397 clusters enables individual-level intent prediction — knowing who needs insurance before they search",
      "First-party data is the new oil: 47% of marketers say better attribution is the top benefit of martech-adtech integration (eMarketer/Zeta)",
      "The convergence of martech, adtech, and fintech creates full-funnel visibility from first touch to policy binding",
    ],
  },
  {
    icon: "🗣️",
    title: "Conversational AI: The Distribution Revolution",
    points: [
      "Voice AI costs $0.15/minute vs. $1.85/minute for human agents — a 92% cost reduction per interaction",
      "Conversational AI operates 24/7/365, handling 10,000+ simultaneous conversations with zero overtime costs",
      "AI-powered outbound voice campaigns initiate, qualify, quote, and close — replacing the entire traditional agent workflow",
      "Voice biometric analysis adds fraud detection layer that human agents cannot replicate at scale",
      "Insurance AI agents can process applications, verify compliance, and bind policies in minutes instead of weeks",
    ],
  },
  {
    icon: "💰",
    title: "FinTech Infrastructure: Unit Economics That Scale",
    points: [
      "PolicyStore's autonomous model reduces per-policy costs from $520 to $70 — an 86.5% reduction",
      "LTV:CAC ratio of 10.6:1 vs. industry average of 1.4:1 — among the best unit economics in any industry",
      "Near-zero marginal cost: scaling from 10K to 1M policies increases cost by ~3x, not 100x",
      "Commission-based revenue with 70% EBITDA margins at scale vs. 5-10% for traditional agencies",
      "Renewal trail creates compounding recurring revenue — $52.3M in renewal revenue by Year 5",
    ],
  },
  {
    icon: "🎯",
    title: "AdTech + MarTech: Precision Targeting at Scale",
    points: [
      "Traditional insurance leads cost $20-$80 with 2-5% conversion; high-intent targeted data costs $2.50 with 8-12% conversion",
      "Martech-adtech convergence driven by AI enables full-funnel attribution from impression to policy bind",
      "Proprietary data lake growing daily with 3+ billion data points across behavioral, intent, and financial dimensions",
      "Real-time optimization engines adjust targeting, messaging, and channel allocation based on conversion signals",
      "Cross-platform identity resolution (email, phone, device ID, address) enables multi-touch attribution across the entire customer journey",
    ],
  },
];

const faqItems = [
  {
    q: "Why is insurance considered a strong investment sector?",
    a: "Insurance is one of the few truly recession-resistant industries. People are legally required to carry auto insurance, mortgage lenders require homeowners insurance, and employers mandate workers' compensation. This creates non-discretionary, recurring revenue regardless of economic conditions. Warren Buffett built Berkshire Hathaway — now an $876 billion company — primarily on insurance because of 'the float': premiums collected upfront that can be invested before claims are paid. The U.S. insurance industry writes $3.35 trillion in annual premiums and consistently delivers 8-12% ROE. Few industries offer this combination of scale, stability, and recurring cash flow.",
  },
  {
    q: "What makes AI-powered insurance distribution different from traditional agencies?",
    a: "Traditional insurance agencies are fundamentally human-dependent: a licensed agent manages 200-400 policies, spends 60% of their time on admin tasks, and costs $75,000+ annually when fully loaded. An AI-powered autonomous agency eliminates this constraint entirely. Conversational AI handles outbound sales at $0.15/minute (vs. $1.85 for humans). Agentic AI performs underwriting, compliance, and carrier matching in seconds. The result is an 86.5% reduction in per-policy costs ($70 vs. $520) with infinite scalability — the same AI infrastructure handles 10,000 or 1,000,000 policies. This isn't incremental improvement; it's a categorical redesign of how insurance is distributed.",
  },
  {
    q: "How does big data improve insurance economics?",
    a: "Insurance is fundamentally a data business — the company with the best data makes the best risk selections, which drives the best loss ratios, which creates the highest profits. PolicyStore's proprietary data stack covers 10,397 behavioral clusters across 11 domains (intent, purchase, financial, household, lifestyle, demographic, content, employment, and more). This enables three transformative capabilities: (1) Identifying consumers with insurance intent before they search, collapsing the top-of-funnel problem; (2) Pre-qualifying risks using behavioral data, reducing adverse selection by 18-25%; and (3) Optimizing cross-sell timing using life event triggers, achieving 28-35% cross-sell rates vs. the 8-12% industry average. LexisNexis documented a 246% increase in conversion rates when predictive analytics were applied to cross-sell campaigns.",
  },
  {
    q: "What is the market size for AI in insurance?",
    a: "The AI in insurance market was valued at $10.8 billion in 2025 and is projected to reach $176.6 billion by 2035, growing at a 32% CAGR (Precedence Research). The agentic AI segment specifically — autonomous systems that can reason, decide, and act without human intervention — is projected to reach $18.16 billion by 2030 at 25.7% CAGR (Business Research Company). InsurTech funding reached $5.08 billion in 2025, with Q4 surging 66.8% as AI-driven mega-rounds dominated deal flow (Gallagher Re). The U.S. captured 55.74% of global insurtech deals, up from 50.58% in 2024. 71% of underwriting executives consider AI investment critical for performance (Accenture).",
  },
  {
    q: "How does the martech-fintech-adtech convergence create value?",
    a: "Traditionally, marketing technology (martech), advertising technology (adtech), and financial technology (fintech) operated in silos. A marketer might generate awareness, an advertiser might drive clicks, but neither could track the full journey to a financial transaction. The convergence of these three — powered by AI and big data — creates end-to-end visibility from first impression to policy binding. PolicyStore sits at this intersection: adtech identifies high-intent consumers through behavioral targeting, martech nurtures them through personalized conversational AI, and fintech processes the insurance transaction (quoting, underwriting, binding) — all in a single automated pipeline. 47% of marketers say better attribution is the top benefit of this convergence (eMarketer/Zeta Global), and for insurance specifically, it means knowing exactly which consumer will buy which product at which moment.",
  },
  {
    q: "What are the comparable exits in insurtech?",
    a: "The insurtech space has produced several landmark transactions: Munich Re acquired NEXT Insurance at a $2.6 billion valuation in 2025 — a commercial insurance AI platform. Lemonade IPO'd at a $3.8 billion valuation (39x revenue). Hippo went public via SPAC at $5 billion. Root IPO'd at $6.7 billion. Duck Creek Technologies was acquired by Vista Equity Partners for $2.6 billion. Applied Systems was acquired for $4.8 billion. Vertafore was acquired by Roper Technologies for $5.35 billion. 21 insurtechs were acquired in Q3 2025 alone — the highest quarterly count since Q3 2022. The pattern is clear: insurance technology companies that demonstrate data moats, scalable unit economics, and AI-driven efficiency are commanding multi-billion dollar exits.",
  },
  {
    q: "How does AI reduce risk for insurance carriers?",
    a: "This is the single most compelling value proposition for carrier partners. PolicyStore's AI reduces carrier risk by $36-67 million per $1 billion in premium volume through four mechanisms: (1) Fraud prevention — AI-powered pre-binding verification reduces investigation referrals by 40-55%, potentially saving the industry $80-160 billion by 2032 (Deloitte). (2) Better risk selection — behavioral pre-qualification using 10,397 data dimensions reduces adverse selection by 18-25%, directly improving loss ratios. (3) Expense ratio reduction — autonomous distribution cuts the carrier's distribution cost by 8.7 percentage points. (4) Combined ratio improvement — the total effect is an 11.9 percentage point combined ratio improvement. On a $100M book, that's $11.9M in additional underwriting profit. Carriers who see these results allocate preferential capacity, creating a self-reinforcing competitive moat.",
  },
  {
    q: "Why is $300M a reasonable pre-money valuation?",
    a: "The $300M valuation is supported by three independent methodologies: (1) Revenue Multiple — Year 3 projected ARR of $48M multiplied by an 8.2x multiple (conservative vs. insurtech comparables of 6-39x) yields $393.6M. (2) DCF Analysis — 10-year discounted cash flow with 15% WACC and 4% terminal growth yields $321.5M (NPV of $87.4M in FCFs plus $234.1M terminal value). (3) Strategic Asset Value — PolicyStore's proprietary data stack, once populated with millions of consumer-insurance interaction records, becomes an irreplaceable asset valued at $50-100M+ independently. The combination of an 86.5% cost advantage, 10.6:1 LTV:CAC, projected $339M Year 5 revenue with 70% EBITDA margins, and a clear path to $3B+ PE exit within 48-60 months makes $300M a conservative entry point for Series A investors.",
  },
  {
    q: "What is the path to liquidity for investors?",
    a: "PolicyStore provides multiple liquidity milestones: Series B at Month 18 ($40M raise at $600M valuation — 2x paper return). Secondary offering at Month 24 where early investors and founders can take money off the table at 2-3x. Series C at Month 36 ($100M raise at $1.2B valuation — 4x paper return). PE acquisition or strategic exit at Month 48-60 at $3B+ (10x+ full liquidity). The secondary at Month 24 is specifically designed to de-risk the investment — investors can realize partial returns while maintaining exposure to the growth trajectory. Potential strategic acquirers include reinsurers (Munich Re, Swiss Re), PE firms with insurance portfolios (KKR, Apollo, Blackstone), and technology companies expanding into insurance (Google, Amazon, Apple).",
  },
  {
    q: "How does PolicyStore differ from Lemonade, Root, and other insurtechs?",
    a: "Most insurtechs are insurance carriers that use technology to improve their own underwriting — they take on insurance risk directly. PolicyStore is fundamentally different: it's a zero-risk distribution platform. PolicyStore never holds insurance risk; it earns commissions by matching consumers with carriers. This means: no claims liability on the balance sheet, no reserve requirements, no catastrophe exposure, and pure margin on every policy bound. Additionally, previous insurtechs focused on a single product line (Lemonade: renters/home, Root: auto, Hippo: home). PolicyStore covers 33+ insurance products across personal, health, business, and specialty lines — maximizing revenue per customer through AI-driven cross-selling. The proprietary data stack (10,397 behavioral clusters) is also unique — no other insurtech has this level of consumer intelligence feeding into their distribution engine.",
  },
  {
    q: "What role does conversational AI play in insurance sales?",
    a: "Conversational AI is the distribution unlock that makes the autonomous agency possible. Traditional insurance sales require a licensed agent to conduct a needs assessment, explain coverage options, handle objections, and close the sale — a process that takes 30-90 minutes per prospect and can only happen during business hours. VoiceDrips' conversational AI replicates this entire workflow through natural voice interaction: it calls the consumer, assesses their needs, explains product options in plain language, handles objections using frameworks derived from top-performing human agents, and either closes the sale or schedules a callback. The system operates 24/7, handles 10,000+ concurrent conversations, scores a 4.2/5.0 on Natural Conversation Score (indistinguishable from humans in blind testing), and maintains full compliance with DOI regulations in all 50 states. Every conversation is recorded, transcribed, and compliance-scored — creating an audit trail superior to any human agency.",
  },
  {
    q: "How does predictive analytics optimize the insurance customer journey?",
    a: "PolicyStore's predictive engine assigns each consumer a Policy Propensity Score (PPS) across all 33+ insurance products using a multivariate model that weighs intent signals, life stage, financial profile, household composition, and temporal urgency. The temporal factor is critical — it captures time-sensitive signals like policy renewal dates (30-60 days before expiration), life events (marriage, home purchase, new vehicle, turning 65), and seasonal enrollment windows (Medicare AEP: Oct 15-Dec 7, ACA OEP: Nov 1-Jan 15). The cross-sell optimization engine identifies the highest-value next product for each consumer by maximizing expected commission times propensity score times competitive displacement probability. This mathematical precision drives a 28-35% cross-sell rate vs. the industry's 8-12%, meaning each customer generates 3x the revenue of a traditionally-acquired customer over their lifetime.",
  },
  {
    q: "Is insurance a good investment during economic uncertainty?",
    a: "Insurance is one of the strongest defensive investments during economic uncertainty for several structural reasons: (1) Non-discretionary demand — auto insurance is legally required in 49 states, homeowners insurance is required by mortgage lenders, workers' comp is mandatory in most states, and health insurance is essential. (2) Pricing power — insurance premiums typically rise during inflationary periods as replacement costs increase, naturally hedging against inflation. (3) Investment income — insurance companies invest premiums ('the float') in bonds and other instruments that benefit from higher interest rates. (4) Counter-cyclical claims — during recessions, people drive less (fewer auto claims), postpone elective procedures (lower health claims), and commit less arson (lower property claims). The 2024 P&C combined ratio of 96.5% was the best in over a decade, and industry ROE is projected at 10% for 2025-2026 (Deloitte). Adding AI and automation to this already-resilient industry creates exponential upside with downside protection.",
  },
  {
    q: "What is the regulatory environment for AI in insurance?",
    a: "Insurance regulation is state-based in the U.S., overseen by 50 state Departments of Insurance plus the NAIC (National Association of Insurance Commissioners). The regulatory framework actually favors AI-powered distribution platforms like PolicyStore because: (1) Distribution is less regulated than underwriting — PolicyStore doesn't set rates or take risk, so it faces lighter regulatory burden than carriers. (2) Compliance is automatable — AI can ensure every conversation adheres to state-specific disclosure requirements, something human agents frequently fail to do. (3) Consumer protection — AI creates complete audit trails of every interaction, exceeding regulatory requirements. (4) The NAIC has published principles for AI in insurance that emphasize transparency, fairness, and accountability — all of which favor data-driven, auditable systems over opaque human decision-making. PolicyStore will maintain agency licenses in all 50 states and adhere to all applicable regulations, with AI-powered compliance verification on every transaction.",
  },
  {
    q: "How does the $10M Series A capital get deployed?",
    a: "The $10M raise is allocated to maximize speed to revenue: AI & Engineering ($3.5M / 35%) — VoiceDrips integration for auto, home, and Medicare verticals; Agents.biz deployment for autonomous underwriting and compliance; carrier API buildout for the top 25 carriers by premium volume; and ML model training on insurance-specific datasets. Data Acquisition ($2.0M / 20%) — scaling the proprietary data stack to 50M+ consumer profiles and expanding the behavioral cluster taxonomy. Carrier Partnerships ($1.5M / 15%) — 50-state licensing, carrier integrations, and compliance infrastructure. Go-to-Market ($1.5M / 15%) — Medicare AEP 2026 campaign (Oct-Dec) as proof of concept, followed by auto and home launch in the top 10 states. Operations & Reserve ($1.5M / 15%) — team, legal, accounting, and contingency. The 18-month runway takes the company to positive EBITDA and Series B readiness.",
  },
  {
    q: "What makes the data moat defensible long-term?",
    a: "PolicyStore's data moat compounds over time through three reinforcing layers: (1) Proprietary behavioral data — 10,397 clusters across 11 domains cannot be replicated by a competitor starting from scratch. This data was built over years of research, aggregation, and identity resolution. (2) Insurance outcome data — every policy bound, every claim filed, every renewal or lapse feeds back into the predictive models. This insurance-specific outcome data doesn't exist anywhere else because no one else is combining behavioral targeting with autonomous insurance distribution. (3) Conversational intelligence — every VoiceDrips conversation generates training data on what messaging, objection handling, and timing works best for each consumer segment and product type. Competitors face a chicken-and-egg problem: they need data to compete, but they need to be in market to generate data. PolicyStore's 2+ year head start on data accumulation creates a moat that widens with every interaction.",
  },
];

export default function InsuranceInvestmentPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ background: "#0a0a0a", color: "#fff", minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Hero */}
      <section style={{
        position: "relative", overflow: "hidden",
        background: "linear-gradient(135deg, #0f172a 0%, #1a365d 40%, #064e3b 100%)",
        padding: "0 20px",
      }}>
        {/* Background image */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.12,
          backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1280&h=600&fit=crop&q=60&fm=webp')",
          backgroundSize: "cover", backgroundPosition: "center",
        }} />
        <div style={{ position: "relative", maxWidth: 1200, margin: "0 auto", padding: "60px 0 80px" }}>
          <a href="/pitch-decks" style={{ color: "#22c55e", textDecoration: "none", fontSize: 14, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6 }}>
            ← Back to All Decks
          </a>
          <div style={{ marginTop: 32 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{
                background: "#E20608", color: "#fff", fontSize: 10, fontWeight: 800,
                padding: "5px 14px", borderRadius: 4, letterSpacing: 2, textTransform: "uppercase",
              }}>CONFIDENTIAL</span>
              <span style={{
                background: "rgba(34,197,94,0.15)", color: "#22c55e", fontSize: 10, fontWeight: 800,
                padding: "5px 14px", borderRadius: 20, letterSpacing: 2, textTransform: "uppercase",
                border: "1px solid rgba(34,197,94,0.3)",
              }}>SERIES A &mdash; NOW OPEN</span>
            </div>
            <h1 style={{
              fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 900, lineHeight: 1.1,
              margin: "0 0 16px", maxWidth: 900,
            }}>
              <span style={{ color: "#fff" }}>Insurance Investment</span><br />
              <span style={{ color: "#22c55e" }}>Opportunity</span>
            </h1>
            <p style={{ fontSize: 20, color: "rgba(255,255,255,0.6)", maxWidth: 700, lineHeight: 1.6, margin: "0 0 12px" }}>
              The first fully autonomous AI insurance agency. FinTech, MarTech, and AdTech converge with big data and proprietary technology to create a $3B+ opportunity.
            </p>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.35)", margin: "0 0 32px" }}>
              $10M Series A &bull; $300M Pre-Money Valuation &bull; PolicyStore, Inc.
            </p>

            {/* CTA buttons */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href="https://policystore.com/decks/pitch-deck.html" target="_blank" rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "#22c55e", color: "#fff", padding: "14px 28px",
                  borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: "none",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#16a34a"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#22c55e"; }}
              >
                View Full Pitch Deck
                <span style={{ fontSize: 18 }}>→</span>
              </a>
              <a href="https://policystore.com/decks/whitepaper.html" target="_blank" rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "rgba(255,255,255,0.08)", color: "#fff", padding: "14px 28px",
                  borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: "none",
                  border: "1px solid rgba(255,255,255,0.15)", transition: "all 0.2s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#3b82f6"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)"; }}
              >
                Read White Paper
              </a>
              <a href="https://policystore.com/decks/one-pager.html" target="_blank" rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "rgba(255,255,255,0.08)", color: "#fff", padding: "14px 28px",
                  borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: "none",
                  border: "1px solid rgba(255,255,255,0.15)", transition: "all 0.2s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#f59e0b"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)"; }}
              >
                One-Page Summary
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section style={{ background: "#1a365d", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 20px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 20 }}>
          {keyMetrics.map(m => (
            <div key={m.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#22c55e", lineHeight: 1 }}>{m.val}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginTop: 4 }}>{m.label}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{m.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* The Autonomous Stack */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 20px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 900, margin: 0 }}>
            The <span style={{ color: "#22c55e" }}>Autonomous</span> Insurance Stack
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, marginTop: 8, maxWidth: 700, margin: "8px auto 0" }}>
            Three proprietary technologies that make PolicyStore the first insurance agency operating with zero human agents
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
          {[
            {
              emoji: "🗣️", name: "VoiceDrips.com", role: "Conversational AI Engine", color: "#22c55e",
              desc: "Outbound voice sales, needs assessment, objection handling, and closing through natural conversation. 4.2/5.0 human-equivalence score. $0.15/minute vs. $1.85 for human agents. 24/7/365, 10,000+ concurrent conversations.",
            },
            {
              emoji: "🤖", name: "Agents.biz", role: "Agentic Workforce Platform", color: "#3b82f6",
              desc: "Autonomous underwriting analysis, carrier matching across 500+ carriers, compliance verification in all 50 states, document generation, and policy lifecycle management. One instance replaces an entire agency back office.",
            },
            {
              emoji: "📊", name: "Proprietary Data Stack", role: "High-Intent Consumer Targeting", color: "#f59e0b",
              desc: "10,397 behavioral clusters across 11 domains powered by WattData. Verified identity resolution with email, phone, address, and device IDs. Identifies insurance buyers before they enter the traditional funnel.",
            },
          ].map(t => (
            <div key={t.name} style={{
              padding: 32, borderRadius: 16,
              background: "rgba(255,255,255,0.03)", border: `1px solid ${t.color}33`,
              transition: "all 0.25s ease",
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = t.color;
                (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${t.color}22`;
                (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = `${t.color}33`;
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
                (e.currentTarget as HTMLElement).style.transform = "none";
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 12 }}>{t.emoji}</div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: t.color, textTransform: "uppercase" as const, marginBottom: 4 }}>{t.role}</div>
              <h3 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 12px" }}>{t.name}</h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: 0 }}>{t.desc}</p>
            </div>
          ))}
        </div>

        {/* Pipeline flow */}
        <div style={{
          marginTop: 40, padding: 24, borderRadius: 12,
          background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap",
          fontSize: 13, fontWeight: 600,
        }}>
          <span style={{ background: "rgba(245,158,11,0.15)", padding: "8px 16px", borderRadius: 8, border: "1px solid rgba(245,158,11,0.2)" }}>Data Identifies Consumer</span>
          <span style={{ color: "#22c55e" }}>→</span>
          <span style={{ background: "rgba(34,197,94,0.15)", padding: "8px 16px", borderRadius: 8, border: "1px solid rgba(34,197,94,0.2)" }}>VoiceDrips Calls</span>
          <span style={{ color: "#22c55e" }}>→</span>
          <span style={{ background: "rgba(34,197,94,0.15)", padding: "8px 16px", borderRadius: 8, border: "1px solid rgba(34,197,94,0.2)" }}>AI Qualifies Needs</span>
          <span style={{ color: "#22c55e" }}>→</span>
          <span style={{ background: "rgba(59,130,246,0.15)", padding: "8px 16px", borderRadius: 8, border: "1px solid rgba(59,130,246,0.2)" }}>Agents.biz Quotes</span>
          <span style={{ color: "#22c55e" }}>→</span>
          <span style={{ background: "rgba(34,197,94,0.25)", padding: "8px 16px", borderRadius: 8, border: "1px solid rgba(34,197,94,0.4)", color: "#22c55e" }}>Policy Bound — Zero Humans</span>
        </div>
      </section>

      {/* Divider */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
        <hr style={{ border: "none", borderTop: "1px solid rgba(34,197,94,0.12)" }} />
      </div>

      {/* Investment Thesis Pillars */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 20px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 900, margin: 0 }}>
            The Investment <span style={{ color: "#22c55e" }}>Thesis</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, maxWidth: 600, margin: "8px auto 0" }}>
            Six converging forces that make PolicyStore a generational investment opportunity
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(520px, 1fr))", gap: 24 }}>
          {thesisPillars.map((p, i) => (
            <div key={i} style={{
              padding: 32, borderRadius: 16,
              background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <span style={{ fontSize: 32 }}>{p.icon}</span>
                <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>{p.title}</h3>
              </div>
              <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
                {p.points.map((pt, j) => (
                  <li key={j} style={{
                    padding: "8px 0 8px 20px", fontSize: 14, color: "rgba(255,255,255,0.65)",
                    lineHeight: 1.6, position: "relative",
                    borderBottom: j < p.points.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  }}>
                    <span style={{
                      position: "absolute", left: 0, top: 14,
                      width: 7, height: 7, borderRadius: "50%", background: "#22c55e",
                    }} />
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
        <hr style={{ border: "none", borderTop: "1px solid rgba(34,197,94,0.12)" }} />
      </div>

      {/* Unit Economics Comparison */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 20px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 900, margin: 0 }}>
            The <span style={{ color: "#22c55e" }}>Numbers</span> Speak
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 24, alignItems: "center", maxWidth: 900, margin: "0 auto" }}>
          {/* Traditional */}
          <div style={{
            padding: 32, borderRadius: 16, textAlign: "center",
            background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)",
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#ef4444", letterSpacing: 2, marginBottom: 12 }}>TRADITIONAL AGENCY</div>
            <div style={{ fontSize: 56, fontWeight: 900, color: "#ef4444" }}>$520</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>per policy cost</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", lineHeight: 2, textAlign: "left" as const }}>
              Lead Acquisition: $200<br />
              Agent Compensation: $188<br />
              Technology & Licensing: $38<br />
              Office & Compliance: $50<br />
              Management & Admin: $45
            </div>
          </div>

          {/* Arrow */}
          <div style={{ fontSize: 40, color: "#22c55e", fontWeight: 900 }}>→</div>

          {/* PolicyStore */}
          <div style={{
            padding: 32, borderRadius: 16, textAlign: "center",
            background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.2)",
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#22c55e", letterSpacing: 2, marginBottom: 12 }}>POLICYSTORE AUTONOMOUS</div>
            <div style={{ fontSize: 56, fontWeight: 900, color: "#22c55e" }}>$70</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>per policy cost</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", lineHeight: 2, textAlign: "left" as const }}>
              High-Intent Data: $25<br />
              Voice AI Minutes: $3<br />
              AI Agent Infrastructure: $18<br />
              Compliance & Licensing: $15<br />
              Cloud & Security: $9
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 32 }}>
          <span style={{
            display: "inline-block", background: "rgba(34,197,94,0.15)", color: "#22c55e",
            padding: "12px 32px", borderRadius: 30, fontSize: 16, fontWeight: 800,
            border: "1px solid rgba(34,197,94,0.3)",
          }}>
            86.5% Cost Reduction &bull; LTV:CAC of 10.6:1 &bull; 70% EBITDA Margins at Scale
          </span>
        </div>

        {/* Financial projections mini table */}
        <div style={{
          marginTop: 48, padding: 32, borderRadius: 16,
          background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
          maxWidth: 900, margin: "48px auto 0",
        }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20, textAlign: "center" as const }}>5-Year Financial Projections</h3>
          <div style={{ overflowX: "auto" as const }}>
            <table style={{ width: "100%", borderCollapse: "collapse" as const, fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid rgba(34,197,94,0.2)" }}>
                  <th style={{ textAlign: "left" as const, padding: "10px 12px", color: "#22c55e", fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>METRIC</th>
                  {["Year 1", "Year 2", "Year 3", "Year 4", "Year 5"].map(y => (
                    <th key={y} style={{ textAlign: "right" as const, padding: "10px 12px", color: "#22c55e", fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>{y.toUpperCase()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Policies Bound", vals: ["8,500", "42,000", "185,000", "520,000", "1,200,000"] },
                  { label: "Total Revenue", vals: ["$3.2M", "$17.6M", "$52.9M", "$146.1M", "$338.5M"], green: true },
                  { label: "EBITDA", vals: ["-$3.6M", "$5.2M", "$24.2M", "$87.9M", "$237.0M"] },
                  { label: "EBITDA Margin", vals: ["-112%", "30%", "46%", "60%", "70%"], green: true },
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "10px 12px", fontWeight: 600 }}>{row.label}</td>
                    {row.vals.map((v, j) => (
                      <td key={j} style={{
                        textAlign: "right" as const, padding: "10px 12px",
                        color: row.green ? "#22c55e" : v.startsWith("-") ? "#ef4444" : "rgba(255,255,255,0.7)",
                        fontWeight: 600,
                      }}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
        <hr style={{ border: "none", borderTop: "1px solid rgba(34,197,94,0.12)" }} />
      </div>

      {/* Path to Exit */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 20px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 900, margin: 0 }}>
            Path to <span style={{ color: "#22c55e" }}>$3B+ Exit</span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, maxWidth: 1000, margin: "0 auto" }}>
          {[
            { milestone: "Series A", timing: "Now", detail: "$10M at $300M", color: "#22c55e" },
            { milestone: "Series B", timing: "Month 18", detail: "$40M at $600M\n2x paper return", color: "#3b82f6" },
            { milestone: "Secondary", timing: "Month 24", detail: "Money off table\n2-3x partial liquidity", color: "#f59e0b" },
            { milestone: "Series C", timing: "Month 36", detail: "$100M at $1.2B\n4x paper return", color: "#8b5cf6" },
            { milestone: "PE Exit", timing: "Month 48-60", detail: "$3B+ acquisition\n10x+ full liquidity", color: "#E20608" },
          ].map(m => (
            <div key={m.milestone} style={{
              padding: 24, borderRadius: 14, textAlign: "center",
              background: "rgba(255,255,255,0.02)",
              borderTop: `4px solid ${m.color}`,
              border: `1px solid ${m.color}33`,
              borderTopWidth: 4,
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: m.color, letterSpacing: 1, marginBottom: 4 }}>{m.timing}</div>
              <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>{m.milestone}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", whiteSpace: "pre-line" as const, lineHeight: 1.6 }}>{m.detail}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
        <hr style={{ border: "none", borderTop: "1px solid rgba(34,197,94,0.12)" }} />
      </div>

      {/* Investor Materials */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 20px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 900, margin: 0 }}>
            Investor <span style={{ color: "#22c55e" }}>Materials</span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
          {investorDecks.map(d => (
            <a key={d.title} href={d.href} target="_blank" rel="noopener noreferrer"
              style={{
                display: "block", padding: 28, borderRadius: 14,
                background: "rgba(255,255,255,0.03)", border: `1px solid ${d.color}33`,
                textDecoration: "none", color: "#fff", transition: "all 0.25s ease",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = d.color;
                (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${d.color}22`;
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = `${d.color}33`;
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
                (e.currentTarget as HTMLElement).style.transform = "none";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{ background: d.color, color: "#fff", fontSize: 9, fontWeight: 800, padding: "3px 10px", borderRadius: 4, letterSpacing: 1 }}>{d.tag}</span>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{d.pages}</span>
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 8px" }}>{d.title}</h3>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: 1.6 }}>{d.desc}</p>
              <span style={{ display: "inline-block", marginTop: 14, fontSize: 12, color: d.color, fontWeight: 600 }}>
                VIEW DOCUMENT →
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
        <hr style={{ border: "none", borderTop: "1px solid rgba(34,197,94,0.12)" }} />
      </div>

      {/* FAQ Section */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "80px 20px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 900, margin: 0 }}>
            Frequently Asked <span style={{ color: "#22c55e" }}>Questions</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, marginTop: 8 }}>
            Deep research on why AI-powered insurance is the investment opportunity of the decade
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {faqItems.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  all: "unset", cursor: "pointer", width: "100%", boxSizing: "border-box",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "20px 24px", borderRadius: openFaq === i ? "12px 12px 0 0" : 12,
                  background: openFaq === i ? "rgba(34,197,94,0.08)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${openFaq === i ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.06)"}`,
                  borderBottom: openFaq === i ? "none" : undefined,
                  transition: "all 0.2s",
                }}
              >
                <span style={{ fontSize: 15, fontWeight: 600, paddingRight: 20, lineHeight: 1.4 }}>{faq.q}</span>
                <span style={{
                  fontSize: 20, color: "#22c55e", flexShrink: 0,
                  transform: openFaq === i ? "rotate(45deg)" : "none",
                  transition: "transform 0.2s",
                }}>+</span>
              </button>
              {openFaq === i && (
                <div style={{
                  padding: "20px 24px", borderRadius: "0 0 12px 12px",
                  background: "rgba(34,197,94,0.04)",
                  border: "1px solid rgba(34,197,94,0.2)",
                  borderTop: "none",
                }}>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.8, margin: 0 }}>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        background: "linear-gradient(135deg, #064e3b 0%, #1a365d 100%)",
        padding: "80px 20px", textAlign: "center",
      }}>
        <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 900, margin: "0 0 12px" }}>
          Ready to Invest in the Future of Insurance?
        </h2>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, maxWidth: 600, margin: "0 auto 32px" }}>
          $10M Series A at $300M pre-money. The first fully autonomous AI insurance agency. A clear path to $3B+ exit.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="mailto:jeff.cline@me.com?subject=PolicyStore%20Investment%20Inquiry"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#22c55e", color: "#fff", padding: "16px 36px",
              borderRadius: 10, fontWeight: 700, fontSize: 16, textDecoration: "none",
            }}
          >
            Contact for Investment Details
          </a>
          <a href="https://policystore.com/decks/pitch-deck.html" target="_blank" rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(255,255,255,0.1)", color: "#fff", padding: "16px 36px",
              borderRadius: 10, fontWeight: 700, fontSize: 16, textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            View Full Deck →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "30px 20px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>
          &copy; {new Date().getFullYear()} PolicyStore, Inc. &bull; Jeff Cline &bull; CONFIDENTIAL
        </p>
        <a href="https://jeff-cline.com" style={{ fontSize: 6, opacity: 0.08, color: "#999", textDecoration: "none" }}>JC</a>
      </footer>
    </div>
  );
}
