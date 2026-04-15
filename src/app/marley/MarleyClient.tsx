"use client";

import { useState, useEffect, useRef } from "react";

/* ── intersection observer ── */
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ── colors ── */
const TEAL = "#0D9488";
const ACID = "#39FF14";
const ORANGE = "#FF8900";

const keyMetrics = [
  { value: "20", unit: "Acres", desc: "Santa Barbara County" },
  { value: "$4.5M", unit: "Equity", desc: "Cash invested to date" },
  { value: "$8.5M", unit: "ARV", desc: "Finished valuation" },
  { value: "64.7%", unit: "LTV", desc: "Lender protection" },
];

const progressItems = [
  { label: "SB County Approval", status: "First all-container project approved", done: true },
  { label: "Two Accessory Buildings", status: "Nearly complete", done: true },
  { label: "Well", status: "Installed & operational", done: true },
  { label: "Drainage Basin", status: "Engineered & installed", done: true },
  { label: "House Infrastructure", status: "Foundation & utilities in place", done: true },
  { label: "Main House Completion", status: "Funded by construction loan", done: false },
];

const highlights = [
  { title: "First of Its Kind", desc: "The first all-shipping-container project ever approved by Santa Barbara County. No precedent means no competition. Scarcity is the ultimate luxury.", color: TEAL },
  { title: "Below Replacement Cost", desc: "$10M total project cost. $8.5M valuation is conservative — 15% below what it costs to build. The lender is protected by a spread that doesn't exist in conventional deals.", color: ORANGE },
  { title: "De-Risked Construction", desc: "The hardest phase is done. Permitting, approvals, foundation, infrastructure, well, drainage — all complete. What remains is the known-cost, low-risk phase: finishing the main house.", color: ACID },
  { title: "Santa Barbara Wine Country", desc: "20 acres in the heart of Santa Ynez Valley. 45 minutes from Montecito, where the median home sells for $5.7M. Same buyer pool, fraction of the price.", color: TEAL },
  { title: "Income Optionality", desc: "Luxury retreat at $2,500-$5,000/night. Corporate events at $15K-$25K. Film locations at $5K-$15K/day. Wine country weddings. Multiple revenue streams de-risk every exit.", color: ORANGE },
  { title: "The Turnkey Buyer", desc: "Late 60s-70s. Self-made. They want Santa Ynez wine country, not Santa Barbara city. They want turnkey — not a rehab. This is the only property like it in the county.", color: ACID },
];

const dealStructure = [
  { label: "Total Project Cost", value: "$10,000,000" },
  { label: "Equity Invested (Cash)", value: "$4,500,000" },
  { label: "Construction Loan Requested", value: "$5,500,000" },
  { label: "LTV on Finished Value", value: "64.7%" },
  { label: "Term", value: "12 Months" },
  { label: "Draw Structure", value: "4-5 Construction Draws" },
  { label: "Lien Position", value: "First Position, 20 Acres" },
  { label: "Exit Strategy", value: "Conventional Refinance" },
  { label: "Lender Return", value: "8-10% + Origination Points" },
];

const challenges = [
  {
    objection: "Banks don't lend on dirt.",
    answer: "This hasn't been dirt since Phase 1. Two buildings nearly complete, well installed, drainage basin engineered, house infrastructure in place. The risk profile has fundamentally shifted from raw land to construction completion.",
    color: TEAL,
  },
  {
    objection: "Construction already started.",
    answer: "That's the point. The hardest, most uncertain phase — permitting, county approval, foundation, infrastructure — is done. What remains is the known-cost, lowest-risk phase: finishing the main house. This is less risky than ground-up.",
    color: ORANGE,
  },
  {
    objection: "No comps in the area.",
    answer: "First-of-its-kind in SB County. But Montecito trades at $5.7M median, Hope Ranch at $6M+, and the highest 2024 SB sale was $96M. Cost approach alone puts replacement at $10M+. At $8.5M, you're financing below replacement cost.",
    color: ACID,
  },
];

export default function MarleyClient() {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    city: "", state: "", zip: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");
  const [deckVersion, setDeckVersion] = useState<1 | 2>(2);

  const heroRef = useInView();
  const metricsRef = useInView();
  const progressRef = useInView();
  const visionRef = useInView();
  const challengeRef = useInView();
  const highlightsRef = useInView();
  const dealRef = useInView();
  const compRef = useInView();
  const gateRef = useInView();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/marley/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setStatus("success");
      setMsg("Your confidential investment memorandum is ready.");
    } catch (err: unknown) {
      setStatus("error");
      setMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  const deckUrl = deckVersion === 1
    ? "/decks/marley-investment-deck.pdf"
    : "/decks/marley-investment-deck-v2.pdf";

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0a", color: "#fff" }}>

      {/* ── HERO ── */}
      <section ref={heroRef.ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(ellipse at 20% 30%, ${TEAL}15 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, ${ORANGE}10 0%, transparent 50%),
            linear-gradient(180deg, #0a0a0a 0%, #050505 100%)
          `
        }} />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 60px, #fff 60px, #fff 61px)",
        }} />

        <div className={`relative z-10 text-center px-6 max-w-4xl transition-all duration-1000 ${
          heroRef.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}>
          <div className="w-20 h-px mx-auto mb-8" style={{ background: TEAL }} />
          <p className="text-xs tracking-[0.5em] uppercase mb-6" style={{ color: TEAL }}>
            2026 Investment Update &middot; Confidential
          </p>
          <h1 className="text-5xl md:text-8xl font-extralight tracking-[0.15em] mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
            SANDITAS RANCH
          </h1>
          <p className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-3">
            Santa Barbara County, California
          </p>
          <p className="text-sm tracking-[0.2em] text-gray-600 mb-4">
            20 Acres &middot; First Approved Container Estate in SB County &middot; Shipping Containers + Glass
          </p>
          <p className="text-xs text-gray-700 mb-12 italic">
            A Private Investment Opportunity
          </p>
          <div className="w-20 h-px mx-auto mb-12" style={{ background: ORANGE }} />
          <a
            href="#memorandum"
            className="inline-block px-10 py-3 text-xs tracking-[0.3em] uppercase border transition-all hover:bg-white/5"
            style={{ borderColor: TEAL, color: TEAL }}
          >
            Request Investment Memorandum
          </a>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-px h-12 opacity-20" style={{ background: `linear-gradient(to bottom, transparent, ${TEAL})` }} />
        </div>
      </section>

      {/* ── KEY METRICS ── */}
      <section ref={metricsRef.ref} className="py-20 px-6 border-y" style={{ borderColor: "#1a1a1a" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {keyMetrics.map((m, i) => (
            <div key={i} className={`text-center transition-all duration-700 ${
              metricsRef.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`} style={{ transitionDelay: `${i * 120}ms` }}>
              <p className="text-3xl md:text-4xl font-extralight tracking-wide" style={{ color: i % 2 === 0 ? TEAL : ORANGE, fontFamily: "Georgia, serif" }}>
                {m.value}
              </p>
              <p className="text-xs tracking-[0.2em] uppercase text-gray-400 mt-2">{m.unit}</p>
              <p className="text-[10px] text-gray-600 mt-1">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROGRESS / DE-RISKING ── */}
      <section ref={progressRef.ref} className="py-24 px-6">
        <div className={`max-w-3xl mx-auto transition-all duration-700 ${
          progressRef.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          <p className="text-xs tracking-[0.4em] uppercase text-center mb-4" style={{ color: ACID }}>
            2026 Progress Report
          </p>
          <h2 className="text-2xl md:text-3xl font-extralight text-center mb-12" style={{ fontFamily: "Georgia, serif" }}>
            This Is Not Dirt. This Is a <span style={{ color: TEAL }}>De-Risked</span> Asset.
          </h2>
          <div className="space-y-4">
            {progressItems.map((item, i) => (
              <div key={i} className="flex items-center gap-4 py-3 border-b" style={{ borderColor: "#1a1a1a" }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                  style={{ background: item.done ? `${TEAL}20` : `${ORANGE}20`, color: item.done ? TEAL : ORANGE }}>
                  {item.done ? "\u2713" : "\u25CB"}
                </div>
                <div className="flex-1">
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <span className="text-xs text-gray-500">{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE VISION ── */}
      <section ref={visionRef.ref} className="py-28 px-6" style={{ background: "#070707" }}>
        <div className={`max-w-3xl mx-auto text-center transition-all duration-700 ${
          visionRef.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          <p className="text-xs tracking-[0.4em] uppercase mb-6" style={{ color: TEAL }}>
            The Vision
          </p>
          <h2 className="text-3xl md:text-4xl font-extralight leading-relaxed mb-8" style={{ fontFamily: "Georgia, serif" }}>
            Where Industrial <span style={{ color: TEAL }}>Meets</span> Ethereal
          </h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            Sanditas Ranch is not a container home. It is an architectural estate that uses repurposed
            shipping containers as its structural medium — fused with expansive floor-to-ceiling
            glass — creating a dialogue between raw industrial strength and transparent vulnerability.
          </p>
          <p className="text-gray-400 leading-relaxed mb-6">
            Set on twenty private acres in Santa Barbara County&apos;s wine country, the estate commands
            panoramic views of the Santa Ynez Valley while maintaining complete seclusion. Minutes from
            Los Olivos, Solvang, and the Foxen Canyon wine trail. Forty-five minutes from Montecito.
          </p>
          <p className="text-gray-500 leading-relaxed italic">
            The first all-shipping-container project ever approved by Santa Barbara County.
            That approval alone took years. It is done. The path is clear.
          </p>
        </div>
      </section>

      {/* ── THE THREE CHALLENGES ── */}
      <section ref={challengeRef.ref} className="py-24 px-6">
        <div className={`max-w-4xl mx-auto transition-all duration-700 ${
          challengeRef.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          <p className="text-xs tracking-[0.4em] uppercase text-center mb-4" style={{ color: ORANGE }}>
            Addressing the Objections
          </p>
          <h2 className="text-2xl md:text-3xl font-extralight text-center mb-12" style={{ fontFamily: "Georgia, serif" }}>
            Yes, We&apos;ve Heard Them All.
          </h2>
          <div className="space-y-6">
            {challenges.map((c, i) => (
              <div key={i} className="rounded-lg p-6 border-l-4" style={{ background: "#111", borderColor: c.color }}>
                <p className="text-sm font-semibold mb-2" style={{ color: c.color }}>
                  &ldquo;{c.objection}&rdquo;
                </p>
                <p className="text-sm text-gray-400 leading-relaxed">{c.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HIGHLIGHTS GRID ── */}
      <section ref={highlightsRef.ref} className="py-24 px-6" style={{ background: "#070707" }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-xs tracking-[0.4em] uppercase text-center mb-16" style={{ color: ORANGE }}>
            Investment Highlights
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights.map((h, i) => (
              <div key={i} className={`p-6 border-l-2 transition-all duration-500 ${
                highlightsRef.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`} style={{ borderColor: h.color, transitionDelay: `${i * 100}ms` }}>
                <h3 className="text-sm font-semibold tracking-wide mb-3" style={{ color: h.color }}>
                  {h.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEAL STRUCTURE ── */}
      <section ref={dealRef.ref} className="py-28 px-6">
        <div className={`max-w-2xl mx-auto transition-all duration-700 ${
          dealRef.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          <p className="text-xs tracking-[0.4em] uppercase text-center mb-12" style={{ color: TEAL }}>
            Deal Structure
          </p>
          <div className="space-y-0">
            {dealStructure.map((row, i) => (
              <div key={i} className="flex justify-between items-center py-4 border-b" style={{ borderColor: "#1a1a1a" }}>
                <span className="text-sm text-gray-400">{row.label}</span>
                <span className="text-sm font-medium" style={{ color: i < 3 ? ORANGE : "#fff" }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUATION ── */}
      <section ref={compRef.ref} className="py-24 px-6" style={{ background: "#070707" }}>
        <div className={`max-w-4xl mx-auto transition-all duration-700 ${
          compRef.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          <p className="text-xs tracking-[0.4em] uppercase text-center mb-6" style={{ color: ACID }}>
            Valuation Analysis
          </p>
          <h2 className="text-2xl md:text-3xl font-extralight text-center mb-12" style={{ fontFamily: "Georgia, serif" }}>
            Three Approaches. One Conclusion.
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center border" style={{ borderColor: TEAL }}>
                <span className="text-lg" style={{ color: TEAL }}>$</span>
              </div>
              <h3 className="text-sm font-semibold mb-2" style={{ color: TEAL }}>Cost Approach</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                $4.5M invested + $5.5M to complete = $10M replacement cost.
                At $8.5M, the lender finances <strong>15% below replacement cost</strong>. No rational builder would construct this for less.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center border" style={{ borderColor: ORANGE }}>
                <span className="text-lg" style={{ color: ORANGE }}>%</span>
              </div>
              <h3 className="text-sm font-semibold mb-2" style={{ color: ORANGE }}>Comparable Sales</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Montecito median: <strong>$5.7M</strong>. Hope Ranch: <strong>$6M+</strong>. Highest SB sale 2024: <strong>$96M</strong>.
                Santa Ynez luxury ranches trade $3M-$12M. SB County list prices up 28% YoY.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center border" style={{ borderColor: ACID }}>
                <span className="text-lg" style={{ color: ACID }}>R</span>
              </div>
              <h3 className="text-sm font-semibold mb-2" style={{ color: ACID }}>Income Approach</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Luxury retreat $2.5K-$5K/night. Corporate events $15K-$25K. Film locations $5K-$15K/day.
                $400K-$800K annual gross at <strong>6-8% cap rate supports $5M-$13M</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUOTE ── */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <blockquote className="text-xl md:text-2xl font-extralight italic text-gray-300 leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>
            &ldquo;Luxury is not about what you have. It&apos;s about what you don&apos;t need.&rdquo;
          </blockquote>
          <div className="w-12 h-px mx-auto mt-8" style={{ background: TEAL }} />
        </div>
      </section>

      {/* ── LOCK GATE ── */}
      <section id="memorandum" ref={gateRef.ref} className="py-28 px-6" style={{ background: "#070707" }}>
        <div className={`max-w-lg mx-auto transition-all duration-700 ${
          gateRef.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          <p className="text-xs tracking-[0.4em] uppercase text-center mb-4" style={{ color: TEAL }}>
            Confidential
          </p>
          <h2 className="text-2xl md:text-3xl font-extralight text-center mb-2" style={{ fontFamily: "Georgia, serif" }}>
            Investment Memorandum
          </h2>
          <p className="text-gray-500 text-center text-sm mb-8">
            Request the full confidential investment deck. Choose your version.
          </p>

          {/* A/B Version Selector */}
          <div className="flex justify-center gap-3 mb-8">
            <button
              onClick={() => setDeckVersion(1)}
              className="px-5 py-2 rounded text-xs tracking-[0.15em] uppercase font-medium transition-all"
              style={{
                background: deckVersion === 1 ? ORANGE : "#1a1a1a",
                color: deckVersion === 1 ? "#000" : "#888",
              }}
            >
              Version 1 &middot; Original
            </button>
            <button
              onClick={() => setDeckVersion(2)}
              className="px-5 py-2 rounded text-xs tracking-[0.15em] uppercase font-medium transition-all"
              style={{
                background: deckVersion === 2 ? ORANGE : "#1a1a1a",
                color: deckVersion === 2 ? "#000" : "#888",
              }}
            >
              Version 2 &middot; 2026 Update
            </button>
          </div>

          {status === "success" ? (
            <div className="rounded-xl p-8 text-center border" style={{ background: "#0a0a0a", borderColor: TEAL }}>
              <p className="text-sm mb-6" style={{ color: TEAL }}>{msg}</p>
              <div className="flex flex-col gap-3">
                <a href={deckUrl} download
                  className="inline-block px-10 py-3 text-xs tracking-[0.3em] uppercase font-medium text-black transition-all hover:scale-105 rounded"
                  style={{ background: ORANGE }}>
                  Download {deckVersion === 1 ? "Version 1" : "Version 2 (2026 Update)"}
                </a>
                <button
                  onClick={() => setDeckVersion(deckVersion === 1 ? 2 : 1)}
                  className="text-xs underline transition-colors hover:text-white"
                  style={{ color: TEAL }}
                >
                  Switch to {deckVersion === 1 ? "Version 2" : "Version 1"} instead
                </button>
              </div>
              <p className="text-[10px] text-gray-600 mt-6">
                This document is confidential and intended solely for the named recipient.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-xl p-8 border space-y-4" style={{ background: "#0a0a0a", borderColor: "#1a1a1a" }}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-gray-500 mb-1">First Name *</label>
                  <input type="text" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full rounded px-4 py-3 text-sm text-white outline-none focus:ring-1 ring-[#0D9488]" style={{ background: "#111" }} />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-gray-500 mb-1">Last Name *</label>
                  <input type="text" required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="w-full rounded px-4 py-3 text-sm text-white outline-none focus:ring-1 ring-[#0D9488]" style={{ background: "#111" }} />
                </div>
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-gray-500 mb-1">Email *</label>
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded px-4 py-3 text-sm text-white outline-none focus:ring-1 ring-[#0D9488]" style={{ background: "#111" }} />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-gray-500 mb-1">Phone *</label>
                <input type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded px-4 py-3 text-sm text-white outline-none focus:ring-1 ring-[#0D9488]" style={{ background: "#111" }} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-gray-500 mb-1">City</label>
                  <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full rounded px-4 py-3 text-sm text-white outline-none focus:ring-1 ring-[#0D9488]" style={{ background: "#111" }} />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-gray-500 mb-1">State</label>
                  <input type="text" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} maxLength={2}
                    className="w-full rounded px-4 py-3 text-sm text-white outline-none focus:ring-1 ring-[#0D9488] uppercase" style={{ background: "#111" }} />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-gray-500 mb-1">Zip</label>
                  <input type="text" value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} maxLength={5}
                    className="w-full rounded px-4 py-3 text-sm text-white outline-none focus:ring-1 ring-[#0D9488]" style={{ background: "#111" }} />
                </div>
              </div>

              {status === "error" && <p className="text-red-400 text-xs">{msg}</p>}

              <button type="submit" disabled={status === "loading"}
                className="w-full py-3 rounded text-xs tracking-[0.2em] uppercase font-medium text-black transition-all hover:scale-[1.02] disabled:opacity-50 mt-2"
                style={{ background: ORANGE }}>
                {status === "loading" ? "Preparing..." : "Request Confidential Memorandum"}
              </button>
              <p className="text-[10px] text-gray-700 text-center">
                Your information is confidential. We do not share investor data with third parties.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ── COMPS ── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs tracking-[0.4em] uppercase text-center mb-4" style={{ color: ORANGE }}>
            Comparable Properties
          </p>
          <h2 className="text-2xl md:text-3xl font-extralight text-center mb-4" style={{ fontFamily: "Georgia, serif" }}>
            12 Comps That Validate <span style={{ color: ORANGE }}>$10M+</span>
          </h2>
          <p className="text-gray-500 text-center text-sm mb-12 max-w-2xl mx-auto">
            Architectural container estates, luxury acreage in Santa Barbara County, and unique
            design-forward properties globally. Every comp supports a finished valuation north of $10 million.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { name: "Westerly Estate", location: "Santa Ynez Valley, CA", price: "$64.5M", detail: "200-acre wine country compound. Equestrian facilities, vineyards. Same Santa Ynez market as Sanditas Ranch.", tag: "Listed 2024", color: ORANGE },
              { name: "Seven Oaks Ranch", location: "Santa Ynez Valley, CA", price: "$20M", detail: "103-acre ranch estate, Tudor Revival mansion, horse stables. Same buyer demographic, same wine country corridor.", tag: "Listed 2025", color: TEAL },
              { name: "Vineyard Estate", location: "Santa Ynez Valley, CA", price: "$28M", detail: "Turnkey vineyard property with full winemaking operation. Forbes-featured. Delivered fully furnished.", tag: "Listed 2025", color: ACID },
              { name: "Happy Canyon Modern Ranch", location: "Santa Ynez Valley, CA", price: "$10M", detail: "6.3-acre modern ranch with sweeping valley views. Music executive seller. Same Happy Canyon sub-market.", tag: "Listed 2025", color: ORANGE },
              { name: "Padaro Lane Oceanfront", location: "Santa Barbara County, CA", price: "$96M", detail: "10-acre oceanfront compound. Highest SB County sale in 2024. Same county, same luxury buyer pool.", tag: "Sold 2024", color: TEAL },
              { name: "Rancho Verde Equestrian", location: "Santa Ynez Valley, CA", price: "$5.9M", detail: "Set the record for sub-10-acre Santa Ynez properties. Traditional construction. Sanditas has 20 acres + architectural significance.", tag: "Sold 2023", color: ACID },
              { name: "Container Townhouse", location: "Williamsburg, Brooklyn, NY", price: "$5.5M", detail: "21 shipping containers, 4 stories, 5 bed/3.5 bath. Urban lot. Sanditas has 20 acres + glass + wine country.", tag: "Sold 2021", color: ORANGE },
              { name: "Container Estate", location: "Winchester, NH", price: "$5.2M", detail: "15 shipping containers on 140 acres. Tennis, basketball, pond. Proves container estates trade at $5M+ even in rural NH.", tag: "Listed 2025", color: TEAL },
              { name: "Starburst House (Unbuilt)", location: "Joshua Tree, CA", price: "$3.5M", detail: "Architectural Digest featured. Container starburst design on 10 acres. Listed at $3.5M for PLANS + LAND ONLY. No construction.", tag: "Listed 2020", color: ACID },
              { name: "Container Penthouse", location: "London, UK", price: "$5M (\u00a33.9M)", detail: "Luxury container home with 2,500 sqft terraces, temperature-controlled cellar. Dense urban setting, no acreage.", tag: "Sold 2021", color: ORANGE },
              { name: "Hope Ranch Estate", location: "Santa Barbara, CA", price: "$24M", detail: "Hope Ranch median ~$6M. Individual sales at $24M. Traditional construction. 15 minutes from Sanditas.", tag: "Sold 2025", color: TEAL },
              { name: "Montecito Estate (Median)", location: "Montecito, CA", price: "$5.7M", detail: "93108 is the 5th most expensive ZIP in America. Median sale $5.7M. Same county, same buyer profile. Traditional homes only.", tag: "2024 Median", color: ACID },
            ].map((comp, i) => (
              <div key={i} className="rounded-lg p-5 border-l-4 flex flex-col justify-between" style={{ background: "#111", borderColor: comp.color }}>
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-semibold" style={{ color: comp.color }}>{comp.name}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full flex-shrink-0 ml-2" style={{ background: `${comp.color}15`, color: comp.color }}>{comp.tag}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mb-2">{comp.location}</p>
                  <p className="text-xs text-gray-400 leading-relaxed">{comp.detail}</p>
                </div>
                <p className="text-lg font-extralight mt-3" style={{ color: comp.color, fontFamily: "Georgia, serif" }}>{comp.price}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-lg p-6 border text-center" style={{ background: "#111", borderColor: "#222" }}>
            <p className="text-sm text-gray-400 mb-2">
              <strong style={{ color: ORANGE }}>Conclusion:</strong> Sanditas Ranch at $8.5M sits conservatively within a market where:
            </p>
            <div className="flex flex-wrap justify-center gap-6 mt-4">
              <div className="text-center">
                <p className="text-xl font-extralight" style={{ color: TEAL, fontFamily: "Georgia, serif" }}>$5.9M-$96M</p>
                <p className="text-[10px] text-gray-500">SB County range</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-extralight" style={{ color: ORANGE, fontFamily: "Georgia, serif" }}>$3.5M-$5.5M</p>
                <p className="text-[10px] text-gray-500">Container estates (no acreage)</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-extralight" style={{ color: ACID, fontFamily: "Georgia, serif" }}>$10M+</p>
                <p className="text-[10px] text-gray-500">Below replacement cost</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <section className="py-12 px-6 text-center border-t" style={{ borderColor: "#111" }}>
        <p className="text-[10px] tracking-[0.3em] uppercase text-gray-700">
          Sanditas Ranch &middot; Santa Barbara County, California &middot; A Jeff Cline Investment
        </p>
        <p className="text-[9px] text-gray-800 mt-2 max-w-xl mx-auto">
          This page is for informational purposes only and does not constitute an offer to sell or a solicitation of an offer to buy any securities.
          Investment involves risk. Past performance is not indicative of future results.
        </p>
      </section>
    </div>
  );
}
