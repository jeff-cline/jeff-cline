"use client";
import { useState } from "react";
import Link from "next/link";

export default function CapRateCalculator() {
  const [propertyValue, setPropertyValue] = useState(500000);
  const [grossRent, setGrossRent] = useState(48000);
  const [vacancy, setVacancy] = useState(5);
  const [opExpenses, setOpExpenses] = useState(12000);

  const effectiveIncome = grossRent * (1 - vacancy / 100);
  const noi = effectiveIncome - opExpenses;
  const capRate = propertyValue > 0 ? (noi / propertyValue) * 100 : 0;
  const grm = grossRent > 0 ? propertyValue / grossRent : 0;
  const cashOnCash = propertyValue > 0 ? (noi / (propertyValue * 0.25)) * 100 : 0; // assuming 25% down
  const fmt = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  return (
    <>
      <head>
        <title>Cap Rate Calculator | Jeff Cline</title>
        <meta name="description" content="Free cap rate calculator for real estate investors. Calculate capitalization rate, NOI, GRM, and cash-on-cash return." />
        <meta name="keywords" content="cap rate calculator, capitalization rate, real estate calculator, NOI calculator, rental property calculator, real estate investing" />
        <meta property="og:title" content="Cap Rate Calculator | Jeff Cline" />
        <meta property="og:description" content="Calculate cap rate and key real estate investment metrics." />
        <meta property="og:url" content="https://jeff-cline.com/calculators/cap-rate" />
        <link rel="canonical" href="https://jeff-cline.com/calculators/cap-rate" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication", name: "Cap Rate Calculator", url: "https://jeff-cline.com/calculators/cap-rate", applicationCategory: "FinanceApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }) }} />
      </head>
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "40px 20px" }}>
        <nav style={{ marginBottom: 24, fontSize: 14, color: "var(--text-muted)" }}>
          <Link href="/" style={{ color: "var(--orange)", textDecoration: "none" }}>Home</Link><span style={{ margin: "0 8px" }}>›</span>
          <Link href="/calculators" style={{ color: "var(--orange)", textDecoration: "none" }}>Calculators</Link><span style={{ margin: "0 8px" }}>›</span><span>Cap Rate</span>
        </nav>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: 8, color: "var(--text)" }}>Cap Rate Calculator</h1>
        <p style={{ color: "var(--text-muted)", marginBottom: 32, fontSize: "1.05rem" }}>Calculate capitalization rate and key metrics for real estate investment analysis.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 40, background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333" }}>
          {[
            { label: "Property Value", val: propertyValue, set: setPropertyValue, min: 50000, max: 5000000, step: 10000, cur: true },
            { label: "Annual Gross Rent", val: grossRent, set: setGrossRent, min: 0, max: 500000, step: 1000, cur: true },
            { label: "Vacancy Rate (%)", val: vacancy, set: setVacancy, min: 0, max: 25, step: 1, cur: false },
            { label: "Annual Operating Expenses", val: opExpenses, set: setOpExpenses, min: 0, max: 200000, step: 500, cur: true },
          ].map(f => (
            <div key={f.label}>
              <label style={{ display: "block", color: "var(--text-muted)", marginBottom: 6, fontSize: 14 }}>{f.label}</label>
              {f.cur ? (
                <input type="text" value={`$${f.val.toLocaleString()}`} onChange={(e) => { const v = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10); if (!isNaN(v)) f.set(v); }} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #444", background: "var(--bg)", color: "var(--text)", fontSize: 18, fontWeight: 600 }} />
              ) : (
                <input type="number" step={f.step} min={f.min} max={f.max} value={f.val} onChange={(e) => f.set(Number(e.target.value))} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #444", background: "var(--bg)", color: "var(--text)", fontSize: 18, fontWeight: 600 }} />
              )}
              <input type="range" min={f.min} max={f.max} step={f.step} value={f.val} onChange={(e) => f.set(Number(e.target.value))} style={{ width: "100%", marginTop: 8, accentColor: "var(--orange)" }} />
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 40 }}>
          {[
            { label: "Cap Rate", value: `${capRate.toFixed(2)}%`, color: "var(--orange)" },
            { label: "Net Operating Income", value: fmt(noi), color: "#22c55e" },
            { label: "Gross Rent Multiplier", value: grm.toFixed(1), color: "var(--text)" },
            { label: "Cash-on-Cash (25% down)", value: `${cashOnCash.toFixed(1)}%`, color: "#3b82f6" },
          ].map(item => (
            <div key={item.label} style={{ background: "var(--bg-card)", borderRadius: 12, padding: 20, border: "1px solid #333", textAlign: "center" }}>
              <div style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: item.color }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* NOI breakdown */}
        <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333", marginBottom: 40 }}>
          <h3 style={{ color: "var(--text)", marginBottom: 16 }}>NOI Breakdown</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { label: "Gross Rent", val: grossRent, color: "#22c55e" },
              { label: "Vacancy Loss", val: grossRent * vacancy / 100, color: "var(--red)" },
              { label: "Effective Income", val: effectiveIncome, color: "#22c55e" },
              { label: "Operating Expenses", val: opExpenses, color: "var(--red)" },
              { label: "NOI", val: noi, color: "var(--orange)" },
            ].map(item => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ width: 160, color: "var(--text-muted)", fontSize: 14 }}>{item.label}</span>
                <div style={{ flex: 1, height: 20, borderRadius: 4, overflow: "hidden", background: "#222" }}>
                  <div style={{ width: `${Math.min(Math.abs(item.val) / Math.max(grossRent, 1) * 100, 100)}%`, height: "100%", background: item.color, borderRadius: 4 }} />
                </div>
                <span style={{ width: 100, textAlign: "right", color: item.color, fontSize: 14, fontWeight: 600 }}>{fmt(item.val)}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333", marginBottom: 40 }}>
          <h2 style={{ color: "var(--text)", marginBottom: 12 }}>Understanding Cap Rate</h2>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>Cap rate (Capitalization Rate) measures the rate of return on a real estate investment based on the income the property generates. It&apos;s calculated as NOI ÷ Property Value. Higher cap rates indicate higher returns but typically come with higher risk. Lower cap rates suggest lower risk, often in prime locations.</p>
        </div>

        <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333" }}>
          <h2 style={{ color: "var(--text)", marginBottom: 16 }}>FAQ</h2>
          {[
            { q: "What is a good cap rate?", a: "Depends on location and property type. Class A urban properties: 3-5%. Suburban multifamily: 5-7%. Rural/value-add properties: 7-10%+. Lower isn't always worse — it often means lower risk." },
            { q: "Does cap rate include mortgage payments?", a: "No. Cap rate uses NOI before debt service. Cash-on-cash return accounts for financing. Cap rate shows property performance independent of financing structure." },
            { q: "What's the difference between cap rate and ROI?", a: "Cap rate is based on current NOI and property value. ROI accounts for total returns including appreciation, tax benefits, and equity buildup over time." },
          ].map(faq => (
            <details key={faq.q} style={{ marginBottom: 12, borderBottom: "1px solid #333", paddingBottom: 12 }}>
              <summary style={{ color: "var(--orange)", cursor: "pointer", fontWeight: 600 }}>{faq.q}</summary>
              <p style={{ color: "var(--text-muted)", marginTop: 8, lineHeight: 1.6 }}>{faq.a}</p>
            </details>
          ))}
        </div>
      </main>
    </>
  );
}
