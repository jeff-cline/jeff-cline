"use client";
import { useState, useMemo } from "react";
import Link from "next/link";

export default function BreakEvenCalculator() {
  const [fixedCosts, setFixedCosts] = useState(50000);
  const [variableCost, setVariableCost] = useState(25);
  const [pricePerUnit, setPricePerUnit] = useState(75);

  const contribution = pricePerUnit - variableCost;
  const breakEvenUnits = contribution > 0 ? Math.ceil(fixedCosts / contribution) : Infinity;
  const breakEvenRevenue = breakEvenUnits * pricePerUnit;
  const contributionMargin = pricePerUnit > 0 ? (contribution / pricePerUnit) * 100 : 0;

  const profitData = useMemo(() => {
    const pts: { units: number; revenue: number; totalCost: number; profit: number }[] = [];
    const maxUnits = Math.min(breakEvenUnits * 2.5, 100000);
    const step = Math.max(Math.floor(maxUnits / 20), 1);
    for (let u = 0; u <= maxUnits; u += step) {
      const rev = u * pricePerUnit;
      const tc = fixedCosts + u * variableCost;
      pts.push({ units: u, revenue: rev, totalCost: tc, profit: rev - tc });
    }
    return pts;
  }, [fixedCosts, variableCost, pricePerUnit, breakEvenUnits]);

  const fmt = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  const maxY = Math.max(...profitData.map(d => Math.max(d.revenue, d.totalCost)), 1);
  const maxX = profitData[profitData.length - 1]?.units ?? 1;

  return (
    <>
      <head>
        <title>Break-Even Analysis Calculator | Jeff Cline</title>
        <meta name="description" content="Free break-even calculator. Find out how many units you need to sell or how much revenue you need to cover costs." />
        <meta name="keywords" content="break even calculator, break even analysis, break even point, fixed costs, variable costs, contribution margin" />
        <meta property="og:title" content="Break-Even Analysis Calculator | Jeff Cline" />
        <meta property="og:description" content="Calculate your break-even point in units and revenue." />
        <meta property="og:url" content="https://jeff-cline.com/calculators/break-even" />
        <link rel="canonical" href="https://jeff-cline.com/calculators/break-even" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication", name: "Break-Even Calculator", url: "https://jeff-cline.com/calculators/break-even", applicationCategory: "FinanceApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }) }} />
      </head>
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "40px 20px" }}>
        <nav style={{ marginBottom: 24, fontSize: 14, color: "var(--text-muted)" }}>
          <Link href="/" style={{ color: "var(--orange)", textDecoration: "none" }}>Home</Link><span style={{ margin: "0 8px" }}>›</span>
          <Link href="/calculators" style={{ color: "var(--orange)", textDecoration: "none" }}>Calculators</Link><span style={{ margin: "0 8px" }}>›</span><span>Break-Even Analysis</span>
        </nav>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: 8, color: "var(--text)" }}>Break-Even Analysis Calculator</h1>
        <p style={{ color: "var(--text-muted)", marginBottom: 32, fontSize: "1.05rem" }}>Find the exact point where revenue covers all costs. Essential for pricing and business planning.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 40, background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333" }}>
          <div>
            <label style={{ display: "block", color: "var(--text-muted)", marginBottom: 6, fontSize: 14 }}>Fixed Costs (Monthly)</label>
            <input type="text" value={`$${fixedCosts.toLocaleString()}`} onChange={(e) => { const v = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10); if (!isNaN(v)) setFixedCosts(v); }} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #444", background: "var(--bg)", color: "var(--text)", fontSize: 18, fontWeight: 600 }} />
            <input type="range" min={1000} max={500000} step={1000} value={fixedCosts} onChange={(e) => setFixedCosts(Number(e.target.value))} style={{ width: "100%", marginTop: 8, accentColor: "var(--orange)" }} />
          </div>
          <div>
            <label style={{ display: "block", color: "var(--text-muted)", marginBottom: 6, fontSize: 14 }}>Variable Cost Per Unit</label>
            <input type="text" value={`$${variableCost}`} onChange={(e) => { const v = parseFloat(e.target.value.replace(/[^0-9.]/g, "")); if (!isNaN(v)) setVariableCost(v); }} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #444", background: "var(--bg)", color: "var(--text)", fontSize: 18, fontWeight: 600 }} />
            <input type="range" min={1} max={500} step={1} value={variableCost} onChange={(e) => setVariableCost(Number(e.target.value))} style={{ width: "100%", marginTop: 8, accentColor: "var(--orange)" }} />
          </div>
          <div>
            <label style={{ display: "block", color: "var(--text-muted)", marginBottom: 6, fontSize: 14 }}>Price Per Unit</label>
            <input type="text" value={`$${pricePerUnit}`} onChange={(e) => { const v = parseFloat(e.target.value.replace(/[^0-9.]/g, "")); if (!isNaN(v)) setPricePerUnit(v); }} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #444", background: "var(--bg)", color: "var(--text)", fontSize: 18, fontWeight: 600 }} />
            <input type="range" min={1} max={1000} step={1} value={pricePerUnit} onChange={(e) => setPricePerUnit(Number(e.target.value))} style={{ width: "100%", marginTop: 8, accentColor: "var(--orange)" }} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 40 }}>
          {[
            { label: "Break-Even Units", value: breakEvenUnits === Infinity ? "N/A" : breakEvenUnits.toLocaleString(), color: "var(--orange)" },
            { label: "Break-Even Revenue", value: breakEvenUnits === Infinity ? "N/A" : fmt(breakEvenRevenue), color: "#22c55e" },
            { label: "Contribution Margin", value: `${contributionMargin.toFixed(1)}%`, color: "var(--text)" },
            { label: "Contribution Per Unit", value: fmt(contribution), color: contribution > 0 ? "#3b82f6" : "var(--red)" },
          ].map(item => (
            <div key={item.label} style={{ background: "var(--bg-card)", borderRadius: 12, padding: 20, border: "1px solid #333", textAlign: "center" }}>
              <div style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: item.color }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333", marginBottom: 40 }}>
          <h3 style={{ color: "var(--text)", marginBottom: 16 }}>Break-Even Chart</h3>
          <svg viewBox="0 0 500 250" style={{ width: "100%" }}>
            {/* Revenue line */}
            <polyline fill="none" stroke="var(--orange)" strokeWidth="2"
              points={profitData.map(d => `${(d.units / maxX) * 460 + 30},${230 - (d.revenue / maxY) * 200}`).join(" ")} />
            {/* Cost line */}
            <polyline fill="none" stroke="var(--red)" strokeWidth="2"
              points={profitData.map(d => `${(d.units / maxX) * 460 + 30},${230 - (d.totalCost / maxY) * 200}`).join(" ")} />
            {/* Break-even marker */}
            {breakEvenUnits !== Infinity && (
              <circle cx={(breakEvenUnits / maxX) * 460 + 30} cy={230 - (breakEvenRevenue / maxY) * 200} r="5" fill="#22c55e" />
            )}
            <text x="20" y="245" fill="var(--text-muted)" fontSize="10">0</text>
            <text x="480" y="245" fill="var(--text-muted)" fontSize="10" textAnchor="end">{maxX.toLocaleString()} units</text>
          </svg>
          <div style={{ display: "flex", gap: 20, marginTop: 8 }}>
            <span style={{ fontSize: 12, color: "var(--orange)" }}>— Revenue</span>
            <span style={{ fontSize: 12, color: "var(--red)" }}>— Total Cost</span>
            <span style={{ fontSize: 12, color: "#22c55e" }}>● Break-Even</span>
          </div>
        </div>

        <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333", marginBottom: 40 }}>
          <h2 style={{ color: "var(--text)", marginBottom: 12 }}>How Break-Even Analysis Works</h2>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>Break-even analysis identifies the point where total revenue equals total costs. Below this point, you&apos;re operating at a loss. Above it, every additional unit sold contributes directly to profit. The contribution margin per unit (price minus variable cost) determines how quickly you reach break-even.</p>
        </div>

        <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333" }}>
          <h2 style={{ color: "var(--text)", marginBottom: 16 }}>FAQ</h2>
          {[
            { q: "What are fixed costs?", a: "Costs that don't change with production volume: rent, salaries, insurance, software subscriptions. They're incurred regardless of how many units you sell." },
            { q: "What are variable costs?", a: "Costs that scale with each unit: raw materials, shipping, commissions, packaging. They increase proportionally with production." },
            { q: "How can I lower my break-even point?", a: "Reduce fixed costs, lower variable costs per unit, or increase your price per unit. Any of these changes will lower the number of units needed to break even." },
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
