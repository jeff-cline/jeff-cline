"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

const QUESTIONS = [
  { category: "Visionary Capacity & Strategic Foresight", question: "How would you describe your 10-year moonshot vision for wealth creation and market impact?", options: [{ text: "I focus primarily on near-term income goals and monthly cash flow stability", score: 1 }, { text: "I have a general sense of where I want to be financially in a decade", score: 2 }, { text: "I maintain a detailed 10-year roadmap with paradigm-shifting milestones and exponential growth targets", score: 3 }, { text: "My vision operates on macro-convergence timelines — I'm architecting category-defining plays that reshape entire industries over the next decade", score: 4 }] },
  { category: "Visionary Capacity & Strategic Foresight", question: "When evaluating market disruption opportunities, how do you identify asymmetric alpha?", options: [{ text: "I follow trending investments and popular financial advice", score: 1 }, { text: "I research sectors and look for undervalued opportunities", score: 2 }, { text: "I systematically scan for asymmetric risk-reward setups across multiple macro themes", score: 3 }, { text: "I deploy proprietary frameworks for identifying paradigm-shifting inflection points before consensus forms — capturing asymmetric alpha at the earliest signal", score: 4 }] },
  { category: "Visionary Capacity & Strategic Foresight", question: "How prepared is your lifestyle infrastructure for global mobility and private aviation-level operations?", options: [{ text: "I operate locally and haven't considered global mobility infrastructure", score: 1 }, { text: "I travel occasionally for business but lack systematic global positioning", score: 2 }, { text: "I have multi-jurisdictional awareness and am building toward location-independent operations", score: 3 }, { text: "My life is architected for frictionless global mobility — tax optimization, residency planning, private aviation access, and operational continuity across any geography", score: 4 }] },
  { category: "Visionary Capacity & Strategic Foresight", question: "How do you approach macro-convergence — the intersection of technological, demographic, and economic mega-trends?", options: [{ text: "I don't typically think in terms of converging macro trends", score: 1 }, { text: "I'm aware of major trends but struggle to synthesize them into actionable strategy", score: 2 }, { text: "I actively map convergence zones and position capital at exponential intersection points", score: 3 }, { text: "I maintain a living thesis on macro-convergence dynamics, adjusting portfolio exposure and venture allocation in real-time as paradigm shifts crystallize", score: 4 }] },
  { category: "Capital Architecture & Wealth Velocity", question: "How sophisticated is your capital stack across asset classes, vehicles, and time horizons?", options: [{ text: "My wealth is concentrated in one or two asset classes with limited diversification", score: 1 }, { text: "I have a diversified portfolio but haven't optimized for velocity of capital across the stack", score: 2 }, { text: "I architect multi-layered capital structures spanning liquid, illiquid, and alternative assets with intentional velocity optimization", score: 3 }, { text: "My compounding infrastructure is a multi-generational wealth architecture — tax-advantaged vehicles, carried interest positions, GP stakes, and programmatic deployment across vintage years", score: 4 }] },
  { category: "Capital Architecture & Wealth Velocity", question: "How do you think about leverage at scale — using other people's money, time, and expertise?", options: [{ text: "I primarily use my own capital and time for everything", score: 1 }, { text: "I use some debt financing but mostly rely on personal resources", score: 2 }, { text: "I systematically deploy leverage across capital, talent, and technology to amplify returns", score: 3 }, { text: "I engineer velocity of capital through layered leverage — non-recourse debt, LP commitments, strategic co-investments, and compounding infrastructure that multiplies every dollar deployed", score: 4 }] },
  { category: "Capital Architecture & Wealth Velocity", question: "What is your relationship with multi-generational wealth architecture and legacy planning?", options: [{ text: "I haven't thought much beyond my own financial security", score: 1 }, { text: "I have basic estate planning documents in place", score: 2 }, { text: "I've designed trust structures and succession frameworks for wealth transfer", score: 3 }, { text: "My wealth architecture spans generations — dynasty trusts, family governance protocols, philanthropic vehicles, and institutional-grade compounding infrastructure designed to outlive me by centuries", score: 4 }] },
  { category: "Executive Cognitive & Emotional Intelligence", question: "How do you manage decision fatigue when facing dozens of high-stakes choices daily?", options: [{ text: "I often feel overwhelmed and make reactive decisions under pressure", score: 1 }, { text: "I try to prioritize but still experience significant cognitive load from decision volume", score: 2 }, { text: "I've implemented cognitive load optimization systems — decision frameworks, delegation protocols, and energy management routines", score: 3 }, { text: "I operate with metacognitive awareness of my decision architecture — pre-committed heuristics, automated low-stakes choices, and reserved bandwidth exclusively for asymmetric decisions", score: 4 }] },
  { category: "Executive Cognitive & Emotional Intelligence", question: "In high-stakes negotiations with sophisticated counterparties, how do you maintain composure and strategic advantage?", options: [{ text: "I get anxious in high-pressure negotiations and often concede too early", score: 1 }, { text: "I can hold my own but sometimes let emotions influence my positioning", score: 2 }, { text: "I practice emotional arbitrage — reading the room while maintaining calibrated composure regardless of pressure", score: 3 }, { text: "I engineer negotiation environments proactively, deploying emotional arbitrage and cognitive load optimization to create information asymmetry that compounds in my favor throughout the process", score: 4 }] },
  { category: "Executive Cognitive & Emotional Intelligence", question: "How well do you hold paradox and complexity — making decisions when data is incomplete and outcomes are uncertain?", options: [{ text: "I need clear data and certainty before making significant decisions", score: 1 }, { text: "I can tolerate some ambiguity but prefer well-defined scenarios", score: 2 }, { text: "I'm comfortable operating in uncertainty and use probabilistic thinking to navigate complexity", score: 3 }, { text: "I thrive in complexity — my metacognitive awareness allows me to hold multiple contradictory frameworks simultaneously, extracting signal from noise and acting decisively with incomplete information", score: 4 }] },
  { category: "Operational Leverage & Scale Mechanics", question: "How would you describe your systems thinking and ability to design self-operating business architectures?", options: [{ text: "I'm the bottleneck — most operations require my direct involvement", score: 1 }, { text: "I've delegated some tasks but the business still depends heavily on me", score: 2 }, { text: "I design operational systems with autonomous execution capabilities and clear escalation protocols", score: 3 }, { text: "I architect autonomous systems design at scale — my businesses generate operational alpha through self-optimizing processes, AI-augmented decision layers, and exponential leverage that compounds without my presence", score: 4 }] },
  { category: "Operational Leverage & Scale Mechanics", question: "How sophisticated is your delegation architecture — your ability to build and empower world-class teams?", options: [{ text: "I struggle to delegate and tend to micromanage critical tasks", score: 1 }, { text: "I delegate routine work but retain control of most strategic decisions", score: 2 }, { text: "I've built a leadership layer that owns outcomes, not just tasks, with clear accountability frameworks", score: 3 }, { text: "My delegation architecture creates exponential leverage — I recruit operators who are 10x better than me in their domain, give them ownership stakes, and build autonomous systems design that scales beyond any individual", score: 4 }] },
  { category: "Operational Leverage & Scale Mechanics", question: "How do you deploy technology as a force multiplier rather than just a cost center?", options: [{ text: "Technology is an expense I try to minimize", score: 1 }, { text: "I use standard tools but haven't invested in technology as strategic advantage", score: 2 }, { text: "I actively invest in technology that creates operational alpha and competitive moats", score: 3 }, { text: "Technology is my primary source of exponential leverage — AI systems, proprietary data infrastructure, and autonomous decision engines that create compounding operational alpha across every business unit", score: 4 }] },
  { category: "Network Intelligence & Relational Capital", question: "How would you rate the caliber of your advisory board and inner circle?", options: [{ text: "I mostly rely on my own judgment and don't have formal advisors", score: 1 }, { text: "I have a few trusted mentors but they haven't operated at the scale I'm targeting", score: 2 }, { text: "My advisory network includes people who've built 8-figure businesses and navigated institutional-scale operations", score: 3 }, { text: "I've engineered gravitational pull of excellence — my inner circle includes billionaires, sovereign wealth operators, and category-defining founders who create relational arbitrage and network effects that compound deal flow exponentially", score: 4 }] },
  { category: "Network Intelligence & Relational Capital", question: "How would you describe the quality and velocity of your deal flow?", options: [{ text: "I find opportunities through public channels and general networking", score: 1 }, { text: "I occasionally receive proprietary deal flow through personal connections", score: 2 }, { text: "I've built systematic channels for high-quality deal flow with network effects that attract opportunities", score: 3 }, { text: "My relational capital generates gravitational pull — I'm in allocation-only rooms, pre-IPO syndicates, and sovereign-level deal tables because my network effects compound and create relational arbitrage at every tier", score: 4 }] },
  { category: "Network Intelligence & Relational Capital", question: "How intentionally do you cultivate relationships with people who've already achieved what you're building toward?", options: [{ text: "I don't have access to people operating at the level I aspire to", score: 1 }, { text: "I occasionally connect with successful people but lack systematic relationship building", score: 2 }, { text: "I invest deliberately in relationships with operators 2-3 levels above my current stage", score: 3 }, { text: "I architect relational arbitrage by providing unique value to people at the highest levels — my network strategy creates gravitational pull of excellence that attracts the caliber of relationships most people never access", score: 4 }] },
  { category: "Resilience Architecture & Anti-Fragility", question: "How prepared are you to navigate black swan events — sudden market crashes, regulatory shifts, or catastrophic disruptions?", options: [{ text: "A major disruption would significantly threaten my financial position", score: 1 }, { text: "I have some reserves but lack systematic downside protection", score: 2 }, { text: "I maintain downside engineering protocols — hedged positions, liquidity reserves, and scenario-tested contingency plans", score: 3 }, { text: "My portfolio has anti-fragile positioning — structured to actually benefit from volatility through asymmetric risk management, convex payoff structures, and downside engineering that turns chaos into opportunity", score: 4 }] },
  { category: "Resilience Architecture & Anti-Fragility", question: "How do you approach stress inoculation — building psychological resilience for operating at extreme scale?", options: [{ text: "Stress frequently impacts my decision-making and well-being", score: 1 }, { text: "I manage stress adequately but it takes a toll during high-pressure periods", score: 2 }, { text: "I have deliberate practices for stress inoculation — physical training, mindfulness, and cognitive reframing protocols", score: 3 }, { text: "I've engineered anti-fragile positioning into my psychology — deliberate exposure to controlled stressors, executive coaching, and asymmetric risk management of my own cognitive and emotional capital", score: 4 }] },
  { category: "Resilience Architecture & Anti-Fragility", question: "How aware are you of the specific pitfalls that derail wealth builders at each order of magnitude ($1M → $10M → $100M → $1B)?", options: [{ text: "I'm not clear on what changes at each wealth threshold", score: 1 }, { text: "I have a general sense that different challenges emerge at scale", score: 2 }, { text: "I've studied the failure patterns at each level and have downside engineering strategies for each transition", score: 3 }, { text: "I maintain a detailed playbook for each order-of-magnitude transition — anti-fragile positioning against ego-driven decisions, asymmetric risk management for over-leverage, and systematic downside engineering for every known failure mode at scale", score: 4 }] },
];

const CATEGORIES = [
  "Visionary Capacity & Strategic Foresight",
  "Capital Architecture & Wealth Velocity",
  "Executive Cognitive & Emotional Intelligence",
  "Operational Leverage & Scale Mechanics",
  "Network Intelligence & Relational Capital",
  "Resilience Architecture & Anti-Fragility",
];

function CircularGauge({ percentage, size = 220 }: { percentage: number; size?: number }) {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const [animatedPct, setAnimatedPct] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedPct(percentage), 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  const offset = circumference - (animatedPct / 100) * circumference;

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="url(#goldGrad)" strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          className="transition-all duration-[1500ms] ease-out" />
        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#f0d060" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-bold text-[#d4af37]">{Math.round(animatedPct)}</span>
        <span className="text-xs text-gray-500 uppercase tracking-widest">Score</span>
      </div>
    </div>
  );
}

function getTier(pct: number) {
  if (pct >= 85) return { label: "Billionaire Trajectory", desc: "You're operating at the highest bandwidth. Your vision, capital architecture, and operational systems are aligned for exponential wealth creation." };
  if (pct >= 70) return { label: "8-Figure Accelerator", desc: "Refine a few key dimensions. You have the foundation — targeted upgrades in specific categories will unlock your next order of magnitude." };
  if (pct >= 50) return { label: "High-Growth Operator", desc: "Strong foundation with gaps to close. Focus on the categories where you scored lowest — these are your highest-leverage improvement areas." };
  return { label: "Emerging Visionary", desc: "The roadmap starts here. You have ambition — now build the systems, network, and capital architecture to match your vision." };
}

export default function BillionairesClubPage() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [fade, setFade] = useState(true);
  const quizRef = useRef<HTMLDivElement>(null);

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);
    setFade(false);
    setTimeout(() => {
      if (currentQ + 1 >= QUESTIONS.length) {
        setIsComplete(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setCurrentQ(currentQ + 1);
        setFade(true);
      }
    }, 300);
  };

  const totalScore = answers.reduce((a, b) => a + b, 0);
  const maxScore = QUESTIONS.length * 4;
  const percentage = Math.round((totalScore / maxScore) * 100);
  const tier = getTier(percentage);

  const getCategoryScore = (catName: string) => {
    const catQs = QUESTIONS.map((q, i) => ({ ...q, idx: i })).filter((q) => q.category === catName);
    const catAnswers = catQs.map((q) => answers[q.idx] || 0);
    const catMax = catQs.length * 4;
    const catTotal = catAnswers.reduce((a, b) => a + b, 0);
    return { pct: Math.round((catTotal / catMax) * 100), total: catTotal, max: catMax };
  };

  const resetQuiz = () => {
    setCurrentQ(0);
    setAnswers([]);
    setIsComplete(false);
    setFade(true);
  };

  const currentCategory = !isComplete && currentQ < QUESTIONS.length ? QUESTIONS[currentQ].category : "";
  const progress = (currentQ / QUESTIONS.length) * 100;

  const principles = [
    { icon: "◆", title: "Capital Allocation Mastery", desc: "Deploy capital with surgical precision across asset classes, time horizons, and risk profiles. Every dollar has an optimal destination." },
    { icon: "⬡", title: "Exponential Systems Design", desc: "Build autonomous systems that scale without linear resource addition. Your architecture should compound, not just grow." },
    { icon: "◈", title: "Cognitive & Emotional Architecture", desc: "Engineer your mental operating system for high-stakes decision-making, paradox tolerance, and sustained peak performance." },
    { icon: "✦", title: "Network Gravity", desc: "Surround yourself with people who've already done what you're building toward. Relational capital compounds faster than financial capital." },
    { icon: "◇", title: "Anti-Fragile Positioning", desc: "Structure every position, every venture, and every relationship to benefit from volatility rather than be destroyed by it." },
    { icon: "⟐", title: "Technology as Leverage, Not Cost", desc: "Deploy AI, automation, and data infrastructure as force multipliers that create exponential operational alpha." },
  ];

  const pitfalls = [
    { title: "Ego-Driven Capital Deployment", desc: "When conviction becomes arrogance, capital gets destroyed. The best allocators maintain intellectual humility at every scale." },
    { title: "Scaling Without Systems", desc: "Revenue growth without operational architecture creates fragility. Scale the system first, then the revenue follows sustainably." },
    { title: "Isolation at the Top", desc: "Success can create echo chambers. Deliberately maintain relationships that challenge your thinking and keep you grounded." },
    { title: "Confusing Revenue with Wealth", desc: "High income is not wealth. Wealth is assets that compound. Shift focus from cash flow to equity value and compounding infrastructure." },
    { title: "Ignoring Emotional Intelligence at Scale", desc: "Technical brilliance without emotional architecture leads to burned relationships, poor team retention, and decision fatigue." },
    { title: "Over-Leveraging Without Downside Protection", desc: "Leverage amplifies returns and losses equally. Always engineer asymmetric downside protection before deploying leverage at scale." },
  ];

  const techTools = [
    { title: "Executive Dashboards & Portfolio Intelligence", desc: "Real-time visibility across every asset class, entity, and performance metric in your wealth architecture.", link: false },
    { title: "AI-Powered Market Analysis", desc: "Leverage institutional-grade language intelligence to understand market positioning, demand signals, and competitive dynamics.", link: true },
    { title: "Scenario Modeling & Stress Testing", desc: "Simulate black swan events, interest rate shifts, and market dislocations before they happen. Prepare, don't react.", link: false },
    { title: "Relationship CRM for High-Net-Worth Networks", desc: "Systematize your relational capital. Track interactions, deal flow, and network intelligence with institutional rigor.", link: false },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-300">
      {/* HERO */}
      <div className="text-center pt-20 pb-16 px-5 max-w-3xl mx-auto">
        <div className="text-[10px] tracking-[5px] uppercase font-bold text-[#d4af37] mb-7">Exclusive Assessment</div>
        <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight bg-gradient-to-r from-[#d4af37] via-[#f0d060] to-[#d4af37] bg-clip-text text-transparent">
          THE BILLIONAIRES CLUB
        </h1>
        <p className="text-xl md:text-2xl text-white mb-3">Does Your Plan Have What It Takes?</p>
        <p className="text-gray-500 text-sm max-w-xl mx-auto leading-relaxed">
          Evaluate whether your vision, capital architecture, operational systems, and network intelligence
          are calibrated for billionaire-level execution. This assessment measures the six critical dimensions
          that separate generational wealth builders from everyone else.
        </p>
      </div>

      {/* QUIZ or RESULTS */}
      {!isComplete ? (
        <div ref={quizRef} className="max-w-2xl mx-auto px-5 pb-16">
          {/* Progress */}
          <div className="mb-10">
            <div className="flex justify-between mb-2">
              <span className="text-[11px] text-gray-500 uppercase tracking-widest">{currentCategory}</span>
              <span className="text-xs text-gray-600">{currentQ + 1} / {QUESTIONS.length}</span>
            </div>
            <div className="h-[3px] bg-white/5 rounded">
              <div className="h-full bg-gradient-to-r from-[#d4af37] to-[#f0d060] rounded transition-all duration-400" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Question */}
          <div className={`transition-opacity duration-300 ${fade ? "opacity-100" : "opacity-0"}`}>
            <h2 className="text-xl text-white mb-7 leading-relaxed">{QUESTIONS[currentQ].question}</h2>
            <div className="flex flex-col gap-3">
              {QUESTIONS[currentQ].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt.score)}
                  className="bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-left text-sm leading-relaxed text-gray-300 cursor-pointer transition-all hover:border-[#d4af37]/40 hover:bg-[#d4af37]/5"
                >
                  <span className="text-[#d4af37] font-bold mr-2">{String.fromCharCode(65 + i)}.</span>
                  {opt.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* RESULTS */}
          <section className="max-w-[900px] mx-auto px-5 py-16">
            <div className="text-[10px] tracking-[5px] uppercase font-bold text-[#d4af37] mb-4 text-center">Your Results</div>
            <h2 className="text-3xl font-bold text-white mb-3 text-center">Assessment Complete</h2>

            <div className="mt-8 p-12 rounded-2xl border border-[#d4af37]/30 bg-gradient-to-br from-[#d4af37]/[0.06] to-[#d4af37]/[0.01] text-center">
              <CircularGauge percentage={percentage} />
              <div className="mt-6">
                <div className="text-2xl text-[#d4af37] font-bold mb-2">{tier.label}</div>
                <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">{tier.desc}</p>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="mt-10">
              <h3 className="text-xl text-white mb-6">Dimensional Breakdown</h3>
              {CATEGORIES.map((cat) => {
                const { pct } = getCategoryScore(cat);
                return (
                  <div key={cat} className="mb-5">
                    <div className="flex justify-between mb-1.5">
                      <span className="text-sm text-gray-300">{cat}</span>
                      <span className="text-sm text-[#d4af37] font-semibold">{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded">
                      <div className="h-full bg-gradient-to-r from-[#d4af37] to-[#f0d060] rounded transition-all duration-[1200ms] ease-out" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center mt-8">
              <button onClick={resetQuiz} className="px-9 py-3.5 bg-[#d4af37] text-black font-bold rounded-xl hover:bg-[#f0d060] transition-colors">
                Retake Assessment
              </button>
            </div>
          </section>

          {/* INVESTOR CALCULATOR */}
          <section className="max-w-[900px] mx-auto px-5 py-16">
            <div className="p-8 rounded-2xl border border-[#d4af37]/30 bg-gradient-to-br from-[#d4af37]/[0.06] to-[#d4af37]/[0.01]">
              <div className="text-[10px] tracking-[5px] uppercase font-bold text-[#d4af37] mb-4 text-center">Foundation of Wealth Intelligence</div>
              <h2 className="text-2xl font-bold text-white mb-3 text-center">The Investor Calculator</h2>
              <p className="text-gray-500 text-sm leading-relaxed text-center max-w-xl mx-auto mb-6">
                Understanding Lifetime Value is foundational to billionaire-level thinking. Before you can architect
                multi-generational wealth, you need to quantify the true value of every customer, every relationship,
                and every asset in your portfolio.
              </p>
              <div className="text-center">
                <Link href="/investment-calculator" className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#d4af37] text-black font-bold rounded-xl hover:bg-[#f0d060] transition-colors">
                  Launch Investment Calculator <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>

          {/* KEY PRINCIPLES */}
          <section className="max-w-[900px] mx-auto px-5 py-16">
            <div className="text-[10px] tracking-[5px] uppercase font-bold text-[#d4af37] mb-4 text-center">The Blueprint</div>
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Key Principles of Scaling to a Billion</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {principles.map((p) => (
                <div key={p.title} className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
                  <div className="text-2xl text-[#d4af37] mb-3">{p.icon}</div>
                  <h3 className="text-lg text-white font-bold mb-2">{p.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* PITFALLS */}
          <section className="max-w-[900px] mx-auto px-5 py-16">
            <div className="text-[10px] tracking-[5px] uppercase font-bold text-[#d4af37] mb-4 text-center">Navigate With Awareness</div>
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Pitfalls &amp; Navigation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {pitfalls.map((p) => (
                <div key={p.title} className="bg-white/[0.03] border border-white/10 border-l-[3px] border-l-[#d4af37]/30 rounded-2xl p-8">
                  <h3 className="text-base text-[#d4af37] font-bold mb-2">{p.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* TECHNOLOGY */}
          <section className="max-w-[900px] mx-auto px-5 py-16">
            <div className="text-[10px] tracking-[5px] uppercase font-bold text-[#d4af37] mb-4 text-center">Preparatory Infrastructure</div>
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Technology &amp; Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {techTools.map((p) => (
                <div key={p.title} className="border border-[#d4af37]/30 bg-gradient-to-br from-[#d4af37]/[0.06] to-[#d4af37]/[0.01] rounded-2xl p-8">
                  <h3 className="text-base text-white font-bold mb-2">{p.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
                  {p.link && <span className="text-[#d4af37] text-xs mt-2 inline-block">Explore Tools →</span>}
                </div>
              ))}
            </div>
          </section>

          {/* PRICING */}
          <section className="max-w-[900px] mx-auto px-5 py-16">
            <div className="text-[10px] tracking-[5px] uppercase font-bold text-[#d4af37] mb-4 text-center">Premium Market Intelligence</div>
            <h2 className="text-3xl font-bold text-white mb-3 text-center">Investment-Grade <span className="text-[#d4af37]">Pricing</span></h2>
            <p className="text-gray-500 text-sm text-center max-w-md mx-auto mb-10">Choose the plan that matches your market intelligence needs</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[750px] mx-auto">
              {/* Business / Single Family Office */}
              <div className="relative bg-gradient-to-br from-[#d4af37]/[0.08] to-[#d4af37]/[0.02] border-2 border-[#d4af37]/30 rounded-2xl p-9 shadow-[0_12px_60px_rgba(212,175,55,0.1)]">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#d4af37] to-[#c09830] px-4 py-1 rounded-full text-[9px] font-extrabold tracking-widest text-black uppercase">
                  Single Family Office
                </div>
                <div className="text-[10px] tracking-[3px] text-[#d4af37] uppercase font-bold mb-3">Business / Single Family Office</div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl text-[#d4af37] font-bold">$32,500</span>
                  <span className="text-gray-500 text-sm">/month</span>
                </div>
                <p className="text-gray-400 text-xs mb-5">1 portfolio company</p>
                <ul className="space-y-0 mb-7">
                  {["Fractional Chief Revenue Officer", "Fractional Chief Demand Officer", "Fractional Chief People Officer", "5 hours per week included", "Full market intelligence suite", "Investment thesis validation", "LLV Calculator & PDF reports", "Direct line to Jeff Cline"].map((f) => (
                    <li key={f} className="py-2 border-b border-[#d4af37]/10 text-sm text-gray-300">
                      <span className="text-[#d4af37] mr-2">★</span>{f}
                    </li>
                  ))}
                </ul>
                <p className="text-gray-500 text-[11px] mb-4">* Travel & expenses billed separately</p>
                <Link href="/contact" className="block w-full text-center py-3.5 bg-[#d4af37] text-black font-bold rounded-xl hover:bg-[#f0d060] transition-colors text-base">
                  Get Started
                </Link>
              </div>

              {/* Multi Family Office */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-9">
                <div className="text-[10px] tracking-[3px] text-gray-500 uppercase font-bold mb-3">Multi Family Office</div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl text-white font-bold">$75,000</span>
                  <span className="text-gray-500 text-sm">/month</span>
                </div>
                <p className="text-gray-400 text-xs mb-5">Up to 5 families or portfolio companies</p>
                <ul className="space-y-0 mb-7">
                  {["Fractional Chief Revenue Officer", "Fractional Chief Demand Officer", "Fractional Chief People Officer", "5 hours per week per entity", "Full market intelligence suite", "Portfolio-wide strategy & analysis", "Custom market modeling & white-label", "Quarterly strategy sessions", "Dedicated account manager", "Requires success fees or equity"].map((f) => (
                    <li key={f} className="py-2 border-b border-white/[0.03] text-sm text-gray-300">
                      <span className="text-[#d4af37] mr-2">✦</span>{f}
                    </li>
                  ))}
                </ul>
                <p className="text-gray-500 text-[11px] mb-4">* Travel & expenses billed separately</p>
                <a href="tel:8302895584" className="flex items-center justify-center gap-2 w-full text-center py-3.5 bg-[#d4af37] text-black font-bold rounded-xl hover:bg-[#f0d060] transition-colors">
                  <Phone className="w-4 h-4" /> 830-289-5584
                </a>
              </div>
            </div>

            {/* Fractional Leadership Summary */}
            <div className="max-w-[700px] mx-auto mt-10 bg-white/[0.03] border border-[#d4af37]/20 rounded-2xl p-8">
              <div className="text-[10px] tracking-[5px] uppercase font-bold text-[#d4af37] mb-4 text-center">What&apos;s Included</div>
              <h3 className="text-xl font-bold text-white text-center mb-6">Fractional Executive Leadership</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {[
                  { title: "Chief Revenue Officer", desc: "Revenue architecture, sales strategy, and growth acceleration" },
                  { title: "Chief Demand Officer", desc: "Market positioning, demand generation, and brand gravity" },
                  { title: "Chief People Officer", desc: "Talent strategy, culture engineering, and organizational design" },
                ].map((role) => (
                  <div key={role.title} className="bg-black/30 rounded-xl p-5 text-center">
                    <div className="text-[#d4af37] font-bold text-sm mb-2">{role.title}</div>
                    <p className="text-gray-500 text-xs leading-relaxed">{role.desc}</p>
                  </div>
                ))}
              </div>
              <p className="text-gray-400 text-sm text-center leading-relaxed">
                5 hours per week of executive-level strategic leadership across your organization.
                <br />
                <span className="text-gray-500 text-xs">Travel & expenses billed separately.</span>
              </p>
            </div>
          </section>
        </>
      )}

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-10 px-5 text-center mt-10">
        <Link href="/" className="text-lg font-black">
          <span className="text-[#FF8900]">JEFF</span>{" "}
          <span className="text-[#DC2626]">CLINE</span>
        </Link>
        <div className="mt-5 flex justify-center gap-6">
          <Link href="/billionaires-club" className="text-gray-500 text-sm hover:text-[#FF8900] transition-colors">Billionaires Club</Link>
          <Link href="/investment-calculator" className="text-gray-500 text-sm hover:text-[#FF8900] transition-colors">Investment Calculator</Link>
          <Link href="/contact" className="text-gray-500 text-sm hover:text-[#FF8900] transition-colors">Contact</Link>
        </div>
        <p className="text-gray-600 text-xs mt-4">© {new Date().getFullYear()} Jeff Cline. All rights reserved.</p>
        <a href="https://jeff-cline.com" style={{ color: "rgba(255,255,255,0.08)", fontSize: "6px", textDecoration: "none" }}>JC</a>
      </footer>
    </div>
  );
}
