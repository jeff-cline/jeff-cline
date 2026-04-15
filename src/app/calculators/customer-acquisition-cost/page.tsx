"use client";
import { useState } from "react";
import Link from "next/link";

export default function CACCalculator() {
  const [marketingSpend, setMarketingSpend] = useState(25000);
  const [salesSpend, setSalesSpend] = useState(15000);
  const [customersAcquired, setCustomersAcquired] = useState(100);
  const [avgRevPerCustomer, setAvgRevPerCustomer] = useState(500);
  const [avgLifespan, setAvgLifespan] = useState(24);
  const [grossMargin, setGrossMargin] = useState(70);

  const totalSpend = marketingSpend + salesSpend;
  const cac = customersAcquired > 0 ? totalSpend / customersAcquired : 0;
  const ltv = avgRevPerCustomer * avgLifespan * (grossMargin / 100);
  const ltvCacRatio = cac > 0 ? ltv / cac : 0;
  const paybackMonths = avgRevPerCustomer * (grossMargin / 100) > 0 ? cac / (avgRevPerCustomer * (grossMargin / 100)) : 0;
  const fmt = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  const ratioColor = ltvCacRatio >= 3 ? "#22c55e" : ltvCacRatio >= 1 ? "var(--orange)" : "var(--red)";
  const ratioLabel = ltvCacRatio >= 3 ? "Healthy" : ltvCacRatio >= 1 ? "Needs Improvement" : "Unsustainable";

  return (
    <>
      <head>
        <title>Customer Acquisition Cost Calculator | Jeff Cline</title>
        <meta name="description" content="Free CAC calculator. Calculate customer acquisition cost, lifetime value, LTV:CAC ratio, and payback period." />
        <meta name="keywords" content="customer acquisition cost calculator, CAC calculator, LTV calculator, LTV CAC ratio, marketing ROI, customer lifetime value" />
        <meta property="og:title" content="Customer Acquisition Cost Calculator | Jeff Cline" />
        <meta property="og:description" content="Calculate CAC, LTV, and the critical LTV:CAC ratio." />
        <meta property="og:url" content="https://jeff-cline.com/calculators/customer-acquisition-cost" />
        <link rel="canonical" href="https://jeff-cline.com/calculators/customer-acquisition-cost" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication", name: "Customer Acquisition Cost Calculator", url: "https://jeff-cline.com/calculators/customer-acquisition-cost", applicationCategory: "FinanceApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }) }} />
      </head>
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "40px 20px" }}>
        <nav style={{ marginBottom: 24, fontSize: 14, color: "var(--text-muted)" }}>
          <Link href="/" style={{ color: "var(--orange)", textDecoration: "none" }}>Home</Link><span style={{ margin: "0 8px" }}>›</span>
          <Link href="/calculators" style={{ color: "var(--orange)", textDecoration: "none" }}>Calculators</Link><span style={{ margin: "0 8px" }}>›</span><span>Customer Acquisition Cost</span>
        </nav>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: 8, color: "var(--text)" }}>Customer Acquisition Cost Calculator</h1>
        <p style={{ color: "var(--text-muted)", marginBottom: 32, fontSize: "1.05rem" }}>Measure your CAC, customer lifetime value, and the critical LTV:CAC ratio to optimize growth spending.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 40, background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333" }}>
          {[
            { label: "Monthly Marketing Spend", val: marketingSpend, set: setMarketingSpend, min: 0, max: 500000, step: 1000, cur: true },
            { label: "Monthly Sales Spend", val: salesSpend, set: setSalesSpend, min: 0, max: 500000, step: 1000, cur: true },
            { label: "Customers Acquired/Month", val: customersAcquired, set: setCustomersAcquired, min: 1, max: 10000, step: 1, cur: false },
            { label: "Avg Monthly Rev/Customer", val: avgRevPerCustomer, set: setAvgRevPerCustomer, min: 10, max: 10000, step: 10, cur: true },
            { label: "Avg Customer Lifespan (mo)", val: avgLifespan, set: setAvgLifespan, min: 1, max: 120, step: 1, cur: false },
            { label: "Gross Margin (%)", val: grossMargin, set: setGrossMargin, min: 10, max: 95, step: 5, cur: false },
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

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 40 }}>
          {[
            { label: "CAC", value: fmt(cac), color: "var(--orange)" },
            { label: "LTV", value: fmt(ltv), color: "#22c55e" },
            { label: "LTV:CAC Ratio", value: `${ltvCacRatio.toFixed(1)}x`, color: ratioColor, sub: ratioLabel },
            { label: "Payback Period", value: `${paybackMonths.toFixed(1)} mo`, color: "var(--text)" },
          ].map(item => (
            <div key={item.label} style={{ background: "var(--bg-card)", borderRadius: 12, padding: 20, border: "1px solid #333", textAlign: "center" }}>
              <div style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: item.color }}>{item.value}</div>
              {"sub" in item && item.sub && <div style={{ color: item.color, fontSize: 12, marginTop: 4 }}>{item.sub}</div>}
            </div>
          ))}
        </div>

        {/* LTV vs CAC visual */}
        <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333", marginBottom: 40 }}>
          <h3 style={{ color: "var(--text)", marginBottom: 16 }}>LTV vs CAC</h3>
          <svg viewBox="0 0 400 90" style={{ width: "100%", maxWidth: 500 }}>
            {(() => {
              const max = Math.max(ltv, cac, 1);
              return (
                <>
                  <rect x="60" y="5" width={cac / max * 300} height="30" fill="var(--red)" rx="4" />
                  <text x="55" y="25" fill="var(--text-muted)" fontSize="11" textAnchor="end">CAC</text>
                  <text x={65 + cac / max * 300} y="25" fill="var(--text)" fontSize="11">{fmt(cac)}</text>
                  <rect x="60" y="45" width={ltv / max * 300} height="30" fill="#22c55e" rx="4" />
                  <text x="55" y="65" fill="var(--text-muted)" fontSize="11" textAnchor="end">LTV</text>
                  <text x={65 + ltv / max * 300} y="65" fill="var(--text)" fontSize="11">{fmt(ltv)}</text>
                </>
              );
            })()}
          </svg>
        </div>

        <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333", marginBottom: 40 }}>
          <h2 style={{ color: "var(--text)", marginBottom: 12 }}>Understanding CAC and LTV</h2>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>CAC (Customer Acquisition Cost) is the total cost to acquire one customer. LTV (Lifetime Value) is the total gross profit from one customer over their entire relationship. The LTV:CAC ratio tells you whether your growth spending is sustainable. A 3:1 ratio is the benchmark — below that, you&apos;re spending too much to acquire customers.</p>
        </div>

        <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333" }}>
          <h2 style={{ color: "var(--text)", marginBottom: 16 }}>FAQ</h2>
          {[
            { q: "What is a good LTV:CAC ratio?", a: "3:1 is the benchmark. Below 1:1 means you're losing money on every customer. 1-3x means growth is inefficient. Above 5x might mean you're under-investing in growth." },
            { q: "How do I reduce CAC?", a: "Improve conversion rates, optimize ad targeting, build organic channels (SEO, content, referrals), reduce sales cycle length, and improve lead qualification." },
            { q: "What's a good payback period?", a: "Under 12 months is ideal for SaaS. Under 18 months is acceptable. Over 24 months signals high risk — if customers churn before payback, you lose money on every acquisition." },
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
