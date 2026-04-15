"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Script from "next/script";

/* ─── types ─── */
interface SearchResult {
  name: string;
  type: string;
  date: string;
  location: string;
  attendance: number;
  speakingOpp: string; // "open" | "apply" | "pay" | "invite"
  sellFromStage: boolean;
  cost: string;
  fitScore: number;
  link: string;
}

type SortKey = "fitScore" | "date" | "name" | "cost" | "attendance" | "speakingOpp" | "sellFromStage";
type SortDir = "asc" | "desc";

/* ─── constants ─── */
const EVENT_TYPES = ["all", "conference", "convention", "cruise", "meetup"] as const;
const SPEAKING_FILTERS = ["all", "open", "apply", "pay", "invite"] as const;
const SELL_FILTERS = ["all", "yes", "no"] as const;

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const SPEAKING_LABELS: Record<string, string> = {
  open: "Open",
  apply: "Apply",
  pay: "Pay to Speak",
  invite: "Invite Only",
};

const SPEAKING_COLORS: Record<string, { bg: string; text: string }> = {
  open: { bg: "rgba(34,197,94,0.15)", text: "#22C55E" },
  apply: { bg: "rgba(59,130,246,0.15)", text: "#3B82F6" },
  pay: { bg: "rgba(249,115,22,0.15)", text: "#F97316" },
  invite: { bg: "rgba(168,85,247,0.15)", text: "#A855F7" },
};

/* ─── helpers ─── */
function costToNumber(c: string): number {
  return parseInt(c.replace(/[^0-9]/g, ""), 10) || 0;
}
function speakingOrder(s: string): number {
  return s === "open" ? 1 : s === "apply" ? 2 : s === "pay" ? 3 : 4;
}
function formatAttendance(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return String(n);
}

/* ─── component ─── */
export default function TalkTechPage() {
  /* auth / gate state */
  const [gated, setGated] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [credits, setCredits] = useState(0);

  /* form state */
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState("");

  /* search state */
  const [searchMode, setSearchMode] = useState<"keyword" | "story">("keyword");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searchError, setSearchError] = useState("");

  /* table state */
  const [sortKey, setSortKey] = useState<SortKey>("fitScore");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [filterType, setFilterType] = useState("all");
  const [filterSpeaking, setFilterSpeaking] = useState("all");
  const [filterSell, setFilterSell] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "calendar">("table");

  /* check localStorage on mount */
  useEffect(() => {
    const stored = localStorage.getItem("talktech_user");
    if (stored) {
      try {
        const u = JSON.parse(stored);
        if (u.email) {
          setUserEmail(u.email);
          setCredits(u.credits ?? 0);
          setGated(false);
        }
      } catch { /* ignore */ }
    }
  }, []);

  /* ─── register ─── */
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setRegLoading(true);
    setRegError("");
    if (!firstName.trim() || !lastName.trim()) {
      setRegError("First name and last name are required.");
      setRegLoading(false);
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setRegError("Please enter a valid email address.");
      setRegLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/talk-tech/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, phone, zipCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      localStorage.setItem(
        "talktech_user",
        JSON.stringify({ email, credits: data.credits })
      );
      setUserEmail(email);
      setCredits(data.credits);
      setGated(false);
    } catch (err: any) {
      setRegError(err.message);
    } finally {
      setRegLoading(false);
    }
  }

  /* ─── search ─── */
  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    setSearchError("");
    try {
      const res = await fetch("/api/talk-tech/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, mode: searchMode, query: searchQuery }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.needMore) {
          setCredits(0);
          localStorage.setItem(
            "talktech_user",
            JSON.stringify({ email: userEmail, credits: 0 })
          );
        }
        throw new Error(data.error || "Search failed");
      }
      setResults(data.results);
      setCredits(data.creditsRemaining);
      localStorage.setItem(
        "talktech_user",
        JSON.stringify({ email: userEmail, credits: data.creditsRemaining })
      );
    } catch (err: any) {
      setSearchError(err.message);
    } finally {
      setSearchLoading(false);
    }
  }

  /* ─── sort & filter ─── */
  const filteredResults = useMemo(() => {
    let r = filterType === "all" ? results : results.filter((e) => e.type === filterType);
    if (filterSpeaking !== "all") r = r.filter((e) => e.speakingOpp === filterSpeaking);
    if (filterSell === "yes") r = r.filter((e) => e.sellFromStage);
    if (filterSell === "no") r = r.filter((e) => !e.sellFromStage);
    r = [...r].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "fitScore":
          cmp = a.fitScore - b.fitScore;
          break;
        case "date":
          cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "cost":
          cmp = costToNumber(a.cost) - costToNumber(b.cost);
          break;
        case "attendance":
          cmp = a.attendance - b.attendance;
          break;
        case "speakingOpp":
          cmp = speakingOrder(a.speakingOpp) - speakingOrder(b.speakingOpp);
          break;
        case "sellFromStage":
          cmp = (a.sellFromStage ? 1 : 0) - (b.sellFromStage ? 1 : 0);
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return r;
  }, [results, filterType, filterSpeaking, filterSell, sortKey, sortDir]);

  /* ─── calendar grouping ─── */
  const calendarData = useMemo(() => {
    const months: Record<string, SearchResult[]> = {};
    filteredResults.forEach((ev) => {
      const d = new Date(ev.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!months[key]) months[key] = [];
      months[key].push(ev);
    });
    return Object.entries(months).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredResults]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir(key === "fitScore" ? "desc" : "asc");
    }
  }

  const sortArrow = (key: SortKey) =>
    sortKey === key ? (sortDir === "asc" ? " ▲" : " ▼") : "";

  /* ─── render ─── */
  return (
    <>
      {/* Schema.org markup */}
      <Script
        id="talk-tech-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Talk Tech — Speaker Opportunity Finder",
            url: "https://jeff-cline.com/talk-tech",
            description:
              "AI-powered platform that matches speakers to high-converting events, conferences, cruises, and conventions based on expertise and audience fit.",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            author: {
              "@type": "Person",
              name: "Jeff Cline",
              url: "https://jeff-cline.com",
            },
          }),
        }}
      />

      <div className="min-h-screen" style={{ background: "#0A1628" }}>
        {/* ═══ HERO ═══ */}
        <section className="relative overflow-hidden py-24 px-6 md:px-12 lg:px-24">
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 30% 50%, #F97316 0%, transparent 60%)",
              }}
            />
          </div>
          <div className="relative max-w-5xl mx-auto text-center">
            <h1
              className="text-5xl md:text-7xl font-black tracking-tight mb-4"
              style={{ color: "#F97316" }}
            >
              FIND YOUR STAGE
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-10 font-light">
              The Smartest 5 Minutes You&apos;ll Ever Spend
            </p>
            <div className="max-w-3xl mx-auto text-left">
              <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                In my first talk on stage, I generated over{" "}
                <span className="font-bold" style={{ color: "#F97316" }}>
                  100 leads
                </span>
                , closed{" "}
                <span className="font-bold" style={{ color: "#F97316" }}>
                  12 deals in seven days
                </span>
                , and met dozens of potential clients.{" "}
                <span className="font-bold text-white">
                  Five minutes that changed everything.
                </span>
              </p>
              <p className="text-lg md:text-xl text-white/70 leading-relaxed mt-4">
                Now I see speaking through a geek&apos;s eyes — and the data is clear:
                picking the <em>right</em> audience is the difference between wasting
                your time and printing money.
              </p>
            </div>
          </div>
        </section>

        {/* ═══ THESIS ═══ */}
        <section
          className="py-20 px-6 md:px-12 lg:px-24"
          style={{ background: "#0F172A" }}
        >
          <div className="max-w-4xl mx-auto">
            <h2
              className="text-3xl md:text-4xl font-bold mb-8 text-center"
              style={{ color: "#F97316" }}
            >
              Every Industry is a Geek Away from Being Uberized
            </h2>
            <div className="space-y-6 text-white/80 text-lg leading-relaxed">
              <p>
                The speaking circuit is a{" "}
                <strong className="text-white">
                  $2.1 billion market operating on pure intuition
                </strong>
                . Speakers pick events the way gamblers pick horses — gut feel,
                hearsay, whoever returns their email first. The result? Eighty
                percent of speakers address audiences that will{" "}
                <em>never</em> buy from them. They fly across the country, burn a
                weekend, and come home with a stack of polite business cards from
                people who forgot them by Monday.
              </p>
              <p>
                That is a data problem. And data problems have data solutions.
              </p>
              <p>
                This platform treats audience selection the way a quant fund
                treats stock picks:{" "}
                <strong className="text-white">
                  with ruthless, algorithmic precision
                </strong>
                . We ingest event data — attendee demographics, industry
                verticals, buyer personas, historical conversion rates — and
                cross-reference it against <em>your</em> expertise, your offer,
                and your ideal customer profile. The output is not a list of
                events. It is a{" "}
                <strong className="text-white">ranked probability matrix</strong>{" "}
                of where your five minutes on stage will generate the highest
                return on invested time.
              </p>
              <p>
                Most speakers ask:{" "}
                <em>&ldquo;Where can I get on stage?&rdquo;</em> The right
                question is:{" "}
                <strong className="text-white">
                  &ldquo;Where will my stage time print money?&rdquo;
                </strong>
              </p>
            </div>
          </div>
        </section>

        {/* ═══ HOW IT WORKS ═══ */}
        <section className="py-20 px-6 md:px-12 lg:px-24" style={{ background: "#0A1628" }}>
          <div className="max-w-5xl mx-auto">
            <h2
              className="text-3xl md:text-4xl font-bold mb-14 text-center"
              style={{ color: "#F97316" }}
            >
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Tell Us Your Story",
                  desc: "Sign up and describe your expertise, your offer, and the audience you want to reach. Two minutes of input powers hours of analysis.",
                },
                {
                  step: "02",
                  title: "AI Finds Your Matches",
                  desc: "Our engine cross-references your profile against thousands of events — conferences, cruises, conventions, masterminds — scoring each by audience fit, conversion potential, and ROI.",
                },
                {
                  step: "03",
                  title: "Pick Your Stage",
                  desc: "Get ranked results sorted by fit score, cost, and dates. Filter by event type. See exactly where your five minutes will generate the biggest return.",
                },
              ].map((s) => (
                <div
                  key={s.step}
                  className="p-8 rounded-xl border"
                  style={{
                    background: "#0F172A",
                    borderColor: "rgba(249,115,22,0.2)",
                  }}
                >
                  <div
                    className="text-5xl font-black mb-4"
                    style={{ color: "#F97316" }}
                  >
                    {s.step}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
                  <p className="text-white/70 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ SOCIAL PROOF ═══ */}
        <section
          className="py-16 px-6 md:px-12 lg:px-24"
          style={{ background: "#0F172A" }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { num: "100+", label: "Leads Generated" },
                { num: "12", label: "Deals Closed" },
                { num: "7", label: "Days to Close" },
                { num: "5", label: "Minutes on Stage" },
              ].map((s) => (
                <div key={s.label}>
                  <div
                    className="text-4xl md:text-5xl font-black"
                    style={{ color: "#F97316" }}
                  >
                    {s.num}
                  </div>
                  <div className="text-white/60 mt-2 text-sm uppercase tracking-wider">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-white/50 mt-8 text-sm">
              Results from Jeff&apos;s first speaking engagement. Individual results vary.
            </p>
          </div>
        </section>

        {/* ═══ GATE / FORM / TOOL ═══ */}
        <section
          className="py-20 px-6 md:px-12 lg:px-24"
          style={{ background: "#0A1628" }}
          id="get-started"
        >
          <div className="max-w-4xl mx-auto">
            {gated ? (
              /* ─── SIGNUP FORM ─── */
              <div
                className="rounded-2xl p-8 md:p-12 border"
                style={{
                  background: "#0F172A",
                  borderColor: "rgba(249,115,22,0.3)",
                }}
              >
                <h2
                  className="text-3xl font-bold mb-2 text-center"
                  style={{ color: "#F97316" }}
                >
                  Unlock the Search Engine
                </h2>
                <p className="text-white/60 text-center mb-8">
                  Create your free account. 500 credits included.
                </p>
                <form
                  onSubmit={handleRegister}
                  noValidate
                  className="grid md:grid-cols-2 gap-4"
                >
                  <input
                    type="text"
                    placeholder="First Name *"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="px-4 py-3 rounded-lg border text-white placeholder-white/40 focus:outline-none focus:ring-2"
                    style={{
                      background: "#1E293B",
                      borderColor: "rgba(255,255,255,0.1)",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Last Name *"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="px-4 py-3 rounded-lg border text-white placeholder-white/40 focus:outline-none focus:ring-2"
                    style={{
                      background: "#1E293B",
                      borderColor: "rgba(255,255,255,0.1)",
                    }}
                  />
                  <input
                    type="text"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="Email *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="px-4 py-3 rounded-lg border text-white placeholder-white/40 focus:outline-none focus:ring-2"
                    style={{
                      background: "#1E293B",
                      borderColor: "rgba(255,255,255,0.1)",
                    }}
                  />
                  <input
                    type="text"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="px-4 py-3 rounded-lg border text-white placeholder-white/40 focus:outline-none focus:ring-2"
                    style={{
                      background: "#1E293B",
                      borderColor: "rgba(255,255,255,0.1)",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Zip Code"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="px-4 py-3 rounded-lg border text-white placeholder-white/40 focus:outline-none focus:ring-2 md:col-span-2"
                    style={{
                      background: "#1E293B",
                      borderColor: "rgba(255,255,255,0.1)",
                    }}
                  />
                  {regError && (
                    <p className="text-red-400 md:col-span-2 text-sm">
                      {regError}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={regLoading}
                    className="md:col-span-2 py-4 rounded-lg text-lg font-bold text-white transition-all hover:scale-[1.02] disabled:opacity-50"
                    style={{ background: "#F97316" }}
                  >
                    {regLoading ? "Creating Account..." : "Get 500 Free Credits →"}
                  </button>
                </form>
              </div>
            ) : (
              /* ─── SEARCH TOOL ─── */
              <div>
                {/* Credits Badge */}
                <div className="flex items-center justify-between mb-6">
                  <h2
                    className="text-2xl md:text-3xl font-bold"
                    style={{ color: "#F97316" }}
                  >
                    Find Speaking Opportunities
                  </h2>
                  <div
                    className="px-4 py-2 rounded-full text-sm font-bold"
                    style={{
                      background:
                        credits > 0
                          ? "rgba(249,115,22,0.15)"
                          : "rgba(220,38,38,0.15)",
                      color: credits > 0 ? "#F97316" : "#DC2626",
                      border: `1px solid ${
                        credits > 0
                          ? "rgba(249,115,22,0.3)"
                          : "rgba(220,38,38,0.3)"
                      }`,
                    }}
                  >
                    {credits} credits
                  </div>
                </div>

                {credits <= 0 && results.length === 0 ? (
                  /* No credits and no results to show */
                  <div
                    className="rounded-xl p-8 text-center border"
                    style={{
                      background: "#0F172A",
                      borderColor: "rgba(249,115,22,0.2)",
                    }}
                  >
                    <p className="text-2xl font-bold text-white mb-4">
                      Need More Searches?
                    </p>
                    <p className="text-white/60 mb-6">
                      Call Jeff directly to unlock unlimited access.
                    </p>
                    <a
                      href="tel:+12234008146"
                      className="inline-block px-8 py-4 rounded-lg text-lg font-bold text-white transition-all hover:scale-[1.02]"
                      style={{ background: "#F97316" }}
                    >
                      (223) 400-8146
                    </a>
                  </div>
                ) : (
                  <>
                    {/* Mode Toggle */}
                    <div className="flex gap-2 mb-4">
                      {(["keyword", "story"] as const).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setSearchMode(mode)}
                          className="px-5 py-2 rounded-lg text-sm font-semibold transition-all"
                          style={{
                            background:
                              searchMode === mode
                                ? "#F97316"
                                : "rgba(255,255,255,0.05)",
                            color:
                              searchMode === mode
                                ? "#fff"
                                : "rgba(255,255,255,0.5)",
                          }}
                        >
                          {mode === "keyword" ? "Keyword Search" : "Tell Your Story"}
                        </button>
                      ))}
                    </div>

                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="mb-8">
                      {searchMode === "keyword" ? (
                        <div className="flex gap-3">
                          <input
                            type="text"
                            placeholder="e.g. insurance technology, SaaS founders, real estate investors..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 px-4 py-3 rounded-lg border text-white placeholder-white/40 focus:outline-none focus:ring-2"
                            style={{
                              background: "#1E293B",
                              borderColor: "rgba(255,255,255,0.1)",
                            }}
                          />
                          <button
                            type="submit"
                            disabled={searchLoading}
                            className="px-6 py-3 rounded-lg font-bold text-white transition-all hover:scale-[1.02] disabled:opacity-50"
                            style={{ background: "#F97316" }}
                          >
                            {searchLoading ? "..." : "Search"}
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <textarea
                            placeholder="Describe your expertise, your ideal audience, and what you're selling. The more detail, the better the matches.&#10;&#10;Example: I'm a SaaS founder who built a $10M ARR company. I speak about growth hacking, product-led growth, and bootstrapping. My ideal audience is other founders and VCs. I sell consulting packages starting at $25K."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            rows={6}
                            className="w-full px-4 py-3 rounded-lg border text-white placeholder-white/40 focus:outline-none focus:ring-2 resize-none"
                            style={{
                              background: "#1E293B",
                              borderColor: "rgba(255,255,255,0.1)",
                            }}
                          />
                          <button
                            type="submit"
                            disabled={searchLoading}
                            className="w-full py-3 rounded-lg font-bold text-white transition-all hover:scale-[1.02] disabled:opacity-50"
                            style={{ background: "#F97316" }}
                          >
                            {searchLoading
                              ? "Analyzing Your Story..."
                              : "Find My Stages → (500 credits)"}
                          </button>
                        </div>
                      )}
                    </form>

                    {searchError && (
                      <p className="text-red-400 mb-4 text-sm">{searchError}</p>
                    )}

                    {/* Results */}
                    {results.length > 0 && (
                      <div>
                        {/* Filter Tabs */}
                        <div className="space-y-3 mb-6">
                          {/* Row 1: Event Type + View Toggle */}
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <span className="text-white/40 text-xs font-semibold uppercase tracking-wider w-16">Type</span>
                              <div className="flex flex-wrap gap-2">
                                {EVENT_TYPES.map((t) => (
                                  <button
                                    key={t}
                                    onClick={() => setFilterType(t)}
                                    className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all"
                                    style={{
                                      background:
                                        filterType === t
                                          ? "#F97316"
                                          : "rgba(255,255,255,0.05)",
                                      color:
                                        filterType === t
                                          ? "#fff"
                                          : "rgba(255,255,255,0.5)",
                                    }}
                                  >
                                    {t}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {(["table", "calendar"] as const).map((v) => (
                                <button
                                  key={v}
                                  onClick={() => setViewMode(v)}
                                  className="px-3 py-1.5 rounded text-xs font-semibold transition-all"
                                  style={{
                                    background:
                                      viewMode === v
                                        ? "rgba(249,115,22,0.2)"
                                        : "transparent",
                                    color:
                                      viewMode === v
                                        ? "#F97316"
                                        : "rgba(255,255,255,0.4)",
                                  }}
                                >
                                  {v === "table" ? "Table" : "Calendar"}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Row 2: Speaking Opportunity */}
                          <div className="flex items-center gap-2">
                            <span className="text-white/40 text-xs font-semibold uppercase tracking-wider w-16">Stage</span>
                            <div className="flex flex-wrap gap-2">
                              {SPEAKING_FILTERS.map((s) => (
                                <button
                                  key={s}
                                  onClick={() => setFilterSpeaking(s)}
                                  className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all"
                                  style={{
                                    background:
                                      filterSpeaking === s
                                        ? (s === "all" ? "#F97316" : SPEAKING_COLORS[s]?.bg || "#F97316")
                                        : "rgba(255,255,255,0.05)",
                                    color:
                                      filterSpeaking === s
                                        ? (s === "all" ? "#fff" : SPEAKING_COLORS[s]?.text || "#fff")
                                        : "rgba(255,255,255,0.5)",
                                  }}
                                >
                                  {s === "all" ? "All" : SPEAKING_LABELS[s] || s}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Row 3: Sell From Stage */}
                          <div className="flex items-center gap-2">
                            <span className="text-white/40 text-xs font-semibold uppercase tracking-wider w-16">Sell</span>
                            <div className="flex flex-wrap gap-2">
                              {SELL_FILTERS.map((s) => (
                                <button
                                  key={s}
                                  onClick={() => setFilterSell(s)}
                                  className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all"
                                  style={{
                                    background:
                                      filterSell === s
                                        ? (s === "yes" ? "rgba(34,197,94,0.2)" : s === "no" ? "rgba(239,68,68,0.2)" : "#F97316")
                                        : "rgba(255,255,255,0.05)",
                                    color:
                                      filterSell === s
                                        ? (s === "yes" ? "#22C55E" : s === "no" ? "#EF4444" : "#fff")
                                        : "rgba(255,255,255,0.5)",
                                  }}
                                >
                                  {s === "all" ? "All" : s === "yes" ? "Can Sell" : "No Selling"}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {viewMode === "table" ? (
                          /* ─── TABLE VIEW ─── */
                          <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                            <table className="w-full text-sm">
                              <thead>
                                <tr style={{ background: "#1E293B" }}>
                                  {[
                                    { key: "name" as SortKey, label: "Event" },
                                    { key: "date" as SortKey, label: "Date" },
                                    { key: "attendance" as SortKey, label: "Attendance" },
                                    { key: "speakingOpp" as SortKey, label: "Speaking" },
                                    { key: "sellFromStage" as SortKey, label: "Sell" },
                                    { key: "cost" as SortKey, label: "Cost" },
                                    { key: "fitScore" as SortKey, label: "Fit" },
                                  ].map((col) => (
                                    <th
                                      key={col.key}
                                      onClick={() => toggleSort(col.key)}
                                      className="px-4 py-3 text-left text-white/60 font-semibold uppercase tracking-wider text-xs cursor-pointer hover:text-white/80 transition-colors select-none"
                                    >
                                      {col.label}
                                      {sortArrow(col.key)}
                                    </th>
                                  ))}
                                  <th className="px-4 py-3 text-left text-white/60 font-semibold uppercase tracking-wider text-xs">
                                    Link
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredResults.map((ev, i) => (
                                  <tr
                                    key={i}
                                    className="border-t transition-colors"
                                    style={{
                                      borderColor: "rgba(255,255,255,0.05)",
                                      background:
                                        i % 2 === 0
                                          ? "rgba(15,23,42,0.5)"
                                          : "rgba(10,22,40,0.5)",
                                    }}
                                    onMouseEnter={(e) =>
                                      (e.currentTarget.style.background =
                                        "rgba(249,115,22,0.05)")
                                    }
                                    onMouseLeave={(e) =>
                                      (e.currentTarget.style.background =
                                        i % 2 === 0
                                          ? "rgba(15,23,42,0.5)"
                                          : "rgba(10,22,40,0.5)")
                                    }
                                  >
                                    <td className="px-4 py-3">
                                      <div className="font-semibold text-white">
                                        {ev.name}
                                      </div>
                                      <div className="text-white/40 text-xs mt-0.5">
                                        {ev.type} &middot; {ev.location}
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 text-white/70 whitespace-nowrap">
                                      {new Date(ev.date).toLocaleDateString(
                                        "en-US",
                                        {
                                          month: "short",
                                          day: "numeric",
                                          year: "numeric",
                                        }
                                      )}
                                    </td>
                                    <td className="px-4 py-3">
                                      <span
                                        className="font-bold text-sm"
                                        style={{
                                          color:
                                            ev.attendance >= 10000
                                              ? "#22C55E"
                                              : ev.attendance >= 1000
                                              ? "#F97316"
                                              : "rgba(255,255,255,0.6)",
                                        }}
                                      >
                                        {formatAttendance(ev.attendance)}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3">
                                      <span
                                        className="px-2 py-0.5 rounded text-xs font-bold"
                                        style={{
                                          background: SPEAKING_COLORS[ev.speakingOpp]?.bg || "rgba(255,255,255,0.08)",
                                          color: SPEAKING_COLORS[ev.speakingOpp]?.text || "rgba(255,255,255,0.5)",
                                        }}
                                      >
                                        {SPEAKING_LABELS[ev.speakingOpp] || ev.speakingOpp}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3">
                                      <span
                                        className="text-xs font-bold"
                                        style={{
                                          color: ev.sellFromStage ? "#22C55E" : "rgba(255,255,255,0.3)",
                                        }}
                                      >
                                        {ev.sellFromStage ? "YES" : "No"}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-white/70">
                                      {ev.cost}
                                    </td>
                                    <td className="px-4 py-3">
                                      <div className="flex items-center gap-2">
                                        <div
                                          className="h-2 rounded-full"
                                          style={{
                                            width: `${ev.fitScore * 10}%`,
                                            maxWidth: "60px",
                                            background:
                                              ev.fitScore >= 8
                                                ? "#22C55E"
                                                : ev.fitScore >= 6
                                                ? "#F97316"
                                                : "#EF4444",
                                          }}
                                        />
                                        <span
                                          className="text-xs font-bold"
                                          style={{
                                            color:
                                              ev.fitScore >= 8
                                                ? "#22C55E"
                                                : ev.fitScore >= 6
                                                ? "#F97316"
                                                : "#EF4444",
                                          }}
                                        >
                                          {ev.fitScore}
                                        </span>
                                      </div>
                                    </td>
                                    <td className="px-4 py-3">
                                      {ev.link !== "#" ? (
                                        <a
                                          href={ev.link}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-xs font-semibold transition-colors"
                                          style={{ color: "#F97316" }}
                                        >
                                          Visit →
                                        </a>
                                      ) : (
                                        <span className="text-white/30 text-xs">
                                          Coming soon
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          /* ─── CALENDAR VIEW ─── */
                          <div className="space-y-6">
                            {calendarData.map(([monthKey, events]) => {
                              const [year, month] = monthKey.split("-");
                              return (
                                <div
                                  key={monthKey}
                                  className="rounded-xl border overflow-hidden"
                                  style={{
                                    borderColor: "rgba(255,255,255,0.08)",
                                  }}
                                >
                                  <div
                                    className="px-5 py-3 font-bold text-white"
                                    style={{ background: "#1E293B" }}
                                  >
                                    {MONTHS[parseInt(month, 10) - 1]} {year}
                                  </div>
                                  <div className="divide-y divide-white/5">
                                    {events.map((ev, i) => (
                                      <div
                                        key={i}
                                        className="flex items-center justify-between px-5 py-3"
                                        style={{
                                          background: "rgba(15,23,42,0.5)",
                                        }}
                                      >
                                        <div className="flex items-center gap-4">
                                          <div
                                            className="text-2xl font-black w-10 text-center"
                                            style={{ color: "#F97316" }}
                                          >
                                            {new Date(ev.date).getDate()}
                                          </div>
                                          <div>
                                            <div className="font-semibold text-white text-sm">
                                              {ev.name}
                                            </div>
                                            <div className="text-white/40 text-xs">
                                              {ev.type} &middot; {ev.location} &middot;{" "}
                                              {formatAttendance(ev.attendance)} attendees &middot;{" "}
                                              {SPEAKING_LABELS[ev.speakingOpp] || ev.speakingOpp}
                                              {ev.sellFromStage && " &middot; Sell from stage"} &middot;{" "}
                                              {ev.cost}
                                            </div>
                                          </div>
                                        </div>
                                        <div
                                          className="px-3 py-1 rounded-full text-xs font-bold"
                                          style={{
                                            background:
                                              ev.fitScore >= 8
                                                ? "rgba(34,197,94,0.15)"
                                                : ev.fitScore >= 6
                                                ? "rgba(249,115,22,0.15)"
                                                : "rgba(239,68,68,0.15)",
                                            color:
                                              ev.fitScore >= 8
                                                ? "#22C55E"
                                                : ev.fitScore >= 6
                                                ? "#F97316"
                                                : "#EF4444",
                                          }}
                                        >
                                          Fit: {ev.fitScore}/10
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        <p className="text-white/30 text-xs mt-4 text-center">
                          {filteredResults.length} events found &middot; Sorted by{" "}
                          {sortKey} ({sortDir})
                        </p>
                      </div>
                    )}

                    {/* Show "Need More?" banner when credits are depleted but results are visible */}
                    {credits <= 0 && results.length > 0 && (
                      <div
                        className="rounded-xl p-6 text-center border mt-8"
                        style={{
                          background: "#0F172A",
                          borderColor: "rgba(249,115,22,0.2)",
                        }}
                      >
                        <p className="text-xl font-bold text-white mb-2">
                          Need More Searches?
                        </p>
                        <p className="text-white/60 mb-4 text-sm">
                          Call Jeff directly to unlock unlimited access.
                        </p>
                        <a
                          href="tel:+12234008146"
                          className="inline-block px-6 py-3 rounded-lg font-bold text-white transition-all hover:scale-[1.02]"
                          style={{ background: "#F97316" }}
                        >
                          (223) 400-8146
                        </a>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </section>

        {/* ═══ CTA ═══ */}
        <section
          className="py-16 px-6 md:px-12 lg:px-24 text-center"
          style={{ background: "#0F172A" }}
        >
          <p className="text-white/50 text-lg mb-4">
            Stop guessing. Start converting.
          </p>
          <a
            href="#get-started"
            className="inline-block px-10 py-4 rounded-lg text-lg font-bold text-white transition-all hover:scale-[1.02]"
            style={{ background: "#F97316" }}
          >
            Find Your Stage →
          </a>
        </section>
      </div>
    </>
  );
}
