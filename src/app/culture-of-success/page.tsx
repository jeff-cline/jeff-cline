import Link from "next/link";
import type { Metadata } from "next";
import { tryGetDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Culture of Success | Jeff Cline",
  description:
    "People-first operating philosophy: why now, why join, how it works, and how humans lead AI to create durable impact.",
};

const attachedDocs = [
  {
    title: "01 Board Brief",
    file: "/culture-of-success/pdfs/01-board-brief.pdf",
    note: "Strategic framing and governance context.",
  },
  {
    title: "02 Corporate Comp Policy",
    file: "/culture-of-success/pdfs/02-corporate-comp-policy.pdf",
    note: "Corporate compensation policy and structure.",
  },
  {
    title: "03 Team Comp Playbook",
    file: "/culture-of-success/pdfs/03-team-comp-playbook.pdf",
    note: "Team behaviors and comp playbook for execution.",
  },
];

const principles = [
  "People first over profit: healthy people and aligned teams produce the best long-term profit.",
  "HUMAN will always lead AI; AI is leverage, not leadership.",
  "A rising tide lifts all boats: win together, support one another, and reward cross-functional impact.",
  "Less about pride, all about WE: team outcomes over ego.",
  "Not time spent, but value created: high-capacity contributors can win in a few focused hours.",
  "No full-time expectation: fractional contribution scales with demand and impact.",
  "Everyone starts in Biz Dev so culture and customer understanding come before role specialization.",
  "As we build, launch, and acquire, we align all teams to the same spirit of shared upside and legacy.",
];

async function persistCultureOfSuccess() {
  const payload = {
    slug: "culture-of-success-v1",
    title: "Culture of Success",
    motto: "EVERY INDUSTRY IS A GEEK AWAY FROM BEING UBERIZED.",
    hashtag: "#ArtLab",
    goal: "Create impact across the globe, change lives, and leave a meaningful, sustainable legacy.",
    why: "The future of work is already here: a new AI workforce is emerging and must be led by high-value humans.",
    whyNow:
      "Organizations that combine people-first culture with AI leverage will out-execute slower, ego-driven, time-based teams.",
    whyJoin:
      "Join if you want to be more than a worker: be a thinker, doer, and builder who helps evolve the system and lifts others.",
    howItWorks: [
      "People first, products and services second in training.",
      "Learn the company offers that generate revenue, then communicate them clearly to the market.",
      "Contribute beyond tasks: bring ideas, optimize workflows, and support team wins.",
      "Compensation rewards productivity, leverage, smart execution, and measurable impact.",
      "Competition is welcome, but in the spirit of winning together and meeting organizational goals.",
    ],
    principles,
    docs: attachedDocs,
    references: {
      compPage: "/artlab",
      bizDevPage: "/BIZ-DEV",
    },
    updatedAt: new Date(),
  };

  const db = await tryGetDb();
  if (!db) return { ok: false as const, reason: "db_unavailable" };

  await db.collection("culture_of_success").updateOne(
    { slug: payload.slug },
    {
      $set: payload,
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true }
  );

  return { ok: true as const };
}

export default async function CultureOfSuccessPage() {
  const persisted = await persistCultureOfSuccess();

  return (
    <section className="px-4 py-28">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="rounded-3xl border border-[#FF8900]/30 bg-gradient-to-br from-[#171717] to-[#0b0b0b] p-8 md:p-12">
          <p className="text-xs tracking-[0.25em] uppercase text-[#FF8900] font-bold mb-4">Culture of Success • #ArtLab</p>
          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-5">
            EVERY INDUSTRY IS A GEEK AWAY FROM BEING <span className="text-[#DC2626]">UBERIZED</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-4xl">
            PEOPLE FIRST over profit. HUMAN leadership over AI autopilot. We build teams that optimize outcomes,
            elevate each other, and create meaningful legacy at scale.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold">
            <span className="px-3 py-1 rounded-full bg-[#FF8900]/15 text-[#FFB15A] border border-[#FF8900]/30">People First</span>
            <span className="px-3 py-1 rounded-full bg-white/5 text-gray-200 border border-white/10">Human-Led AI</span>
            <span className="px-3 py-1 rounded-full bg-white/5 text-gray-200 border border-white/10">Why + Why Now</span>
            <span className="px-3 py-1 rounded-full bg-[#DC2626]/15 text-red-300 border border-[#DC2626]/30">Win Together</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-white/10 bg-[#141414] p-7">
            <h2 className="text-2xl font-bold mb-4">Why</h2>
            <p className="text-gray-300 leading-relaxed">
              We are building organizations where people love what they do, make global impact, and leave a legacy.
              Culture is not a poster—it is the operating system that determines whether teams compound or collapse.
            </p>
            <h2 className="text-2xl font-bold mt-6 mb-4">Why Now</h2>
            <p className="text-gray-300 leading-relaxed">
              The future of work is already here. A new AI workforce is emerging, and it will always be led by humans
              who provide clarity, values, and strategic judgment. Teams that adapt now will lead the next decade.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#141414] p-7">
            <h2 className="text-2xl font-bold mb-4">Why Join</h2>
            <ul className="space-y-3 text-gray-300 leading-relaxed">
              <li>• Be a builder, not just a worker.</li>
              <li>• Grow with a high-capacity team that values smart execution over clocked hours.</li>
              <li>• Learn products/services that generate real revenue and market impact.</li>
              <li>• Participate in a comp model designed to reward contribution and team lift.</li>
              <li>• Help create businesses, products, and acquisitions that win together.</li>
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#121212] p-7">
          <h2 className="text-2xl font-bold mb-5">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <article className="rounded-xl border border-white/10 bg-[#1a1a1a] p-5">
              <h3 className="text-lg font-bold">Training Sequence</h3>
              <p className="text-sm text-gray-300 mt-3">
                People first, then products/services. Understand the mission, then communicate value with confidence.
              </p>
            </article>
            <article className="rounded-xl border border-white/10 bg-[#1a1a1a] p-5">
              <h3 className="text-lg font-bold">Entry Point</h3>
              <p className="text-sm text-gray-300 mt-3">
                Everyone starts as Biz Dev to internalize culture, process, and customer value before specialization.
              </p>
            </article>
            <article className="rounded-xl border border-white/10 bg-[#1a1a1a] p-5">
              <h3 className="text-lg font-bold">Work Model</h3>
              <p className="text-sm text-gray-300 mt-3">
                No full-time expectation. Fractional leaders can contribute a few hours weekly and still create major outcomes.
              </p>
            </article>
            <article className="rounded-xl border border-white/10 bg-[#1a1a1a] p-5">
              <h3 className="text-lg font-bold">Winning Logic</h3>
              <p className="text-sm text-gray-300 mt-3">
                We encourage leaders and healthy competition in the spirit of shared wins, impact, and organizational goals.
              </p>
            </article>
          </div>
          <p className="text-sm text-gray-400 mt-5">
            Compensation details live in the comp framework: <Link href="/artlab" className="text-[#FF8900] hover:text-[#FFB15A] underline underline-offset-4">/artlab</Link>
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#121212] p-7">
          <h2 className="text-2xl font-bold mb-5">People-First Principles</h2>
          <ul className="space-y-3 text-gray-300 leading-relaxed">
            {principles.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#121212] p-7">
          <h2 className="text-2xl font-bold mb-5">Attached PDFs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {attachedDocs.map((doc) => (
              <article key={doc.file} className="rounded-xl border border-white/10 bg-[#1a1a1a] p-5">
                <p className="font-bold">{doc.title}</p>
                <p className="text-sm text-gray-400 mt-2 min-h-[44px]">{doc.note}</p>
                <a
                  href={doc.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex mt-4 text-sm font-semibold text-[#FF8900] hover:text-[#FFB15A]"
                >
                  Open PDF →
                </a>
              </article>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-5">
            Database sync: {persisted.ok ? "saved to culture_of_success collection" : "pending (database unavailable in this environment)"}.
          </p>
        </div>

        <div className="rounded-2xl border border-[#DC2626]/25 bg-[#0f0f0f] p-7">
          <h2 className="text-2xl font-bold mb-3">The Future Is Human-Led</h2>
          <p className="text-gray-300 leading-relaxed">
            The future belongs to teams who combine human judgment, honorable execution, and AI leverage. Pride and ego
            take a back seat to purpose, impact, and shared outcomes.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/contact" className="btn-primary">Join the Mission →</Link>
            <Link href="/artlab" className="btn-secondary">View Comp Structure</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
