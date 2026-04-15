import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Fast Start Program | Jeff Cline — Build Your Demand Engine in 90 Days",
  description:
    "The Fast Start Program leverages Jeff Cline's proprietary technology, networks, and 30+ years of experience to increase sales, reduce costs, and de-risk your business. Fractional CRO, CSEO, and CMO-level consulting. $33,500/mo — 90-day minimum engagement.",
  openGraph: {
    title: "Fast Start Program | Jeff Cline",
    description: "Ready to UBERIZE your industry? Build a Demand Engine in 90 days with Jeff Cline's proprietary tools, networks, and executive-level consulting.",
    url: "https://jeff-cline.com/fast-start",
    siteName: "Jeff Cline",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fast Start Program | Jeff Cline",
    description: "Build a Demand Engine in 90 days. PROFIT AT SCALE.",
  },
};

export default function FastStartPage() {
  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Fast Start Program",
            provider: {
              "@type": "Person",
              name: "Jeff Cline",
              url: "https://jeff-cline.com",
            },
            description:
              "90-day accelerator program that builds a proprietary Demand Engine to increase sales, create operational efficiencies, and reduce long-term risk.",
            offers: {
              "@type": "Offer",
              price: "33500",
              priceCurrency: "USD",
              unitText: "per month",
              description: "Minimum 90-day engagement. Travel and entertainment expenses additional.",
            },
          }),
        }}
      />

      <Breadcrumbs items={[{ label: "Fast Start" }]} />

      {/* ═══════════════════════════════════════════════════════ HERO */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "6rem 1.5rem 4rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Radial glow */}
        <div
          style={{
            position: "absolute",
            top: "-40%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "900px",
            height: "900px",
            background: "radial-gradient(circle, rgba(255,137,0,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <p
          className="animate-fade-in"
          style={{
            fontSize: "0.85rem",
            textTransform: "uppercase",
            letterSpacing: "4px",
            color: "var(--orange)",
            marginBottom: "1.5rem",
            fontWeight: 600,
          }}
        >
          The Fast Start Program
        </p>

        <h1
          className="animate-fade-in-up"
          style={{
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            fontWeight: 800,
            lineHeight: 1.05,
            maxWidth: "900px",
            marginBottom: "1.5rem",
          }}
        >
          Build a{" "}
          <span className="gradient-text">Demand Engine</span>
          <br />
          in 90 Days
        </h1>

        <p
          className="animate-fade-in-up delay-200"
          style={{
            fontSize: "1.25rem",
            color: "var(--text-muted)",
            maxWidth: "640px",
            lineHeight: 1.6,
            marginBottom: "2.5rem",
          }}
        >
          Leverage Jeff Cline&apos;s proprietary technology, networks, and 30+ years
          of battle-tested strategy to{" "}
          <a href="#increase-sales" style={{ display: "inline-block", background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "6px", padding: "0.15rem 0.6rem", color: "#22c55e", fontWeight: 700, textDecoration: "none", transition: "background 0.2s" }}>increase sales</a>,{" "}
          <a href="#slash-costs" style={{ display: "inline-block", background: "rgba(255,137,0,0.15)", border: "1px solid rgba(255,137,0,0.3)", borderRadius: "6px", padding: "0.15rem 0.6rem", color: "var(--orange)", fontWeight: 700, textDecoration: "none", transition: "background 0.2s" }}>slash costs</a>, and{" "}
          <a href="#de-risk" style={{ display: "inline-block", background: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.3)", borderRadius: "6px", padding: "0.15rem 0.6rem", color: "var(--red)", fontWeight: 700, textDecoration: "none", transition: "background 0.2s" }}>de-risk your business</a>.
        </p>

        <div className="animate-fade-in-up delay-300" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
          <a
            href="#cta"
            className="animate-pulse-glow"
            style={{
              display: "inline-block",
              padding: "1rem 3rem",
              background: "linear-gradient(135deg, var(--orange), var(--red))",
              color: "#000",
              fontWeight: 700,
              fontSize: "1.1rem",
              borderRadius: "8px",
              textDecoration: "none",
              letterSpacing: "1px",
            }}
          >
            TEXT &quot;UBERIZE&quot; TO 223-400-8146
          </a>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            Ready to UBERIZE your industry?
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ PROBLEM → SOLUTION */}
      <section
        style={{
          padding: "5rem 1.5rem",
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            fontWeight: 700,
            textAlign: "center",
            marginBottom: "1.5rem",
          }}
        >
          Every Industry is a <span className="gradient-text">GEEK</span> Away
          from Being <span className="gradient-text">UBERIZED</span>
        </h2>
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "1.1rem",
            lineHeight: 1.7,
            textAlign: "center",
            maxWidth: "750px",
            margin: "0 auto 3rem",
          }}
        >
          Most businesses are sitting on untapped revenue, bleeding operational
          costs, and carrying risk they don&apos;t even see. The Fast Start Program
          changes that — fast.
        </p>

        {/* Three Pillars */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2rem",
          }}
        >
          {[
            {
              id: "increase-sales",
              icon: "▲",
              title: "INCREASE Sales",
              desc: "We build a proprietary Demand Engine using technology most companies don't know exists. Predictive targeting, AI-driven outreach, voice drip campaigns, and data-fueled acquisition funnels — all calibrated to your market.",
              color: "#22c55e",
            },
            {
              id: "slash-costs",
              icon: "▼",
              title: "DECREASE Cost & Strain",
              desc: "Leverage technology, automation, and our proprietary tool stack to eliminate inefficiencies. We identify where you're burning cash and operational bandwidth — then we fix it.",
              color: "var(--orange)",
            },
            {
              id: "de-risk",
              icon: "◆",
              title: "MITIGATE Risk",
              desc: "AI tools like Voice Drips, predictive analytics, and our network — including Multi-Family Office AI — create a moat around your business. Capital access, strategic connections, and long-term positioning.",
              color: "var(--red)",
            },
          ].map((pillar) => (
            <div
              id={pillar.id}
              key={pillar.title}
              style={{
                background: "var(--bg-card)",
                border: "1px solid #2a2a2a",
                borderRadius: "12px",
                padding: "2rem",
                transition: "border-color 0.3s",
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  color: pillar.color,
                  marginBottom: "1rem",
                }}
              >
                {pillar.icon}
              </div>
              <h3
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  marginBottom: "0.75rem",
                }}
              >
                {pillar.title}
              </h3>
              <p style={{ color: "var(--text-muted)", lineHeight: 1.6, fontSize: "0.95rem" }}>
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ WHAT YOU GET */}
      <section
        style={{
          padding: "5rem 1.5rem",
          background: "var(--bg-light)",
        }}
      >
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
              fontWeight: 700,
              textAlign: "center",
              marginBottom: "3rem",
            }}
          >
            What the <span className="gradient-text">Fast Start</span> Delivers
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
            {[
              {
                label: "Fractional C-Suite Leadership",
                detail: "CRO (Chief Revenue Officer), CSEO (Chief Search Engine Optimization Officer), and CMO (Chief Marketing Officer) level consulting — until your company can hire suitable team members.",
              },
              {
                label: "Proprietary Demand Engine",
                detail: "A custom-built Marketing Portal & Platform designed to drive scalable demand. Fully owned by Jeff Cline, Affiliates & Team (444) during the engagement — licensable after.",
              },
              {
                label: "Voice Drips & AI Outreach",
                detail: "Proprietary AI-powered voice drip campaigns and automated outreach systems that engage prospects at scale without burning your team.",
              },
              {
                label: "Network & Capital Access",
                detail: "Connections to our investor network, family offices, and the Multi-Family Office AI ecosystem. If capital is needed, we charge an industry-standard deal fee to connect those dots.",
              },
              {
                label: "Data-Driven Decision Making",
                detail: "We like data. Data drives decisions. By day 90, you will know your cost to acquire a customer, your path to profitability, and whether the model can scale.",
              },
              {
                label: "Unlimited Email Support",
                detail: "After the initial 90 days: 1 hour per week of consulting plus unlimited email support. We don't disappear — we stay in your corner.",
              },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid #2a2a2a",
                  borderRadius: "10px",
                  padding: "1.5rem",
                }}
              >
                <h4
                  style={{
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    color: "var(--orange)",
                    marginBottom: "0.5rem",
                  }}
                >
                  {item.label}
                </h4>
                <p style={{ color: "var(--text-muted)", lineHeight: 1.6, fontSize: "0.9rem" }}>
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ THE 90-DAY FRAMEWORK */}
      <section style={{ padding: "5rem 1.5rem", maxWidth: "900px", margin: "0 auto" }}>
        <h2
          style={{
            fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
            fontWeight: 700,
            textAlign: "center",
            marginBottom: "1rem",
          }}
        >
          The <span className="gradient-text">90-Day</span> Framework
        </h2>
        <p
          style={{
            textAlign: "center",
            color: "var(--text-muted)",
            marginBottom: "3rem",
            fontSize: "1.05rem",
            maxWidth: "650px",
            margin: "0 auto 3rem",
          }}
        >
          This isn&apos;t theory. It&apos;s a battle-tested process. At the end of 90 days, the data tells the story.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {[
            {
              phase: "01",
              title: "Audit & Architect",
              text: "Deep-dive into your business model, revenue streams, tech stack, and competitive landscape. We identify the gaps, the waste, and the opportunity.",
            },
            {
              phase: "02",
              title: "Build the Engine",
              text: "Deploy the Demand Engine — proprietary technology, AI-powered funnels, voice drip campaigns, and your custom Marketing Portal & Platform.",
            },
            {
              phase: "03",
              title: "Optimize & Scale",
              text: "Tune the machine. Refine targeting, lower acquisition costs, increase conversion rates. Data in, decisions out.",
            },
            {
              phase: "04",
              title: "The Verdict",
              text: "By day 90 you will know: What does it cost to acquire a customer? Can this business scale profitably for the next 12 months? If yes — we keep going. If not — we know exactly why, and what it would take to make it work.",
            },
          ].map((p) => (
            <div
              key={p.phase}
              style={{
                display: "flex",
                gap: "1.5rem",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: 800,
                  color: "var(--orange)",
                  opacity: 0.4,
                  minWidth: "50px",
                }}
              >
                {p.phase}
              </div>
              <div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.4rem" }}>
                  {p.title}
                </h3>
                <p style={{ color: "var(--text-muted)", lineHeight: 1.6, fontSize: "0.95rem" }}>
                  {p.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ HONESTY BLOCK */}
      <section
        style={{
          padding: "4rem 1.5rem",
          background: "var(--bg-light)",
        }}
      >
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", fontWeight: 700, marginBottom: "1.5rem" }}>
            The Process <span className="gradient-text">Always Works</span>
          </h2>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "1.05rem",
              lineHeight: 1.7,
              marginBottom: "1.5rem",
            }}
          >
            Sometimes we discover that the cost to scale is more than the business
            can withstand — or we need to rewire the metrics. Increase the price,
            adjust the value proposition, restructure the selling model to allow for{" "}
            <strong style={{ color: "var(--text)" }}>PROFIT AT SCALE</strong>.
          </p>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "1.05rem",
              lineHeight: 1.7,
            }}
          >
            Either way, you walk away with clarity, data, and a real answer — not a
            guess. That&apos;s worth more than most companies get in years of
            fumbling in the dark.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ IP & EXIT */}
      <section style={{ padding: "5rem 1.5rem", maxWidth: "900px", margin: "0 auto" }}>
        <h2
          style={{
            fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
            fontWeight: 700,
            textAlign: "center",
            marginBottom: "1.5rem",
          }}
        >
          Your Platform. Your <span className="gradient-text">Future</span>.
        </h2>
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "1.05rem",
            lineHeight: 1.7,
            textAlign: "center",
            maxWidth: "750px",
            margin: "0 auto 2rem",
          }}
        >
          The Marketing Portal & Platform built during your engagement is fully
          owned by Jeff Cline, Affiliates & Team (444). At the end of the
          agreement, if you want to keep it — you can license it.
        </p>
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "1.05rem",
            lineHeight: 1.7,
            textAlign: "center",
            maxWidth: "750px",
            margin: "0 auto 2rem",
          }}
        >
          But here&apos;s the thing: this process often creates real, tangible
          value. When it does, we&apos;re happy to participate in an exit — with
          agreed-upon goodwill at market rates.
        </p>
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "1.05rem",
            lineHeight: 1.7,
            textAlign: "center",
            maxWidth: "750px",
            margin: "0 auto",
          }}
        >
          Our investor network, family offices, and roll-up partners already
          understand the value we create. That makes for a{" "}
          <strong style={{ color: "var(--text)" }}>
            win-win-win
          </strong>{" "}
          when the opportunity is right.
        </p>
      </section>

      {/* ═══════════════════════════════════════════════════════ ARTLAB */}
      <section
        style={{
          padding: "3rem 1.5rem",
          textAlign: "center",
          background: "var(--bg-light)",
        }}
      >
        <p
          style={{
            fontSize: "1.6rem",
            fontWeight: 700,
            color: "var(--orange)",
            marginBottom: "0.5rem",
          }}
        >
          #ARTLAB
        </p>
        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", fontStyle: "italic" }}>
          &quot;A Rising Tide Lifts All Boats&quot;
        </p>
      </section>

      {/* ═══════════════════════════════════════════════════════ INVESTMENT */}
      <section style={{ padding: "5rem 1.5rem", maxWidth: "900px", margin: "0 auto" }}>
        <h2
          style={{
            fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
            fontWeight: 700,
            textAlign: "center",
            marginBottom: "2.5rem",
          }}
        >
          The <span className="gradient-text">Investment</span>
        </h2>

        <div
          style={{
            background: "var(--bg-card)",
            border: "2px solid var(--orange)",
            borderRadius: "16px",
            padding: "3rem 2rem",
            textAlign: "center",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "0.5rem" }}>
            Monthly Commitment
          </p>
          <p
            style={{
              fontSize: "3.5rem",
              fontWeight: 800,
              marginBottom: "0.25rem",
            }}
          >
            <span className="gradient-text">$33,500</span>
            <span style={{ fontSize: "1.2rem", color: "var(--text-muted)", fontWeight: 400 }}>/mo</span>
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: "2rem" }}>
            Minimum 90-day engagement &bull; T&amp;E expenses additional
          </p>

          <div
            style={{
              borderTop: "1px solid #2a2a2a",
              paddingTop: "1.5rem",
              textAlign: "left",
            }}
          >
            <p style={{ fontWeight: 600, marginBottom: "1rem", fontSize: "1rem" }}>First 90 Days:</p>
            <ul
              style={{
                color: "var(--text-muted)",
                lineHeight: 2,
                fontSize: "0.95rem",
                paddingLeft: "1.25rem",
              }}
            >
              <li>Full Demand Engine build &amp; deployment</li>
              <li>Fractional CRO + CSEO + CMO leadership</li>
              <li>Proprietary technology &amp; AI tool stack</li>
              <li>Network &amp; capital access as needed</li>
              <li>Business consulting &amp; risk mitigation</li>
              <li>Marketing Portal &amp; Platform development</li>
            </ul>

            <p style={{ fontWeight: 600, marginBottom: "1rem", marginTop: "1.5rem", fontSize: "1rem" }}>After 90 Days:</p>
            <ul
              style={{
                color: "var(--text-muted)",
                lineHeight: 2,
                fontSize: "0.95rem",
                paddingLeft: "1.25rem",
              }}
            >
              <li>1 hour/week consulting</li>
              <li>Unlimited email support</li>
              <li>Continued platform &amp; Demand Engine optimization</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ CTA */}
      <section
        id="cta"
        style={{
          padding: "6rem 1.5rem",
          textAlign: "center",
          background: "linear-gradient(180deg, var(--bg) 0%, #1a1200 100%)",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: 800,
            marginBottom: "1rem",
          }}
        >
          Ready to <span className="gradient-text">UBERIZE</span> Your Industry?
        </h2>
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "1.15rem",
            marginBottom: "2.5rem",
            maxWidth: "550px",
            margin: "0 auto 2.5rem",
            lineHeight: 1.6,
          }}
        >
          Take the first step. Text us and let&apos;s talk about what your business
          looks like when it&apos;s running on a real Demand Engine.
        </p>

        <a
          href="sms:2234008146&body=UBERIZE"
          className="animate-pulse-glow"
          style={{
            display: "inline-block",
            padding: "1.25rem 3.5rem",
            background: "linear-gradient(135deg, var(--orange), var(--red))",
            color: "#000",
            fontWeight: 700,
            fontSize: "1.3rem",
            borderRadius: "10px",
            textDecoration: "none",
            letterSpacing: "1.5px",
          }}
        >
          TEXT &quot;UBERIZE&quot; TO 223-400-8146
        </a>

        <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "1.5rem" }}>
          Or text UBERIZE to <strong style={{ color: "var(--text)" }}>223-400-8146</strong> from your phone right now.
        </p>
      </section>
    </>
  );
}
