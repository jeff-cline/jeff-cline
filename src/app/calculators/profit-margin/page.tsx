"use client";
import { useState } from "react";
import Link from "next/link";

export default function ProfitMarginCalculator() {
  const [revenue, setRevenue] = useState(500000);
  const [cogs, setCogs] = useState(200000);
  const [opExpenses, setOpExpenses] = useState(150000);
  const [taxes, setTaxes] = useState(30000);

  const grossProfit = revenue - cogs;
  const operatingProfit = grossProfit - opExpenses;
  const netProfit = operatingProfit - taxes;
  const grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;
  const opMargin = revenue > 0 ? (operatingProfit / revenue) * 100 : 0;
  const netMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;
  const fmt = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  return (
    <>
      <head>
        <title>Profit Margin Calculator | Jeff Cline</title>
        <meta name="description" content="Free profit margin calculator. Calculate gross margin, operating margin, and net profit margin from your revenue and cost data." />
        <meta name="keywords" content="profit margin calculator, gross margin, net margin, operating margin, profitability calculator" />
        <meta property="og:title" content="Profit Margin Calculator | Jeff Cline" />
        <meta property="og:description" content="Calculate gross, operating, and net profit margins instantly." />
        <meta property="og:url" content="https://jeff-cline.com/calculators/profit-margin" />
        <link rel="canonical" href="https://jeff-cline.com/calculators/profit-margin" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication", name: "Profit Margin Calculator", url: "https://jeff-cline.com/calculators/profit-margin", applicationCategory: "FinanceApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }) }} />
      </head>
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "40px 20px" }}>
        <nav style={{ marginBottom: 24, fontSize: 14, color: "var(--text-muted)" }}>
          <Link href="/" style={{ color: "var(--orange)", textDecoration: "none" }}>Home</Link><span style={{ margin: "0 8px" }}>›</span>
          <Link href="/calculators" style={{ color: "var(--orange)", textDecoration: "none" }}>Calculators</Link><span style={{ margin: "0 8px" }}>›</span><span>Profit Margin</span>
        </nav>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: 8, color: "var(--text)" }}>Profit Margin Calculator</h1>
        <p style={{ color: "var(--text-muted)", marginBottom: 32, fontSize: "1.05rem" }}>Calculate your gross, operating, and net profit margins to understand your true profitability.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 40, background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333" }}>
          {[
            { label: "Revenue", value: revenue, set: setRevenue, min: 10000, max: 10000000, step: 10000 },
            { label: "Cost of Goods Sold", value: cogs, set: setCogs, min: 0, max: 5000000, step: 5000 },
            { label: "Operating Expenses", value: opExpenses, set: setOpExpenses, min: 0, max: 5000000, step: 5000 },
            { label: "Taxes & Other", value: taxes, set: setTaxes, min: 0, max: 2000000, step: 5000 },
          ].map(f => (
            <div key={f.label}>
              <label style={{ display: "block", color: "var(--text-muted)", marginBottom: 6, fontSize: 14 }}>{f.label}</label>
              <input type="text" value={`$${f.value.toLocaleString()}`} onChange={(e) => { const v = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10); if (!isNaN(v)) f.set(v); }} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #444", background: "var(--bg)", color: "var(--text)", fontSize: 18, fontWeight: 600 }} />
              <input type="range" min={f.min} max={f.max} step={f.step} value={f.value} onChange={(e) => f.set(Number(e.target.value))} style={{ width: "100%", marginTop: 8, accentColor: "var(--orange)" }} />
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 40 }}>
          {[
            { label: "Gross Margin", value: `${grossMargin.toFixed(1)}%`, sub: fmt(grossProfit), color: "var(--orange)" },
            { label: "Operating Margin", value: `${opMargin.toFixed(1)}%`, sub: fmt(operatingProfit), color: "#22c55e" },
            { label: "Net Margin", value: `${netMargin.toFixed(1)}%`, sub: fmt(netProfit), color: netMargin >= 0 ? "#3b82f6" : "var(--red)" },
          ].map(item => (
            <div key={item.label} style={{ background: "var(--bg-card)", borderRadius: 12, padding: 20, border: "1px solid #333", textAlign: "center" }}>
              <div style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: item.color }}>{item.value}</div>
              <div style={{ color: "var(--text-muted)", fontSize: 14 }}>{item.sub}</div>
            </div>
          ))}
        </div>

        {/* Waterfall Chart */}
        <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333", marginBottom: 40 }}>
          <h3 style={{ color: "var(--text)", marginBottom: 16 }}>Revenue Waterfall</h3>
          <svg viewBox="0 0 500 180" style={{ width: "100%", maxWidth: 600 }}>
            {(() => {
              const items = [
                { label: "Revenue", val: revenue, color: "var(--orange)" },
                { label: "COGS", val: -cogs, color: "var(--red)" },
                { label: "Gross", val: grossProfit, color: "#22c55e" },
                { label: "OpEx", val: -opExpenses, color: "var(--red)" },
                { label: "Operating", val: operatingProfit, color: "#22c55e" },
                { label: "Tax", val: -taxes, color: "var(--red)" },
                { label: "Net", val: netProfit, color: netProfit >= 0 ? "#3b82f6" : "var(--red)" },
              ];
              const maxV = Math.max(...items.map(i => Math.abs(i.val)), 1);
              return items.map((item, idx) => {
                const barH = (Math.abs(item.val) / maxV) * 120;
                const x = idx * 70 + 10;
                return (
                  <g key={idx}>
                    <rect x={x} y={150 - barH} width="50" height={barH} fill={item.color} rx="3" opacity="0.85" />
                    <text x={x + 25} y="168" fill="var(--text-muted)" fontSize="9" textAnchor="middle">{item.label}</text>
                    <text x={x + 25} y={145 - barH} fill="var(--text)" fontSize="8" textAnchor="middle">{fmt(Math.abs(item.val))}</text>
                  </g>
                );
              });
            })()}
          </svg>
        </div>

        <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333", marginBottom: 40 }}>
          <h2 style={{ color: "var(--text)", marginBottom: 12 }}>Understanding Profit Margins</h2>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>Gross margin shows profitability after direct costs. Operating margin accounts for overhead like rent, salaries, and marketing. Net margin is your bottom line after all expenses including taxes. Track all three to identify where profits leak.</p>
          <h2 style={{ color: "var(--text)", marginTop: 24, marginBottom: 12 }}>Industry Benchmarks</h2>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>Software/SaaS: 70-85% gross, 20-40% net. Retail: 25-35% gross, 2-5% net. Manufacturing: 25-40% gross, 5-10% net. Professional services: 50-70% gross, 15-25% net.</p>
        </div>

        <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333" }}>
          <h2 style={{ color: "var(--text)", marginBottom: 16 }}>FAQ</h2>
          {[
            { q: "What's the difference between gross and net margin?", a: "Gross margin only subtracts direct costs (COGS). Net margin subtracts everything: COGS, operating expenses, taxes, and interest. Net margin shows your true bottom-line profitability." },
            { q: "What's a healthy profit margin?", a: "It varies wildly by industry. A 5% net margin is excellent in retail but poor in software. Compare against your specific industry benchmarks." },
            { q: "How can I improve my margins?", a: "Increase prices, reduce COGS through better sourcing, cut unnecessary operating expenses, optimize tax strategy, or increase volume to spread fixed costs." },
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
