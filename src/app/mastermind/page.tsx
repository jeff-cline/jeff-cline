"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* ─── COLOR PALETTE ─── */
const C = {
  deepOcean: "#0A1628",
  caribbean: "#0891B2",
  caribbeanDark: "#065F7C",
  lagoon: "#06B6D4",
  seafoam: "#2DD4BF",
  palm: "#059669",
  sand: "#F5F0E8",
  coral: "#F97316",
  white: "#FFFFFF",
  gold: "#D4A843",
  darkText: "#0F172A",
  lightText: "#CBD5E1",
  pink: "#EC4899",
};

/* ─── TESTIMONIALS ─── */
const testimonials = [
  {
    name: "Dr. Annika",
    country: "Switzerland",
    text: "I have worked with some of the most celebrated minds in venture capital and private equity. Jeff operates on a different plane entirely. He sees the architecture of opportunity before anyone else even recognizes there is a building. Within seventy-two hours of our first session, he restructured my entire go-to-market and tripled our pipeline velocity. He is not a consultant — he is a force multiplier.",
    theme: "SHINING OBJECT",
  },
  {
    name: "Marcus",
    country: "United Kingdom",
    text: "What separates Jeff from every other advisor I have retained is the rare combination of deep technical fluency and an almost preternatural instinct for business mechanics. He built a predictive analytics engine for our firm in a weekend that outperformed the tool we paid a seven-figure contract for. Watching him work is like watching someone play chess while everyone else is playing checkers. Blindfolded.",
    theme: "AMAZING GEEK MIND",
  },
  {
    name: "Camila",
    country: "Brazil",
    text: "I came into the mastermind skeptical. I have an MBA from Wharton and twenty years in private markets. Jeff dismantled every assumption I had about customer acquisition in the first afternoon and replaced it with a system so elegant I was genuinely angry I had not seen it myself. He is the rarest breed — a technologist who thinks like a dealmaker and communicates like a poet.",
    theme: "GO FAST & GET STUFF DONE",
  },
  {
    name: "Takeshi",
    country: "Japan",
    text: "In my culture, we do not use the word genius lightly. Jeff earned it. His ability to move between AI architecture, capital markets strategy, and human psychology is something I have never witnessed in thirty years of building companies across Asia and North America. He is in his breakout season and anyone paying attention can feel the gravity of it.",
    theme: "GENIUS",
  },
  {
    name: "Dr. Ingrid",
    country: "Germany",
    text: "I have published four hundred peer-reviewed papers on organizational behavior. Jeff is the most compelling case study I have encountered of someone who integrates personal mastery with professional excellence. He is as disciplined in his health and relationships as he is in his deal flow. That coherence is what makes his mentorship so transformative — he does not just teach business, he models a life worth building.",
    theme: "PERSONAL & PROFESSIONAL SUCCESS",
  },
  {
    name: "Santiago",
    country: "Colombia",
    text: "Jeff helped us go from pre-revenue to a signed term sheet in eleven weeks. Eleven. His demand engine technology identified buyer intent signals we did not know existed, and his capital strategy connected us with family offices that actually deploy — not the ones that waste your time with coffee meetings. The man executes like he has something to prove to God. SUCCESS ON STEROIDS.",
    theme: "SUCCESS ON STEROIDS",
  },
  {
    name: "Priya",
    country: "India",
    text: "I flew fourteen hours to spend one week with Jeff. I would fly forty. He rebuilt our entire data infrastructure, identified three revenue streams we were leaving on the table, and personally walked me through an AI agent deployment that replaced a twelve-person operations team. GEEK POWER is real — and Jeff is its embodiment. He is an inspiration not because of what he has accomplished, but because of the velocity at which he is still accelerating.",
    theme: "GEEK POWER",
  },
];

/* ─── ROADMAP PHASES ─── */
const phases = [
  {
    num: "01",
    title: "DISCOVERY & DIAGNOSTIC",
    subtitle: "Where Are You Now?",
    desc: "Comprehensive audit of your business model, unit economics, technology stack, and competitive positioning. We identify the gap between where you are and where the market is moving.",
  },
  {
    num: "02",
    title: "OPPORTUNITY QUALIFICATION",
    subtitle: "Go / No-Go Framework",
    desc: "Lifetime value of customer versus cost per acquisition at scale. Data-driven decision architecture through MoneyWords.org. No gut feelings — only math that moves markets.",
  },
  {
    num: "03",
    title: "DEMAND ENGINE BUILD",
    subtitle: "Marketing Assets & Triggers",
    desc: "Proprietary demand engine deployment. Predictive analytics and visitor optimization with billions of real-time data points through el.ag. Marketing systems by jeff-cline.com. You do not chase customers — they find you.",
  },
  {
    num: "04",
    title: "OUTREACH & OPTIMIZATION",
    subtitle: "Scale What Works",
    desc: "Multi-channel outreach automation through VoiceDrips.com. Identify business levers that increase revenue and decrease expenses simultaneously. This is where compound growth begins.",
  },
  {
    num: "05",
    title: "AGENTIC OPERATIONS",
    subtitle: "AI Team Deployment",
    desc: "Deploy AI agents from agents.biz to handle back-office operations, risk mitigation, and process automation. Trained AI agents eliminate human error — the silent killer of companies and profit margins. Risk mitigation is not a feature, it is a survival strategy.",
  },
  {
    num: "06",
    title: "CAPITAL & EXIT ARCHITECTURE",
    subtitle: "Fund, Scale, Exit",
    desc: "Access our network of 400+ private family offices through multifamilyoffice.ai and softcircle.ai. Seed, growth, Series A through C. Build IP and systems along the way that increase your exit multiples. The exit strategy starts on day one.",
  },
];

/* ─── TOOL ECOSYSTEM ─── */
const tools = [
  { name: "MoneyWords.org", url: "https://moneywords.org", desc: "Opportunity Qualification & Decision Intelligence", detail: "Data-driven go/no-go frameworks. Qualify every opportunity by comparing customer lifetime value against cost per acquisition at scale. Eliminate guesswork from your most consequential business decisions.", why: "Because the difference between a $10M exit and a $100M exit is the quality of the opportunities you pursue." },
  { name: "el.ag", url: "https://el.ag", desc: "Big Data, Predictive Analytics & Visitor Optimization", detail: "Proprietary technology leveraging billions of connection points for real-time predictive analytics. Identify, optimize, and convert your highest-value visitors before your competitors know they exist.", why: "Because your website traffic contains intelligence worth millions — if you know how to extract it." },
  { name: "jeff-cline.com", url: "https://jeff-cline.com", desc: "Marketing Systems & Conversion Architecture", detail: "Full-stack marketing asset creation, trigger systems, demand engine infrastructure, and conversion architecture that turns attention into revenue.", why: "Because marketing without systems is just noise. Systems without marketing is just inventory." },
  { name: "VoiceDrips.com", url: "https://voicedrips.com", desc: "Outreach & Scale Optimization", detail: "Multi-channel automated outreach that scales without losing the human touch. Voice, SMS, email, and social — orchestrated for maximum conversion.", why: "Because the best product in the world fails in silence. Outreach at scale is how you break through." },
  { name: "agents.biz", url: "https://agents.biz", desc: "Agentic AI Team Members", detail: "Identify business levers to increase revenue and decrease expenses using AI-powered agentic team members. Back-office automation, risk mitigation, and operational AI that replaces entire departments.", why: "Because trained AI mitigates human error — the silent killer of companies and profit margins. This is not efficiency. This is survival." },
  { name: "multifamilyoffice.ai", url: "https://multifamilyoffice.ai", desc: "Capital Access & Family Office Network", detail: "Direct access to a network of 400+ private family offices for funding, strategic partnerships, and deal flow. Real capital from real deployers.", why: "Because the best business plan means nothing without the capital to execute it at the speed the market demands." },
  { name: "softcircle.ai", url: "https://softcircle.ai", desc: "Family Office Services & Funding Pipeline", detail: "Soft circling, investor discovery, and structured funding pathways for seed, growth, Series A/B/C. Purpose-built for founders seeking institutional capital.", why: "Because raising capital is a process, not an event — and most founders approach it backwards." },
];

/* ─── FAQ ─── */
const faqs = [
  {
    q: "What distinguishes this mastermind from programs offered by YPO, EO, or the C-Suite Network?",
    a: "Those organizations provide peer forums — valuable, but fundamentally different. This is a working immersion with a single operator who has built, scaled, and exited four times. You are not sitting in a circle sharing challenges. You are building systems, deploying technology, and restructuring your business in real time with someone who has done it at scale across dozens of companies. The Caribbean island setting eliminates distractions and creates the cognitive space required for breakthrough work.",
  },
  {
    q: "Why does the 3-month cohort cost $100,000? How is that justified?",
    a: "The technology stack alone — if licensed independently — would cost $7,500 to $15,000 per month. Six months of post-program access represents $45,000 to $90,000 in tool value. Add 90 days of daily, hands-on strategy sessions, capital introductions to family offices, AI agent deployment, exit architecture, and full island accommodations. The question is not whether $100,000 is justified. The question is what it costs you to spend another year without these systems in place.",
  },
  {
    q: "What kind of businesses benefit most from this program?",
    a: "Businesses generating $500K to $50M in annual revenue that have validated their model but need sophisticated systems for scale, capital strategy, and exit planning. We have worked with SaaS founders, professional service firms, e-commerce operators, healthcare companies, real estate portfolios, and deep-tech startups. The common denominator is a founder who recognizes that the next phase of growth requires a fundamentally different operating system.",
  },
  {
    q: "Is the Caribbean island location logistically practical for a serious business program?",
    a: "It is strategically essential. Research in environmental psychology consistently demonstrates that novel, low-stimulus environments dramatically improve executive function, creative problem-solving, and strategic thinking. Every major decision-maker — from heads of state to Fortune 100 CEOs — conducts their most important strategic work in isolated, distraction-free environments. The island is not an amenity. It is a cognitive advantage.",
  },
  {
    q: "What happens after the program ends? Is there ongoing support?",
    a: "You retain full access to the technology ecosystem for six months post-program, valued at $7,500 to $15,000 per month. Redline pricing is available for continued access beyond that window. Additionally, all IP, systems, and processes built during the program are yours permanently. You also gain lifetime access to the alumni network and priority consideration for capital introductions through our family office network.",
  },
  {
    q: "How do you handle confidentiality? I cannot discuss my business openly.",
    a: "Every participant signs a comprehensive NDA before arrival. The cohort model is capped at five people specifically to maintain intimacy and trust. Jeff personally vets every applicant — not just for business readiness, but for character alignment. In over a decade of running high-level programs, there has never been a confidentiality breach. Your IP, strategy, and financials are sacred.",
  },
  {
    q: "What is the application process? Can I just pay and attend?",
    a: "No. This is an application-only program. After submitting your initial information, you will complete a comprehensive readiness assessment covering business metrics, personal growth orientation, and strategic clarity. This assessment generates a Readiness Report that determines mutual fit. Approximately 30% of applicants are accepted. We protect the quality of the cohort as aggressively as we protect the quality of the program.",
  },
  {
    q: "Can I bring a business partner or co-founder?",
    a: "Yes, and we encourage it for the 3-month cohort. Co-founders who go through the program together implement at roughly twice the velocity of solo participants. Each person requires a separate application and fee, but co-founder pairs receive priority consideration.",
  },
  {
    q: "What is the typical ROI participants report after the program?",
    a: "We do not make specific ROI guarantees — anyone who does is lying to you. What we can tell you is that participants have reported outcomes ranging from 3x revenue growth within 12 months, successful Series A raises, acquisition offers at multiples they did not think were possible, and — perhaps most importantly — a complete restructuring of how they think about business as a system rather than a series of tasks.",
  },
  {
    q: "I am already successful. Why would I need a mastermind?",
    a: "That is precisely the point. This program is not for people trying to find product-market fit. It is for people who have already proven their model and need the technology infrastructure, capital relationships, and operational systems to move from successful to dominant. The gap between $5M and $50M is not effort — it is architecture. That is what we build.",
  },
  {
    q: "What does 'agentic AI team members' mean in practical terms?",
    a: "It means deploying AI systems that do not just answer questions — they execute tasks, make decisions within defined parameters, and operate as functional team members. Think of an AI that handles your entire accounts receivable process, an agent that monitors market conditions and adjusts your pricing in real time, or a system that qualifies leads, schedules meetings, and prepares briefing documents — all without human intervention. We deploy these during the program and you keep them.",
  },
  {
    q: "How is the readiness assessment scored? What determines acceptance?",
    a: "The assessment evaluates five dimensions: business viability and growth trajectory, personal development orientation, professional ambition and execution history, mental resilience and adaptability, and financial capacity to implement at scale. There is no single disqualifying factor — we are looking for the gestalt. The assessment is designed to identify founders who will extract maximum value from the program and contribute meaningfully to the cohort dynamic.",
  },
];

/* ─── MAIN PAGE ─── */
export default function MastermindPage() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", company: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => setTestimonialIdx((i) => (i + 1) % testimonials.length), 6000);
    return () => clearInterval(t);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch("/api/mastermind", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, interest: "mastermind-landing" }),
      });
      setSubmitted(true);
    } catch {
      alert("Something went wrong. Please try again.");
    }
    setSubmitting(false);
  };

  const openForm = () => {
    setShowForm(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "14px 16px",
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "8px", color: C.white, fontSize: "16px", fontFamily: "Georgia, serif",
    outline: "none", boxSizing: "border-box" as const,
  };

  return (
    <div style={{ background: C.deepOcean, color: C.white, fontFamily: "'Georgia', 'Times New Roman', serif", minHeight: "100vh", overflowX: "hidden" }}>

      {/* ═══ HERO ═══ */}
      <section style={{
        position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center", textAlign: "center", padding: "40px 20px",
        background: `linear-gradient(180deg, ${C.deepOcean} 0%, #0C2D48 40%, #0A3D5C 70%, ${C.deepOcean} 100%)`,
      }}>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "120px", background: `linear-gradient(0deg, ${C.deepOcean}, transparent)`, zIndex: 1 }} />
        <div style={{ position: "relative", zIndex: 2, maxWidth: "900px" }}>
          <p style={{ letterSpacing: "8px", fontSize: "14px", color: C.seafoam, marginBottom: "20px", fontFamily: "sans-serif", textTransform: "uppercase" }}>
            By Invitation &middot; Caribbean Island &middot; Limited to 5
          </p>
          <h1 style={{ fontSize: "clamp(48px, 8vw, 96px)", fontWeight: 300, lineHeight: 1.05, letterSpacing: "-2px", margin: "0 0 24px 0" }}>
            MASTERMIND
          </h1>
          <div style={{ width: "80px", height: "2px", background: `linear-gradient(90deg, ${C.caribbean}, ${C.seafoam})`, margin: "0 auto 24px" }} />
          <p style={{ fontSize: "clamp(18px, 2.5vw, 28px)", fontWeight: 300, lineHeight: 1.6, color: C.lightText, maxWidth: "700px", margin: "0 auto 40px" }}>
            An immersive experience in building, scaling, and exiting businesses at the intersection of technology, capital, and relentless execution.
          </p>
          <p style={{ fontSize: "16px", color: C.gold, letterSpacing: "3px", fontFamily: "sans-serif", textTransform: "uppercase" }}>
            Success on Steroids &middot; Geek Power &middot; Go Fast & Get It Done
          </p>
        </div>
        {/* Palm silhouettes */}
        <svg style={{ position: "absolute", bottom: "60px", left: "5%", opacity: 0.06, zIndex: 0 }} width="200" height="300" viewBox="0 0 200 300">
          <path d="M100 300 L100 120 Q60 80 20 40 Q60 90 100 110 Q80 50 40 10 Q80 70 100 110 Q120 50 160 10 Q120 70 100 110 Q140 80 180 40 Q140 90 100 120" fill={C.palm} />
        </svg>
        <svg style={{ position: "absolute", bottom: "60px", right: "5%", opacity: 0.06, zIndex: 0, transform: "scaleX(-1)" }} width="200" height="300" viewBox="0 0 200 300">
          <path d="M100 300 L100 120 Q60 80 20 40 Q60 90 100 110 Q80 50 40 10 Q80 70 100 110 Q120 50 160 10 Q120 70 100 110 Q140 80 180 40 Q140 90 100 120" fill={C.palm} />
        </svg>
      </section>

      {/* ═══ THE PREMISE ═══ */}
      <section style={{ maxWidth: "800px", margin: "0 auto", padding: "80px 20px", textAlign: "center" }}>
        <h2 style={{ fontSize: "14px", letterSpacing: "6px", color: C.seafoam, marginBottom: "30px", fontFamily: "sans-serif", textTransform: "uppercase" }}>The Premise</h2>
        <p style={{ fontSize: "22px", lineHeight: 1.8, color: C.lightText, fontWeight: 300 }}>
          You have built something real. Now you need proximity to someone who has built, scaled, and exited
          <span style={{ color: C.gold }}> four times</span> — and launched dozens of businesses with the technology, systems, and capital strategies that most founders spend a decade searching for.
        </p>
        <p style={{ fontSize: "22px", lineHeight: 1.8, color: C.lightText, fontWeight: 300, marginTop: "24px" }}>
          This is not a conference. There are no name badges. No buffet lines. This is a private, working immersion on a Caribbean island with a founder who operates at the intersection of
          <span style={{ color: C.caribbean }}> geek power</span> and
          <span style={{ color: C.coral }}> deal flow</span>.
        </p>
      </section>

      {/* ═══ SCALE & EXIT FEATURE BOX ═══ */}
      <section style={{ padding: "0 20px 80px" }}>
        <div style={{
          maxWidth: "900px", margin: "0 auto",
          background: `linear-gradient(135deg, rgba(8,145,178,0.12), rgba(249,115,22,0.08))`,
          border: `2px solid ${C.caribbean}`,
          borderRadius: "20px", padding: "60px 40px", textAlign: "center",
        }}>
          <p style={{ fontSize: "14px", letterSpacing: "6px", color: C.coral, fontFamily: "sans-serif", textTransform: "uppercase", marginBottom: "16px" }}>What You Get</p>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 300, lineHeight: 1.3, marginBottom: "24px" }}>
            Every Tool Used to <span style={{ color: C.coral }}>Scale & Exit 4 Times</span> and Launch Dozens of Businesses
          </h2>
          <p style={{ fontSize: "18px", lineHeight: 1.8, color: C.lightText, maxWidth: "700px", margin: "0 auto 32px" }}>
            Both the 1-week immersion and the 3-month cohort include full access to the proprietary technology ecosystem — the same systems, frameworks, and infrastructure that generated over $500M in revenue across 100+ companies. This is not theory. These are the exact tools running in production right now.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "40px", flexWrap: "wrap" }}>
            {[
              { num: "4x", label: "Exits" },
              { num: "100+", label: "Companies Built" },
              { num: "$500M+", label: "Revenue Generated" },
              { num: "7", label: "Proprietary Tools" },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "36px", fontWeight: 300, color: C.caribbean }}>{s.num}</div>
                <div style={{ fontSize: "12px", letterSpacing: "2px", color: C.lightText, fontFamily: "sans-serif", textTransform: "uppercase" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS CAROUSEL ═══ */}
      <section style={{ padding: "80px 20px", background: `linear-gradient(180deg, transparent, rgba(8,145,178,0.08), transparent)` }}>
        <h2 style={{ fontSize: "14px", letterSpacing: "6px", color: C.seafoam, textAlign: "center", marginBottom: "50px", fontFamily: "sans-serif", textTransform: "uppercase" }}>What They Say</h2>
        <div style={{ maxWidth: "700px", margin: "0 auto", minHeight: "320px", position: "relative" }}>
          {testimonials.map((t, i) => (
            <div key={i} style={{
              position: i === testimonialIdx ? "relative" : "absolute",
              top: 0, left: 0, right: 0,
              opacity: i === testimonialIdx ? 1 : 0,
              transition: "opacity 1s ease", textAlign: "center", padding: "0 20px",
            }}>
              <p style={{ fontSize: "12px", letterSpacing: "4px", color: C.coral, fontFamily: "sans-serif", marginBottom: "20px" }}>{t.theme}</p>
              <p style={{ fontSize: "20px", lineHeight: 1.8, color: C.lightText, fontStyle: "italic", fontWeight: 300 }}>
                &ldquo;{t.text}&rdquo;
              </p>
              <p style={{ marginTop: "24px", color: C.gold, fontSize: "16px", fontFamily: "sans-serif", letterSpacing: "2px" }}>
                {t.name} &middot; {t.country}
              </p>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "30px" }}>
          {testimonials.map((_, i) => (
            <button key={i} onClick={() => setTestimonialIdx(i)} style={{
              width: i === testimonialIdx ? "24px" : "8px", height: "8px", borderRadius: "4px",
              border: "none", cursor: "pointer",
              background: i === testimonialIdx ? C.caribbean : "rgba(255,255,255,0.2)",
              transition: "all 0.3s ease",
            }} />
          ))}
        </div>
      </section>

      {/* ═══ ROADMAP ═══ */}
      <section style={{ padding: "80px 20px", maxWidth: "800px", margin: "0 auto" }}>
        <h2 style={{ fontSize: "14px", letterSpacing: "6px", color: C.seafoam, textAlign: "center", marginBottom: "16px", fontFamily: "sans-serif", textTransform: "uppercase" }}>The Roadmap</h2>
        <p style={{ textAlign: "center", fontSize: "22px", fontWeight: 300, color: C.lightText, marginBottom: "16px" }}>
          We will meet your business where it is at.
        </p>
        <p style={{ textAlign: "center", fontSize: "16px", color: C.gold, marginBottom: "60px", fontFamily: "sans-serif" }}>
          Everyone goes through the same process — you are simply in one of these phases.
        </p>
        <div style={{ textAlign: "center", marginBottom: "60px", padding: "24px", background: "rgba(212,168,67,0.08)", border: `1px solid ${C.gold}`, borderRadius: "12px" }}>
          <p style={{ fontSize: "18px", color: C.white }}>Technology worth <span style={{ color: C.gold, fontWeight: 700 }}>$7,500 — $15,000/month</span> included for 6 months</p>
          <p style={{ fontSize: "14px", color: C.lightText, marginTop: "8px" }}>Plus Redline pricing for continued access if applicable</p>
        </div>
        {phases.map((phase) => (
          <div key={phase.num} style={{ display: "flex", gap: "24px", marginBottom: "48px", alignItems: "flex-start" }}>
            <div style={{
              minWidth: "64px", height: "64px", borderRadius: "50%",
              background: `linear-gradient(135deg, ${C.caribbean}, ${C.seafoam})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "sans-serif", fontWeight: 900, fontSize: "20px", color: C.deepOcean, flexShrink: 0,
            }}>{phase.num}</div>
            <div>
              <h3 style={{ fontSize: "18px", fontFamily: "sans-serif", fontWeight: 700, color: C.white, marginBottom: "4px" }}>{phase.title}</h3>
              <p style={{ fontSize: "14px", color: C.gold, letterSpacing: "2px", fontFamily: "sans-serif", textTransform: "uppercase", marginBottom: "8px" }}>{phase.subtitle}</p>
              <p style={{ fontSize: "16px", lineHeight: 1.7, color: C.lightText }}>{phase.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ═══ TOOLS ECOSYSTEM ═══ */}
      <section style={{ padding: "80px 20px", maxWidth: "1000px", margin: "0 auto" }}>
        <h2 style={{ fontSize: "14px", letterSpacing: "6px", color: C.seafoam, textAlign: "center", marginBottom: "16px", fontFamily: "sans-serif", textTransform: "uppercase" }}>Your Arsenal</h2>
        <p style={{ textAlign: "center", fontSize: "28px", fontWeight: 300, color: C.white, marginBottom: "60px" }}>
          The Technology Ecosystem That Powers Everything
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
          {tools.map((tool) => (
            <div key={tool.name} style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px", padding: "32px 24px", transition: "border-color 0.3s, transform 0.3s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.caribbean; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <a href={tool.url} target="_blank" rel="noopener noreferrer" style={{ color: C.caribbean, fontSize: "18px", fontFamily: "sans-serif", fontWeight: 700, textDecoration: "none" }}>
                {tool.name}
              </a>
              <p style={{ color: C.gold, fontSize: "13px", letterSpacing: "2px", marginTop: "8px", fontFamily: "sans-serif", textTransform: "uppercase" }}>{tool.desc}</p>
              <p style={{ color: C.lightText, fontSize: "15px", lineHeight: 1.6, marginTop: "12px" }}>{tool.detail}</p>
            </div>
          ))}
        </div>
        <div style={{
          marginTop: "40px",
          background: `linear-gradient(135deg, rgba(8,145,178,0.15), rgba(5,150,105,0.15))`,
          border: `1px solid ${C.caribbean}`, borderRadius: "12px", padding: "32px", textAlign: "center",
        }}>
          <p style={{ fontSize: "20px", color: C.white, fontWeight: 300, lineHeight: 1.6 }}>
            Risk mitigation is not a line item — it is the <span style={{ color: C.coral, fontWeight: 700 }}>defining feature</span>. Trained AI agents eliminate human error, the silent killer of companies and profit margins. You leave with systems that protect you long after the program ends.
          </p>
        </div>
      </section>

      {/* ═══ EXIT MULTIPLIER FEATURE ═══ */}
      <section style={{ padding: "80px 20px", background: `linear-gradient(180deg, transparent, rgba(212,168,67,0.06), transparent)` }}>
        <div style={{
          maxWidth: "800px", margin: "0 auto", textAlign: "center",
          border: `1px solid ${C.gold}`, borderRadius: "16px", padding: "60px 40px", background: "rgba(212,168,67,0.03)",
        }}>
          <p style={{ fontSize: "14px", letterSpacing: "6px", color: C.gold, marginBottom: "20px", fontFamily: "sans-serif", textTransform: "uppercase" }}>The Exit Advantage</p>
          <h2 style={{ fontSize: "32px", fontWeight: 300, lineHeight: 1.4, marginBottom: "24px" }}>
            Build IP and Systems That <span style={{ color: C.gold }}>Increase Your Multiples</span> at Exit
          </h2>
          <p style={{ fontSize: "18px", lineHeight: 1.8, color: C.lightText, fontWeight: 300 }}>
            Every tool, system, and process you build during the mastermind becomes proprietary intellectual property that travels with you. At exit, acquirers do not just value revenue — they value defensible systems, automated operations, and data infrastructure. We build those from day one so that when the moment comes, your multiples reflect the machine you have constructed, not just the revenue it produces.
          </p>
        </div>
      </section>

      {/* ═══ PRICING GATE ═══ */}
      <section id="pricing" style={{ padding: "80px 20px", textAlign: "center" }}>
        <h2 style={{ fontSize: "14px", letterSpacing: "6px", color: C.seafoam, marginBottom: "40px", fontFamily: "sans-serif", textTransform: "uppercase" }}>Experience Options</h2>

        {!showForm ? (
          <div style={{ maxWidth: "700px", margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", marginBottom: "40px" }}>
              <div style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "16px", padding: "40px 24px", position: "relative", overflow: "hidden",
              }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, ${C.caribbean}, ${C.seafoam})` }} />
                <p style={{ fontSize: "13px", letterSpacing: "4px", color: C.seafoam, fontFamily: "sans-serif", textTransform: "uppercase" }}>1-Week Immersion</p>
                <p style={{ fontSize: "42px", fontWeight: 300, margin: "16px 0 8px", color: C.white }}>
                  <span style={{ fontSize: "20px", color: C.lightText }}>Details upon</span><br />request
                </p>
                <p style={{ fontSize: "14px", color: C.lightText, lineHeight: 1.6 }}>
                  7 days of intensive strategy, system builds, and 1-on-1 working sessions on a private Caribbean island.
                </p>
              </div>
              <div style={{
                background: "rgba(212,168,67,0.05)", border: `1px solid ${C.gold}`,
                borderRadius: "16px", padding: "40px 24px", position: "relative", overflow: "hidden",
              }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, ${C.gold}, ${C.coral})` }} />
                <p style={{ fontSize: "13px", letterSpacing: "4px", color: C.gold, fontFamily: "sans-serif", textTransform: "uppercase" }}>90-Day Cohort</p>
                <p style={{ fontSize: "42px", fontWeight: 300, margin: "16px 0 8px", color: C.white }}>
                  <span style={{ fontSize: "20px", color: C.lightText }}>Details upon</span><br />request
                </p>
                <p style={{ fontSize: "14px", color: C.lightText, lineHeight: 1.6 }}>
                  Live on the island for 3 months. Up to 5 people, coed. Total business transformation with daily access.
                </p>
                <p style={{ marginTop: "12px", fontSize: "12px", letterSpacing: "3px", color: C.gold, fontFamily: "sans-serif", textTransform: "uppercase" }}>Most Transformative</p>
              </div>
            </div>
            <p style={{ fontSize: "16px", color: C.lightText, marginBottom: "32px", lineHeight: 1.6 }}>
              Both programs include full access to the technology ecosystem ($7,500—$15,000/mo value) for 6 months post-program, plus redline pricing if applicable.
            </p>
            <button onClick={openForm} style={{
              background: `linear-gradient(135deg, ${C.pink}, #D946EF)`,
              color: C.white, border: "none", padding: "20px 56px", fontSize: "18px",
              fontFamily: "sans-serif", fontWeight: 700, letterSpacing: "4px", textTransform: "uppercase",
              borderRadius: "8px", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = `0 8px 32px rgba(236,72,153,0.4)`; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              Get More Information
            </button>
          </div>
        ) : (
          <div ref={formRef} style={{ maxWidth: "560px", margin: "0 auto" }}>
            {!submitted ? (
              <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
                <h3 style={{ fontSize: "24px", fontWeight: 300, textAlign: "center", marginBottom: "8px" }}>
                  Get More Information
                </h3>
                <p style={{ textAlign: "center", fontSize: "14px", color: C.lightText, marginBottom: "32px" }}>
                  Complete the form below to unlock full pricing and begin the application process.
                </p>
                {[
                  { key: "name", label: "Full Name", type: "text" },
                  { key: "phone", label: "Phone Number", type: "tel" },
                  { key: "email", label: "Email Address", type: "email" },
                  { key: "company", label: "Business Name", type: "text" },
                ].map((f) => (
                  <div key={f.key} style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "12px", letterSpacing: "3px", color: C.seafoam, marginBottom: "8px", fontFamily: "sans-serif", textTransform: "uppercase" }}>
                      {f.label} *
                    </label>
                    <input type={f.type} required value={(formData as any)[f.key]}
                      onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                      style={inputStyle} />
                  </div>
                ))}
                <button type="submit" disabled={submitting} style={{
                  width: "100%", background: `linear-gradient(135deg, ${C.pink}, #D946EF)`,
                  color: C.white, border: "none", padding: "18px", fontSize: "16px",
                  fontFamily: "sans-serif", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase",
                  borderRadius: "8px", cursor: submitting ? "wait" : "pointer", opacity: submitting ? 0.7 : 1,
                }}>
                  {submitting ? "Submitting..." : "Unlock Pricing & Apply"}
                </button>
              </form>
            ) : (
              <div>
                <p style={{ fontSize: "14px", letterSpacing: "4px", color: C.seafoam, fontFamily: "sans-serif", textTransform: "uppercase", marginBottom: "24px" }}>
                  Welcome, {formData.name.split(" ")[0]}. Here are the details.
                </p>
                <div style={{
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "16px", padding: "40px 32px", marginBottom: "24px", textAlign: "left",
                }}>
                  <p style={{ fontSize: "13px", letterSpacing: "4px", color: C.seafoam, fontFamily: "sans-serif", textTransform: "uppercase", marginBottom: "12px" }}>1-Week Immersion</p>
                  <p style={{ fontSize: "48px", fontWeight: 300, color: C.white, marginBottom: "16px" }}>$35,000</p>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "15px", color: C.lightText, lineHeight: 2 }}>
                    <li>✦ 7 days on a private Caribbean island</li>
                    <li>✦ 1-on-1 strategy and system build sessions daily</li>
                    <li>✦ Full technology ecosystem access (6 months)</li>
                    <li>✦ Accommodations and meals included</li>
                    <li>✦ Roadmap and implementation plan at completion</li>
                  </ul>
                </div>
                <div style={{
                  background: "rgba(212,168,67,0.05)", border: `1px solid ${C.gold}`,
                  borderRadius: "16px", padding: "40px 32px", textAlign: "left",
                }}>
                  <p style={{ fontSize: "13px", letterSpacing: "4px", color: C.gold, fontFamily: "sans-serif", textTransform: "uppercase", marginBottom: "12px" }}>90-Day Cohort</p>
                  <p style={{ fontSize: "48px", fontWeight: 300, color: C.white, marginBottom: "16px" }}>$100,000</p>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "15px", color: C.lightText, lineHeight: 2 }}>
                    <li>✦ Live on the island for 90 days</li>
                    <li>✦ Up to 5 people, coed cohort</li>
                    <li>✦ Daily working sessions and real-time business transformation</li>
                    <li>✦ Full technology ecosystem access (6 months + redline)</li>
                    <li>✦ All accommodations, meals, and island logistics</li>
                    <li>✦ Exit strategy architecture and capital introductions</li>
                  </ul>
                </div>
                <div style={{ marginTop: "32px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                  <Link href="/deck"
                    style={{
                      display: "inline-block", background: `linear-gradient(135deg, ${C.coral}, #DC2626)`,
                      color: C.white, padding: "20px 56px", fontSize: "18px", fontFamily: "sans-serif",
                      fontWeight: 700, letterSpacing: "4px", textTransform: "uppercase", borderRadius: "8px",
                      textDecoration: "none", transition: "transform 0.2s", boxShadow: "0 8px 32px rgba(249,115,22,0.4)",
                    }}>
                    APPLY NOW →
                  </Link>
                  <p style={{ marginTop: "8px", fontSize: "14px", color: C.lightText }}>
                    Complete the readiness assessment to determine your fit for the program.
                  </p>
                  <Link href={`/mastermind/apply?name=${encodeURIComponent(formData.name)}&email=${encodeURIComponent(formData.email)}&phone=${encodeURIComponent(formData.phone)}&company=${encodeURIComponent(formData.company)}`}
                    style={{
                      display: "inline-block", background: `linear-gradient(135deg, ${C.caribbean}, ${C.seafoam})`,
                      color: C.deepOcean, padding: "14px 36px", fontSize: "14px", fontFamily: "sans-serif",
                      fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", borderRadius: "8px",
                      textDecoration: "none", transition: "transform 0.2s", opacity: 0.7,
                    }}>
                    Or Quick Apply →
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ═══ TOOLBOX ACCESS ═══ */}
      <section style={{ padding: "80px 20px", background: `linear-gradient(180deg, transparent, rgba(8,145,178,0.06), transparent)` }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <p style={{ fontSize: "14px", letterSpacing: "6px", color: C.coral, fontFamily: "sans-serif", textTransform: "uppercase", marginBottom: "16px" }}>Toolbox Access</p>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 300, marginBottom: "16px" }}>
              For 6 Months — Up to <span style={{ color: C.gold }}>$75,000</span> in Credits
            </h2>
            <p style={{ fontSize: "16px", color: C.lightText, maxWidth: "600px", margin: "0 auto" }}>
              Every mastermind participant receives full access to the proprietary technology ecosystem that powers our portfolio companies.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
            {tools.map((tool) => (
              <div key={tool.name} style={{
                background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "16px", padding: "32px 24px", display: "flex", flexDirection: "column",
              }}>
                <h3 style={{ fontSize: "20px", fontFamily: "sans-serif", fontWeight: 700, color: C.caribbean, marginBottom: "8px" }}>{tool.name}</h3>
                <p style={{ fontSize: "13px", letterSpacing: "2px", color: C.gold, fontFamily: "sans-serif", textTransform: "uppercase", marginBottom: "12px" }}>{tool.desc}</p>
                <p style={{ fontSize: "15px", lineHeight: 1.6, color: C.lightText, marginBottom: "12px", flex: 1 }}>{tool.detail}</p>
                <p style={{ fontSize: "14px", lineHeight: 1.6, color: C.seafoam, fontStyle: "italic", marginBottom: "16px" }}>{tool.why}</p>
                <a href={tool.url} target="_blank" rel="noopener noreferrer" style={{
                  display: "inline-block", padding: "10px 20px", background: "rgba(8,145,178,0.15)",
                  border: `1px solid ${C.caribbean}`, borderRadius: "8px", color: C.caribbean,
                  textDecoration: "none", fontFamily: "sans-serif", fontWeight: 700, fontSize: "13px",
                  letterSpacing: "2px", textTransform: "uppercase", textAlign: "center",
                  transition: "background 0.3s",
                }}>
                  Visit Tool →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section style={{ padding: "80px 20px", maxWidth: "800px", margin: "0 auto" }}>
        <h2 style={{ fontSize: "14px", letterSpacing: "6px", color: C.seafoam, textAlign: "center", marginBottom: "16px", fontFamily: "sans-serif", textTransform: "uppercase" }}>Frequently Asked Questions</h2>
        <p style={{ textAlign: "center", fontSize: "22px", fontWeight: 300, color: C.lightText, marginBottom: "60px" }}>
          The questions serious candidates ask.
        </p>
        <div>
          {faqs.map((faq, i) => (
            <div key={i} style={{
              borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: "0",
            }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
                width: "100%", textAlign: "left", background: "none", border: "none",
                padding: "24px 0", cursor: "pointer", color: C.white, display: "flex",
                justifyContent: "space-between", alignItems: "center", gap: "16px",
              }}>
                <span style={{ fontSize: "17px", fontFamily: "Georgia, serif", lineHeight: 1.5 }}>{faq.q}</span>
                <span style={{ fontSize: "24px", color: C.caribbean, flexShrink: 0, transition: "transform 0.3s", transform: openFaq === i ? "rotate(45deg)" : "rotate(0)" }}>+</span>
              </button>
              <div style={{
                maxHeight: openFaq === i ? "500px" : "0", overflow: "hidden",
                transition: "max-height 0.4s ease", paddingBottom: openFaq === i ? "24px" : "0",
              }}>
                <p style={{ fontSize: "16px", lineHeight: 1.8, color: C.lightText }}>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section style={{ padding: "80px 20px", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 300, marginBottom: "24px" }}>
          The Next Phase of Your Business Starts Here
        </h2>
        <p style={{ fontSize: "18px", color: C.lightText, maxWidth: "600px", margin: "0 auto 32px", lineHeight: 1.6 }}>
          Limited to 5 participants per cohort. Application required.
        </p>
        <button onClick={() => { const el = document.getElementById("pricing"); el?.scrollIntoView({ behavior: "smooth" }); }}
          style={{
            background: `linear-gradient(135deg, ${C.pink}, #D946EF)`,
            color: C.white, border: "none", padding: "20px 56px", fontSize: "18px",
            fontFamily: "sans-serif", fontWeight: 700, letterSpacing: "4px", textTransform: "uppercase",
            borderRadius: "8px", cursor: "pointer",
          }}>
          Get More Information
        </button>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ padding: "40px 20px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", fontFamily: "sans-serif" }}>
          &copy; {new Date().getFullYear()} Jeff Cline. All rights reserved.
        </p>
        <a href="https://jeff-cline.com" style={{ fontSize: "6px", opacity: 0.08, color: C.lightText, textDecoration: "none" }}>JC</a>
      </footer>
    </div>
  );
}
