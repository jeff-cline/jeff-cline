"use client";
import { useState, useMemo } from "react";
import Link from "next/link";

export default function InvestmentReturnCalculator() {
  const [initial, setInitial] = useState(10000);
  const [monthly, setMonthly] = useState(500);
  const [annualReturn, setAnnualReturn] = useState(8);
  const [years, setYears] = useState(25);

  const data = useMemo(() => {
    const rows: { year: number; balance: number; contributions: number; earnings: number }[] = [];
    let balance = initial;
    const r = annualReturn / 100 / 12;
    for (let y = 1; y <= years; y++) {
      for (let m = 0; m < 12; m++) {
        balance = balance * (1 + r) + monthly;
      }
      const totalContrib = initial + monthly * 12 * y;
      rows.push({ year: y, balance, contributions: totalContrib, earnings: balance - totalContrib });
    }
    return rows;
  }, [initial, monthly, annualReturn, years]);

  const final = data[data.length - 1];
  const totalContrib = initial + monthly * 12 * years;
  const totalEarnings = (final?.balance ?? 0) - totalContrib;
  const fmt = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  const maxBal = Math.max(...data.map(d => d.balance), 1);

  return (
    <>
      <head>
        <title>Investment Return Calculator | Jeff Cline</title>
        <meta name="description" content="Free investment return calculator. Project growth with initial investment, monthly contributions, and compound returns over time." />
        <meta name="keywords" content="investment return calculator, investment growth, compound returns, monthly contributions, portfolio growth calculator" />
        <meta property="og:title" content="Investment Return Calculator | Jeff Cline" />
        <meta property="og:description" content="Project your investment growth with monthly contributions and compound returns." />
        <meta property="og:url" content="https://jeff-cline.com/calculators/investment-return" />
        <link rel="canonical" href="https://jeff-cline.com/calculators/investment-return" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication", name: "Investment Return Calculator", url: "https://jeff-cline.com/calculators/investment-return", applicationCategory: "FinanceApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }) }} />
      </head>
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "40px 20px" }}>
        <nav style={{ marginBottom: 24, fontSize: 14, color: "var(--text-muted)" }}>
          <Link href="/" style={{ color: "var(--orange)", textDecoration: "none" }}>Home</Link><span style={{ margin: "0 8px" }}>›</span>
          <Link href="/calculators" style={{ color: "var(--orange)", textDecoration: "none" }}>Calculators</Link><span style={{ margin: "0 8px" }}>›</span><span>Investment Return</span>
        </nav>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: 8, color: "var(--text)" }}>Investment Return Calculator</h1>
        <p style={{ color: "var(--text-muted)", marginBottom: 32, fontSize: "1.05rem" }}>Project how your investments grow with regular contributions and compound returns over time.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 40, background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333" }}>
          {[
            { label: "Initial Investment", val: initial, set: setInitial, min: 0, max: 500000, step: 1000, isCurrency: true },
            { label: "Monthly Contribution", val: monthly, set: setMonthly, min: 0, max: 10000, step: 100, isCurrency: true },
            { label: "Expected Annual Return (%)", val: annualReturn, set: setAnnualReturn, min: 0, max: 20, step: 0.5, isCurrency: false },
            { label: "Investment Period (Years)", val: years, set: setYears, min: 1, max: 50, step: 1, isCurrency: false },
          ].map(f => (
            <div key={f.label}>
              <label style={{ display: "block", color: "var(--text-muted)", marginBottom: 6, fontSize: 14 }}>{f.label}</label>
              {f.isCurrency ? (
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
            { label: "Final Balance", value: fmt(final?.balance ?? 0), color: "var(--orange)" },
            { label: "Total Contributions", value: fmt(totalContrib), color: "var(--text)" },
            { label: "Investment Earnings", value: fmt(totalEarnings), color: "#22c55e" },
            { label: "Return Multiple", value: `${((final?.balance ?? 0) / Math.max(totalContrib, 1)).toFixed(1)}x`, color: "var(--orange)" },
          ].map(item => (
            <div key={item.label} style={{ background: "var(--bg-card)", borderRadius: 12, padding: 20, border: "1px solid #333", textAlign: "center" }}>
              <div style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: item.color }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* Stacked bar chart */}
        <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333", marginBottom: 40 }}>
          <h3 style={{ color: "var(--text)", marginBottom: 16 }}>Growth Over Time</h3>
          <svg viewBox={`0 0 ${Math.max(data.length * 24 + 50, 300)} 200`} style={{ width: "100%", overflow: "visible" }}>
            {data.map((d, i) => {
              const totalH = (d.balance / maxBal) * 170;
              const contribH = (d.contributions / maxBal) * 170;
              const x = i * 24 + 35;
              return (
                <g key={i}>
                  <rect x={x} y={190 - totalH} width="18" height={totalH} fill="var(--orange)" rx="2" opacity="0.7" />
                  <rect x={x} y={190 - contribH} width="18" height={contribH} fill="#444" rx="2" />
                  {(i === 0 || i === data.length - 1 || (i + 1) % 5 === 0) && (
                    <text x={x + 9} y="204" fill="var(--text-muted)" fontSize="8" textAnchor="middle">{d.year}</text>
                  )}
                </g>
              );
            })}
          </svg>
          <div style={{ display: "flex", gap: 20, marginTop: 8 }}>
            <span style={{ fontSize: 12, color: "#444" }}>■ Contributions</span>
            <span style={{ fontSize: 12, color: "var(--orange)" }}>■ Total (incl. earnings)</span>
          </div>
        </div>

        <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333", marginBottom: 40 }}>
          <h2 style={{ color: "var(--text)", marginBottom: 12 }}>The Power of Consistent Investing</h2>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>Dollar-cost averaging through monthly contributions smooths out market volatility and builds wealth consistently. Combined with compound returns, even modest monthly investments can grow to substantial sums over decades. The key is starting early and staying consistent.</p>
        </div>

        <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333" }}>
          <h2 style={{ color: "var(--text)", marginBottom: 16 }}>FAQ</h2>
          {[
            { q: "What annual return should I expect?", a: "The S&P 500 has historically returned about 10% annually (7% after inflation). Conservative portfolios might target 5-6%, while aggressive growth portfolios might target 10-12%." },
            { q: "Does this account for taxes?", a: "No, returns shown are pre-tax. In tax-advantaged accounts (401k, IRA), you defer or avoid taxes. In taxable accounts, expect to lose 15-30% of gains to taxes depending on your bracket." },
            { q: "How important is the initial investment vs monthly contributions?", a: "Both matter, but for long time horizons, consistent monthly contributions often outweigh the initial investment due to sustained compounding over more periods." },
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
