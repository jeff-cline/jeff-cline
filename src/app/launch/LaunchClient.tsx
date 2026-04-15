"use client";

import { useState, useEffect, useRef } from "react";

/* ── tool data ── */
const tools = [
  {
    name: "LaunchAI",
    icon: "🤖",
    tagline: "Your AI Workforce",
    description:
      "AI workforce, 24/7 lead qualification, custom AI agents, automated follow-ups. Your team that never sleeps.",
  },
  {
    name: "LaunchCART",
    icon: "🛒",
    tagline: "Sell Anything, Instantly",
    description:
      "One-click checkout, payment processing, inventory management. E-commerce without the headache.",
  },
  {
    name: "LaunchCRM",
    icon: "📇",
    tagline: "Reputation Command",
    description:
      "Reputation management, missed call text-back, AI chat, lead nurturing. Never lose a lead again.",
  },
  {
    name: "LaunchADS",
    icon: "📡",
    tagline: "Ads That Actually Work",
    description:
      "Multi-platform ads, AI targeting, ROI tracking. Spend smarter with measurable campaigns.",
  },
  {
    name: "LaunchDATA",
    icon: "🔍",
    tagline: "Know Your Visitors",
    description:
      "Visitor identification, audience building, and data enrichment. Turn anonymous traffic into warm leads.",
  },
  {
    name: "LaunchWEBINARS",
    icon: "🎥",
    tagline: "Go Live. Go Big.",
    description:
      "Live streaming, Q&A, replays, and registration funnels. Turn attendance into revenue.",
  },
  {
    name: "LaunchACADEMY",
    icon: "🎓",
    tagline: "Teach. Coach. Certify.",
    description:
      "Courses, coaching, community, and certifications. Scale your expertise with premium delivery.",
  },
];

const faqItems = [
  {
    q: "What is LAUNCH?",
    a: "LAUNCH is an all-in-one business platform with 7 integrated tools: LaunchAI, LaunchCART, LaunchCRM, LaunchADS, LaunchDATA, LaunchWEBINARS, and LaunchACADEMY. Everything runs on credits instead of separate subscriptions.",
  },
  {
    q: "How do credits work?",
    a: "Credits are the universal currency across all LAUNCH tools. Instead of paying separate subscriptions for each tool, you buy credits and spend them wherever you need — AI agents, ad spend, data lookups, webinar hosting, and more.",
  },
  {
    q: "What is an unlock code?",
    a: 'Unlock codes are special invite codes that grant bonus credits when you sign up. If you have one, enter it during registration to receive 50 free credits. You can still sign up without one.',
  },
  {
    q: "Is LAUNCH free to try?",
    a: "Yes. Sign up for free and explore the platform. With a valid unlock code you get 50 free credits to start using the tools immediately.",
  },
  {
    q: "What tools are included?",
    a: "LAUNCH includes LaunchAI (AI workforce), LaunchCART (e-commerce), LaunchCRM (reputation management), LaunchADS (advertising), LaunchDATA (data enrichment), LaunchWEBINARS (live streaming), and LaunchACADEMY (courses & coaching).",
  },
];

/* ── intersection observer hook ── */
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

/* ── main component ── */
export default function LaunchClient() {
  const [showCode, setShowCode] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", unlockCode: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const heroRef = useInView();
  const toolsRef = useInView();
  const creditsRef = useInView();
  const signupRef = useInView();
  const faqRef = useInView();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/launch/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");
      setStatus("success");
      setMsg(
        data.credits > 0
          ? `Welcome aboard! You've got ${data.credits} credits to start.`
          : "You're in! Explore the platform and grab an unlock code for free credits."
      );
      localStorage.setItem("launch_email", form.email);
      localStorage.setItem("launch_name", form.name);
      document.cookie = `launch_email=${encodeURIComponent(
        form.email
      )}; path=/; max-age=2592000`;
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
        className="relative overflow-hidden py-28 md:py-40 text-center"
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, #FF8900 0%, transparent 70%)",
          }}
        />
        <div
          className={`relative z-10 max-w-5xl mx-auto px-6 transition-all duration-700 ${
            heroRef.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h1
            className="text-6xl md:text-8xl font-black tracking-tight mb-4"
            style={{ color: "#FF8900" }}
          >
            LAUNCH
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-2 font-light">
            7 Tools. One Platform. Zero Excuses.
          </p>
          <p className="text-gray-500 max-w-2xl mx-auto mb-10">
            Everything you need to build, sell, market, and scale — powered by a single
            credit system. No more juggling subscriptions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#signup"
              className="px-8 py-3 rounded-lg font-semibold text-black transition-all hover:scale-105"
              style={{ background: "#FF8900" }}
            >
              Get Started Free
            </a>
            <a
              href="#tools"
              className="px-8 py-3 rounded-lg font-semibold border transition-all hover:bg-white/5"
              style={{ borderColor: "#FF8900", color: "#FF8900" }}
            >
              See the Tools
            </a>
          </div>
        </div>
      </section>

      {/* ── TOOLS GRID ── */}
      <section id="tools" ref={toolsRef.ref} className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2
            className={`text-3xl md:text-4xl font-bold text-center mb-4 transition-all duration-700 ${
              toolsRef.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            The Arsenal
          </h2>
          <p
            className={`text-gray-500 text-center mb-16 max-w-xl mx-auto transition-all duration-700 delay-100 ${
              toolsRef.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Seven battle-tested tools working together. Each one is powerful alone —
            together they&apos;re unstoppable.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, i) => (
              <div
                key={tool.name}
                className={`group rounded-xl p-6 border transition-all duration-500 hover:border-[#FF8900]/60 hover:-translate-y-1 ${
                  toolsRef.visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{
                  background: "#111",
                  borderColor: "#222",
                  transitionDelay: `${150 + i * 80}ms`,
                }}
              >
                <div className="text-4xl mb-3">{tool.icon}</div>
                <h3 className="text-lg font-bold mb-1" style={{ color: "#FF8900" }}>
                  {tool.name}
                </h3>
                <p className="text-sm text-gray-400 font-medium mb-2">{tool.tagline}</p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {tool.description}
                </p>
              </div>
            ))}
            {/* 7th card spans to fill the gap nicely on lg */}
          </div>
        </div>
      </section>

      {/* ── CREDITS EXPLAINER ── */}
      <section
        ref={creditsRef.ref}
        className="py-24 px-6"
        style={{ background: "#111" }}
      >
        <div
          className={`max-w-4xl mx-auto text-center transition-all duration-700 ${
            creditsRef.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            One Currency.{" "}
            <span style={{ color: "#FF8900" }}>Infinite Possibilities.</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-12">
            Forget juggling seven subscriptions. LAUNCH runs on credits — a single,
            flexible currency that works across every tool. Buy what you need, use it
            where you want.
          </p>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                title: "Buy Credits",
                desc: "Purchase credits in bulk or as you go. No contracts, no minimums.",
                icon: "💳",
              },
              {
                title: "Use Anywhere",
                desc: "Spend credits on AI agents, ads, data, webinars, courses — you pick.",
                icon: "🔄",
              },
              {
                title: "Track Everything",
                desc: "Real-time balance, full transaction history, zero surprises.",
                icon: "📊",
              },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SIGNUP / UNLOCK CODE ── */}
      <section id="signup" ref={signupRef.ref} className="py-24 px-6">
        <div
          className={`max-w-lg mx-auto transition-all duration-700 ${
            signupRef.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl font-bold text-center mb-2">
            Ready to <span style={{ color: "#FF8900" }}>LAUNCH</span>?
          </h2>
          <p className="text-gray-500 text-center mb-8">
            Create your account in seconds. Free to start.
          </p>

          {status === "success" ? (
            <div
              className="rounded-xl p-8 text-center border"
              style={{ background: "#111", borderColor: "#FF8900" }}
            >
              <div className="text-5xl mb-4">🚀</div>
              <p className="text-lg font-semibold mb-2" style={{ color: "#FF8900" }}>
                {msg}
              </p>
              <a
                href="/launch/dashboard"
                className="inline-block mt-4 px-6 py-2 rounded-lg text-black font-semibold"
                style={{ background: "#FF8900" }}
              >
                Go to Dashboard
              </a>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-xl p-8 border space-y-5"
              style={{ background: "#111", borderColor: "#222" }}
            >
              <div>
                <label className="block text-sm text-gray-400 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg px-4 py-3 text-white outline-none focus:ring-2 ring-[#FF8900]"
                  style={{
                    background: "#1a1a1a",
                  }}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-lg px-4 py-3 text-white outline-none focus:ring-2"
                  style={{ background: "#1a1a1a" }}
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded-lg px-4 py-3 text-white outline-none focus:ring-2"
                  style={{ background: "#1a1a1a" }}
                  placeholder="(555) 123-4567"
                />
              </div>

              {/* unlock code toggle */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowCode(!showCode)}
                  className="text-sm font-medium flex items-center gap-2 transition-colors hover:text-white"
                  style={{ color: "#FF8900" }}
                >
                  <span
                    className="transition-transform"
                    style={{ transform: showCode ? "rotate(90deg)" : "rotate(0)" }}
                  >
                    ▶
                  </span>
                  Have an unlock code?
                </button>
                {showCode && (
                  <div className="mt-3">
                    <input
                      type="text"
                      value={form.unlockCode}
                      onChange={(e) =>
                        setForm({ ...form, unlockCode: e.target.value.toUpperCase() })
                      }
                      className="w-full rounded-lg px-4 py-3 text-white outline-none focus:ring-2 font-mono tracking-widest text-center text-lg"
                      style={{ background: "#1a1a1a", borderColor: "#FF8900", border: "1px solid #FF8900" }}
                      placeholder="ENTER CODE"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Valid codes unlock 50 free credits on signup
                    </p>
                  </div>
                )}
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
                {status === "loading" ? "Creating Account..." : "Create Free Account"}
              </button>
              <p className="text-xs text-gray-600 text-center">
                No credit card required. Start with credits, scale when ready.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section ref={faqRef.ref} className="py-24 px-6" style={{ background: "#111" }}>
        <div
          className={`max-w-3xl mx-auto transition-all duration-700 ${
            faqRef.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <div
                key={i}
                className="rounded-lg border overflow-hidden"
                style={{ borderColor: "#222", background: "#0a0a0a" }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-6 py-4 flex justify-between items-center hover:bg-white/5 transition-colors"
                >
                  <span className="font-medium">{item.q}</span>
                  <span
                    className="transition-transform text-gray-500"
                    style={{
                      transform: openFaq === i ? "rotate(180deg)" : "rotate(0)",
                    }}
                  >
                    ▼
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-sm text-gray-400 leading-relaxed">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── bottom CTA ── */}
      <section className="py-20 text-center px-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Stop Subscribing. Start <span style={{ color: "#FF8900" }}>Launching.</span>
        </h2>
        <p className="text-gray-500 mb-8 max-w-lg mx-auto">
          Seven tools, one credit system, zero excuses. Your business deserves better
          than duct-taped software stacks.
        </p>
        <a
          href="#signup"
          className="inline-block px-10 py-3 rounded-lg font-bold text-black transition-all hover:scale-105"
          style={{ background: "#FF8900" }}
        >
          Get Started Free
        </a>
      </section>
    </div>
  );
}
