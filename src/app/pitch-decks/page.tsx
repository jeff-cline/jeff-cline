"use client";

import { useState } from "react";

const techStack = [
  { title: "Agentic Workforce", url: "https://agents.biz", desc: "AI-powered workforce automation and agent deployment platform" },
  { title: "Conversational Outreach", url: "https://voicedrips.com", desc: "AI-driven outbound sales and conversational engagement platform" },
  { title: "Automated Deal Flow", url: "https://softcircle.ai", desc: "Automated investor matching and deal flow management" },
  { title: "High Intent Targets & Unique Data", url: "https://moneywords.org", desc: "Precision targeting with high-intent data and behavioral intelligence" },
  { title: "Multifamily Office Technology", url: "https://multifamilyoffice.ai", desc: "Enterprise technology for multifamily offices and wealth management" },
  { title: "Proprietary Data Lake", url: "https://el.ag", desc: "3+ billion data points growing daily — demand engine and visitor optimization" },
];

const pitchDecks = [
  { title: "VRTCLS Holdings 2026", file: "/decks/VRTCLS-Holdings-2026.pdf", desc: "Proprietary first-party data acquisition technology and AI-driven High Intent Tagging across 1,500+ industry verticals. Berkshire Hathaway business model powered by AI." },
  { title: "Investor Discovery Tour: Caribbean Island Real Estate", file: "/decks/investor-discovery-tour-caribbean.pdf", desc: "Caribbean island real estate investment opportunities in Roatan, Honduras — premium development sites and resort properties." },
  { title: "Smart Island: Digital Utility Platform", file: "/decks/ONE-ISLAND-Digital-Utility.pdf", desc: "Private digital infrastructure utility for Roatan — cellular networks, fiber, IoT, and AdTech tourism monetization platform." },
  { title: "RCL Hospital & Wellness Center", file: "/decks/RCL-Hospital-Wellness.pdf", desc: "$28M acute-care hospital and wellness campus on Roatan Island. Medical tourism + local healthcare. Projected $28M annual revenue." },
  { title: "Cruise Ship Dock: Port Royal", file: "/decks/Cruise-Ship-Dock-Dimensiones.pdf", desc: "40,568 m² cruise ship dock facility in Port Royal, Jose Santos Guardiola, Bay Islands, Honduras." },
  { title: "Top 10 Roatan Strategic Infrastructure", file: "/decks/Top-10-Roatan-Strategic-Infrastructure.pdf", desc: "Strategic infrastructure development opportunities across Roatan." },
  { title: "VRTCLS Holdings (Extended)", file: "/decks/VRTCLS-Holdings-4.pdf", desc: "Extended presentation of VRTCLS Holdings portfolio and technology stack." },
];

const galleryImages = Array.from({ length: 7 }, (_, i) => `/decks/gallery/roatan-${i + 1}.jpg`);

export default function PitchDecksPage() {
  const [activeDeck, setActiveDeck] = useState<string | null>(null);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  return (
    <div style={{ background: "#0a0a0a", color: "#fff", minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Header */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px 0" }}>
        <a href="/" style={{ color: "#FF8900", textDecoration: "none", fontSize: 14, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6 }}>
          ← Back to Home
        </a>
      </div>

      {/* ── FEATURED: PolicyStore Investor Materials ── */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px 60px" }}>
        <div style={{
          background: "linear-gradient(135deg, rgba(26,54,93,0.3) 0%, rgba(34,197,94,0.08) 100%)",
          border: "1px solid rgba(34,197,94,0.25)",
          borderRadius: 20,
          padding: "48px 40px",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Featured badge */}
          <div style={{
            position: "absolute", top: 20, right: 20,
            background: "#22c55e", color: "#fff",
            fontSize: 10, fontWeight: 800, letterSpacing: 2,
            padding: "6px 16px", borderRadius: 20,
            textTransform: "uppercase",
          }}>
            FEATURED
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div style={{
              width: 10, height: 10, borderRadius: "50%",
              background: "#22c55e",
              boxShadow: "0 0 12px rgba(34,197,94,0.6)",
              animation: "pulse 2s infinite",
            }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: "#22c55e", textTransform: "uppercase" }}>
              NEW &mdash; SERIES A
            </span>
          </div>

          <h2 style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: 900, margin: "0 0 8px", lineHeight: 1.1 }}>
            <span style={{ color: "#fff" }}>PolicyStore</span>{" "}
            <span style={{ color: "#22c55e" }}>Investor Deck</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, maxWidth: 700, margin: "0 0 12px", lineHeight: 1.6 }}>
            The first fully autonomous AI insurance agency. FinTech + MarTech powered by conversational AI, agentic workforce, and proprietary big data across 10,397 behavioral clusters.
          </p>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: "0 0 28px" }}>
            $10M Series A &bull; $300M Pre-Money Valuation &bull; $3.35T Market &bull; Path to $3B+ Exit
          </p>

          {/* Key metrics */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 32 }}>
            {[
              { val: "86.5%", lbl: "Cost Reduction" },
              { val: "10.6:1", lbl: "LTV:CAC" },
              { val: "$339M", lbl: "Y5 Revenue" },
              { val: "70%", lbl: "EBITDA Margin" },
              { val: "10x+", lbl: "Target Return" },
            ].map((m) => (
              <div key={m.lbl} style={{
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 10, padding: "12px 20px", textAlign: "center", minWidth: 100,
              }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#22c55e", lineHeight: 1 }}>{m.val}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{m.lbl}</div>
              </div>
            ))}
          </div>

          {/* Three document links */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
            <a
              href="https://policystore.com/decks/pitch-deck.html"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block", padding: 24, borderRadius: 14,
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(34,197,94,0.2)",
                textDecoration: "none", color: "#fff", transition: "all 0.25s ease",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "#22c55e";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(34,197,94,0.15)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(34,197,94,0.2)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
                (e.currentTarget as HTMLElement).style.transform = "none";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ background: "#22c55e", color: "#fff", fontSize: 9, fontWeight: 800, padding: "3px 10px", borderRadius: 4, letterSpacing: 1 }}>PITCH DECK</span>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>25 slides</span>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 6px" }}>Full Color Pitch Deck</h3>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: 1.5 }}>
                Complete investor presentation with market analysis, technology stack, unit economics, financial projections, and path to $3B+ exit.
              </p>
              <span style={{ display: "inline-block", marginTop: 12, fontSize: 12, color: "#22c55e", fontWeight: 600 }}>
                VIEW DECK →
              </span>
            </a>

            <a
              href="https://policystore.com/decks/whitepaper.html"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block", padding: 24, borderRadius: 14,
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(59,130,246,0.2)",
                textDecoration: "none", color: "#fff", transition: "all 0.25s ease",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "#3b82f6";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(59,130,246,0.15)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(59,130,246,0.2)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
                (e.currentTarget as HTMLElement).style.transform = "none";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ background: "#3b82f6", color: "#fff", fontSize: 9, fontWeight: 800, padding: "3px 10px", borderRadius: 4, letterSpacing: 1 }}>WHITE PAPER</span>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Technical paper</span>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 6px" }}>Technical White Paper</h3>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: 1.5 }}>
                PhD-level actuarial mathematics, predictive analytics framework, risk mitigation modeling, and unit economics for CFOs and actuaries.
              </p>
              <span style={{ display: "inline-block", marginTop: 12, fontSize: 12, color: "#3b82f6", fontWeight: 600 }}>
                READ PAPER →
              </span>
            </a>

            <a
              href="https://policystore.com/decks/one-pager.html"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block", padding: 24, borderRadius: 14,
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(245,158,11,0.2)",
                textDecoration: "none", color: "#fff", transition: "all 0.25s ease",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "#f59e0b";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(245,158,11,0.15)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(245,158,11,0.2)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
                (e.currentTarget as HTMLElement).style.transform = "none";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ background: "#f59e0b", color: "#fff", fontSize: 9, fontWeight: 800, padding: "3px 10px", borderRadius: 4, letterSpacing: 1 }}>ONE PAGER</span>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Executive summary</span>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 6px" }}>Executive One-Pager</h3>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: 1.5 }}>
                Single-page executive summary with key metrics, 5-year projections, use of proceeds, and path to exit. Quick investor review.
              </p>
              <span style={{ display: "inline-block", marginTop: 12, fontSize: 12, color: "#f59e0b", fontWeight: 600 }}>
                VIEW SUMMARY →
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
        <hr style={{ border: "none", borderTop: "1px solid rgba(255,137,0,0.12)" }} />
      </div>

      {/* ── SECTION A: Tech Stack ── */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 20px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h1 style={{ fontSize: "clamp(32px,5vw,48px)", fontWeight: 900, margin: 0 }}>
            The <span style={{ color: "#FF8900" }}>Tech Stack</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, marginTop: 8 }}>
            Proprietary technology powering every opportunity
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
          {techStack.map((t) => (
            <a
              key={t.url}
              href={t.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block", padding: 28, borderRadius: 12,
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,137,0,0.15)",
                textDecoration: "none", color: "#fff", transition: "all 0.25s ease",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "#FF8900";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(255,137,0,0.15)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,137,0,0.15)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
                (e.currentTarget as HTMLElement).style.transform = "none";
              }}
            >
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: "#FF8900" }}>{t.title}</h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, margin: 0 }}>{t.desc}</p>
              <span style={{ display: "inline-block", marginTop: 12, fontSize: 12, color: "rgba(255,255,255,0.3)", letterSpacing: 1 }}>
                {t.url.replace("https://", "")} →
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
        <hr style={{ border: "none", borderTop: "1px solid rgba(255,137,0,0.12)" }} />
      </div>

      {/* ── SECTION B: Investment Opportunities ── */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 20px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: 900, margin: 0 }}>
            Investment <span style={{ color: "#FF8900" }}>Opportunities</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, marginTop: 8 }}>
            Powered by our proprietary technology
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
          {pitchDecks.map((d) => (
            <button
              key={d.file}
              onClick={() => setActiveDeck(d.file)}
              style={{
                all: "unset", cursor: "pointer", display: "flex", flexDirection: "column",
                padding: 28, borderRadius: 12, background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,137,0,0.15)", transition: "all 0.25s ease", boxSizing: "border-box",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "#FF8900";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(255,137,0,0.15)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,137,0,0.15)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
                (e.currentTarget as HTMLElement).style.transform = "none";
              }}
            >
              {/* PDF thumbnail placeholder */}
              <div style={{
                width: "100%", height: 180, borderRadius: 8, marginBottom: 16,
                background: "linear-gradient(135deg, rgba(255,137,0,0.08) 0%, rgba(220,38,38,0.06) 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "1px solid rgba(255,137,0,0.1)",
              }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FF8900" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{d.title}</h3>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, margin: 0, flexGrow: 1 }}>{d.desc}</p>
              <span style={{ display: "inline-block", marginTop: 14, fontSize: 12, color: "#FF8900", fontWeight: 600, letterSpacing: 1 }}>
                VIEW DECK →
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* PDF Modal */}
      {activeDeck && (
        <div
          onClick={() => setActiveDeck(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.92)", display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", padding: 20,
          }}
        >
          <div style={{ width: "100%", maxWidth: 1100, display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
            <button
              onClick={() => setActiveDeck(null)}
              style={{
                background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff", borderRadius: 8, padding: "8px 20px", cursor: "pointer",
                fontSize: 14, fontWeight: 600,
              }}
            >
              ✕ Close
            </button>
          </div>
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: "100%", maxWidth: 1100, height: "80vh", borderRadius: 12, overflow: "hidden",
              border: "1px solid rgba(255,137,0,0.2)", background: "#111",
            }}
          >
            <iframe
              src={activeDeck}
              style={{ width: "100%", height: "100%", border: "none" }}
              title="Pitch Deck Viewer"
            />
          </div>
        </div>
      )}

      {/* Divider */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
        <hr style={{ border: "none", borderTop: "1px solid rgba(255,137,0,0.12)" }} />
      </div>

      {/* ── SECTION C: Gallery ── */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 20px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: 900, margin: 0 }}>
            Roatan <span style={{ color: "#FF8900" }}>Gallery</span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {galleryImages.map((src) => (
            <button
              key={src}
              onClick={() => setLightboxImg(src)}
              style={{
                all: "unset", cursor: "pointer", borderRadius: 12, overflow: "hidden",
                border: "1px solid rgba(255,137,0,0.1)", transition: "all 0.25s ease",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "#FF8900";
                (e.currentTarget as HTMLElement).style.transform = "scale(1.02)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,137,0,0.1)";
                (e.currentTarget as HTMLElement).style.transform = "none";
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="Roatan" style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }} />
            </button>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxImg && (
        <div
          onClick={() => setLightboxImg(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.92)", display: "flex",
            alignItems: "center", justifyContent: "center", padding: 20, cursor: "pointer",
          }}
        >
          <div style={{ position: "absolute", top: 20, right: 20 }}>
            <button
              onClick={() => setLightboxImg(null)}
              style={{
                background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff", borderRadius: 8, padding: "8px 20px", cursor: "pointer",
                fontSize: 14, fontWeight: 600,
              }}
            >
              ✕ Close
            </button>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightboxImg}
            alt="Roatan"
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: "90vw", maxHeight: "85vh", borderRadius: 12, objectFit: "contain", cursor: "default" }}
          />
        </div>
      )}

      {/* Divider */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
        <hr style={{ border: "none", borderTop: "1px solid rgba(255,137,0,0.12)" }} />
      </div>

      {/* ── SECTION D: Video ── */}
      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "60px 20px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h2 style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: 900, margin: 0 }}>
            Roatan <span style={{ color: "#FF8900" }}>Overview</span>
          </h2>
        </div>

        <div style={{
          borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,137,0,0.2)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}>
          <video
            controls
            playsInline
            preload="metadata"
            style={{ width: "100%", display: "block", background: "#000" }}
          >
            <source src="/decks/roatan-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "30px 20px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>
          &copy; {new Date().getFullYear()} Jeff Cline. PROFIT AT SCALE.
        </p>
        <a href="https://jeff-cline.com" style={{ fontSize: 6, opacity: 0.08, color: "#999", textDecoration: "none" }}>JC</a>
      </footer>
    </div>
  );
}
