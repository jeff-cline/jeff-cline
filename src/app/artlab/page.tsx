import Link from "next/link";
import type { Metadata } from "next";
import { tryGetDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ArtLab Comp & Culture | Jeff Cline",
  description:
    "Corporate compensation structure and culture framework focused on impact, optimization, and shared upside.",
};

type Tier = {
  tier: string;
  timeline: string;
  allocation: string;
  description: string;
};

type BizDevLevel = {
  level: string;
  base: string;
  notes: string;
};

const attachedDocs = [
  {
    title: "01 Board Brief",
    file: "/artlab/pdfs/01-board-brief.pdf",
    note: "High-level strategic framing and governance context.",
  },
  {
    title: "02 Corporate Comp Policy",
    file: "/artlab/pdfs/02-corporate-comp-policy.pdf",
    note: "Compensation policy details for corporate implementation.",
  },
  {
    title: "03 Team Comp Playbook",
    file: "/artlab/pdfs/03-team-comp-playbook.pdf",
    note: "Operating playbook for team-level compensation behavior.",
  },
];

const tierModel: Tier[] = [
  {
    tier: "Tier 1",
    timeline: "Founding window (approx. Jul 2025–Jul 2026)",
    allocation: "50% of the loyalty bucket",
    description:
      "Recognizes early believers who contributed time, effort, and energy with little or no early compensation.",
  },
  {
    tier: "Tier 2",
    timeline: "Growth window (approx. 2027–2028)",
    allocation: "30% of the loyalty bucket",
    description:
      "Recognizes operators joining in scale-up years who materially move outcomes.",
  },
  {
    tier: "Tier 3",
    timeline: "Expansion window (2029+)",
    allocation: "20% of the loyalty bucket",
    description:
      "Rewards later contributors based on measurable impact and optimization leverage.",
  },
];

const bizDevLevels: BizDevLevel[] = [
  {
    level: "Level 1",
    base: "$555/mo",
    notes:
      "Plus prorated quarterly profit-pool share based on time in role.",
  },
  {
    level: "Level 2",
    base: "$1,111/mo",
    notes: "Progression based on execution, ownership, and repeatable outcomes.",
  },
  {
    level: "Level 3",
    base: "$2,222/mo",
    notes: "Expanded influence, deal velocity, and cross-team contribution.",
  },
  {
    level: "Level 4",
    base: "$4,444/mo",
    notes: "High-capacity leadership contribution with multiplier-level impact.",
  },
];

async function persistArtlabBrief() {
  const payload = {
    slug: "artlab-comp-culture-v1",
    title: "ArtLab Comp & Culture",
    motto: "EVERY INDUSTRY IS A GEEK AWAY FROM BEING UBERIZED.",
    goal: "Create impact, change lives, and leave a legacy friends and family can admire.",
    principles: [
      "A rising tide lifts all boats.",
      "No full-time employees; build with high-capacity fractional leadership.",
      "Comp is driven by outcomes and optimization, not time spent.",
      "Everyone starts in Biz Dev to learn process, vision, and culture.",
      "Support roles participate in success upside, not just frontline sales.",
      "Back-of-house value can out-earn front-of-house when impact is greatest.",
      "Acquisitions and rollups should reflect the same spirit with tailored mechanics.",
    ],
    profitPool: {
      poolPercent: 10,
      aspirationalExitGoalPerCoreMember: 1000000,
      split: {
        commitmentWeightPercent: 70,
        impactVoteWeightPercent: 30,
      },
      governance: {
        votingSource: "Peer team-member votes",
        leadershipBias: "Leadership weighting based on measurable data and impact",
        finalDecisionAuthority: "Jeff Cline tie-break/final decision",
      },
    },
    tiers: tierModel,
    bizDevLevels,
    docs: attachedDocs,
    updatedAt: new Date(),
  };

  const db = await tryGetDb();
  if (!db) return { ok: false as const, reason: "db_unavailable" };

  await db.collection("artlab_comp_culture").updateOne(
    { slug: payload.slug },
    {
      $set: payload,
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true }
  );

  return { ok: true as const };
}

export default async function ArtlabPage() {
  const persisted = await persistArtlabBrief();

  return (
    <section className="px-4 py-28">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="rounded-3xl border border-[#FF8900]/30 bg-gradient-to-br from-[#171717] to-[#0b0b0b] p-8 md:p-12">
          <p className="text-xs tracking-[0.25em] uppercase text-[#FF8900] font-bold mb-4">ArtLab • Comp + Culture</p>
          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-5">
            EVERY INDUSTRY IS A GEEK AWAY FROM BEING <span className="text-[#DC2626]">UBERIZED</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-4xl">
            Build a high-capacity, optimization-first team that wins together. The model rewards commitment,
            measurable impact, and cross-functional lift—not raw hours.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold">
            <span className="px-3 py-1 rounded-full bg-[#FF8900]/15 text-[#FFB15A] border border-[#FF8900]/30">10% Profit Pool</span>
            <span className="px-3 py-1 rounded-full bg-white/5 text-gray-200 border border-white/10">70% Commitment</span>
            <span className="px-3 py-1 rounded-full bg-white/5 text-gray-200 border border-white/10">30% Team-Voted Impact</span>
            <span className="px-3 py-1 rounded-full bg-[#DC2626]/15 text-red-300 border border-[#DC2626]/30">No Full-Time Headcount</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-white/10 bg-[#141414] p-7">
            <h2 className="text-2xl font-bold mb-4">Corporate Comp Structure</h2>
            <ul className="space-y-3 text-gray-300 leading-relaxed">
              <li>• 10% profit pool with a long-range objective of <strong>$1M per core member at exit</strong>.</li>
              <li>• Pool allocation: <strong>70%</strong> commitment + <strong>30%</strong> impact (team votes).</li>
              <li>• Votes are tallied from peers and calibrated by leadership recommendations.</li>
              <li>• Jeff Cline acts as final decision authority / tie-breaker.</li>
              <li>• Quarterly payout logic supports prorated participation by time in active role.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#141414] p-7">
            <h2 className="text-2xl font-bold mb-4">Purpose + Cultural Operating System</h2>
            <ul className="space-y-3 text-gray-300 leading-relaxed">
              <li>• <strong>Goal:</strong> Create impact, change lives, and leave a legacy.</li>
              <li>• <strong>How:</strong> People-first culture aligned to shared outcomes.</li>
              <li>• <strong>Belief:</strong> A rising tide lifts all boats.</li>
              <li>• <strong>Behavior:</strong> Resolve problems in an honorable way while having fun and lifting others.</li>
              <li>• <strong>Design:</strong> Build a magical vortex where individual success compounds team success.</li>
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#121212] p-7">
          <h2 className="text-2xl font-bold mb-5">Tier Recognition Model (Loyalty + Early Contribution)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tierModel.map((tier) => (
              <article key={tier.tier} className="rounded-xl border border-white/10 bg-[#1a1a1a] p-5">
                <p className="text-sm uppercase tracking-wider text-[#FF8900] font-bold">{tier.tier}</p>
                <p className="text-lg font-bold mt-1">{tier.allocation}</p>
                <p className="text-xs text-gray-500 mt-1">{tier.timeline}</p>
                <p className="text-sm text-gray-300 mt-3 leading-relaxed">{tier.description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#121212] p-7">
          <h2 className="text-2xl font-bold mb-5">Biz Dev Ladder (<Link href="/BIZ-DEV" className="text-[#FF8900] hover:text-[#FFB15A] underline underline-offset-4">Everyone Starts Here</Link>)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bizDevLevels.map((item) => (
              <article key={item.level} className="rounded-xl border border-white/10 bg-[#1a1a1a] p-5">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-lg font-bold">{item.level}</p>
                  <p className="text-[#FF8900] font-black">{item.base}</p>
                </div>
                <p className="text-sm text-gray-300 mt-3">{item.notes}</p>
              </article>
            ))}
          </div>
          <p className="text-sm text-gray-400 mt-5 leading-relaxed">
            Base compensation can map to an individual, partner, or company. Core expectation: strong command of process,
            vision, and culture. Frontline sales comp remains separate, while universal support bonus mechanics ensure
            back-of-house impact is rewarded when it drives outcomes.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#121212] p-7">
          <h2 className="text-2xl font-bold mb-5">Attached PDF Context</h2>
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
            Database sync: {persisted.ok ? "saved to artlab_comp_culture collection" : "pending (database unavailable in this environment)"}.
          </p>
        </div>

        <div className="rounded-2xl border border-[#DC2626]/25 bg-[#0f0f0f] p-7">
          <h2 className="text-2xl font-bold mb-3">Optimization Team Blueprint</h2>
          <p className="text-gray-300 leading-relaxed">
            The operating model starts as a fractional leadership system (as little as one hour per week) and scales with
            demand. Success is measured by leverage, outcomes, and acceleration—not attendance. Acquisitions and rollups
            can preserve internal structures while aligning to this spirit of shared upside, accountability, and cross-team lift.
          </p>
          <div className="mt-5">
            <Link href="/contact" className="btn-primary">Build the Team →</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
