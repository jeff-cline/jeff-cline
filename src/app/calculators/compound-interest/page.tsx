"use client";
import { useState, useMemo } from "react";
import Link from "next/link";

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(20);
  const [frequency, setFrequency] = useState(12);

  const data = useMemo(() => {
    const rows: { year: number; balance: number; contributions: number; interest: number }[] = [];
    let balance = principal;
    const r = rate / 100;
    for (let y = 1; y <= years; y++) {
      const prev = balance;
      balance = prev * Math.pow(1 + r / frequency, frequency);
      rows.push({ year: y, balance, contributions: principal, interest: balance - principal });
    }
    return rows;
  }, [principal, rate, years, frequency]);

  const finalBalance = data[data.length - 1]?.balance ?? principal;
  const totalInterest = finalBalance - principal;
  const fmt = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  const maxBal = Math.max(...data.map(d => d.balance), 1);

  return (
    <>
      <head>
        <title>Compound Interest Calculator | Jeff Cline</title>
        <meta name="description" content="Free compound interest calculator. See how your money grows with daily, monthly, quarterly, or annual compounding over time." />
        <meta name="keywords" content="compound interest calculator, interest calculator, compound growth, savings calculator, investment growth" />
        <meta property="og:title" content="Compound Interest Calculator | Jeff Cline" />
        <meta property="og:description" content="Visualize compound interest growth over time." />
        <meta property="og:url" content="https://jeff-cline.com/calculators/compound-interest" />
        <link rel="canonical" href="https://jeff-cline.com/calculators/compound-interest" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication", name: "Compound Interest Calculator", url: "https://jeff-cline.com/calculators/compound-interest", applicationCategory: "FinanceApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }) }} />
      </head>
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "40px 20px" }}>
        <nav style={{ marginBottom: 24, fontSize: 14, color: "var(--text-muted)" }}>
          <Link href="/" style={{ color: "var(--orange)", textDecoration: "none" }}>Home</Link>
          <span style={{ margin: "0 8px" }}>›</span>
          <Link href="/calculators" style={{ color: "var(--orange)", textDecoration: "none" }}>Calculators</Link>
          <span style={{ margin: "0 8px" }}>›</span><span>Compound Interest</span>
        </nav>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: 8, color: "var(--text)" }}>Compound Interest Calculator</h1>
        <p style={{ color: "var(--text-muted)", marginBottom: 32, fontSize: "1.05rem" }}>See the power of compound interest. Watch your money grow exponentially over time.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 40, background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333" }}>
          <div>
            <label style={{ display: "block", color: "var(--text-muted)", marginBottom: 6, fontSize: 14 }}>Principal</label>
            <input type="text" value={`$${principal.toLocaleString()}`} onChange={(e) => { const v = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10); if (!isNaN(v)) setPrincipal(v); }} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #444", background: "var(--bg)", color: "var(--text)", fontSize: 18, fontWeight: 600 }} />
            <input type="range" min={1000} max={500000} step={1000} value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} style={{ width: "100%", marginTop: 8, accentColor: "var(--orange)" }} />
          </div>
          <div>
            <label style={{ display: "block", color: "var(--text-muted)", marginBottom: 6, fontSize: 14 }}>Annual Rate (%)</label>
            <input type="number" step={0.1} min={0} max={30} value={rate} onChange={(e) => setRate(Number(e.target.value))} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #444", background: "var(--bg)", color: "var(--text)", fontSize: 18, fontWeight: 600 }} />
            <input type="range" min={0} max={30} step={0.1} value={rate} onChange={(e) => setRate(Number(e.target.value))} style={{ width: "100%", marginTop: 8, accentColor: "var(--orange)" }} />
          </div>
          <div>
            <label style={{ display: "block", color: "var(--text-muted)", marginBottom: 6, fontSize: 14 }}>Years</label>
            <input type="number" min={1} max={50} value={years} onChange={(e) => setYears(Number(e.target.value))} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #444", background: "var(--bg)", color: "var(--text)", fontSize: 18, fontWeight: 600 }} />
            <input type="range" min={1} max={50} value={years} onChange={(e) => setYears(Number(e.target.value))} style={{ width: "100%", marginTop: 8, accentColor: "var(--orange)" }} />
          </div>
          <div>
            <label style={{ display: "block", color: "var(--text-muted)", marginBottom: 6, fontSize: 14 }}>Compounding</label>
            <select value={frequency} onChange={(e) => setFrequency(Number(e.target.value))} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #444", background: "var(--bg)", color: "var(--text)", fontSize: 16 }}>
              <option value={1}>Annually</option>
              <option value={4}>Quarterly</option>
              <option value={12}>Monthly</option>
              <option value={365}>Daily</option>
            </select>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 40 }}>
          {[
            { label: "Final Balance", value: fmt(finalBalance), color: "var(--orange)" },
            { label: "Total Interest Earned", value: fmt(totalInterest), color: "#22c55e" },
            { label: "Principal", value: fmt(principal), color: "var(--text)" },
            { label: "Interest/Principal Ratio", value: `${(totalInterest / Math.max(principal, 1) * 100).toFixed(0)}%`, color: "var(--orange)" },
          ].map((item) => (
            <div key={item.label} style={{ background: "var(--bg-card)", borderRadius: 12, padding: 20, border: "1px solid #333", textAlign: "center" }}>
              <div style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: item.color }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* Growth Chart */}
        <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333", marginBottom: 40 }}>
          <h3 style={{ color: "var(--text)", marginBottom: 16 }}>Growth Over Time</h3>
          <svg viewBox={`0 0 ${Math.max(data.length * 30 + 60, 300)} 200`} style={{ width: "100%", overflow: "visible" }}>
            {data.map((d, i) => {
              const barH = (d.balance / maxBal) * 160;
              const principalH = (principal / maxBal) * 160;
              const x = i * 30 + 40;
              return (
                <g key={i}>
                  <rect x={x} y={180 - barH} width="22" height={barH} fill="var(--orange)" rx="2" opacity="0.8" />
                  <rect x={x} y={180 - principalH} width="22" height={principalH} fill="#444" rx="2" />
                  {(i === 0 || i === data.length - 1 || (i + 1) % 5 === 0) && (
                    <text x={x + 11} y="196" fill="var(--text-muted)" fontSize="9" textAnchor="middle">Y{d.year}</text>
                  )}
                </g>
              );
            })}
          </svg>
          <div style={{ display: "flex", gap: 20, marginTop: 12 }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>■ <span style={{ color: "#444" }}>Principal</span></span>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>■ <span style={{ color: "var(--orange)" }}>Total Balance</span></span>
          </div>
        </div>

        {/* Table */}
        <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333", marginBottom: 40, overflowX: "auto" }}>
          <h3 style={{ color: "var(--text)", marginBottom: 16 }}>Year-by-Year Breakdown</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>{["Year", "Balance", "Interest Earned"].map(h => <th key={h} style={{ textAlign: "left", padding: "8px 12px", borderBottom: "1px solid #333", color: "var(--text-muted)", fontSize: 13 }}>{h}</th>)}</tr></thead>
            <tbody>{data.map(d => (
              <tr key={d.year} style={{ borderBottom: "1px solid #222" }}>
                <td style={{ padding: "8px 12px", color: "var(--text)", fontSize: 14 }}>{d.year}</td>
                <td style={{ padding: "8px 12px", color: "var(--orange)", fontSize: 14, fontWeight: 600 }}>{fmt(d.balance)}</td>
                <td style={{ padding: "8px 12px", color: "#22c55e", fontSize: 14 }}>{fmt(d.interest)}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>

        <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333", marginBottom: 40 }}>
          <h2 style={{ color: "var(--text)", marginBottom: 12 }}>How Compound Interest Works</h2>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>Compound interest earns interest on your interest, creating exponential growth over time. The more frequently interest compounds, the faster your money grows. Albert Einstein reportedly called it the eighth wonder of the world.</p>
          <h2 style={{ color: "var(--text)", marginTop: 24, marginBottom: 12 }}>Why Compounding Frequency Matters</h2>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>Daily compounding earns slightly more than annual compounding at the same rate. The difference becomes significant with larger amounts and longer time horizons. This is why understanding your investment&apos;s compounding frequency is critical.</p>
        </div>

        <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333" }}>
          <h2 style={{ color: "var(--text)", marginBottom: 16 }}>FAQ</h2>
          {[
            { q: "What's the Rule of 72?", a: "Divide 72 by your interest rate to estimate how many years it takes to double your money. At 7%, it takes about 10.3 years." },
            { q: "Is compound interest the same as APY?", a: "APY (Annual Percentage Yield) already accounts for compounding frequency. The stated rate (APR) doesn't. This calculator lets you see the difference." },
            { q: "How does inflation affect compound interest?", a: "Inflation erodes purchasing power. If you earn 7% but inflation is 3%, your real return is approximately 4%. Always consider real returns for long-term planning." },
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
