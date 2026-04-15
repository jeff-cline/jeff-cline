"use client";
import { useState } from "react";
import Link from "next/link";

export default function BusinessValuationCalculator() {
  const [revenue, setRevenue] = useState(1000000);
  const [earnings, setEarnings] = useState(200000);
  const [revenueMultiple, setRevenueMultiple] = useState(3);
  const [earningsMultiple, setEarningsMultiple] = useState(10);

  const revenueVal = revenue * revenueMultiple;
  const earningsVal = earnings * earningsMultiple;
  const avgVal = (revenueVal + earningsVal) / 2;
  const fmt = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  const maxVal = Math.max(revenueVal, earningsVal, 1);

  return (
    <>
      <head>
        <title>Business Valuation Calculator | Jeff Cline</title>
        <meta name="description" content="Free business valuation calculator using revenue multiples and earnings multiples. Estimate what your business is worth." />
        <meta name="keywords" content="business valuation calculator, company valuation, revenue multiple, earnings multiple, business worth, EBITDA multiple" />
        <meta property="og:title" content="Business Valuation Calculator | Jeff Cline" />
        <meta property="og:description" content="Estimate your business value using revenue and earnings multiples." />
        <meta property="og:url" content="https://jeff-cline.com/calculators/business-valuation" />
        <link rel="canonical" href="https://jeff-cline.com/calculators/business-valuation" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication", name: "Business Valuation Calculator", url: "https://jeff-cline.com/calculators/business-valuation", applicationCategory: "FinanceApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }) }} />
      </head>
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "40px 20px" }}>
        <nav style={{ marginBottom: 24, fontSize: 14, color: "var(--text-muted)" }}>
          <Link href="/" style={{ color: "var(--orange)", textDecoration: "none" }}>Home</Link><span style={{ margin: "0 8px" }}>›</span>
          <Link href="/calculators" style={{ color: "var(--orange)", textDecoration: "none" }}>Calculators</Link><span style={{ margin: "0 8px" }}>›</span><span>Business Valuation</span>
        </nav>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: 8, color: "var(--text)" }}>Business Valuation Calculator</h1>
        <p style={{ color: "var(--text-muted)", marginBottom: 32, fontSize: "1.05rem" }}>Estimate your business value using revenue and earnings multiples common in your industry.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 40, background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333" }}>
          <div>
            <label style={{ display: "block", color: "var(--text-muted)", marginBottom: 6, fontSize: 14 }}>Annual Revenue</label>
            <input type="text" value={`$${revenue.toLocaleString()}`} onChange={(e) => { const v = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10); if (!isNaN(v)) setRevenue(v); }} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #444", background: "var(--bg)", color: "var(--text)", fontSize: 18, fontWeight: 600 }} />
            <input type="range" min={100000} max={50000000} step={100000} value={revenue} onChange={(e) => setRevenue(Number(e.target.value))} style={{ width: "100%", marginTop: 8, accentColor: "var(--orange)" }} />
          </div>
          <div>
            <label style={{ display: "block", color: "var(--text-muted)", marginBottom: 6, fontSize: 14 }}>Annual Earnings (EBITDA)</label>
            <input type="text" value={`$${earnings.toLocaleString()}`} onChange={(e) => { const v = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10); if (!isNaN(v)) setEarnings(v); }} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #444", background: "var(--bg)", color: "var(--text)", fontSize: 18, fontWeight: 600 }} />
            <input type="range" min={10000} max={10000000} step={10000} value={earnings} onChange={(e) => setEarnings(Number(e.target.value))} style={{ width: "100%", marginTop: 8, accentColor: "var(--orange)" }} />
          </div>
          <div>
            <label style={{ display: "block", color: "var(--text-muted)", marginBottom: 6, fontSize: 14 }}>Revenue Multiple</label>
            <input type="number" step={0.5} min={0.5} max={20} value={revenueMultiple} onChange={(e) => setRevenueMultiple(Number(e.target.value))} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #444", background: "var(--bg)", color: "var(--text)", fontSize: 18, fontWeight: 600 }} />
            <input type="range" min={0.5} max={20} step={0.5} value={revenueMultiple} onChange={(e) => setRevenueMultiple(Number(e.target.value))} style={{ width: "100%", marginTop: 8, accentColor: "var(--orange)" }} />
          </div>
          <div>
            <label style={{ display: "block", color: "var(--text-muted)", marginBottom: 6, fontSize: 14 }}>Earnings Multiple</label>
            <input type="number" step={1} min={1} max={50} value={earningsMultiple} onChange={(e) => setEarningsMultiple(Number(e.target.value))} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #444", background: "var(--bg)", color: "var(--text)", fontSize: 18, fontWeight: 600 }} />
            <input type="range" min={1} max={50} value={earningsMultiple} onChange={(e) => setEarningsMultiple(Number(e.target.value))} style={{ width: "100%", marginTop: 8, accentColor: "var(--orange)" }} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 40 }}>
          {[
            { label: "Revenue-Based Valuation", value: fmt(revenueVal), color: "var(--orange)" },
            { label: "Earnings-Based Valuation", value: fmt(earningsVal), color: "#22c55e" },
            { label: "Blended Average", value: fmt(avgVal), color: "var(--text)" },
          ].map(item => (
            <div key={item.label} style={{ background: "var(--bg-card)", borderRadius: 12, padding: 20, border: "1px solid #333", textAlign: "center" }}>
              <div style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: item.color }}>{item.value}</div>
            </div>
          ))}
        </div>

        <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333", marginBottom: 40 }}>
          <h3 style={{ color: "var(--text)", marginBottom: 16 }}>Valuation Comparison</h3>
          <svg viewBox="0 0 400 100" style={{ width: "100%", maxWidth: 500 }}>
            <rect x="120" y="5" width={revenueVal / maxVal * 240} height="30" fill="var(--orange)" rx="4" />
            <text x="115" y="25" fill="var(--text-muted)" fontSize="11" textAnchor="end">Revenue</text>
            <rect x="120" y="45" width={earningsVal / maxVal * 240} height="30" fill="#22c55e" rx="4" />
            <text x="115" y="65" fill="var(--text-muted)" fontSize="11" textAnchor="end">Earnings</text>
          </svg>
        </div>

        <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333", marginBottom: 40 }}>
          <h2 style={{ color: "var(--text)", marginBottom: 12 }}>How Business Valuation Works</h2>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>Business valuation using multiples is the most common approach for private companies. Revenue multiples are used for high-growth companies, while earnings multiples (EBITDA) are preferred for profitable, mature businesses. Industry, growth rate, and market conditions all influence appropriate multiples.</p>
          <h2 style={{ color: "var(--text)", marginTop: 24, marginBottom: 12 }}>Common Industry Multiples</h2>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>SaaS companies: 5-15x revenue. Professional services: 1-3x revenue. Manufacturing: 4-8x EBITDA. Retail: 3-6x EBITDA. Healthcare: 8-15x EBITDA. Technology: 10-25x EBITDA.</p>
        </div>

        <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333" }}>
          <h2 style={{ color: "var(--text)", marginBottom: 16 }}>FAQ</h2>
          {[
            { q: "Which valuation method should I use?", a: "Revenue multiples work best for high-growth companies with low/no earnings. Earnings multiples suit profitable, established businesses. The blended average provides a reasonable middle ground." },
            { q: "How do I find the right multiple for my industry?", a: "Research recent M&A transactions in your industry, consult industry reports from firms like PitchBook or BizBuySell, or speak with a business broker or M&A advisor." },
            { q: "Is this valuation accurate?", a: "This provides a rough estimate. Actual valuations consider many factors including growth trajectory, competitive moats, customer concentration, recurring revenue, and market conditions." },
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
