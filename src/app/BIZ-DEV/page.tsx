import Link from "next/link";
import type { Metadata } from "next";
import { silos } from "@/lib/silo-data";
import { portfolioCompanies } from "@/lib/portfolio-data";
import { tryGetDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "BIZ-DEV | Jeff Cline",
  description:
    "Biz Dev onboarding path for culture-aligned operators: understand the vision, demonstrate value, and earn by impact.",
};

type LadderLevel = {
  level: string;
  monthlyBase: string;
  monthlyBaseValue: number;
  commissionRule: string;
};

const ladder: LadderLevel[] = [
  {
    level: "Level 1",
    monthlyBase: "$555/mo",
    monthlyBaseValue: 555,
    commissionRule: "Greater of 6% commission OR closest ladder level payout baseline.",
  },
  {
    level: "Level 2",
    monthlyBase: "$1,111/mo",
    monthlyBaseValue: 1111,
    commissionRule: "Progressive eligibility based on understanding + contribution.",
  },
  {
    level: "Level 3",
    monthlyBase: "$2,222/mo",
    monthlyBaseValue: 2222,
    commissionRule: "High-capacity execution with cross-team impact.",
  },
  {
    level: "Level 4",
    monthlyBase: "$4,444/mo",
    monthlyBaseValue: 4444,
    commissionRule: "Multiplier leadership contribution and optimization lift.",
  },
];

const publicProductsAndOffers = [
  { name: "Tools Hub", href: "/tools", kind: "Product" },
  { name: "Tools Pricing", href: "/tools-pricing", kind: "Product" },
  { name: "Tools À La Carte", href: "/tools-a-la-carte", kind: "Product" },
  { name: "Disruption Quiz", href: "/quiz", kind: "Lead Product" },
  { name: "Investment Calculator", href: "/investment-calculator", kind: "Product" },
  { name: "Calculators Suite", href: "/calculators", kind: "Product" },
  { name: "Pitch Decks", href: "/pitch-decks", kind: "Offer" },
  { name: "Books", href: "/books", kind: "Offer" },
  { name: "Mastermind", href: "/mastermind", kind: "Offer" },
  { name: "Portfolio Companies", href: "/portfolio-companies", kind: "Offer" },
];

const trainingRoutes = [
  { title: "Business", href: "/business" },
  { title: "Entrepreneur", href: "/entrepreneur" },
  { title: "Start-Ups", href: "/start-ups" },
  { title: "Investors", href: "/investors" },
  { title: "Family Offices", href: "/family-offices" },
  { title: "Tools", href: "/tools" },
  { title: "Pitch Decks", href: "/pitch-decks" },
  { title: "Portfolio Companies", href: "/portfolio-companies" },
];

async function persistBizDevBrief() {
  const payload = {
    slug: "biz-dev-onboarding-v1",
    title: "BIZ-DEV Program",
    motto: "EVERY INDUSTRY IS A GEEK AWAY FROM BEING UBERIZED.",
    mission:
      "Everyone who starts must understand the vision and demonstrate alignment by bringing one JV, partner, client, or opportunity.",
    compensation: {
      entryRule:
        "Participant receives the greater of two values for start compensation: 6% commission or the closest ladder level baseline.",
      commissionDurationMonths: 12,
      ladder,
    },
    trainingLinks: trainingRoutes,
    publicOffers: publicProductsAndOffers,
    updatedAt: new Date(),
  };

  const db = await tryGetDb();
  if (!db) return { ok: false as const };

  await db.collection("biz_dev_program").updateOne(
    { slug: payload.slug },
    {
      $set: payload,
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true }
  );

  return { ok: true as const };
}

export default async function BizDevPage() {
  const persisted = await persistBizDevBrief();

  return (
    <section className="px-4 py-28">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="rounded-3xl border border-[#FF8900]/30 bg-gradient-to-br from-[#171717] to-[#0b0b0b] p-8 md:p-12">
          <p className="text-xs tracking-[0.25em] uppercase text-[#FF8900] font-bold mb-4">BIZ-DEV • Everyone Starts Here</p>
          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-5">
            BIZ-DEV: Understand the Vision. <span className="text-[#DC2626]">Demonstrate You Get It.</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-5xl leading-relaxed">
            This path is for people who want to come alongside a culture of winners. From C-suite to coders to project
            managers, everyone starts with business development understanding. To begin, bring one real JV, partner,
            client, or opportunity that proves commitment and alignment.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold">
            <span className="px-3 py-1 rounded-full bg-[#FF8900]/15 text-[#FFB15A] border border-[#FF8900]/30">Entry Proof: 1 JV / Partner / Client / Opportunity</span>
            <span className="px-3 py-1 rounded-full bg-white/5 text-gray-200 border border-white/10">Commission Window: 12 Months</span>
            <span className="px-3 py-1 rounded-full bg-white/5 text-gray-200 border border-white/10">Comp Rule: Greater of 6% or Closest Level</span>
            <span className="px-3 py-1 rounded-full bg-[#DC2626]/15 text-red-300 border border-[#DC2626]/30">Culture First, Impact Always</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-white/10 bg-[#141414] p-7">
            <h2 className="text-2xl font-bold mb-4">Program Concept</h2>
            <ul className="space-y-3 text-gray-300 leading-relaxed">
              <li>• Every starter must fully understand the Jeff Cline vision and culture.</li>
              <li>• Demonstration is practical, not theoretical: bring one qualified opportunity.</li>
              <li>• Everyone learns total value creation across products, services, and delivery.</li>
              <li>• This is a proving ground for commitment, understanding, and contribution.</li>
              <li>• The goal is to learn in motion with high performers already winning on the team.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#141414] p-7">
            <h2 className="text-2xl font-bold mb-4">Compensation Rule (Start Journey)</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              For the first 12 months, starter compensation is the <strong>greater of:</strong>
            </p>
            <ul className="space-y-3 text-gray-300 leading-relaxed">
              <li>• <strong>6% commission</strong> on qualified business outcome, or</li>
              <li>• <strong>The closest ladder level baseline</strong> for their entry stage.</li>
            </ul>
            <p className="text-sm text-gray-400 mt-5">
              This structure creates a fair floor with upside while people prove understanding and operational impact.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#121212] p-7">
          <h2 className="text-2xl font-bold mb-5">BIZ-DEV Ladder</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ladder.map((item) => (
              <article key={item.level} className="rounded-xl border border-white/10 bg-[#1a1a1a] p-5">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-lg font-bold">{item.level}</p>
                  <p className="text-[#FF8900] font-black">{item.monthlyBase}</p>
                </div>
                <p className="text-sm text-gray-300 mt-3">{item.commissionRule}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#121212] p-7">
          <h2 className="text-2xl font-bold mb-5">Products & Services (Public) — Training + Understanding</h2>
          <p className="text-gray-300 mb-5 leading-relaxed">
            These are public-facing assets every BIZ-DEV participant should study to understand what we are creating,
            how value is delivered, and where opportunities come from.
          </p>

          <h3 className="text-xl font-bold mb-3 text-[#FF8900]">Core Service Pillars</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {silos.map((silo) => (
              <article key={silo.slug} className="rounded-xl border border-white/10 bg-[#1a1a1a] p-5">
                <Link href={`/${silo.slug}`} className="text-lg font-bold hover:text-[#FF8900] transition-colors">
                  {silo.name}
                </Link>
                <p className="text-sm text-gray-400 mt-2 line-clamp-3">{silo.heroSub}</p>
                <ul className="mt-3 space-y-1 text-xs text-gray-500">
                  {silo.subPages.slice(0, 3).map((p) => (
                    <li key={p.slug}>• {p.title}</li>
                  ))}
                </ul>
                <Link href={`/${silo.slug}`} className="inline-flex mt-4 text-sm font-semibold text-[#FF8900] hover:text-[#FFB15A]">
                  Training Path →
                </Link>
              </article>
            ))}
          </div>

          <h3 className="text-xl font-bold mb-3 text-[#FF8900]">Public Products + Offers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {publicProductsAndOffers.map((item) => (
              <article key={item.href} className="rounded-xl border border-white/10 bg-[#1a1a1a] p-5">
                <p className="text-xs uppercase tracking-wider text-gray-500">{item.kind}</p>
                <Link href={item.href} className="text-lg font-bold hover:text-[#FF8900] transition-colors mt-1 inline-block">
                  {item.name}
                </Link>
                <p className="text-xs text-gray-500 mt-3">Use this for onboarding, positioning, and offer fluency.</p>
              </article>
            ))}
          </div>

          <h3 className="text-xl font-bold mb-3 text-[#FF8900]">Portfolio Product Awareness</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {portfolioCompanies.map((company) => (
              <article key={company.slug} className="rounded-xl border border-white/10 bg-[#1a1a1a] p-5">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-bold">{company.name}</p>
                  <span className="text-xs px-2 py-1 rounded-full border border-white/10 text-gray-300">{company.category}</span>
                </div>
                <p className="text-sm text-gray-400 mt-2">{company.brandPromise}</p>
                <p className="text-xs text-gray-500 mt-2 line-clamp-2">{company.description}</p>
                {company.link ? (
                  <a
                    href={company.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex mt-3 text-sm font-semibold text-[#FF8900] hover:text-[#FFB15A]"
                  >
                    View Product →
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#DC2626]/25 bg-[#0f0f0f] p-7">
          <h2 className="text-2xl font-bold mb-3">Why This Exists</h2>
          <p className="text-gray-300 leading-relaxed mb-5">
            This is designed for contributors who want to align with culture, learn by doing, and prove they can create
            opportunity. The requirement to bring real deal flow ensures understanding is demonstrated through action.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/artlab" className="btn-secondary">Back to Comp + Culture</Link>
            <Link href="/contact" className="btn-primary">Bring an Opportunity →</Link>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Database sync: {persisted.ok ? "saved to biz_dev_program collection" : "pending (database unavailable in this environment)"}.
          </p>
        </div>
      </div>
    </section>
  );
}
