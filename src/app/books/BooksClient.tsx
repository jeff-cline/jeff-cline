"use client";

import { useState, useEffect, useRef } from "react";

/* ── intersection observer ── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

const chapters = [
  { num: "Part I", title: "The Foundation", items: [
    "The Geek Advantage — Why Technology Is the Great Equalizer",
    "The Credit Economy — A New Model for Business Tools",
    "Data Is the New Oil — But Only If You Refine It",
    "The AI Workforce — Your Team That Never Sleeps",
  ]},
  { num: "Part II", title: "Industry Playbooks", items: [
    "Real Estate & Property Management",
    "Healthcare & Life Sciences",
    "Financial Services & Insurance",
    "Manufacturing & Industry 4.0",
    "Retail & E-Commerce",
    "Professional Services & Legal",
    "Education & Coaching",
    "Energy & Utilities",
    "Marketing & Advertising",
    "Transportation & Logistics",
  ]},
  { num: "Part III", title: "Your Playbook", items: [
    "The Business Owner's Toolkit",
    "From Manager to Investor — Scaling Your Perspective",
    "The Immersive Mastermind — What Comes Next",
  ]},
];

const stats = [
  { value: "78%", label: "of organizations use AI in at least one function" },
  { value: "10.3x", label: "ROI for companies with strong tech integration" },
  { value: "$7T+", label: "in AI-driven productivity gains globally" },
  { value: "53", label: "pages of data-driven strategy" },
];

const testimonialQuotes = [
  { text: "Every industry is one geek away from being Uberized.", attr: "Jeff Cline" },
  { text: "The companies that win aren't the ones with the most money. They're the ones with the best geeks.", attr: "From Chapter 1" },
  { text: "You don't need seven subscriptions. You need one credit system.", attr: "From Chapter 2" },
];

export default function BooksClient() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", role: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  const heroRef = useInView();
  const coverRef = useInView();
  const statsRef = useInView();
  const tocRef = useInView();
  const gateRef = useInView();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/books/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setStatus("success");
      setDownloadUrl(data.downloadUrl);
      setMsg("Your copy is ready.");
    } catch (err: unknown) {
      setStatus("error");
      setMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0a" }}>
      {/* ── HERO ── */}
      <section
        ref={heroRef.ref}
        className="relative overflow-hidden py-28 md:py-40"
      >
        <div
          className="absolute inset-0 opacity-8"
          style={{
            background:
              "radial-gradient(ellipse at 30% 20%, #FF8900 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, #FF890033 0%, transparent 50%)",
          }}
        />
        <div
          className={`relative z-10 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center transition-all duration-700 ${
            heroRef.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Text side */}
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-4">
              New Book by Jeff Cline
            </p>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-2">
              <span style={{ color: "#FF8900" }}>SUCCESS</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 font-light mb-1">
              From a Geek Lens
            </p>
            <p className="text-gray-500 italic mb-8">
              Your Next Level of Success
            </p>
            <p className="text-gray-400 leading-relaxed mb-8 max-w-md">
              53 pages of data-driven strategy across 10 industries. The Profit
              at Scale framework. Real statistics. Real playbooks. Written by a
              geek who&apos;s built it, scaled it, and exited it — four times.
            </p>
            <a
              href="#download"
              className="inline-block px-8 py-3 rounded-lg font-bold text-black transition-all hover:scale-105"
              style={{ background: "#FF8900" }}
            >
              Download Free Copy
            </a>
          </div>

          {/* Book cover side */}
          <div
            ref={coverRef.ref}
            className={`flex justify-center transition-all duration-1000 delay-200 ${
              coverRef.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
          >
            <div
              className="relative w-72 md:w-80"
              style={{
                perspective: "1000px",
              }}
            >
              {/* Book shadow */}
              <div
                className="absolute inset-0 rounded-lg blur-2xl opacity-30"
                style={{ background: "#FF8900", transform: "translateY(20px) scale(0.9)" }}
              />
              {/* Book cover */}
              <div
                className="relative rounded-lg overflow-hidden border-2"
                style={{
                  background: "linear-gradient(135deg, #111 0%, #0a0a0a 50%, #1a1a1a 100%)",
                  borderColor: "#FF8900",
                  aspectRatio: "0.65",
                  boxShadow: "8px 8px 30px rgba(0,0,0,0.6), -2px -2px 10px rgba(255,137,0,0.1)",
                  transform: "rotateY(-5deg)",
                }}
              >
                <div className="absolute inset-0 p-8 flex flex-col justify-between">
                  {/* Top */}
                  <div>
                    <div
                      className="w-16 h-1 mb-6"
                      style={{ background: "#FF8900" }}
                    />
                    <h2
                      className="text-4xl md:text-5xl font-black leading-none mb-2"
                      style={{ color: "#FF8900" }}
                    >
                      SUCCESS
                    </h2>
                    <p className="text-sm text-gray-400 tracking-widest uppercase">
                      From a Geek Lens
                    </p>
                    <div
                      className="w-full h-px mt-4 opacity-20"
                      style={{ background: "#FF8900" }}
                    />
                  </div>
                  {/* Middle */}
                  <div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      YOUR NEXT LEVEL
                      <br />
                      OF SUCCESS
                    </p>
                  </div>
                  {/* Bottom */}
                  <div>
                    <div
                      className="w-full h-px mb-4 opacity-20"
                      style={{ background: "#FF8900" }}
                    />
                    <p className="text-sm font-bold text-white tracking-wide">
                      JEFF CLINE
                    </p>
                    <p className="text-[10px] text-gray-600 mt-1">
                      PROFIT AT SCALE
                    </p>
                  </div>
                </div>
                {/* Spine effect */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-2"
                  style={{
                    background:
                      "linear-gradient(to right, rgba(255,137,0,0.3), transparent)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section
        ref={statsRef.ref}
        className="py-16 px-6 border-y"
        style={{ background: "#111", borderColor: "#222" }}
      >
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div
              key={i}
              className={`text-center transition-all duration-500 ${
                statsRef.visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <p
                className="text-3xl md:text-4xl font-black"
                style={{ color: "#FF8900" }}
              >
                {s.value}
              </p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHAT'S INSIDE / TOC ── */}
      <section ref={tocRef.ref} className="py-24 px-6">
        <div
          className={`max-w-4xl mx-auto transition-all duration-700 ${
            tocRef.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            What&apos;s Inside
          </h2>
          <p className="text-gray-500 text-center mb-16 max-w-xl mx-auto">
            17 chapters. 10 industries. One framework. Everything you need to
            weaponize technology for profit.
          </p>

          <div className="space-y-10">
            {chapters.map((part, pi) => (
              <div key={pi}>
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-full"
                    style={{ background: "#FF890020", color: "#FF8900" }}
                  >
                    {part.num}
                  </span>
                  <h3 className="text-lg font-bold">{part.title}</h3>
                </div>
                <div className="space-y-2 pl-4 border-l-2" style={{ borderColor: "#222" }}>
                  {part.items.map((item, ci) => (
                    <div
                      key={ci}
                      className="flex items-center gap-3 py-2 px-4 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <span className="text-xs text-gray-600 font-mono w-8">
                        {pi === 0
                          ? ci + 1
                          : pi === 1
                          ? ci + 5
                          : ci + 15}
                      </span>
                      <span className="text-gray-300 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUOTES SLIDER ── */}
      <section className="py-20 px-6" style={{ background: "#111" }}>
        <div className="max-w-3xl mx-auto space-y-8">
          {testimonialQuotes.map((q, i) => (
            <blockquote
              key={i}
              className="border-l-4 pl-6 py-2"
              style={{ borderColor: "#FF8900" }}
            >
              <p className="text-lg text-gray-300 italic leading-relaxed">
                &ldquo;{q.text}&rdquo;
              </p>
              <cite className="text-sm text-gray-500 mt-2 block not-italic">
                — {q.attr}
              </cite>
            </blockquote>
          ))}
        </div>
      </section>

      {/* ── DOWNLOAD GATE ── */}
      <section id="download" ref={gateRef.ref} className="py-24 px-6">
        <div
          className={`max-w-lg mx-auto transition-all duration-700 ${
            gateRef.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl font-bold text-center mb-2">
            Get Your <span style={{ color: "#FF8900" }}>Free Copy</span>
          </h2>
          <p className="text-gray-500 text-center mb-8">
            Tell us who you are and the book is yours. No credit card. No catch.
          </p>

          {status === "success" ? (
            <div
              className="rounded-xl p-8 text-center border"
              style={{ background: "#111", borderColor: "#FF8900" }}
            >
              <div className="text-5xl mb-4">📖</div>
              <p
                className="text-lg font-semibold mb-2"
                style={{ color: "#FF8900" }}
              >
                {msg}
              </p>
              <a
                href={downloadUrl}
                download
                className="inline-block mt-4 px-8 py-3 rounded-lg text-black font-bold transition-all hover:scale-105"
                style={{ background: "#FF8900" }}
              >
                Download PDF
              </a>
              <p className="text-xs text-gray-600 mt-4">
                Check your email — we&apos;ll send resources and updates too.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-xl p-8 border space-y-5"
              style={{ background: "#111", borderColor: "#222" }}
            >
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg px-4 py-3 text-white outline-none focus:ring-2 ring-[#FF8900]"
                  style={{ background: "#1a1a1a" }}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-lg px-4 py-3 text-white outline-none focus:ring-2 ring-[#FF8900]"
                  style={{ background: "#1a1a1a" }}
                  placeholder="you@company.com"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded-lg px-4 py-3 text-white outline-none focus:ring-2 ring-[#FF8900]"
                  style={{ background: "#1a1a1a" }}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  I am a... *
                </label>
                <select
                  required
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full rounded-lg px-4 py-3 text-white outline-none focus:ring-2 ring-[#FF8900]"
                  style={{ background: "#1a1a1a" }}
                >
                  <option value="">Select your role</option>
                  <option value="Business Owner">Business Owner</option>
                  <option value="Manager / Executive">Manager / Executive</option>
                  <option value="Entrepreneur">Entrepreneur</option>
                  <option value="Startup Founder">Startup Founder</option>
                  <option value="Investor">Investor</option>
                  <option value="Family Office">Family Office</option>
                  <option value="Consultant">Consultant</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {status === "error" && (
                <p className="text-red-400 text-sm">{msg}</p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-3 rounded-lg font-bold text-black transition-all hover:scale-[1.02] disabled:opacity-50"
                style={{ background: "#FF8900" }}
              >
                {status === "loading"
                  ? "Preparing Your Copy..."
                  : "Download the Book — Free"}
              </button>
              <p className="text-xs text-gray-600 text-center">
                53 pages. 10 industries. Zero fluff.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ── ABOUT AUTHOR ── */}
      <section className="py-20 px-6" style={{ background: "#111" }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500 mb-4">
            About the Author
          </p>
          <h3 className="text-2xl font-bold mb-4">Jeff Cline</h3>
          <p className="text-gray-400 leading-relaxed max-w-2xl mx-auto">
            Technology strategist and enterprise executive with 30+ years of
            experience. Four exits. Dozens of launches. Jeff helps businesses,
            entrepreneurs, start-ups, investors, and family offices profit at
            scale through technology disruption. He is the founder of VRTCLS, a
            multi-family office powered by geeks.
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <a
              href="/"
              className="px-6 py-2 rounded-lg text-sm font-medium border transition-all hover:bg-white/5"
              style={{ borderColor: "#FF8900", color: "#FF8900" }}
            >
              jeff-cline.com
            </a>
            <a
              href="/quiz"
              className="px-6 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 text-black"
              style={{ background: "#FF8900" }}
            >
              Take the Quiz
            </a>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-16 text-center px-6">
        <p className="text-gray-500 mb-4">
          Ready to see success from a different angle?
        </p>
        <a
          href="#download"
          className="inline-block px-10 py-3 rounded-lg font-bold text-black transition-all hover:scale-105"
          style={{ background: "#FF8900" }}
        >
          Get the Book — It&apos;s Free
        </a>
      </section>
    </div>
  );
}
