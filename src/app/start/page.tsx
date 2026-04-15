import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Start Here | Jeff Cline",
  description:
    "Jeff Cline's ecosystem of AI-powered tools and platforms. MoneyWords, Kreeper, Agents.biz, VoiceDrips, KeywordCalls, SoftCircle, Coaches Cloud, and more.",
};

const products = [
  {
    name: "MoneyWords",
    domain: "moneywords.org",
    url: "https://moneywords.org",
    color: "#F97316",
    description:
      "AI-powered keyword intelligence platform. Discover high-intent keywords, analyze search demand, and find the exact phrases your buyers are typing before they buy.",
  },
  {
    name: "Kreeper",
    domain: "kreeper.ai",
    url: "https://kreeper.ai",
    color: "#22c55e",
    description:
      "Visitor identification technology. See who's on your website in real time -- names, companies, emails -- even if they never fill out a form. Turn anonymous traffic into qualified leads.",
  },
  {
    name: "Agents.biz",
    domain: "agents.biz",
    url: "https://agents.biz",
    color: "#3b82f6",
    description:
      "AI agent tools for the C-suite. Deploy autonomous AI agents that handle research, outreach, data analysis, and workflow automation at enterprise scale.",
  },
  {
    name: "VoiceDrips",
    domain: "voicedrips.com",
    url: "https://voicedrips.com",
    color: "#a855f7",
    description:
      "AI voice campaigns that drip on autopilot. Send personalized voice messages to prospects at scale -- ringless voicemail, voice broadcasts, and follow-up sequences powered by AI.",
  },
  {
    name: "KeywordCalls",
    domain: "keywordcalls.com",
    url: "https://keywordcalls.com",
    color: "#ef4444",
    description:
      "Inbound call generation from high-intent keywords. Connect search demand directly to your phone -- when someone searches your keyword, they call you. Pay-per-call lead generation.",
  },
  {
    name: "SoftCircle",
    domain: "softcircle.ai",
    url: "https://softcircle.ai",
    color: "#06b6d4",
    description:
      "AI-powered investor discovery and soft circling. Find accredited investors, gauge interest before you pitch, and build your raise with warm introductions -- not cold outreach.",
  },
  {
    name: "Coaches Cloud",
    domain: "coaches.cloud",
    url: "https://coaches.cloud",
    color: "#E91E90",
    description:
      "The coaching ecosystem platform. Whether you're building a community, scaling a coaching practice, or launching a brand -- Coaches Cloud connects all three sides of the coaching economy.",
  },
];

export default function StartPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-black" />
        <div className="relative max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4">
            Start Here
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Jeff Cline&apos;s ecosystem of AI-powered platforms. Every tool below is built to help you find buyers, close deals, and scale faster.
          </p>
        </div>
      </section>

      {/* Product Grid */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid gap-6 md:grid-cols-2">
          {products.map((p) => (
            <a
              key={p.domain}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-2xl border border-gray-800 bg-gray-950 p-8 transition-all duration-200 hover:border-gray-600 hover:bg-gray-900/80 hover:shadow-lg"
            >
              {/* Logo text */}
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="inline-block w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: p.color }}
                />
                <span
                  className="text-2xl font-black tracking-tight"
                  style={{ color: p.color }}
                >
                  {p.name}
                </span>
                <span className="text-sm text-gray-500 font-mono">
                  {p.domain}
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-400 leading-relaxed text-[15px]">
                {p.description}
              </p>

              {/* Visit arrow */}
              <div
                className="mt-5 text-sm font-semibold flex items-center gap-1 transition-transform group-hover:translate-x-1"
                style={{ color: p.color }}
              >
                Visit {p.domain}
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Tools Section */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <div className="rounded-2xl border border-gray-800 bg-gradient-to-r from-gray-950 to-gray-900 p-10 text-center">
          <h2 className="text-3xl font-black mb-3">Tools &agrave; la Carte</h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-6">
            Don&apos;t need a full platform? Pick individual SEO and keyword tools, pay per use, no subscription required.
          </p>
          <Link
            href="/tools-a-la-carte"
            className="inline-flex items-center gap-2 bg-white text-black font-bold px-8 py-3 rounded-full hover:bg-gray-200 transition-colors"
          >
            Browse Tools
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer easter egg */}
      <div className="text-center pb-4">
        <a
          href="https://jeff-cline.com"
          style={{ fontSize: "6px", opacity: 0.08 }}
          className="text-gray-500 hover:text-gray-400"
        >
          JC
        </a>
      </div>
    </main>
  );
}
