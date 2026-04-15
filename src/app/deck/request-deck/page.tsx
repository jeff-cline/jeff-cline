"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

/* ─── helpers ─── */
const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const fmtK = (n: number) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return fmt(n);
};

function AnimatedNumber({ value, duration = 2000, prefix = "$", suffix = "" }: { value: number; duration?: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value, duration]);
  return <span>{prefix}{display.toLocaleString()}{suffix}</span>;
}

/* ─── steps ─── */
type Step = "intro" | "q1" | "q2" | "q3" | "q4" | "q5" | "q6" | "q7" | "q8" | "q9" | "q10" | "q11" | "q12" | "q13" | "q14" | "q15" | "q16" | "q17" | "q18" | "q19" | "q20" | "q21" | "q22" | "q23" | "results";

const TOTAL_Q = 23;

export default function MastermindApplication() {
  const [step, setStep] = useState<Step>("intro");
  const [showResults, setShowResults] = useState(false);
  const [leadSent, setLeadSent] = useState(false);

  /* ─── answers ─── */
  // Business readiness
  const [a1, setA1] = useState(""); // annual revenue
  const [a2, setA2] = useState(""); // years in business
  const [a3, setA3] = useState(""); // team size
  const [a4, setA4] = useState(""); // biggest bottleneck
  const [a5, setA5] = useState(""); // revenue goal next 12mo

  // Personal growth
  const [a6, setA6] = useState(""); // invested in yourself before
  const [a7, setA7] = useState(""); // biggest personal challenge
  const [a8, setA8] = useState(""); // health/energy level
  const [a9, setA9] = useState(""); // relationship status impact

  // Professional growth
  const [a10, setA10] = useState(""); // exits/acquisitions
  const [a11, setA11] = useState(""); // industries operated in
  const [a12, setA12] = useState(""); // what would 10x look like
  const [a13, setA13] = useState(""); // tech sophistication

  // Mental state
  const [a14, setA14] = useState(""); // where are you mentally
  const [a15, setA15] = useState(""); // decision speed
  const [a16, setA16] = useState(""); // comfort with discomfort
  const [a17, setA17] = useState(""); // accountability style

  // Income/Revenue
  const [a18, setA18] = useState(""); // personal income
  const [a18Input, setA18Input] = useState("");
  const [a19, setA19] = useState(""); // liquid capital available
  const [a20, setA20] = useState(""); // investment timeline

  // Business metrics
  const [a21, setA21] = useState(""); // profit margin
  const [a22, setA22] = useState(""); // customer LTV
  const [a23, setA23] = useState(""); // why this mastermind

  const next = useCallback((s: Step) => {
    setStep(s);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const qNum: Record<string, number> = {};
  for (let i = 1; i <= TOTAL_Q; i++) qNum[`q${i}`] = i;
  const progress = step === "intro" ? 0 : step === "results" ? 100 : Math.round(((qNum[step] || 0) / TOTAL_Q) * 100);

  /* ─── scoring ─── */
  const calcScores = () => {
    let business = 0, personal = 0, professional = 0, mental = 0, financial = 0;

    // Business readiness (q1-q5)
    if (a1.includes("$1M")) business += 20; else if (a1.includes("$500K")) business += 16; else if (a1.includes("$250K")) business += 12; else if (a1.includes("$100K")) business += 8; else business += 4;
    if (a2.includes("5+") || a2.includes("10+")) business += 20; else if (a2.includes("3")) business += 15; else business += 8;
    if (a3.includes("10+") || a3.includes("50+")) business += 20; else if (a3.includes("5")) business += 15; else business += 8;
    if (a4.includes("scale") || a4.includes("systems")) business += 20; else business += 12;
    if (a5.includes("10X") || a5.includes("5X")) business += 20; else if (a5.includes("3X") || a5.includes("2X")) business += 15; else business += 8;

    // Personal growth (q6-q9)
    if (a6.includes("$50K+") || a6.includes("$100K+")) personal += 25; else if (a6.includes("$10K")) personal += 18; else if (a6.includes("Yes")) personal += 12; else personal += 5;
    if (a7.includes("comfort zone") || a7.includes("discipline")) personal += 25; else personal += 15;
    if (a8.includes("peak") || a8.includes("strong")) personal += 25; else if (a8.includes("good")) personal += 18; else personal += 10;
    if (a9.includes("supportive") || a9.includes("aligned")) personal += 25; else personal += 12;

    // Professional growth (q10-q13)
    if (a10.includes("multiple") || a10.includes("yes")) professional += 25; else if (a10.includes("one")) professional += 18; else professional += 8;
    if (a11.includes("multiple") || a11.includes("3+")) professional += 25; else professional += 12;
    if (a12.length > 0) professional += 25;
    if (a13.includes("advanced") || a13.includes("AI")) professional += 25; else if (a13.includes("moderate")) professional += 18; else professional += 10;

    // Mental state (q14-q17)
    if (a14.includes("ready") || a14.includes("trigger")) mental += 25; else if (a14.includes("willing")) mental += 18; else mental += 10;
    if (a15.includes("immediate") || a15.includes("fast")) mental += 25; else if (a15.includes("days")) mental += 18; else mental += 10;
    if (a16.includes("thrive") || a16.includes("growth")) mental += 25; else if (a16.includes("handle")) mental += 18; else mental += 10;
    if (a17.includes("coach") || a17.includes("external")) mental += 25; else if (a17.includes("self")) mental += 18; else mental += 10;

    // Financial (q18-q23)
    const income = parseInt(a18.replace(/[^0-9]/g, "")) || 0;
    if (income >= 500000) financial += 20; else if (income >= 250000) financial += 16; else if (income >= 150000) financial += 12; else financial += 6;
    if (a19.includes("$500K+") || a19.includes("$1M+")) financial += 20; else if (a19.includes("$250K")) financial += 16; else if (a19.includes("$100K")) financial += 12; else financial += 6;
    if (a20.includes("now") || a20.includes("30 days")) financial += 20; else if (a20.includes("90")) financial += 14; else financial += 6;
    if (a21.includes("30%+") || a21.includes("40%+")) financial += 15; else if (a21.includes("20%")) financial += 10; else financial += 5;
    if (a22.includes("$50K+") || a22.includes("$100K+")) financial += 15; else if (a22.includes("$10K")) financial += 10; else financial += 5;
    if (a23.length > 0) financial += 10;

    return { business: Math.min(business, 100), personal: Math.min(personal, 100), professional: Math.min(professional, 100), mental: Math.min(mental, 100), financial: Math.min(financial, 100) };
  };

  const scores = calcScores();
  const overallScore = Math.round((scores.business + scores.personal + scores.professional + scores.mental + scores.financial) / 5);
  const income = parseInt(a18.replace(/[^0-9]/g, "")) || 150000;
  const recommendedProgram = overallScore >= 70 || income >= 300000 ? "3-month" : "1-week";
  const recommendedPrice = recommendedProgram === "3-month" ? 100000 : 35000;
  const projectedROI = Math.round((income * 3) / recommendedPrice);
  const lifetimeValue = income * 10;
  const investmentPct = (recommendedPrice / lifetimeValue) * 100;

  useEffect(() => {
    if (step === "results") {
      const t = setTimeout(() => setShowResults(true), 300);
      return () => clearTimeout(t);
    }
  }, [step]);

  // Send lead data
  useEffect(() => {
    if (step === "results" && !leadSent) {
      setLeadSent(true);
      fetch("/api/todo/webhook/lead-ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-CRM-Key": "jc-crm-2024" },
        body: JSON.stringify({
          source: "mastermind-application",
          type: "mastermind",
          data: {
            annualRevenue: a1, yearsInBusiness: a2, teamSize: a3, bottleneck: a4, revenueGoal: a5,
            investedBefore: a6, personalChallenge: a7, energyLevel: a8, relationshipImpact: a9,
            exits: a10, industries: a11, tenXVision: a12, techLevel: a13,
            mentalState: a14, decisionSpeed: a15, discomfortLevel: a16, accountabilityStyle: a17,
            personalIncome: a18, liquidCapital: a19, investmentTimeline: a20,
            profitMargin: a21, customerLTV: a22, whyMastermind: a23,
            scores, overallScore, recommendedProgram, recommendedPrice,
          },
        }),
      }).catch(() => {});
    }
  }, [step, leadSent, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, scores, overallScore, recommendedProgram, recommendedPrice]);

  const handleIncomeInput = (raw: string) => {
    const digits = raw.replace(/[^0-9]/g, "");
    setA18(digits);
    setA18Input(digits ? Number(digits).toLocaleString() : "");
  };

  /* ─── reusable components ─── */
  const Opt = ({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`w-full text-left px-6 py-4 rounded-xl border transition-all duration-200 ${
        selected
          ? "border-[#FF8900] bg-[#FF8900]/10 text-[#FF8900]"
          : "border-white/10 bg-[#111] text-gray-300 hover:border-[#FF8900]/50 hover:bg-[#1a1a1a]"
      }`}
    >
      <span className="text-sm font-mono mr-3 opacity-50">{selected ? "●" : "○"}</span>
      {label}
    </button>
  );

  const Bar = ({ label, value, max, color }: { label: string; value: number; max: number; color: string }) => (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-400 font-mono">{label}</span>
        <span className="text-white font-bold font-mono">{value}%</span>
      </div>
      <div className="h-6 bg-[#1a1a1a] rounded-full overflow-hidden border border-white/5">
        <div
          className="h-full rounded-full transition-all duration-[2s] ease-out"
          style={{ width: showResults ? `${Math.min((value / max) * 100, 100)}%` : "0%", background: color }}
        />
      </div>
    </div>
  );

  const ValBar = ({ label, value, max, color }: { label: string; value: number; max: number; color: string }) => (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-400 font-mono">{label}</span>
        <span className="text-white font-bold font-mono">{fmtK(value)}</span>
      </div>
      <div className="h-6 bg-[#1a1a1a] rounded-full overflow-hidden border border-white/5">
        <div
          className="h-full rounded-full transition-all duration-[2s] ease-out"
          style={{ width: showResults ? `${Math.min((value / max) * 100, 100)}%` : "0%", background: color }}
        />
      </div>
    </div>
  );

  const QHeader = ({ n }: { n: number }) => (
    <p className="text-[#FF8900] font-mono text-sm mb-2">QUESTION {String(n).padStart(2, "0")} / {TOTAL_Q}</p>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {step !== "intro" && (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-[#1a1a1a]">
          <div className="h-full bg-gradient-to-r from-[#FF8900] to-[#DC2626] transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      )}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(255,137,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,137,0,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-16">

        {/* ═══ INTRO ═══ */}
        {step === "intro" && (
          <div className="text-center animate-fade-in-up">
            <div className="inline-block px-4 py-1 rounded-full border border-[#FF8900]/30 text-[#FF8900] text-xs font-mono tracking-widest mb-8">
              APPLICATION-ONLY · APPROVAL REQUIRED
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="text-[#FF8900]">MASTERMIND</span><br />
              <span className="text-[#DC2626]">APPLICATION</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-6 leading-relaxed">
              This is not a sign-up form. This is a <span className="text-white font-semibold">readiness assessment.</span>{" "}
              We accept approximately 30% of applicants. The questions are designed to determine if this experience will deliver
              <span className="text-[#FF8900]"> transformational ROI</span> for you.
            </p>
            <p className="text-gray-500 max-w-xl mx-auto mb-12">
              Answer honestly. There are no wrong answers — only data points that help us determine
              if this is the right investment for where you are right now.
            </p>
            <button
              onClick={() => next("q1")}
              className="px-12 py-5 bg-[#FF8900] hover:bg-[#e07a00] text-black font-black text-lg rounded-xl transition-all duration-200 hover:scale-105 shadow-[0_0_40px_rgba(255,137,0,0.3)]"
            >
              BEGIN APPLICATION →
            </button>
            <p className="text-gray-600 text-sm mt-6 font-mono">{TOTAL_Q} questions · 5 minutes · determines your readiness</p>
          </div>
        )}

        {/* ═══ BUSINESS READINESS (Q1-Q5) ═══ */}

        {step === "q1" && (
          <div className="max-w-2xl mx-auto animate-fade-in-up">
            <QHeader n={1} />
            <p className="text-[#DC2626] font-mono text-xs tracking-widest mb-4">SECTION: BUSINESS READINESS</p>
            <h2 className="text-3xl md:text-4xl font-black mb-4">What is your current <span className="text-[#FF8900]">annual revenue</span>?</h2>
            <p className="text-gray-500 mb-8">We need to understand the scale of your operation.</p>
            <div className="space-y-3">
              {[
                "Pre-revenue — still building",
                "$0 – $100K",
                "$100K – $250K",
                "$250K – $500K",
                "$500K – $1M",
                "$1M – $5M",
                "$5M – $10M",
                "$10M+",
              ].map((o) => (
                <Opt key={o} label={o} selected={a1 === o} onClick={() => { setA1(o); setTimeout(() => next("q2"), 400); }} />
              ))}
            </div>
          </div>
        )}

        {step === "q2" && (
          <div className="max-w-2xl mx-auto animate-fade-in-up">
            <QHeader n={2} />
            <h2 className="text-3xl md:text-4xl font-black mb-4">How long have you been in <span className="text-[#FF8900]">business</span>?</h2>
            <p className="text-gray-500 mb-8">Experience shapes readiness.</p>
            <div className="space-y-3">
              {[
                "Less than 1 year",
                "1 – 2 years",
                "3 – 5 years",
                "5 – 10 years",
                "10+ years",
                "Serial entrepreneur — multiple ventures",
              ].map((o) => (
                <Opt key={o} label={o} selected={a2 === o} onClick={() => { setA2(o); setTimeout(() => next("q3"), 400); }} />
              ))}
            </div>
          </div>
        )}

        {step === "q3" && (
          <div className="max-w-2xl mx-auto animate-fade-in-up">
            <QHeader n={3} />
            <h2 className="text-3xl md:text-4xl font-black mb-4">How large is your <span className="text-[#FF8900]">team</span>?</h2>
            <p className="text-gray-500 mb-8">People are infrastructure.</p>
            <div className="space-y-3">
              {[
                "Just me — solopreneur",
                "2 – 5 people",
                "5 – 10 people",
                "10 – 25 people",
                "25 – 50 people",
                "50+ people",
              ].map((o) => (
                <Opt key={o} label={o} selected={a3 === o} onClick={() => { setA3(o); setTimeout(() => next("q4"), 400); }} />
              ))}
            </div>
          </div>
        )}

        {step === "q4" && (
          <div className="max-w-2xl mx-auto animate-fade-in-up">
            <QHeader n={4} />
            <h2 className="text-3xl md:text-4xl font-black mb-4">What is your biggest <span className="text-[#DC2626]">bottleneck</span> right now?</h2>
            <p className="text-gray-500 mb-8">The thing that keeps you up at night.</p>
            <div className="space-y-3">
              {[
                "I can't scale — systems are broken",
                "I need capital to grow",
                "I'm the bottleneck — can't delegate",
                "Marketing/sales pipeline is dry",
                "Technology is holding me back",
                "I don't have the right people",
                "I need an exit strategy",
                "I don't know what I don't know",
              ].map((o) => (
                <Opt key={o} label={o} selected={a4 === o} onClick={() => { setA4(o); setTimeout(() => next("q5"), 400); }} />
              ))}
            </div>
          </div>
        )}

        {step === "q5" && (
          <div className="max-w-2xl mx-auto animate-fade-in-up">
            <QHeader n={5} />
            <h2 className="text-3xl md:text-4xl font-black mb-4">Where do you want revenue in <span className="text-[#FF8900]">12 months</span>?</h2>
            <p className="text-gray-500 mb-8">Ambition tells us everything.</p>
            <div className="space-y-3">
              {[
                "Maintain current levels — stability",
                "2X current revenue",
                "3X current revenue",
                "5X current revenue",
                "10X — I want a quantum leap",
                "I want to position for acquisition/exit",
              ].map((o) => (
                <Opt key={o} label={o} selected={a5 === o} onClick={() => { setA5(o); setTimeout(() => next("q6"), 400); }} />
              ))}
            </div>
          </div>
        )}

        {/* ═══ PERSONAL GROWTH (Q6-Q9) ═══ */}

        {step === "q6" && (
          <div className="max-w-2xl mx-auto animate-fade-in-up">
            <QHeader n={6} />
            <p className="text-[#DC2626] font-mono text-xs tracking-widest mb-4">SECTION: PERSONAL GROWTH</p>
            <h2 className="text-3xl md:text-4xl font-black mb-4">Have you <span className="text-[#FF8900]">invested in yourself</span> before?</h2>
            <p className="text-gray-500 mb-8">Coaching, masterminds, programs, education beyond college.</p>
            <div className="space-y-3">
              {[
                "No — this would be my first",
                "Yes — under $5K total",
                "Yes — $5K – $10K",
                "Yes — $10K – $25K",
                "Yes — $25K – $50K",
                "$50K+ — I invest heavily in growth",
                "$100K+ — I treat self-investment as a business expense",
              ].map((o) => (
                <Opt key={o} label={o} selected={a6 === o} onClick={() => { setA6(o); setTimeout(() => next("q7"), 400); }} />
              ))}
            </div>
          </div>
        )}

        {step === "q7" && (
          <div className="max-w-2xl mx-auto animate-fade-in-up">
            <QHeader n={7} />
            <h2 className="text-3xl md:text-4xl font-black mb-4">What is your biggest <span className="text-[#FF8900]">personal challenge</span> right now?</h2>
            <p className="text-gray-500 mb-8">Growth requires honesty.</p>
            <div className="space-y-3">
              {[
                "Breaking out of my comfort zone",
                "Discipline and consistency",
                "Health and energy management",
                "Work-life integration",
                "Confidence in my next move",
                "Loneliness at the top — no one gets it",
                "I'm burned out and need a reset",
              ].map((o) => (
                <Opt key={o} label={o} selected={a7 === o} onClick={() => { setA7(o); setTimeout(() => next("q8"), 400); }} />
              ))}
            </div>
          </div>
        )}

        {step === "q8" && (
          <div className="max-w-2xl mx-auto animate-fade-in-up">
            <QHeader n={8} />
            <h2 className="text-3xl md:text-4xl font-black mb-4">How would you rate your <span className="text-[#FF8900]">health and energy</span>?</h2>
            <p className="text-gray-500 mb-8">Your body is your business vehicle.</p>
            <div className="space-y-3">
              {[
                "Peak performance — I prioritize health",
                "Strong — above average, consistent habits",
                "Good — but I know I could be better",
                "Average — it's not a priority right now",
                "Struggling — low energy, poor habits",
                "In crisis — health is actively hurting my business",
              ].map((o) => (
                <Opt key={o} label={o} selected={a8 === o} onClick={() => { setA8(o); setTimeout(() => next("q9"), 400); }} />
              ))}
            </div>
          </div>
        )}

        {step === "q9" && (
          <div className="max-w-2xl mx-auto animate-fade-in-up">
            <QHeader n={9} />
            <h2 className="text-3xl md:text-4xl font-black mb-4">How does your <span className="text-[#FF8900]">inner circle</span> feel about your growth?</h2>
            <p className="text-gray-500 mb-8">Environment determines trajectory.</p>
            <div className="space-y-3">
              {[
                "Fully supportive and aligned — they push me",
                "Supportive but don't fully understand",
                "Neutral — they don't care either way",
                "Resistant — they fear change",
                "I don't have an inner circle",
                "I need a new peer group entirely",
              ].map((o) => (
                <Opt key={o} label={o} selected={a9 === o} onClick={() => { setA9(o); setTimeout(() => next("q10"), 400); }} />
              ))}
            </div>
          </div>
        )}

        {/* ═══ PROFESSIONAL GROWTH (Q10-Q13) ═══ */}

        {step === "q10" && (
          <div className="max-w-2xl mx-auto animate-fade-in-up">
            <QHeader n={10} />
            <p className="text-[#DC2626] font-mono text-xs tracking-widest mb-4">SECTION: PROFESSIONAL GROWTH</p>
            <h2 className="text-3xl md:text-4xl font-black mb-4">Have you had any <span className="text-[#FF8900]">exits or acquisitions</span>?</h2>
            <p className="text-gray-500 mb-8">Experience with liquidity events.</p>
            <div className="space-y-3">
              {[
                "No — this is my first venture",
                "No, but I'm building toward one",
                "Yes — one exit",
                "Yes — multiple exits",
                "I've been acquired",
                "I've acquired other companies",
              ].map((o) => (
                <Opt key={o} label={o} selected={a10 === o} onClick={() => { setA10(o); setTimeout(() => next("q11"), 400); }} />
              ))}
            </div>
          </div>
        )}

        {step === "q11" && (
          <div className="max-w-2xl mx-auto animate-fade-in-up">
            <QHeader n={11} />
            <h2 className="text-3xl md:text-4xl font-black mb-4">How many <span className="text-[#FF8900]">industries</span> have you operated in?</h2>
            <p className="text-gray-500 mb-8">Breadth of experience indicates adaptability.</p>
            <div className="space-y-3">
              {[
                "One — I'm deeply specialized",
                "Two — I've pivoted once",
                "3+ industries — I'm versatile",
                "I've lost count — I build in whatever catches my interest",
              ].map((o) => (
                <Opt key={o} label={o} selected={a11 === o} onClick={() => { setA11(o); setTimeout(() => next("q12"), 400); }} />
              ))}
            </div>
          </div>
        )}

        {step === "q12" && (
          <div className="max-w-2xl mx-auto animate-fade-in-up">
            <QHeader n={12} />
            <h2 className="text-3xl md:text-4xl font-black mb-4">What would <span className="text-[#FF8900]">10X growth</span> look like for you?</h2>
            <p className="text-gray-500 mb-8">Paint the picture. Be specific.</p>
            <div className="space-y-3">
              {[
                "10X revenue — from $500K to $5M",
                "10X team — building an organization",
                "10X impact — changing an entire industry",
                "10X freedom — business runs without me",
                "10X wealth — generational legacy",
                "All of the above — I want it all",
              ].map((o) => (
                <Opt key={o} label={o} selected={a12 === o} onClick={() => { setA12(o); setTimeout(() => next("q13"), 400); }} />
              ))}
            </div>
          </div>
        )}

        {step === "q13" && (
          <div className="max-w-2xl mx-auto animate-fade-in-up">
            <QHeader n={13} />
            <h2 className="text-3xl md:text-4xl font-black mb-4">What is your <span className="text-[#FF8900]">technology sophistication</span>?</h2>
            <p className="text-gray-500 mb-8">We deploy advanced systems. Where are you starting from?</p>
            <div className="space-y-3">
              {[
                "Basic — I use email and spreadsheets",
                "Moderate — CRM, marketing tools, analytics",
                "Advanced — custom tech stack, APIs, automation",
                "AI-native — already using AI agents and ML",
                "I'm a technologist myself",
              ].map((o) => (
                <Opt key={o} label={o} selected={a13 === o} onClick={() => { setA13(o); setTimeout(() => next("q14"), 400); }} />
              ))}
            </div>
          </div>
        )}

        {/* ═══ MENTAL STATE (Q14-Q17) ═══ */}

        {step === "q14" && (
          <div className="max-w-2xl mx-auto animate-fade-in-up">
            <QHeader n={14} />
            <p className="text-[#DC2626] font-mono text-xs tracking-widest mb-4">SECTION: MENTAL STATE</p>
            <h2 className="text-3xl md:text-4xl font-black mb-4">Where are you <span className="text-[#FF8900]">mentally</span> right now?</h2>
            <p className="text-gray-500 mb-8">Mindset determines outcomes.</p>
            <div className="space-y-3">
              {[
                "I'm ready — I've been searching for this",
                "I'm willing to make a change",
                "I've had a trigger moment and I'm activated",
                "I'm desperate — something has to change now",
                "I'm curious but skeptical",
                "I'm doing this out of spite — watch me",
              ].map((o) => (
                <Opt key={o} label={o} selected={a14 === o} onClick={() => { setA14(o); setTimeout(() => next("q15"), 400); }} />
              ))}
            </div>
          </div>
        )}

        {step === "q15" && (
          <div className="max-w-2xl mx-auto animate-fade-in-up">
            <QHeader n={15} />
            <h2 className="text-3xl md:text-4xl font-black mb-4">How fast do you make <span className="text-[#FF8900]">decisions</span>?</h2>
            <p className="text-gray-500 mb-8">Speed of implementation = speed of results.</p>
            <div className="space-y-3">
              {[
                "Immediately — when I see it, I move",
                "Fast — within 24-48 hours",
                "A few days — I sleep on everything",
                "Weeks — I need to analyze thoroughly",
                "I overthink and usually miss the window",
              ].map((o) => (
                <Opt key={o} label={o} selected={a15 === o} onClick={() => { setA15(o); setTimeout(() => next("q16"), 400); }} />
              ))}
            </div>
          </div>
        )}

        {step === "q16" && (
          <div className="max-w-2xl mx-auto animate-fade-in-up">
            <QHeader n={16} />
            <h2 className="text-3xl md:text-4xl font-black mb-4">How do you handle <span className="text-[#DC2626]">discomfort</span>?</h2>
            <p className="text-gray-500 mb-8">Growth lives outside the comfort zone.</p>
            <div className="space-y-3">
              {[
                "I thrive in discomfort — it's where growth happens",
                "I can handle it when I see the purpose",
                "I resist it but push through eventually",
                "I avoid it whenever possible",
                "I seek it out deliberately",
              ].map((o) => (
                <Opt key={o} label={o} selected={a16 === o} onClick={() => { setA16(o); setTimeout(() => next("q17"), 400); }} />
              ))}
            </div>
          </div>
        )}

        {step === "q17" && (
          <div className="max-w-2xl mx-auto animate-fade-in-up">
            <QHeader n={17} />
            <h2 className="text-3xl md:text-4xl font-black mb-4">What <span className="text-[#FF8900]">accountability</span> style works best for you?</h2>
            <p className="text-gray-500 mb-8">How do you perform at your peak?</p>
            <div className="space-y-3">
              {[
                "External accountability — I need a coach or mentor pushing me",
                "Peer accountability — I perform best in a group",
                "Self-driven — I just need the right framework",
                "Competition — I need someone to beat",
                "Deadlines and structure — I need the container",
              ].map((o) => (
                <Opt key={o} label={o} selected={a17 === o} onClick={() => { setA17(o); setTimeout(() => next("q18"), 400); }} />
              ))}
            </div>
          </div>
        )}

        {/* ═══ INCOME & FINANCIAL (Q18-Q20) ═══ */}

        {step === "q18" && (
          <div className="max-w-2xl mx-auto animate-fade-in-up">
            <QHeader n={18} />
            <p className="text-[#DC2626] font-mono text-xs tracking-widest mb-4">SECTION: FINANCIAL READINESS</p>
            <h2 className="text-3xl md:text-4xl font-black mb-4">What is your current <span className="text-[#FF8900]">personal annual income</span>?</h2>
            <p className="text-gray-500 mb-8">This helps us calibrate the ROI analysis.</p>
            <div className="relative mb-8">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#FF8900] text-2xl font-bold">$</span>
              <input
                type="text"
                value={a18Input}
                onChange={(e) => handleIncomeInput(e.target.value)}
                placeholder="250,000"
                className="w-full pl-12 pr-6 py-5 bg-[#111] border border-white/10 rounded-xl text-2xl font-mono text-white focus:border-[#FF8900] focus:outline-none focus:ring-2 focus:ring-[#FF8900]/20 transition-all"
              />
            </div>
            <button
              onClick={() => a18.length > 0 && next("q19")}
              disabled={a18.length === 0}
              className="w-full px-8 py-4 bg-[#FF8900] hover:bg-[#e07a00] disabled:bg-gray-700 disabled:cursor-not-allowed text-black font-bold rounded-xl transition-all"
            >
              NEXT →
            </button>
          </div>
        )}

        {step === "q19" && (
          <div className="max-w-2xl mx-auto animate-fade-in-up">
            <QHeader n={19} />
            <h2 className="text-3xl md:text-4xl font-black mb-4">How much <span className="text-[#FF8900]">liquid capital</span> do you have available?</h2>
            <p className="text-gray-500 mb-8">Available for investment within 30 days.</p>
            <div className="space-y-3">
              {[
                "Under $25K",
                "$25K – $50K",
                "$50K – $100K",
                "$100K – $250K",
                "$250K – $500K",
                "$500K+",
                "$1M+ — capital is not the constraint",
              ].map((o) => (
                <Opt key={o} label={o} selected={a19 === o} onClick={() => { setA19(o); setTimeout(() => next("q20"), 400); }} />
              ))}
            </div>
          </div>
        )}

        {step === "q20" && (
          <div className="max-w-2xl mx-auto animate-fade-in-up">
            <QHeader n={20} />
            <h2 className="text-3xl md:text-4xl font-black mb-4">When are you ready to <span className="text-[#FF8900]">start</span>?</h2>
            <p className="text-gray-500 mb-8">Timing matters. Speed matters more.</p>
            <div className="space-y-3">
              {[
                "Now — I'm ready to move immediately",
                "Within 30 days",
                "Within 90 days",
                "6 months — I need to plan",
                "I'm exploring — no timeline yet",
              ].map((o) => (
                <Opt key={o} label={o} selected={a20 === o} onClick={() => { setA20(o); setTimeout(() => next("q21"), 400); }} />
              ))}
            </div>
          </div>
        )}

        {/* ═══ BUSINESS METRICS (Q21-Q23) ═══ */}

        {step === "q21" && (
          <div className="max-w-2xl mx-auto animate-fade-in-up">
            <QHeader n={21} />
            <p className="text-[#DC2626] font-mono text-xs tracking-widest mb-4">SECTION: BUSINESS METRICS</p>
            <h2 className="text-3xl md:text-4xl font-black mb-4">What is your <span className="text-[#FF8900]">profit margin</span>?</h2>
            <p className="text-gray-500 mb-8">Revenue is vanity. Profit is sanity.</p>
            <div className="space-y-3">
              {[
                "Negative — not profitable yet",
                "0 – 10% — barely breaking even",
                "10% – 20% — healthy but could be better",
                "20% – 30% — strong margins",
                "30%+ — highly profitable",
                "40%+ — exceptional unit economics",
                "I don't know — that's part of the problem",
              ].map((o) => (
                <Opt key={o} label={o} selected={a21 === o} onClick={() => { setA21(o); setTimeout(() => next("q22"), 400); }} />
              ))}
            </div>
          </div>
        )}

        {step === "q22" && (
          <div className="max-w-2xl mx-auto animate-fade-in-up">
            <QHeader n={22} />
            <h2 className="text-3xl md:text-4xl font-black mb-4">What is your average <span className="text-[#FF8900]">customer lifetime value</span>?</h2>
            <p className="text-gray-500 mb-8">The single most important number in business.</p>
            <div className="space-y-3">
              {[
                "Under $1K",
                "$1K – $5K",
                "$5K – $10K",
                "$10K – $50K",
                "$50K – $100K",
                "$100K+ — enterprise-level relationships",
                "I haven't calculated this yet",
              ].map((o) => (
                <Opt key={o} label={o} selected={a22 === o} onClick={() => { setA22(o); setTimeout(() => next("q23"), 400); }} />
              ))}
            </div>
          </div>
        )}

        {step === "q23" && (
          <div className="max-w-2xl mx-auto animate-fade-in-up">
            <QHeader n={23} />
            <h2 className="text-3xl md:text-4xl font-black mb-4">Why <span className="text-[#FF8900]">this mastermind</span>, why <span className="text-[#DC2626]">now</span>?</h2>
            <p className="text-gray-500 mb-8">The most important question. Be real.</p>
            <div className="space-y-3">
              {[
                "I need systems and technology I can't build alone",
                "I want access to capital and family office networks",
                "I need a complete business transformation",
                "I'm stuck and I need someone who's been where I'm going",
                "I want proximity to a builder, not a talker",
                "I've tried everything else — this feels different",
                "I want the full mind, body, business experience",
                "I'm ready for the next level and tired of playing small",
              ].map((o) => (
                <Opt key={o} label={o} selected={a23 === o} onClick={() => { setA23(o); setTimeout(() => next("results"), 400); }} />
              ))}
            </div>
          </div>
        )}

        {/* ═══ RESULTS / READINESS REPORT ═══ */}
        {step === "results" && (
          <div className="animate-fade-in-up">
            <div className="text-center mb-16">
              <div className="inline-block px-4 py-1 rounded-full border border-[#DC2626]/30 text-[#DC2626] text-xs font-mono tracking-widest mb-6">
                ▶ READINESS REPORT COMPLETE
              </div>
              <h2 className="text-3xl md:text-5xl font-black mb-4">
                YOUR <span className="text-[#FF8900]">READINESS SCORE</span>
              </h2>
              <div className="text-5xl md:text-7xl font-black text-[#FF8900] my-8">
                <AnimatedNumber value={overallScore} prefix="" suffix="%" />
              </div>
              <p className="text-gray-500 font-mono text-sm mb-4">OVERALL READINESS · BASED ON YOUR RESPONSES</p>
              <div className="bg-[#111] border border-[#FF8900]/20 rounded-2xl p-6 inline-block">
                <p className="text-gray-400 font-mono text-sm mb-2">RECOMMENDED PROGRAM</p>
                <div className="text-3xl md:text-4xl font-black text-white">
                  {recommendedProgram === "3-month" ? "90-Day Cohort" : "1-Week Immersion"}
                </div>
                <div className="text-2xl font-black text-[#FF8900] mt-2">{fmt(recommendedPrice)}</div>
              </div>
            </div>

            {/* Dimension Scores */}
            <div className="bg-[#111] border border-white/5 rounded-2xl p-8 mb-8">
              <h3 className="text-[#FF8900] font-mono text-sm mb-6 tracking-widest">READINESS BY DIMENSION</h3>
              <Bar label="BUSINESS READINESS" value={scores.business} max={100} color="#FF8900" />
              <Bar label="PERSONAL GROWTH" value={scores.personal} max={100} color="#06B6D4" />
              <Bar label="PROFESSIONAL GROWTH" value={scores.professional} max={100} color="#2DD4BF" />
              <Bar label="MENTAL STATE" value={scores.mental} max={100} color="#D946EF" />
              <Bar label="FINANCIAL READINESS" value={scores.financial} max={100} color="#DC2626" />
            </div>

            {/* ROI Projection */}
            <div className="bg-[#111] border border-white/5 rounded-2xl p-8 mb-8">
              <h3 className="text-[#FF8900] font-mono text-sm mb-6 tracking-widest">ROI PROJECTION</h3>
              <div className="space-y-4 font-mono text-sm">
                <div className="flex justify-between border-b border-white/5 pb-3">
                  <span className="text-gray-400">Your Current Income</span>
                  <span className="text-white font-bold">{fmt(income)}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-3">
                  <span className="text-gray-400">Projected 3X Income (Year 1)</span>
                  <span className="text-[#FF8900] font-bold">{fmt(income * 3)}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-3">
                  <span className="text-gray-400">Program Investment</span>
                  <span className="text-white font-bold">{fmt(recommendedPrice)}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-3">
                  <span className="text-gray-400">10-Year Lifetime Value</span>
                  <span className="text-[#FF8900] font-bold">{fmt(lifetimeValue)}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-3">
                  <span className="text-gray-400">Investment as % of Lifetime Value</span>
                  <span className="text-[#DC2626] font-bold">{investmentPct.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-[#FF8900] font-bold">Projected First-Year ROI</span>
                  <span className="text-[#FF8900] font-bold text-lg">{projectedROI}X</span>
                </div>
              </div>
            </div>

            {/* Investment vs Value Bar */}
            <div className="bg-[#111] border border-white/5 rounded-2xl p-8 mb-8">
              <h3 className="text-[#FF8900] font-mono text-sm mb-6 tracking-widest">INVESTMENT vs LIFETIME VALUE</h3>
              <ValBar label="Program Investment" value={recommendedPrice} max={lifetimeValue} color="#DC2626" />
              <ValBar label="10-Year Income Value" value={lifetimeValue} max={lifetimeValue} color="#FF8900" />
              <ValBar label="Projected 3X Income (Year 1)" value={income * 3} max={lifetimeValue} color="#06B6D4" />
            </div>

            {/* Candidate Profile */}
            <div className="bg-[#111] border border-[#FF8900]/10 rounded-2xl p-8 mb-8 text-center">
              <h3 className="text-2xl font-black mb-4">Your <span className="text-[#FF8900]">Candidate Profile</span></h3>
              <p className="text-gray-400 mb-6 max-w-xl mx-auto">
                Based on your responses, you demonstrate the characteristics we look for in mastermind candidates:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { icon: "🎯", label: "Driven", score: scores.mental },
                  { icon: "📊", label: "Data-Minded", score: scores.business },
                  { icon: "🚀", label: "Growth-Oriented", score: scores.professional },
                  { icon: "💎", label: "Investment Ready", score: scores.financial },
                ].map((h) => (
                  <div key={h.label} className="bg-[#0a0a0a] rounded-xl p-4 border border-white/5">
                    <div className="text-2xl mb-2">{h.icon}</div>
                    <span className="text-sm">{h.label}</span>
                    <div className="text-[#FF8900] font-mono text-xs mt-1">{h.score}%</div>
                  </div>
                ))}
              </div>
              <div className="bg-[#DC2626]/5 border border-[#DC2626]/20 rounded-xl p-6">
                <p className="text-xl font-black text-white">
                  {overallScore >= 70
                    ? "You are an exceptional candidate for the 90-Day Cohort."
                    : overallScore >= 50
                    ? "You are a strong candidate for the 1-Week Immersion."
                    : "The 1-Week Immersion is the perfect starting point for you."}
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Your readiness profile indicates {overallScore >= 70 ? "high" : "strong"} alignment with our program requirements.
                </p>
              </div>
            </div>

            {/* Program Recommendation */}
            <div className="bg-gradient-to-b from-[#1a1a1a] to-[#111] border border-[#FF8900]/20 rounded-2xl p-8 md:p-12 mb-8">
              <div className="text-center mb-8">
                <p className="text-[#FF8900] font-mono text-sm tracking-widest mb-2">YOUR RECOMMENDED PATH</p>
                <h3 className="text-3xl md:text-4xl font-black mb-2">
                  {recommendedProgram === "3-month" ? "90-Day Caribbean Cohort" : "7-Day Immersive Retreat"}
                </h3>
                <p className="text-gray-400">
                  {recommendedProgram === "3-month"
                    ? "Full transformation. Daily access. Total immersion."
                    : "Intensive strategy. Rapid system builds. Immediate impact."}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className={`bg-[#0a0a0a] border rounded-2xl p-6 text-center ${recommendedProgram === "1-week" ? "border-[#FF8900]/30" : "border-white/10"}`}>
                  {recommendedProgram === "1-week" && <div className="text-[#FF8900] font-mono text-xs tracking-widest mb-2">← RECOMMENDED FOR YOU</div>}
                  <p className="text-gray-500 font-mono text-xs tracking-widest mb-3">1-WEEK IMMERSION</p>
                  <div className="text-4xl font-black text-white mb-2">$35,000</div>
                  <div className="border-t border-white/5 pt-4 space-y-2 text-sm text-gray-400 text-left">
                    <p>✦ 7 days on a private Caribbean island</p>
                    <p>✦ 1-on-1 strategy & system build sessions</p>
                    <p>✦ Full tech ecosystem access (6 months)</p>
                    <p>✦ Accommodations & meals included</p>
                  </div>
                </div>
                <div className={`bg-[#0a0a0a] border rounded-2xl p-6 text-center ${recommendedProgram === "3-month" ? "border-[#FF8900]/30" : "border-white/10"}`}>
                  {recommendedProgram === "3-month" && <div className="text-[#FF8900] font-mono text-xs tracking-widest mb-2">← RECOMMENDED FOR YOU</div>}
                  <p className="text-gray-500 font-mono text-xs tracking-widest mb-3">90-DAY COHORT</p>
                  <div className="text-4xl font-black text-white mb-2">$100,000</div>
                  <div className="border-t border-white/5 pt-4 space-y-2 text-sm text-gray-400 text-left">
                    <p>✦ Live on the island for 90 days</p>
                    <p>✦ Up to 5 people, coed cohort</p>
                    <p>✦ Daily working sessions & transformation</p>
                    <p>✦ Capital introductions & exit architecture</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Guarantee */}
            <div className="bg-[#DC2626]/5 border border-[#DC2626]/20 rounded-2xl p-8 text-center mb-8">
              <p className="text-[#DC2626] font-mono text-sm tracking-widest mb-2">90-DAY GUARANTEE</p>
              <h3 className="text-2xl font-black mb-3">Not fully satisfied? Stay another 90 days. <span className="text-[#FF8900]">FREE.</span></h3>
              <p className="text-gray-400">The work works if you do the work. 180 days if that&apos;s what it takes.</p>
            </div>

            {/* Final CTA */}
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg mb-4">Your readiness score qualifies you for the next step.</p>
              <h2 className="text-3xl md:text-5xl font-black mb-8">
                Are you <span className="text-[#FF8900]">ready</span>?
              </h2>
              <a
                href="sms:223-400-8146?body=I'M%20READY%20-%20Mastermind%20Application%20Complete"
                className="inline-block px-16 py-6 bg-[#FF8900] hover:bg-[#e07a00] text-black font-black text-2xl rounded-2xl transition-all duration-200 hover:scale-105 shadow-[0_0_60px_rgba(255,137,0,0.4)] mb-6"
              >
                I AM READY
              </a>
              <p className="text-gray-400 mb-2">Text <span className="font-bold text-white">&quot;I&apos;M READY&quot;</span> to</p>
              <a href="sms:223-400-8146?body=I'M%20READY%20-%20Mastermind%20Application%20Complete" className="text-4xl md:text-5xl font-black text-[#FF8900] hover:text-[#ffa033] transition-colors">
                223-400-8146
              </a>
              <p className="text-gray-600 text-sm mt-8 font-mono">
                Your application has been submitted. A member of our team will review your readiness profile and contact you within 48 hours.
              </p>
            </div>

            {/* Back */}
            <div className="text-center pt-8 border-t border-white/5">
              <Link href="/mastermind" className="text-gray-600 text-sm hover:text-[#FF8900] transition-colors">
                ← Back to Mastermind
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
