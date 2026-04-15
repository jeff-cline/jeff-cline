"use client";
import { useState, useMemo } from "react";
import Link from "next/link";

export default function RevenueGrowthCalculator() {
  const [previousRev, setPreviousRev] = useState(800000);
  const [currentRev, setCurrentRev] = useState(1200000);
  const [years, setYears] = useState(3);
  const [projectionYears, setProjectionYears] = useState(5);

  const yoyGrowth = previousRev > 0 ? ((currentRev - previousRev) / previousRev) * 100 : 0;
  const cagr = previousRev > 0 && years > 0 ? (Math.pow(currentRev / previousRev, 1 / years) - 1) * 100 : 0;

  const projections = useMemo(() => {
    const rows: { year: number; revenue: number }[] = [];
    let rev = currentRev;
    for (let y = 1; y <= projectionYears; y++) {
      rev = rev * (1 + cagr / 100);
      rows.push({ year: y, revenue: rev });
    }
    return rows;
  }, [currentRev, cagr, projectionYears]);

  const fmt = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  const allRevs = [currentRev, ...projections.map(p => p.revenue)];
  const maxRev = Math.max(...allRevs, 1);

  return (
    <>
      <head>
        <title>Revenue Growth Rate Calculator | Jeff Cline</title>
        <meta name="description" content="Free revenue growth calculator. Calculate YoY growth rate, CAGR, and project future revenue based on historical performance." />
        <meta name="keywords" content="revenue growth calculator, CAGR calculator, growth rate calculator, revenue projections, year over year growth" />
        <meta property="og:title" content="Revenue Growth Rate Calculator | Jeff Cline" />
        <meta property="og:description" content="Calculate growth rates and project future revenue." />
        <meta property="og:url" content="https://jeff-cline.com/calculators/revenue-growth" />
        <link rel="canonical" href="https://jeff-cline.com/calculators/revenue-growth" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication", name: "Revenue Growth Rate Calculator", url: "https://jeff-cline.com/calculators/revenue-growth", applicationCategory: "FinanceApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }) }} />
      </head>
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "40px 20px" }}>
        <nav style={{ marginBottom: 24, fontSize: 14, color: "var(--text-muted)" }}>
          <Link href="/" style={{ color: "var(--orange)", textDecoration: "none" }}>Home</Link><span style={{ margin: "0 8px" }}>›</span>
          <Link href="/calculators" style={{ color: "var(--orange)", textDecoration: "none" }}>Calculators</Link><span style={{ margin: "0 8px" }}>›</span><span>Revenue Growth</span>
        </nav>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: 8, color: "var(--text)" }}>Revenue Growth Rate Calculator</h1>
        <p style={{ color: "var(--text-muted)", marginBottom: 32, fontSize: "1.05rem" }}>Calculate year-over-year growth, CAGR, and project future revenue trajectories.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 40, background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333" }}>
          {[
            { label: "Previous Revenue", val: previousRev, set: setPreviousRev, min: 10000, max: 50000000, step: 10000, cur: true },
            { label: "Current Revenue", val: currentRev, set: setCurrentRev, min: 10000, max: 50000000, step: 10000, cur: true },
            { label: "Period (Years)", val: years, set: setYears, min: 1, max: 10, step: 1, cur: false },
            { label: "Project Forward (Years)", val: projectionYears, set: setProjectionYears, min: 1, max: 10, step: 1, cur: false },
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
            { label: "Total Growth", value: `${yoyGrowth.toFixed(1)}%`, color: yoyGrowth >= 0 ? "var(--orange)" : "var(--red)" },
            { label: "CAGR", value: `${cagr.toFixed(2)}%`, color: cagr >= 0 ? "#22c55e" : "var(--red)" },
            { label: "Revenue Change", value: fmt(currentRev - previousRev), color: currentRev >= previousRev ? "#22c55e" : "var(--red)" },
            { label: `Projected (Y${projectionYears})`, value: fmt(projections[projections.length - 1]?.revenue ?? 0), color: "var(--orange)" },
          ].map(item => (
            <div key={item.label} style={{ background: "var(--bg-card)", borderRadius: 12, padding: 20, border: "1px solid #333", textAlign: "center" }}>
              <div style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: item.color }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* Projection chart */}
        <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333", marginBottom: 40 }}>
          <h3 style={{ color: "var(--text)", marginBottom: 16 }}>Revenue Projection</h3>
          <svg viewBox={`0 0 ${(projectionYears + 1) * 60 + 60} 200`} style={{ width: "100%", overflow: "visible" }}>
            {[{ year: 0, revenue: currentRev }, ...projections.map(p => ({ year: p.year, revenue: p.revenue }))].map((d, i) => {
              const barH = (d.revenue / maxRev) * 160;
              const x = i * 60 + 40;
              return (
                <g key={i}>
                  <rect x={x} y={185 - barH} width="40" height={barH} fill={i === 0 ? "#444" : "var(--orange)"} rx="3" opacity="0.85" />
                  <text x={x + 20} y="200" fill="var(--text-muted)" fontSize="10" textAnchor="middle">{i === 0 ? "Now" : `Y${d.year}`}</text>
                  <text x={x + 20} y={180 - barH} fill="var(--text)" fontSize="9" textAnchor="middle">{fmt(d.revenue)}</text>
                </g>
              );
            })}
          </svg>
        </div>

        <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333", marginBottom: 40 }}>
          <h2 style={{ color: "var(--text)", marginBottom: 12 }}>CAGR vs Simple Growth</h2>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>Simple growth rate shows total change. CAGR (Compound Annual Growth Rate) normalizes growth across multiple years, showing the equivalent annual rate needed to get from start to finish. CAGR is the standard for comparing growth across different time periods and companies.</p>
        </div>

        <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333" }}>
          <h2 style={{ color: "var(--text)", marginBottom: 16 }}>FAQ</h2>
          {[
            { q: "What is a good revenue growth rate?", a: "For startups: 15-25% month-over-month is strong. For established SMBs: 10-25% annual growth. For enterprises: 5-15% annual growth. Industry and stage matter greatly." },
            { q: "How reliable are revenue projections?", a: "Projections based on CAGR assume consistent growth, which rarely happens. Use them as directional guidance, not predictions. Factor in market conditions, competition, and operational capacity." },
            { q: "What's the Rule of 72 for revenue?", a: "Divide 72 by your annual growth rate to estimate doubling time. At 20% annual growth, revenue doubles approximately every 3.6 years." },
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
