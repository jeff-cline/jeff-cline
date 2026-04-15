import Link from "next/link";
import type { Metadata } from "next";
import { silos } from "@/lib/silo-data";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "About Jeff Cline — 30+ Years of Technology Disruption | PROFIT AT SCALE",
  description:
    "Jeff Cline: enterprise executive, tech visionary, and the geek who helps businesses, entrepreneurs, and investors uberize their industries. 30+ years of making profit at scale real.",
  openGraph: {
    title: "About Jeff Cline | Jeff Cline",
    description: "Every industry is ONE GEEK away from being UBERIZED. Meet the geek.",
    url: "https://jeff-cline.com/about",
    siteName: "Jeff Cline",
    type: "website",
    images: [{ url: "/favicon-192x192.png", width: 192, height: 192, alt: "Jeff Cline" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Jeff Cline | Jeff Cline",
    description: "30+ years of technology disruption. Meet Jeff Cline.",
  },
};

const siloIcons: Record<string, string> = {
  business: "🏢",
  entrepreneur: "🚀",
  "start-ups": "⚡",
  investors: "📈",
  "family-offices": "🏛️",
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Jeff Cline",
            url: "https://jeff-cline.com",
            jobTitle: "Technology Strategist & Enterprise Executive",
            description:
              "30+ years of enterprise technology leadership. Helping businesses, entrepreneurs, start-ups, investors, and family offices achieve PROFIT AT SCALE.",
            sameAs: ["https://jeff-cline.com"],
          }),
        }}
      />

      <Breadcrumbs items={[{ label: "About" }]} />

      {/* Hero */}
      <section className="pt-8 pb-20 px-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(220,38,38,0.06)_0%,transparent_70%)]" />
        <div className="max-w-4xl mx-auto text-center animate-fade-in-up relative z-10">
          <p className="text-[#DC2626] font-bold text-sm tracking-[0.3em] uppercase mb-4">
            About Jeff Cline
          </p>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            The <span className="text-[#FF8900]">GEEK</span> Behind the{" "}
            <span className="text-[#DC2626]">DISRUPTION</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            30+ years of enterprise technology leadership. Zero patience for mediocrity.
            One mission: <span className="text-[#FF8900] font-bold">PROFIT AT SCALE</span>.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black mb-8">
            The <span className="text-[#FF8900]">Journey</span>
          </h2>
          <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
            <p>
              I&apos;ve spent three decades in the trenches of enterprise technology—building systems,
              breaking systems, and rebuilding them better. I&apos;ve watched entire industries get
              blindsided by technology they didn&apos;t see coming. And I&apos;ve been the geek
              standing behind the companies that did the blindsiding.
            </p>
            <p>
              From healthcare IT to AI voice platforms, from creative technology to executive
              wellness—every company I touch gets the same treatment: ruthless efficiency, scalable
              systems, and technology that creates an unfair competitive advantage.
            </p>
            <p>
              I don&apos;t do incremental improvement. I do disruption. The kind that makes your
              competitors wonder what the hell just happened.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-20 px-4 bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black mb-12 text-center">
            The <span className="text-[#FF8900]">Philosophy</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-8">
              <h3 className="text-5xl font-black gradient-text mb-4">PROFIT AT SCALE</h3>
              <p className="text-gray-400 leading-relaxed">
                Growth without profit is a hobby. Profit without scale is a job. I build systems
                that deliver both—simultaneously and relentlessly. Every technology decision I make
                is anchored to one question: does this print money at scale?
              </p>
            </div>
            <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-8">
              <h3 className="text-2xl font-black mb-4">
                Every Industry is a <span className="text-[#FF8900]">GEEK</span> Away from Being{" "}
                <span className="text-[#DC2626]">UBERIZED</span>
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Taxis had Uber. Hotels had Airbnb. Your industry has its own disruption coming.
                The only question is whether you&apos;re the disruptor or the disrupted. I make
                sure it&apos;s the former.
              </p>
            </div>
          </div>
          <div className="mt-12 text-center">
            <p className="text-2xl md:text-3xl font-black">
              <span className="text-[#FF8900]">2026</span> is going to be{" "}
              <span className="text-[#DC2626]">EPIC</span>.
            </p>
            <p className="text-gray-500 mt-2 text-lg">FIREHORSE #GIDDYUP 🐎🔥</p>
          </div>
        </div>
      </section>

      {/* The Increase/Decrease Framework */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black mb-12 text-center">
            The <span className="text-[#FF8900]">Framework</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#1a1a1a] border border-[#FF8900]/20 rounded-2xl p-8">
              <h3 className="text-[#FF8900] font-black text-xl mb-6">↑ INCREASE</h3>
              <ul className="space-y-4">
                {[
                  "Scalable Demand Engine",
                  "Highly Efficient Sales Teams",
                  "IP & Technology for IP Value and Exit Multiples",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-[#FF8900] mt-1">▲</span>
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#1a1a1a] border border-[#DC2626]/20 rounded-2xl p-8">
              <h3 className="text-[#DC2626] font-black text-xl mb-6">↓ DECREASE</h3>
              <ul className="space-y-4">
                {["Reduction in Cost", "Risk", "Operational Strain"].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-[#DC2626] mt-1">▼</span>
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="text-center text-gray-500 mt-8">
            Powered by predictive analytics, big data, and proprietary technology.
          </p>
        </div>
      </section>

      {/* What I Do - 5 Silos */}
      <section className="py-20 px-4 bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black mb-12 text-center">
            What I <span className="text-[#FF8900]">Do</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {silos.map((silo, i) => (
              <Link
                key={silo.slug}
                href={`/${silo.slug}`}
                className={`bg-[#1a1a1a] border border-white/5 rounded-xl p-6 group hover:border-[#FF8900]/30 transition-colors ${
                  i === 4 ? "md:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <div className="text-3xl mb-3">{siloIcons[silo.slug]}</div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-[#FF8900] transition-colors">
                  {silo.name}
                </h3>
                <p className="text-gray-500 text-sm">{silo.heroSub}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-4">
            Ready to Get <span className="text-[#FF8900]">Disrupted</span>?
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Not disrupted by someone else. Disrupted by yourself—on purpose, with a plan,
            and with a geek who&apos;s done it a hundred times before.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quiz" className="btn-primary text-lg animate-pulse-glow">
              Take the Disruption Quiz →
            </Link>
            <Link href="/contact" className="btn-secondary text-lg">
              Let&apos;s Talk
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
