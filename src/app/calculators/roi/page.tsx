"use client";
import { useState } from "react";
import Link from "next/link";

export default function ROICalculator() {
  const [investment, setInvestment] = useState(10000);
  const [returns, setReturns] = useState(15000);
  const [years, setYears] = useState(1);

  const netProfit = returns - investment;
  const roi = investment > 0 ? (netProfit / investment) * 100 : 0;
  const annualizedROI = investment > 0 && years > 0 ? (Math.pow(returns / investment, 1 / years) - 1) * 100 : 0;

  const fmt = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  const barW = Math.min(Math.max(roi, 0), 500) / 5;

  return (
    <>
      <head>
        <title>ROI Calculator - Return on Investment | Jeff Cline</title>
        <meta name="description" content="Free ROI calculator. Calculate return on investment, annualized returns, and net profit for any investment scenario." />
        <meta name="keywords" content="ROI calculator, return on investment, investment calculator, annualized return, net profit calculator" />
        <meta property="og:title" content="ROI Calculator | Jeff Cline" />
        <meta property="og:description" content="Calculate return on investment with visual breakdowns." />
        <meta property="og:url" content="https://jeff-cline.com/calculators/roi" />
        <link rel="canonical" href="https://jeff-cline.com/calculators/roi" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication", name: "ROI Calculator", url: "https://jeff-cline.com/calculators/roi", applicationCategory: "FinanceApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }) }} />
      </head>
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "40px 20px" }}>
        <nav style={{ marginBottom: 24, fontSize: 14, color: "var(--text-muted)" }}>
          <Link href="/" style={{ color: "var(--orange)", textDecoration: "none" }}>Home</Link>
          <span style={{ margin: "0 8px" }}>›</span>
          <Link href="/calculators" style={{ color: "var(--orange)", textDecoration: "none" }}>Calculators</Link>
          <span style={{ margin: "0 8px" }}>›</span>
          <span>ROI Calculator</span>
        </nav>

        <h1 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: 8, color: "var(--text)" }}>ROI Calculator</h1>
        <p style={{ color: "var(--text-muted)", marginBottom: 32, fontSize: "1.05rem" }}>Calculate your return on investment and compare scenarios to make smarter decisions.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 40, background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333" }}>
          <div>
            <label style={{ display: "block", color: "var(--text-muted)", marginBottom: 6, fontSize: 14 }}>Investment Amount</label>
            <input type="text" value={`$${investment.toLocaleString()}`} onChange={(e) => { const v = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10); if (!isNaN(v)) setInvestment(v); }} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #444", background: "var(--bg)", color: "var(--text)", fontSize: 18, fontWeight: 600 }} />
            <input type="range" min={1000} max={1000000} step={1000} value={investment} onChange={(e) => setInvestment(Number(e.target.value))} style={{ width: "100%", marginTop: 8, accentColor: "var(--orange)" }} />
          </div>
          <div>
            <label style={{ display: "block", color: "var(--text-muted)", marginBottom: 6, fontSize: 14 }}>Total Returns</label>
            <input type="text" value={`$${returns.toLocaleString()}`} onChange={(e) => { const v = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10); if (!isNaN(v)) setReturns(v); }} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #444", background: "var(--bg)", color: "var(--text)", fontSize: 18, fontWeight: 600 }} />
            <input type="range" min={0} max={2000000} step={1000} value={returns} onChange={(e) => setReturns(Number(e.target.value))} style={{ width: "100%", marginTop: 8, accentColor: "var(--orange)" }} />
          </div>
          <div>
            <label style={{ display: "block", color: "var(--text-muted)", marginBottom: 6, fontSize: 14 }}>Time Period (Years)</label>
            <input type="number" min={1} max={50} value={years} onChange={(e) => setYears(Number(e.target.value))} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #444", background: "var(--bg)", color: "var(--text)", fontSize: 18, fontWeight: 600 }} />
            <input type="range" min={1} max={50} value={years} onChange={(e) => setYears(Number(e.target.value))} style={{ width: "100%", marginTop: 8, accentColor: "var(--orange)" }} />
          </div>
        </div>

        {/* Results */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 40 }}>
          {[
            { label: "ROI", value: `${roi.toFixed(1)}%`, color: roi >= 0 ? "var(--orange)" : "var(--red)" },
            { label: "Annualized ROI", value: `${annualizedROI.toFixed(2)}%`, color: annualizedROI >= 0 ? "var(--orange)" : "var(--red)" },
            { label: "Net Profit", value: fmt(netProfit), color: netProfit >= 0 ? "#22c55e" : "var(--red)" },
            { label: "Total Return", value: fmt(returns), color: "var(--text)" },
          ].map((item) => (
            <div key={item.label} style={{ background: "var(--bg-card)", borderRadius: 12, padding: 20, border: "1px solid #333", textAlign: "center" }}>
              <div style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: item.color }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* Visual */}
        <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333", marginBottom: 40 }}>
          <h3 style={{ color: "var(--text)", marginBottom: 16 }}>Investment vs Return</h3>
          <svg viewBox="0 0 400 120" style={{ width: "100%", maxWidth: 500 }}>
            <rect x="100" y="10" width={Math.min(investment / Math.max(investment, returns) * 250, 250)} height="35" fill="#444" rx="4" />
            <text x="90" y="33" fill="var(--text-muted)" fontSize="12" textAnchor="end">Invested</text>
            <text x={105 + Math.min(investment / Math.max(investment, returns) * 250, 250)} y="33" fill="var(--text)" fontSize="12">{fmt(investment)}</text>
            <rect x="100" y="60" width={Math.min(returns / Math.max(investment, returns) * 250, 250)} height="35" fill="var(--orange)" rx="4" />
            <text x="90" y="83" fill="var(--text-muted)" fontSize="12" textAnchor="end">Returns</text>
            <text x={105 + Math.min(returns / Math.max(investment, returns) * 250, 250)} y="83" fill="var(--text)" fontSize="12">{fmt(returns)}</text>
          </svg>
        </div>

        {/* Content */}
        <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333", marginBottom: 40 }}>
          <h2 style={{ color: "var(--text)", marginBottom: 12 }}>How to Use the ROI Calculator</h2>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>Enter your initial investment amount, the total returns received, and the time period. The calculator computes your total ROI percentage, annualized return, and net profit. Use this to compare different investment opportunities on an equal basis.</p>
          <h2 style={{ color: "var(--text)", marginTop: 24, marginBottom: 12 }}>Why ROI Matters</h2>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>Return on Investment is the most fundamental metric for evaluating any investment. It tells you how efficiently your capital is being deployed. Annualized ROI normalizes returns across different time periods, enabling apples-to-apples comparison between a 6-month venture and a 5-year investment.</p>
        </div>

        <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333" }}>
          <h2 style={{ color: "var(--text)", marginBottom: 16 }}>FAQ</h2>
          {[
            { q: "What is a good ROI?", a: "A good ROI depends on context. For stocks, 7-10% annually is typical. For business investments, 15-25% is often expected. Real estate typically targets 8-12% annually." },
            { q: "How is annualized ROI different from total ROI?", a: "Total ROI shows the overall return regardless of time. Annualized ROI converts it to a yearly rate, making it easier to compare investments of different durations." },
            { q: "Does this account for inflation?", a: "This calculator shows nominal returns. To get real (inflation-adjusted) returns, subtract the annual inflation rate (typically 2-3%) from the annualized ROI." },
          ].map((faq) => (
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
