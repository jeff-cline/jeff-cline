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

function AnimatedNumber({ value, duration = 2000, prefix = "$" }: { value: number; duration?: number; prefix?: string }) {
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
  return <span>{prefix}{display.toLocaleString()}</span>;
}

/* ─── steps ─── */
type Step = "intro" | "q1" | "q2" | "q3" | "q4" | "q5" | "q6" | "q7" | "q8" | "q9" | "q10" | "q11" | "q12" | "q13" | "q14" | "q15" | "q16" | "results";

const TOTAL_Q = 16;

export default function InvestmentCalculator() {
  const [step, setStep] = useState<Step>("intro");
  /* answers */
  const [aRisk, setARisk] = useState("");
  const [aInvHistory, setAInvHistory] = useState("");
  const [aPassive, setAPassive] = useState("");
  const [aMental, setAMental] = useState("");
  const [aPeakIncome, setAPeakIncome] = useState<number>(0);
  const [aPeakInput, setAPeakInput] = useState("");
  const [aMissed, setAMissed] = useState("");
  const [aMultiplier, setAMultiplier] = useState(1);
  const [aTimeMgmt, setATimeMgmt] = useState("");
  const [aMotivation, setAMotivation] = useState("");
  const [aLargestReturn, setALargestReturn] = useState("");
  const [aLargestLoss, setALargestLoss] = useState("");
  const [aLifeIns, setALifeIns] = useState("");
  const [aTimeframe, setATimeframe] = useState("");
  const [aDecisionMakers, setADecisionMakers] = useState("");
  const [aAdvisors, setAAdvisors] = useState("");
  const [aSupport, setASupport] = useState("");
  const [showResults, setShowResults] = useState(false);

  const next = useCallback((s: Step) => {
    setStep(s);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const qNum: Record<string, number> = { q1:1, q2:2, q3:3, q4:4, q5:5, q6:6, q7:7, q8:8, q9:9, q10:10, q11:11, q12:12, q13:13, q14:14, q15:15, q16:16 };
  const progress = step === "intro" ? 0 : step === "results" ? 100 : Math.round(((qNum[step] || 0) / TOTAL_Q) * 100);

  /* calculations */
  const peakIncome = aPeakIncome || 100000;
  const targetIncome = peakIncome * aMultiplier;
  const lifeExt1 = 7;
  const lifeExt2 = 12;
  const valueRange1 = lifeExt1 * peakIncome;
  const valueRange2 = lifeExt2 * targetIncome;
  const avgValue = (valueRange1 + valueRange2) / 2;
  const weeklyValue = avgValue / 52;
  const hourlyValue = weeklyValue / 40;
  const thirtyTwoMin = hourlyValue * (32 / 60);
  const costPerHour = 30000 / (90 * 24);
  const pctOfValue = (30000 / avgValue) * 100;

  useEffect(() => {
    if (step === "results") {
      const t = setTimeout(() => setShowResults(true), 300);
      return () => clearTimeout(t);
    }
  }, [step]);

  const handlePeakIncome = (raw: string) => {
    const digits = raw.replace(/[^0-9]/g, "");
    setAPeakIncome(Number(digits));
    setAPeakInput(digits ? Number(digits).toLocaleString() : "");
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Best Investment Calculator",
            url: "https://jeff-cline.com/investment-calculator",
            description: "Data-driven investment calculator that analyzes your risk profile, income, and life goals to calculate the value of investing in yourself. 16 questions, 4 minutes, priceless insight.",
            applicationCategory: "FinanceApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            creator: { "@type": "Person", name: "Jeff Cline", url: "https://jeff-cline.com" },
          }),
        }}
      />
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
              DATA-DRIVEN ANALYSIS v2.0
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="text-[#FF8900]">BEST</span> INVESTMENT<br />
              <span className="text-[#DC2626]">CALCULATOR</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-6 leading-relaxed">
              From a geek&apos;s perspective... <span className="text-white font-semibold">everything is context.</span>{" "}
              Data drives decisions. Not motivation. Not mantras. <span className="text-[#FF8900]">Data.</span>
            </p>
            <p className="text-gray-500 max-w-xl mx-auto mb-12">
              Sometimes you need more than inspiration — you need handles, KPIs, metrics.
              You&apos;re a &quot;what do I put in to get out&quot; type of person. So let&apos;s run the numbers.
              Answer the questions and you&apos;ll be shocked at how your life will change by looking at things differently.
            </p>
            <button
              onClick={() => next("q1")}
              className="px-12 py-5 bg-[#FF8900] hover:bg-[#e07a00] text-black font-black text-lg rounded-xl transition-all duration-200 hover:scale-105 shadow-[0_0_40px_rgba(255,137,0,0.3)]"
            >
              CALCULATE NOW →
            </button>
            <p className="text-gray-600 text-sm mt-6 font-mono">{TOTAL_Q} questions · 4 minutes · priceless insight</p>
          </div>
        )}

        {/* ═══ Q1: Risk Profile ═══ */}
        {step === "q1" && (
          <div className="max-w-2xl mx-auto animate-fade-in-up">
            <QHeader n={1} />
            <h2 className="text-3xl md:text-4xl font-black mb-4">What is your <span className="text-[#FF8900]">risk profile</span>?</h2>
            <p className="text-gray-500 mb-8">Every investment has a risk tolerance. What&apos;s yours?</p>
            <div className="space-y-3">
              {[
                "Conservative — I protect capital at all costs",
                "Moderate — Balanced risk for steady growth",
                "Aggressive — High risk, high reward",
                "Very Aggressive — I go all in when I believe",
                "Calculated — I only move when the data says move",
              ].map((o) => (
                <Opt key={o} label={o} selected={aRisk === o} onClick={() => { setARisk(o); setTimeout(() => next("q2"), 400); }} />
              ))}
            </div>
          </div>
        )}

        {/* ═══ Q2: Investment History ═══ */}
        {step === "q2" && (
          <div className="max-w-2xl mx-auto animate-fade-in-up">
            <QHeader n={2} />
            <h2 className="text-3xl md:text-4xl font-black mb-4">What have you <span className="text-[#FF8900]">invested in</span>?</h2>
            <p className="text-gray-500 mb-8">Where has your money been working?</p>
            <div className="space-y-3">
              {[
                "Stocks & Equities",
                "Real Estate",
                "Private Equity / Venture Capital",
                "Crypto / Digital Assets",
                "Business Ownership",
                "Commodities / Precious Metals",
                "Myself — coaching, education, health",
                "I haven't really invested in anything yet",
              ].map((o) => (
                <Opt key={o} label={o} selected={aInvHistory === o} onClick={() => { setAInvHistory(o); setTimeout(() => next("q3"), 400); }} />
              ))}
            </div>
          </div>
        )}

        {/* ═══ Q3: Passive Investments ═══ */}
        {step === "q3" && (
          <div className="max-w-2xl mx-auto animate-fade-in-up">
            <QHeader n={3} />
            <h2 className="text-3xl md:text-4xl font-black mb-4">How much do you currently have in <span className="text-[#FF8900]">passive investments</span>?</h2>
            <p className="text-gray-500 mb-8">Anything generating returns without your daily involvement.</p>
            <div className="space-y-3">
              {[
                "Under $50K",
                "$50K – $250K",
                "$250K – $500K",
                "$500K – $1M",
                "$1M – $5M",
                "$5M – $10M",
                "$10M+",
                "I don't have any passive investments",
              ].map((o) => (
                <Opt key={o} label={o} selected={aPassive === o} onClick={() => { setAPassive(o); setTimeout(() => next("q4"), 400); }} />
              ))}
            </div>
          </div>
        )}

        {/* ═══ Q4: Mental State (moved from 1) ═══ */}
        {step === "q4" && (
          <div className="max-w-2xl mx-auto animate-fade-in-up">
            <QHeader n={4} />
            <h2 className="text-3xl md:text-4xl font-black mb-8">Where are you now <span className="text-[#FF8900]">mentally</span>?</h2>
            <div className="space-y-3">
              {[
                "I want to make a change",
                "I'm willing to make a change",
                "I'm doing it for me",
                "I'm doing it for someone else",
                "I'm doing it out of spite",
                "I'm exhausted and want something different",
                "I've had a trigger moment and I'm ready",
              ].map((o) => (
                <Opt key={o} label={o} selected={aMental === o} onClick={() => { setAMental(o); setTimeout(() => next("q5"), 400); }} />
              ))}
            </div>
          </div>
        )}

        {/* ═══ Q5: Peak Income ═══ */}
        {step === "q5" && (
          <div className="max-w-2xl mx-auto animate-fade-in-up">
            <QHeader n={5} />
            <h2 className="text-3xl md:text-4xl font-black mb-4">What was your biggest annual income?</h2>
            <p className="text-gray-500 mb-8">Be honest. This is for you.</p>
            <div className="relative mb-8">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#FF8900] text-2xl font-bold">$</span>
              <input
                type="text"
                value={aPeakInput}
                onChange={(e) => handlePeakIncome(e.target.value)}
                placeholder="150,000"
                className="w-full pl-12 pr-6 py-5 bg-[#111] border border-white/10 rounded-xl text-2xl font-mono text-white focus:border-[#FF8900] focus:outline-none focus:ring-2 focus:ring-[#FF8900]/20 transition-all"
              />
            </div>
            <button
              onClick={() => aPeakIncome > 0 && next("q6")}
              disabled={aPeakIncome <= 0}
              className="w-full px-8 py-4 bg-[#FF8900] hover:bg-[#e07a00] disabled:bg-gray-700 disabled:cursor-not-allowed text-black font-bold rounded-xl transition-all"
            >
              NEXT →
            </button>
          </div>
        )}

        {/* ═══ Q6: Would You Be Missed (moved from 2) ═══ */}
        {step === "q6" && (
          <div className="max-w-2xl mx-auto animate-fade-in-up">
            <QHeader n={6} />
            <h2 className="text-3xl md:text-4xl font-black mb-8">Would you be <span className="text-[#DC2626]">missed</span> if you were gone?</h2>
            <div className="space-y-3">
              {[
                "Yes, I've made an impact and would leave a legacy",
                "My family will come to my funeral, but it'll be a small one",
                "I don't really know — I haven't built relationships of value",
                "Probably not, most people hate me",
                "I don't know, I've never thought about it",
              ].map((o) => (
                <Opt key={o} label={o} selected={aMissed === o} onClick={() => { setAMissed(o); setTimeout(() => next("q7"), 400); }} />
              ))}
            </div>
          </div>
        )}

        {/* ═══ Q7: Target Multiplier ═══ */}
        {step === "q7" && (
          <div className="max-w-2xl mx-auto animate-fade-in-up">
            <QHeader n={7} />
            <h2 className="text-3xl md:text-4xl font-black mb-4">What would you like your income to be?</h2>
            <p className="text-gray-500 mb-2">Your peak was <span className="text-[#FF8900] font-bold">{fmt(aPeakIncome)}</span>. Where do you want to go?</p>
            <p className="text-gray-600 text-sm mb-8 font-mono">SELECT YOUR TARGET MULTIPLIER</p>
            <div className="grid grid-cols-5 gap-3 mb-6">
              {[2, 3, 4, 5, 10].map((m) => (
                <button
                  key={m}
                  onClick={() => { setAMultiplier(m); setTimeout(() => next("q8"), 400); }}
                  className={`py-6 rounded-xl border text-center transition-all duration-200 ${
                    aMultiplier === m
                      ? "border-[#FF8900] bg-[#FF8900]/10 text-[#FF8900]"
                      : "border-white/10 bg-[#111] hover:border-[#FF8900]/50"
                  }`}
                >
                  <div className="text-2xl font-black">{m}X</div>
                  <div className="text-xs text-gray-500 mt-1 font-mono">{fmtK(aPeakIncome * m)}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ═══ Q8: Time Managing Investments ═══ */}
        {step === "q8" && (
          <div className="max-w-2xl mx-auto animate-fade-in-up">
            <QHeader n={8} />
            <h2 className="text-3xl md:text-4xl font-black mb-4">How much time do you want to spend <span className="text-[#FF8900]">managing</span> your investments daily?</h2>
            <p className="text-gray-500 mb-8">Time is the one asset you can&apos;t get back.</p>
            <div className="space-y-3">
              {[
                "30 minutes — if it provides a greater return",
                "1 hour — I enjoy being involved",
                "None — I want totally hands-free",
                "I already spend too much time on it",
                "I'd spend whatever it takes for the right opportunity",
              ].map((o) => (
                <Opt key={o} label={o} selected={aTimeMgmt === o} onClick={() => { setATimeMgmt(o); setTimeout(() => next("q9"), 400); }} />
              ))}
            </div>
          </div>
        )}

        {/* ═══ Q9: Motivation (moved from 3) ═══ */}
        {step === "q9" && (
          <div className="max-w-2xl mx-auto animate-fade-in-up">
            <QHeader n={9} />
            <h2 className="text-3xl md:text-4xl font-black mb-8">What <span className="text-[#FF8900]">motivates</span> you?</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Playtime / Fun", icon: "🎮" },
                { label: "Adrenaline", icon: "⚡" },
                { label: "Money / Fortune", icon: "💰" },
                { label: "Fame", icon: "🌟" },
              ].map((o) => (
                <button
                  key={o.label}
                  onClick={() => { setAMotivation(o.label); setTimeout(() => next("q10"), 400); }}
                  className={`p-6 rounded-xl border text-center transition-all duration-200 ${
                    aMotivation === o.label
                      ? "border-[#FF8900] bg-[#FF8900]/10"
                      : "border-white/10 bg-[#111] hover:border-[#FF8900]/50"
                  }`}
                >
                  <div className="text-4xl mb-3">{o.icon}</div>
                  <div className="font-semibold">{o.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ═══ Q10: Largest Return ═══ */}
        {step === "q10" && (
          <div className="max-w-2xl mx-auto animate-fade-in-up">
            <QHeader n={10} />
            <h2 className="text-3xl md:text-4xl font-black mb-4">What&apos;s the <span className="text-[#FF8900]">largest return</span> you&apos;ve had on an investment?</h2>
            <p className="text-gray-500 mb-8">Winners remember their wins.</p>
            <div className="space-y-3">
              {[
                "Under 10% — safe and steady",
                "10-50% — solid returns",
                "50-100% — I've had a great win",
                "100%+ — I've doubled my money or more",
                "I've had a 10X+ return at least once",
                "I haven't tracked my returns closely",
              ].map((o) => (
                <Opt key={o} label={o} selected={aLargestReturn === o} onClick={() => { setALargestReturn(o); setTimeout(() => next("q11"), 400); }} />
              ))}
            </div>
          </div>
        )}

        {/* ═══ Q11: Largest Loss ═══ */}
        {step === "q11" && (
          <div className="max-w-2xl mx-auto animate-fade-in-up">
            <QHeader n={11} />
            <h2 className="text-3xl md:text-4xl font-black mb-4">What was your <span className="text-[#DC2626]">largest single loss</span>?</h2>
            <p className="text-gray-500 mb-8">Every investor has scars. Own them.</p>
            <div className="space-y-3">
              {[
                "Under $10K — I play it safe",
                "$10K - $50K — it stung but I recovered",
                "$50K - $250K — a hard lesson learned",
                "$250K+ — it nearly broke me",
                "I've lost more than I care to admit",
                "I haven't lost anything significant yet",
              ].map((o) => (
                <Opt key={o} label={o} selected={aLargestLoss === o} onClick={() => { setALargestLoss(o); setTimeout(() => next("q12"), 400); }} />
              ))}
            </div>
          </div>
        )}

        {/* ═══ Q12: Life Insurance ═══ */}
        {step === "q12" && (
          <div className="max-w-2xl mx-auto animate-fade-in-up">
            <QHeader n={12} />
            <h2 className="text-3xl md:text-4xl font-black mb-4">How much <span className="text-[#FF8900]">life insurance</span> do you carry?</h2>
            <p className="text-gray-500 mb-8">Protection, legacy, or strategy — everyone has a reason.</p>
            <div className="space-y-3">
              {[
                "None — I don't have life insurance",
                "I don't believe in it",
                "$1M",
                "$2M – $5M",
                "$5M – $10M",
                "$10M+",
                "A lot — more than I probably need",
                "I use life insurance as a tax engine & legacy lever",
                "I have a strategic reason beyond basic coverage",
              ].map((o) => (
                <Opt key={o} label={o} selected={aLifeIns === o} onClick={() => { setALifeIns(o); setTimeout(() => next("q13"), 400); }} />
              ))}
            </div>
          </div>
        )}

        {/* ═══ Q13: Timeframe to Deploy ═══ */}
        {step === "q13" && (
          <div className="max-w-2xl mx-auto animate-fade-in-up">
            <QHeader n={13} />
            <h2 className="text-3xl md:text-4xl font-black mb-4">What&apos;s your <span className="text-[#FF8900]">timeframe</span> to deploy capital?</h2>
            <p className="text-gray-500 mb-8">When you see an opportunity, how fast do you move?</p>
            <div className="space-y-3">
              {[
                "Immediately — when I see it, I move",
                "Days — I need to sleep on it",
                "Weeks — I do my due diligence",
                "Months — I analyze everything first",
                "I overthink and usually miss the window",
              ].map((o) => (
                <Opt key={o} label={o} selected={aTimeframe === o} onClick={() => { setATimeframe(o); setTimeout(() => next("q14"), 400); }} />
              ))}
            </div>
          </div>
        )}

        {/* ═══ Q14: Decision Makers ═══ */}
        {step === "q14" && (
          <div className="max-w-2xl mx-auto animate-fade-in-up">
            <QHeader n={14} />
            <h2 className="text-3xl md:text-4xl font-black mb-4">Are there <span className="text-[#FF8900]">other decision makers</span> on your investment strategy?</h2>
            <p className="text-gray-500 mb-8">Who else has a say in how you allocate capital?</p>
            <div className="space-y-3">
              {[
                "Just me — I make all the calls",
                "Spouse / Partner — we decide together",
                "Business partner(s)",
                "Financial advisor / wealth manager",
                "Board or investment committee",
                "Multiple stakeholders — it's complicated",
              ].map((o) => (
                <Opt key={o} label={o} selected={aDecisionMakers === o} onClick={() => { setADecisionMakers(o); setTimeout(() => next("q15"), 400); }} />
              ))}
            </div>
          </div>
        )}

        {/* ═══ Q15: Investment Advisors ═══ */}
        {step === "q15" && (
          <div className="max-w-2xl mx-auto animate-fade-in-up">
            <QHeader n={15} />
            <h2 className="text-3xl md:text-4xl font-black mb-4">What types of <span className="text-[#FF8900]">investment advisors</span> have you used?</h2>
            <p className="text-gray-500 mb-8">Who&apos;s been managing your money?</p>
            <div className="space-y-3">
              {[
                "Traditional financial advisor / broker",
                "Wealth management firm",
                "Robo-advisor (Betterment, Wealthfront, etc.)",
                "Self-directed — I manage everything myself",
                "CPA / Tax strategist",
                "Family office",
                "I've never used an advisor",
              ].map((o) => (
                <Opt key={o} label={o} selected={aAdvisors === o} onClick={() => { setAAdvisors(o); setTimeout(() => next("q16"), 400); }} />
              ))}
            </div>
          </div>
        )}

        {/* ═══ Q16: Support System ═══ */}
        {step === "q16" && (
          <div className="max-w-2xl mx-auto animate-fade-in-up">
            <QHeader n={16} />
            <h2 className="text-3xl md:text-4xl font-black mb-8">Who do you go to when times are <span className="text-[#DC2626]">tough</span>?</h2>
            <div className="space-y-3">
              {[
                "A close friend I lean on",
                "Spouse",
                "Family",
                "Pastor / Spiritual advisor",
                "I have no one — I'm an island",
              ].map((o) => (
                <Opt key={o} label={o} selected={aSupport === o} onClick={() => { setASupport(o); setTimeout(() => next("results"), 400); }} />
              ))}
            </div>
          </div>
        )}

        {/* ═══ RESULTS ═══ */}
        {step === "results" && (
          <div className="animate-fade-in-up">
            <div className="text-center mb-16">
              <div className="inline-block px-4 py-1 rounded-full border border-[#DC2626]/30 text-[#DC2626] text-xs font-mono tracking-widest mb-6">
                ▶ ANALYSIS COMPLETE
              </div>
              <h2 className="text-3xl md:text-5xl font-black mb-4">
                THE VALUE OF YOUR <span className="text-[#FF8900]">32 MINUTES</span>
              </h2>
              <div className="text-5xl md:text-7xl font-black text-[#FF8900] my-8">
                <AnimatedNumber value={Math.round(thirtyTwoMin)} />
              </div>
              <p className="text-gray-500 font-mono text-sm mb-8">PER SESSION · BASED ON YOUR DATA</p>
              <div className="bg-[#111] border border-[#FF8900]/20 rounded-2xl p-8 inline-block">
                <p className="text-gray-400 font-mono text-sm mb-2">THAT&apos;S AN</p>
                <div className="text-4xl md:text-6xl font-black text-white">
                  <AnimatedNumber value={Math.round(hourlyValue)} duration={2500} />
                  <span className="text-[#FF8900]">/hr</span>
                </div>
                <p className="text-[#FF8900] font-mono text-sm mt-2 tracking-widest">HOURLY RATE</p>
              </div>
            </div>

            {/* Math Breakdown */}
            <div className="bg-[#111] border border-white/5 rounded-2xl p-8 mb-8">
              <h3 className="text-[#FF8900] font-mono text-sm mb-6 tracking-widest">CALCULATION BREAKDOWN</h3>
              <div className="space-y-4 font-mono text-sm">
                <div className="flex justify-between border-b border-white/5 pb-3">
                  <span className="text-gray-400">Peak Annual Income</span>
                  <span className="text-white font-bold">{fmt(peakIncome)}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-3">
                  <span className="text-gray-400">Target Income ({aMultiplier}X)</span>
                  <span className="text-[#FF8900] font-bold">{fmt(targetIncome)}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-3">
                  <span className="text-gray-400">Conservative Life Extension</span>
                  <span className="text-white">+{lifeExt1} years</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-3">
                  <span className="text-gray-400">Aggressive Life Extension</span>
                  <span className="text-[#DC2626]">+{lifeExt2} years</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-3">
                  <span className="text-gray-400">Value Range (Low)</span>
                  <span className="text-white">{fmt(valueRange1)}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-3">
                  <span className="text-gray-400">Value Range (High)</span>
                  <span className="text-[#FF8900]">{fmt(valueRange2)}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-3">
                  <span className="text-gray-400">Weekly Value</span>
                  <span className="text-white">{fmt(weeklyValue)}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-3">
                  <span className="text-gray-400">Hourly Value</span>
                  <span className="text-white">{fmt(hourlyValue)}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-[#FF8900] font-bold">32-Minute Value</span>
                  <span className="text-[#FF8900] font-bold text-lg">{fmt(thirtyTwoMin)}</span>
                </div>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="bg-[#111] border border-white/5 rounded-2xl p-8 mb-8">
              <h3 className="text-[#FF8900] font-mono text-sm mb-6 tracking-widest">LIFE EXTENSION VALUE COMPARISON</h3>
              <Bar label="CONSERVATIVE: 30min/day + 10% fat loss (+7 yrs)" value={valueRange1} max={valueRange2} color="#FF8900" />
              <Bar label="AGGRESSIVE: 1hr 3x/wk + 40% fat loss (+12 yrs)" value={valueRange2} max={valueRange2} color="#DC2626" />
              <p className="text-gray-600 text-xs font-mono mt-4">Sources: Harvard T.H. Chan School of Public Health, Mayo Clinic Proceedings, JAMA Internal Medicine</p>
            </div>

            {/* Halo Effect */}
            <div className="bg-[#111] border border-[#FF8900]/10 rounded-2xl p-8 mb-8 text-center">
              <h3 className="text-2xl font-black mb-4">The <span className="text-[#FF8900]">Halo Effect</span></h3>
              <p className="text-gray-400 mb-6 max-w-xl mx-auto">
                Better energy. More happiness. Greater strength. A legacy worth leaving. Deeper relationships.
                The calculated value above is the <em>minimum</em>. The real value? Probably <span className="text-[#FF8900] font-bold">10X that</span>. But truly? <span className="text-[#DC2626] font-bold">Priceless.</span>
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["⚡ Energy", "😊 Happiness", "💪 Strength", "👑 Legacy"].map((h) => (
                  <div key={h} className="bg-[#0a0a0a] rounded-xl p-4 border border-white/5">
                    <span className="text-lg">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* #1 Investment */}
            <div className="text-center py-12 mb-8">
              <h2 className="text-4xl md:text-6xl font-black">
                <span className="text-[#FF8900]">YOU</span> are your <span className="text-[#DC2626]">#1</span> investment.
              </h2>
            </div>

            {/* Testimonials Scroller */}
            <div className="mb-16 overflow-hidden">
              <h3 className="text-center text-[#FF8900] font-mono text-sm tracking-widest mb-8">WHAT PEOPLE ARE SAYING</h3>
              <div className="flex gap-6 animate-[scroll_20s_linear_infinite] hover:[animation-play-state:paused]" style={{ width: "max-content" }}>
                {[
                  { quote: "I'm a totally different person — better today than I was in college!", author: "Private — Under NDA" },
                  { quote: "You don't really understand the word transformation until you live through it.", author: "Private — Under NDA" },
                  { quote: "Investing in myself is gonna provide multiple streams of ROI.", author: "Private — Under NDA" },
                  { quote: "The data doesn't lie. This mind, body, spirit, business accelerator growth journey has changed my life.", author: "Private — Under NDA" },
                  { quote: "I'm a totally different person — better today than I was in college!", author: "Private — Under NDA" },
                  { quote: "You don't really understand the word transformation until you live through it.", author: "Private — Under NDA" },
                  { quote: "Investing in myself is gonna provide multiple streams of ROI.", author: "Private — Under NDA" },
                  { quote: "The data doesn't lie. This mind, body, spirit, business accelerator growth journey has changed my life.", author: "Private — Under NDA" },
                ].map((t, i) => (
                  <div key={i} className="flex-shrink-0 w-[350px] bg-[#111] border border-white/10 rounded-2xl p-6">
                    <p className="text-gray-300 text-sm leading-relaxed mb-4 italic">&ldquo;{t.quote}&rdquo;</p>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#FF8900]/20 flex items-center justify-center">
                        <span className="text-[#FF8900] text-xs font-bold">✦</span>
                      </div>
                      <span className="text-gray-500 text-xs font-mono">{t.author}</span>
                    </div>
                  </div>
                ))}
              </div>
              <style jsx>{`
                @keyframes scroll {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-50%); }
                }
              `}</style>
            </div>

            {/* ─── THE OFFER ─── */}
            <div className="border-t border-[#FF8900]/20 pt-16">
              <div className="text-center mb-12">
                <p className="text-gray-500 font-mono text-sm mb-4">THE PROOF</p>
                <h3 className="text-3xl md:text-4xl font-black mb-6">
                  I was <span className="text-[#DC2626]">306 lbs.</span> Headed to <span className="text-[#FF8900]">220.</span>
                </h3>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-6 leading-relaxed">
                  And the biggest income years are in front of me. I am happier. Healthier. Over <span className="text-[#FF8900] font-bold">150 things</span> on my &quot;Done For The First Time&quot; list.
                </p>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-6 leading-relaxed">
                  I feel amazing. My friends, investors, business partners see a <span className="text-white font-semibold">different me</span>.
                </p>
                <p className="text-2xl font-black text-white max-w-2xl mx-auto mb-4">
                  The best investment I ever made was in <span className="text-[#FF8900]">myself</span> — doing the work.
                </p>
                <p className="text-lg text-gray-500 max-w-xl mx-auto">
                  A work in progress — but <span className="text-[#DC2626] font-bold">the work works if you do the work.</span>
                </p>
              </div>

              {/* The Program */}
              <div className="bg-gradient-to-b from-[#1a1a1a] to-[#111] border border-[#FF8900]/20 rounded-2xl p-8 md:p-12 mb-8">
                <div className="text-center mb-8">
                  <p className="text-[#FF8900] font-mono text-sm tracking-widest mb-2">THE PROGRAM</p>
                  <h3 className="text-3xl md:text-4xl font-black mb-2">90-Day Caribbean Immersion</h3>
                  <p className="text-gray-400">A complete transformation experience.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-10">
                  {[
                    "🏠 Boutique luxury home overlooking the Caribbean",
                    "👥 Dedicated team looking after you",
                    "🌊 Fully immersive experience — mind, body, business",
                    "💻 Work from paradise — Wi-Fi, take calls, creature comforts",
                    "🍽️ ALL INCLUSIVE (except transportation)",
                    "🔒 Private. Discreet. Results-focused.",
                  ].map((f) => (
                    <div key={f} className="flex items-start gap-3 text-gray-300">
                      <span className="text-lg">{f.slice(0, 2)}</span>
                      <span>{f.slice(3)}</span>
                    </div>
                  ))}
                </div>

                {/* Pricing Tiers */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 text-center">
                    <p className="text-gray-500 font-mono text-xs tracking-widest mb-3">SMALL COHORT</p>
                    <div className="text-4xl font-black text-white mb-2">$30,000</div>
                    <p className="text-gray-500 font-mono text-sm mb-4">PER PERSON</p>
                    <div className="border-t border-white/5 pt-4 space-y-2 text-sm text-gray-400">
                      <p>3–5 people per cohort</p>
                      <p>Group accountability</p>
                      <p>Shared luxury accommodations</p>
                      <p>Full program access</p>
                    </div>
                  </div>

                  <div className="bg-[#0a0a0a] border border-[#FF8900]/30 rounded-2xl p-6 text-center relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#FF8900] text-black text-xs font-bold rounded-full">PRIVATE</div>
                    <p className="text-[#FF8900] font-mono text-xs tracking-widest mb-3 mt-2">1 PERSON · PRIVATE</p>
                    <div className="text-4xl font-black text-[#FF8900] mb-2">$100,000</div>
                    <p className="text-gray-500 font-mono text-sm mb-4">ALL INCLUSIVE</p>
                    <div className="border-t border-[#FF8900]/10 pt-4 space-y-2 text-sm text-gray-400">
                      <p>Private luxury home</p>
                      <p>Dedicated personal team</p>
                      <p>Fully customized program</p>
                      <p>Complete privacy</p>
                    </div>
                  </div>

                  <div className="bg-[#0a0a0a] border border-[#DC2626]/30 rounded-2xl p-6 text-center relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#DC2626] text-white text-xs font-bold rounded-full">COUPLES</div>
                    <p className="text-[#DC2626] font-mono text-xs tracking-widest mb-3 mt-2">COUPLE · PRIVATE</p>
                    <div className="text-4xl font-black text-[#DC2626] mb-2">$175,000</div>
                    <p className="text-gray-500 font-mono text-sm mb-4">ALL INCLUSIVE</p>
                    <div className="border-t border-[#DC2626]/10 pt-4 space-y-2 text-sm text-gray-400">
                      <p>Private luxury home for two</p>
                      <p>Dedicated team</p>
                      <p>Transform together</p>
                      <p>Complete privacy &amp; exclusivity</p>
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

              {/* Amortization */}
              <div className="bg-[#111] border border-white/5 rounded-2xl p-8 mb-8">
                <h3 className="text-[#FF8900] font-mono text-sm mb-6 tracking-widest">INVESTMENT AMORTIZATION</h3>
                <div className="space-y-4 font-mono text-sm">
                  <div className="flex justify-between border-b border-white/5 pb-3">
                    <span className="text-gray-400">Cohort Investment</span>
                    <span className="text-white font-bold">$30,000</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-3">
                    <span className="text-gray-400">Your Calculated Life Value</span>
                    <span className="text-[#FF8900] font-bold">{fmt(avgValue)}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-3">
                    <span className="text-gray-400">Investment as % of Life Value</span>
                    <span className="text-[#DC2626] font-bold">{pctOfValue.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-3">
                    <span className="text-gray-400">Cost Per Hour (90 days)</span>
                    <span className="text-white">{fmt(costPerHour)}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-3">
                    <span className="text-gray-400">Cost Per Day</span>
                    <span className="text-white">{fmt(30000 / 90)}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-3">
                    <span className="text-gray-400">10-Year Annual Cost</span>
                    <span className="text-white">{fmt(3000)}/yr</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-[#FF8900] font-bold">10-Year ROI</span>
                    <span className="text-[#FF8900] font-bold text-lg">{Math.round(avgValue / 30000)}X</span>
                  </div>
                </div>
                <p className="text-gray-600 text-xs mt-6 font-mono text-center">
                  Even at 180 days (with the guarantee), you can&apos;t afford NOT to do it.
                </p>
              </div>

              {/* Bar: Investment vs Value */}
              <div className="bg-[#111] border border-white/5 rounded-2xl p-8 mb-12">
                <h3 className="text-[#FF8900] font-mono text-sm mb-6 tracking-widest">$30K vs YOUR LIFE VALUE</h3>
                <Bar label="Program Investment" value={30000} max={avgValue} color="#DC2626" />
                <Bar label="Your Life Value (Avg)" value={avgValue} max={avgValue} color="#FF8900" />
              </div>

              {/* Final CTA */}
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg mb-4">Don&apos;t do it unless you really want it.</p>
                <h2 className="text-3xl md:text-5xl font-black mb-8">
                  But if you&apos;re <span className="text-[#FF8900]">ready</span>...
                </h2>
                <a
                  href="sms:223-400-8146?body=I'M%20READY"
                  className="inline-block px-16 py-6 bg-[#FF8900] hover:bg-[#e07a00] text-black font-black text-2xl rounded-2xl transition-all duration-200 hover:scale-105 shadow-[0_0_60px_rgba(255,137,0,0.4)] mb-6"
                >
                  I&apos;M READY
                </a>
                <p className="text-gray-400 mb-2">Text <span className="font-bold text-white">&quot;I&apos;M READY&quot;</span> to</p>
                <a href="sms:223-400-8146?body=I'M%20READY" className="text-4xl md:text-5xl font-black text-[#FF8900] hover:text-[#ffa033] transition-colors">
                  223-400-8146
                </a>
              </div>
            </div>

            {/* Back to home */}
            <div className="text-center pt-8 border-t border-white/5">
              <Link href="/" className="text-gray-600 text-sm hover:text-[#FF8900] transition-colors">
                ← Back to jeff-cline.com
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
