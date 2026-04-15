import Link from "next/link";
import type { Metadata } from "next";
import { silos } from "@/lib/silo-data";

export const metadata: Metadata = {
  title: "Jeff Cline — PROFIT AT SCALE | Every Industry is ONE GEEK Away from Being UBERIZED",
  description:
    "Jeff Cline helps businesses, entrepreneurs, start-ups, investors, and family offices weaponize technology to dominate their markets. Predictive analytics, AI, and proprietary systems that print profit at scale.",
  openGraph: {
    title: "Jeff Cline — PROFIT AT SCALE",
    description: "Every Industry is ONE GEEK away from being UBERIZED. Technology disruption for profit.",
    url: "https://jeff-cline.com",
    siteName: "Jeff Cline",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jeff Cline — PROFIT AT SCALE",
    description: "Every Industry is ONE GEEK away from being UBERIZED.",
  },
};

const siloIcons: Record<string, string> = {
  business: "🏢",
  entrepreneur: "🚀",
  "start-ups": "⚡",
  investors: "📈",
  "family-offices": "🏛️",
};

export default function Home() {
  return (
    <>
      {/* JSON-LD Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Jeff Cline",
            url: "https://jeff-cline.com",
            description: "Technology disruption consultancy helping businesses achieve PROFIT AT SCALE.",
            founder: { "@type": "Person", name: "Jeff Cline" },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Jeff Cline",
            url: "https://jeff-cline.com",
            description: "Every Industry is ONE GEEK away from being UBERIZED.",
          }),
        }}
      />

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Who is Jeff Cline?",
                acceptedAnswer: { "@type": "Answer", text: "Jeff Cline is a technology strategist and enterprise executive with 30+ years of experience helping businesses, entrepreneurs, start-ups, investors, and family offices profit at scale through technology disruption. He is the founder of VRTCLS, a multi-family office powered by geeks." },
              },
              {
                "@type": "Question",
                name: "What is PROFIT AT SCALE?",
                acceptedAnswer: { "@type": "Answer", text: "PROFIT AT SCALE is Jeff Cline's core methodology for building technology-driven businesses that generate profit at scale. It uses the Increase/Decrease Framework: INCREASE your Scalable Demand Engine, Sales Team Efficiency, and IP Value/Exit Multiples while DECREASING Cost, Risk, and Operational Strain." },
              },
              {
                "@type": "Question",
                name: "What does 'Every Industry is ONE GEEK away from being UBERIZED' mean?",
                acceptedAnswer: { "@type": "Answer", text: "Just as Uber disrupted taxis and Airbnb disrupted hotels, every industry is vulnerable to technology disruption. Jeff Cline helps businesses become the disruptor rather than the disrupted through strategic technology implementation." },
              },
              {
                "@type": "Question",
                name: "What industries does Jeff Cline work with?",
                acceptedAnswer: { "@type": "Answer", text: "Jeff has transformed businesses across 25+ industries including healthcare, finance, technology, real estate, energy, and consumer products. His PROFIT AT SCALE methodology is industry-agnostic — every industry can be disrupted by technology." },
              },
              {
                "@type": "Question",
                name: "How do I get started working with Jeff Cline?",
                acceptedAnswer: { "@type": "Answer", text: "Take the 2-minute Disruption Quiz at jeff-cline.com/quiz for a personalized assessment, or contact Jeff directly at jeff-cline.com/contact or text 223-400-8146." },
              },
              {
                "@type": "Question",
                name: "What is VRTCLS?",
                acceptedAnswer: { "@type": "Answer", text: "VRTCLS is Jeff Cline's multi-family office holding company encompassing the VRTCLS Fund (Scalable Equity Technology Fund), VRTCLS Technology, VRTCLS Marketing, VRTCLS Land, and portfolio company investments across technology, healthcare, energy, and more." },
              },
            ],
          }),
        }}
      />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        {/* BG grid effect */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,137,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,137,0,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(255,137,0,0.08)_0%,transparent_70%)]" />

        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <div className="animate-fade-in-up">
            <p className="text-[#DC2626] font-bold text-sm md:text-base tracking-[0.3em] uppercase mb-6">
              Jeff Cline Presents
            </p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
              <span className="text-[#FF8900]">PROFIT</span> AT{" "}
              <span className="text-[#DC2626]">SCALE</span>
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl text-gray-300 font-light mb-8 max-w-3xl mx-auto">
              Every Industry is ONE <span className="text-[#FF8900] font-bold">GEEK</span> away from being{" "}
              <span className="text-[#DC2626] font-bold">UBERIZED</span>
            </p>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-12">
              I help businesses, entrepreneurs, start-ups, investors, and family offices weaponize technology to dominate their markets. No fluff. No theory. Just systems that print money.
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
        </div>
      </section>

      {/* Silos */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              Choose Your <span className="text-[#FF8900]">Path</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Every path leads to profit. The question is which one fits you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {silos.map((silo, i) => (
              <Link
                key={silo.slug}
                href={`/${silo.slug}`}
                className={`card-hover bg-[#1a1a1a] border border-white/5 rounded-2xl p-8 group ${
                  i === 4 ? "md:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <div className="text-4xl mb-4">{siloIcons[silo.slug]}</div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-[#FF8900] transition-colors">
                  {silo.name}
                </h3>
                <p className="text-gray-400 mb-6 leading-relaxed">{silo.heroSub}</p>
                <div className="space-y-2">
                  {silo.problems.map((p) => (
                    <div key={p.title} className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="text-[#DC2626]">✓</span> {p.title}
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-[#FF8900] font-semibold text-sm group-hover:translate-x-2 transition-transform">
                  Explore {silo.name} →
                </div>
              </Link>
            ))}

            {/* Investment Calculator Card */}
            <Link
              href="/investment-calculator"
              className="card-hover bg-[#1a1a1a] border border-[#FF8900]/20 rounded-2xl p-8 group"
            >
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-[#FF8900] transition-colors">
                Best Investment Calculator
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                From a geek&apos;s perspective... everything is context. Data drives decisions. I have a proven method.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="text-[#DC2626]">✓</span> Data-Driven Analysis
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="text-[#DC2626]">✓</span> ROI Calculation
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="text-[#DC2626]">✓</span> Personalized Results
                </div>
              </div>
              <div className="mt-6 text-[#FF8900] font-semibold text-sm group-hover:translate-x-2 transition-transform">
                Try If You Dare →
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 px-4 bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: "100+", label: "Companies Disrupted" },
              { num: "10x", label: "Average ROI" },
              { num: "25+", label: "Industries Transformed" },
              { num: "$500M+", label: "Revenue Generated" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl md:text-5xl font-black gradient-text mb-2">{s.num}</div>
                <div className="text-gray-400 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-6">
            Ready to <span className="text-[#FF8900]">Uberize</span> Your Industry?
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Take the 2-minute Disruption Quiz to find out exactly where technology can transform your business—and how fast.
          </p>
          <Link href="/quiz" className="btn-primary text-lg">
            Start the Quiz →
          </Link>
        </div>
      </section>

      {/* Immersive Mastermind Feature */}
      <section className="py-24 px-4 bg-gradient-to-b from-[#111] to-[#0a0a0a] border-t border-[#FF8900]/20 border-b border-b-[#FF8900]/20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Brain/Cogs/Fire Logo - Left Side */}
            <div className="w-full md:w-5/12 flex-shrink-0">
              <svg width="100%" height="auto" viewBox="0 0 400 320" style={{ margin: "0 auto", display: "block", maxWidth: 340 }}>
                <defs>
                  <filter id="hglow"><feGaussianBlur stdDeviation="2.5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                  <filter id="hglowBig"><feGaussianBlur stdDeviation="5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                  <filter id="hsmoke"><feGaussianBlur stdDeviation="6"/></filter>
                </defs>
                <g opacity="0.25">
                  <circle cx="50" cy="40" r="2" fill="#FF8900"><animate attributeName="opacity" values="0.2;0.8;0.2" dur="2.1s" repeatCount="indefinite"/></circle>
                  <circle cx="350" cy="50" r="1.5" fill="#FF8900"><animate attributeName="opacity" values="0.3;0.9;0.3" dur="1.7s" repeatCount="indefinite"/></circle>
                  <circle cx="30" cy="150" r="1.5" fill="#FF8900"><animate attributeName="opacity" values="0.2;0.7;0.2" dur="2.8s" repeatCount="indefinite"/></circle>
                  <circle cx="370" cy="140" r="2" fill="#FF8900"><animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.3s" repeatCount="indefinite"/></circle>
                  <line x1="50" y1="40" x2="120" y2="80" stroke="#FF8900" strokeWidth="0.5"><animate attributeName="opacity" values="0;0.5;0" dur="3s" repeatCount="indefinite"/></line>
                  <line x1="350" y1="50" x2="290" y2="75" stroke="#FF8900" strokeWidth="0.5"><animate attributeName="opacity" values="0;0.5;0" dur="3.5s" repeatCount="indefinite"/></line>
                </g>
                <g filter="url(#hsmoke)" opacity="0.15">
                  <circle cx="170" cy="30" r="12" fill="#FF8900">
                    <animate attributeName="cy" values="50;15;50" dur="6s" repeatCount="indefinite"/>
                    <animate attributeName="r" values="8;18;8" dur="6s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.2;0;0.2" dur="6s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="220" cy="25" r="10" fill="#FF8900">
                    <animate attributeName="cy" values="45;10;45" dur="5s" repeatCount="indefinite"/>
                    <animate attributeName="r" values="6;16;6" dur="5s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.15;0;0.15" dur="5s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="195" cy="20" r="14" fill="#FF8900">
                    <animate attributeName="cy" values="40;5;40" dur="7s" repeatCount="indefinite"/>
                    <animate attributeName="r" values="10;22;10" dur="7s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.2;0;0.2" dur="7s" repeatCount="indefinite"/>
                  </circle>
                </g>
                {/* Cogs */}
                <g filter="url(#hglow)">
                  <g transform="translate(130, 55)">
                    <animateTransform attributeName="transform" type="rotate" from="0 130 55" to="360 130 55" dur="12s" repeatCount="indefinite" additive="sum"/>
                    <circle cx="0" cy="0" r="22" fill="none" stroke="#FF8900" strokeWidth="1.5" opacity="0.6"/>
                    <circle cx="0" cy="0" r="4" fill="#FF8900" opacity="0.5"/>
                  </g>
                </g>
                <g filter="url(#hglow)">
                  <g transform="translate(275, 48)">
                    <animateTransform attributeName="transform" type="rotate" from="360 275 48" to="0 275 48" dur="9s" repeatCount="indefinite" additive="sum"/>
                    <circle cx="0" cy="0" r="17" fill="none" stroke="#FF8900" strokeWidth="1.2" opacity="0.5"/>
                    <circle cx="0" cy="0" r="3" fill="#FF8900" opacity="0.4"/>
                  </g>
                </g>
                <g filter="url(#hglow)">
                  <g transform="translate(200, 35)">
                    <animateTransform attributeName="transform" type="rotate" from="0 200 35" to="360 200 35" dur="7s" repeatCount="indefinite" additive="sum"/>
                    <circle cx="0" cy="0" r="11" fill="none" stroke="#FF8900" strokeWidth="1" opacity="0.5"/>
                    <circle cx="0" cy="0" r="2" fill="#FF8900" opacity="0.4"/>
                  </g>
                </g>
                {/* Flame hair */}
                <g filter="url(#hglow)">
                  <path d="M135 130 Q130 100 140 80 Q148 65 155 55 Q152 70 158 60 Q162 50 168 42" fill="none" stroke="#FF8900" strokeWidth="2" opacity="0.8">
                    <animate attributeName="d" values="M135 130 Q130 100 140 80 Q148 65 155 55 Q152 70 158 60 Q162 50 168 42;M135 130 Q128 98 138 78 Q146 62 152 50 Q150 68 156 56 Q160 46 165 38;M135 130 Q130 100 140 80 Q148 65 155 55 Q152 70 158 60 Q162 50 168 42" dur="1.5s" repeatCount="indefinite"/>
                  </path>
                  <path d="M180 120 Q176 88 182 65 Q188 48 195 32 Q192 52 198 38 Q202 25 205 18" fill="none" stroke="#FF8900" strokeWidth="2" opacity="0.9">
                    <animate attributeName="d" values="M180 120 Q176 88 182 65 Q188 48 195 32 Q192 52 198 38 Q202 25 205 18;M180 120 Q174 85 180 60 Q186 44 192 28 Q190 48 196 34 Q200 22 202 14;M180 120 Q176 88 182 65 Q188 48 195 32 Q192 52 198 38 Q202 25 205 18" dur="1.3s" repeatCount="indefinite"/>
                  </path>
                  <path d="M200 118 Q198 82 202 58 Q206 40 200 22 Q204 45 208 30 Q210 20 206 12" fill="none" stroke="#FF8900" strokeWidth="2.2" opacity="0.9">
                    <animate attributeName="d" values="M200 118 Q198 82 202 58 Q206 40 200 22 Q204 45 208 30 Q210 20 206 12;M200 118 Q196 80 200 55 Q204 36 198 18 Q202 42 206 26 Q208 16 204 8;M200 118 Q198 82 202 58 Q206 40 200 22 Q204 45 208 30 Q210 20 206 12" dur="1.6s" repeatCount="indefinite"/>
                  </path>
                  <path d="M220 120 Q224 88 218 65 Q212 48 205 32 Q208 52 202 38 Q198 25 195 18" fill="none" stroke="#FF8900" strokeWidth="2" opacity="0.9">
                    <animate attributeName="d" values="M220 120 Q224 88 218 65 Q212 48 205 32 Q208 52 202 38 Q198 25 195 18;M220 120 Q226 85 220 60 Q214 44 208 28 Q210 48 204 34 Q200 22 198 14;M220 120 Q224 88 218 65 Q212 48 205 32 Q208 52 202 38 Q198 25 195 18" dur="1.4s" repeatCount="indefinite"/>
                  </path>
                  <path d="M265 130 Q270 100 260 80 Q252 65 245 55 Q248 70 242 60 Q238 50 232 42" fill="none" stroke="#FF8900" strokeWidth="2" opacity="0.8">
                    <animate attributeName="d" values="M265 130 Q270 100 260 80 Q252 65 245 55 Q248 70 242 60 Q238 50 232 42;M265 130 Q272 98 262 78 Q254 62 248 50 Q250 68 244 56 Q240 46 235 38;M265 130 Q270 100 260 80 Q252 65 245 55 Q248 70 242 60 Q238 50 232 42" dur="1.5s" repeatCount="indefinite"/>
                  </path>
                </g>
                {/* Glasses */}
                <g filter="url(#hglow)">
                  <path d="M130 148 L130 145 Q130 140 135 140 L188 140 Q192 140 192 145 L192 148" fill="none" stroke="#FF8900" strokeWidth="3" opacity="0.9"/>
                  <path d="M130 148 Q128 170 135 180 Q142 188 161 188 Q180 188 187 180 Q192 170 192 148" fill="none" stroke="#FF8900" strokeWidth="1.2" opacity="0.7"/>
                  <path d="M208 148 L208 145 Q208 140 213 140 L265 140 Q270 140 270 145 L270 148" fill="none" stroke="#FF8900" strokeWidth="3" opacity="0.9"/>
                  <path d="M208 148 Q206 170 213 180 Q220 188 239 188 Q258 188 265 180 Q270 170 270 148" fill="none" stroke="#FF8900" strokeWidth="1.2" opacity="0.7"/>
                  <path d="M192 152 Q200 148 208 152" fill="none" stroke="#FF8900" strokeWidth="1.5" opacity="0.7"/>
                  <path d="M130 145 L105 142 L88 144" fill="none" stroke="#FF8900" strokeWidth="2" opacity="0.7"/>
                  <path d="M270 145 L295 142 L312 144" fill="none" stroke="#FF8900" strokeWidth="2" opacity="0.7"/>
                </g>
                {/* Eyes */}
                <g filter="url(#hglowBig)">
                  <circle cx="161" cy="164" r="18" fill="#0a0a0a"/>
                  <circle cx="161" cy="164" r="13" fill="#1a6bb5" opacity="0.9"><animate attributeName="r" values="13;12;13" dur="4s" repeatCount="indefinite"/></circle>
                  <circle cx="161" cy="164" r="9" fill="#2E9BF0"><animate attributeName="r" values="9;8;9" dur="4s" repeatCount="indefinite"/></circle>
                  <circle cx="161" cy="164" r="5" fill="#111"/>
                  <circle cx="156" cy="159" r="3" fill="#7BC8FF" opacity="0.6"/>
                  <circle cx="239" cy="164" r="18" fill="#0a0a0a"/>
                  <circle cx="239" cy="164" r="13" fill="#1a6bb5" opacity="0.9"><animate attributeName="r" values="13;12;13" dur="4s" repeatCount="indefinite" begin="0.3s"/></circle>
                  <circle cx="239" cy="164" r="9" fill="#2E9BF0"><animate attributeName="r" values="9;8;9" dur="4s" repeatCount="indefinite" begin="0.3s"/></circle>
                  <circle cx="239" cy="164" r="5" fill="#111"/>
                  <circle cx="234" cy="159" r="3" fill="#7BC8FF" opacity="0.6"/>
                </g>
                {/* Ember 4s */}
                <g filter="url(#hglow)">
                  <text x="110" y="70" fill="#FF8900" fontSize="16" fontWeight="700" fontFamily="monospace" opacity="0">
                    4
                    <animate attributeName="y" values="85;-10" dur="3s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.9;0" dur="3s" repeatCount="indefinite"/>
                  </text>
                  <text x="280" y="65" fill="#FF8900" fontSize="14" fontWeight="700" fontFamily="monospace" opacity="0">
                    4
                    <animate attributeName="y" values="80;-15" dur="3.5s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.8;0" dur="3.5s" repeatCount="indefinite"/>
                  </text>
                  <text x="200" y="40" fill="#FF8900" fontSize="18" fontWeight="700" fontFamily="monospace" opacity="0">
                    4
                    <animate attributeName="y" values="55;-25" dur="4s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.8;0" dur="4s" repeatCount="indefinite"/>
                  </text>
                </g>
                {/* Forehead + nose */}
                <path d="M135 132 Q155 124 200 122 Q245 124 265 132" fill="none" stroke="#FF8900" strokeWidth="1.2" opacity="0.5"/>
                <path d="M197 196 Q200 204 203 196" fill="none" stroke="#FF8900" strokeWidth="0.8" opacity="0.25"/>
                {/* Scanning line */}
                <line x1="90" y1="0" x2="310" y2="0" stroke="#FF8900" strokeWidth="0.6" opacity="0.1">
                  <animate attributeName="y1" values="60;200;60" dur="6s" repeatCount="indefinite"/>
                  <animate attributeName="y2" values="60;200;60" dur="6s" repeatCount="indefinite"/>
                </line>
              </svg>
            </div>

            {/* Content - Right Side */}
            <div className="w-full md:w-7/12">
              <p className="text-[#FF8900] font-bold text-sm tracking-widest uppercase mb-3">Limited Availability</p>
              <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight">
                Immersive <span className="text-[#FF8900]">Mastermind</span>
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                This is not a vacation with a buffet and a stack of content thrown at you. This is an opportunity to walk and live life immersively -- to impact your business and scale it alongside a geek, supported by decades of R&amp;D, exits, failures, and executive leadership teams.
              </p>
              <p className="text-gray-400 text-base leading-relaxed mb-8">
                You will leave equipped and ready to scale, knowing you have the support and power of a team of geeks behind you. Technology worth $7,500-$15,000/month. Tools that have been forged through four exits and dozens of launches. Caribbean island. Small cohort. Total immersion.
              </p>
              <Link href="/mastermind" className="inline-block bg-[#FF8900] text-black font-bold py-4 px-8 rounded-lg text-lg hover:bg-[#FFa033] transition-colors">
                Get More Information →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
