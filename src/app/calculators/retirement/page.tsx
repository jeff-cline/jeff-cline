"use client";
import { useState, useMemo } from "react";
import Link from "next/link";

export default function RetirementCalculator() {
  const [currentAge, setCurrentAge] = useState(30);
  const [retireAge, setRetireAge] = useState(65);
  const [currentSavings, setCurrentSavings] = useState(50000);
  const [monthlyContrib, setMonthlyContrib] = useState(1000);
  const [expectedReturn, setExpectedReturn] = useState(7);
  const [withdrawalRate, setWithdrawalRate] = useState(4);

  const yearsToRetire = Math.max(retireAge - currentAge, 0);

  const data = useMemo(() => {
    const rows: { age: number; balance: number; contributions: number }[] = [];
    let bal = currentSavings;
    const r = expectedReturn / 100 / 12;
    for (let y = 1; y <= yearsToRetire; y++) {
      for (let m = 0; m < 12; m++) { bal = bal * (1 + r) + monthlyContrib; }
      const tc = currentSavings + monthlyContrib * 12 * y;
      rows.push({ age: currentAge + y, balance: bal, contributions: tc });
    }
    return rows;
  }, [currentAge, currentSavings, monthlyContrib, expectedReturn, yearsToRetire]);

  const retirementBalance = data[data.length - 1]?.balance ?? currentSavings;
  const annualIncome = retirementBalance * (withdrawalRate / 100);
  const monthlyIncome = annualIncome / 12;
  const totalContrib = currentSavings + monthlyContrib * 12 * yearsToRetire;
  const totalEarnings = retirementBalance - totalContrib;
  const fmt = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  const maxBal = Math.max(...data.map(d => d.balance), 1);

  return (
    <>
      <head>
        <title>Retirement Savings Calculator | Jeff Cline</title>
        <meta name="description" content="Free retirement calculator. Plan how much you need to save to retire comfortably based on your age, savings, and expected returns." />
        <meta name="keywords" content="retirement calculator, retirement savings, retirement planning, 401k calculator, retirement income, how much to retire" />
        <meta property="og:title" content="Retirement Savings Calculator | Jeff Cline" />
        <meta property="og:description" content="Plan your retirement savings and see your projected retirement income." />
        <meta property="og:url" content="https://jeff-cline.com/calculators/retirement" />
        <link rel="canonical" href="https://jeff-cline.com/calculators/retirement" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication", name: "Retirement Savings Calculator", url: "https://jeff-cline.com/calculators/retirement", applicationCategory: "FinanceApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }) }} />
      </head>
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "40px 20px" }}>
        <nav style={{ marginBottom: 24, fontSize: 14, color: "var(--text-muted)" }}>
          <Link href="/" style={{ color: "var(--orange)", textDecoration: "none" }}>Home</Link><span style={{ margin: "0 8px" }}>›</span>
          <Link href="/calculators" style={{ color: "var(--orange)", textDecoration: "none" }}>Calculators</Link><span style={{ margin: "0 8px" }}>›</span><span>Retirement</span>
        </nav>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: 8, color: "var(--text)" }}>Retirement Savings Calculator</h1>
        <p style={{ color: "var(--text-muted)", marginBottom: 32, fontSize: "1.05rem" }}>Plan your retirement. See how your savings grow and estimate your retirement income.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 20, marginBottom: 40, background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333" }}>
          {[
            { label: "Current Age", val: currentAge, set: setCurrentAge, min: 18, max: 80, step: 1, cur: false },
            { label: "Retirement Age", val: retireAge, set: setRetireAge, min: 30, max: 90, step: 1, cur: false },
            { label: "Current Savings", val: currentSavings, set: setCurrentSavings, min: 0, max: 2000000, step: 5000, cur: true },
            { label: "Monthly Contribution", val: monthlyContrib, set: setMonthlyContrib, min: 0, max: 10000, step: 100, cur: true },
            { label: "Expected Return (%)", val: expectedReturn, set: setExpectedReturn, min: 1, max: 15, step: 0.5, cur: false },
            { label: "Withdrawal Rate (%)", val: withdrawalRate, set: setWithdrawalRate, min: 2, max: 8, step: 0.5, cur: false },
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
            { label: "Retirement Balance", value: fmt(retirementBalance), color: "var(--orange)" },
            { label: "Monthly Income", value: fmt(monthlyIncome), color: "#22c55e" },
            { label: "Annual Income", value: fmt(annualIncome), color: "#22c55e" },
            { label: "Years to Retire", value: `${yearsToRetire}`, color: "var(--text)" },
          ].map(item => (
            <div key={item.label} style={{ background: "var(--bg-card)", borderRadius: 12, padding: 20, border: "1px solid #333", textAlign: "center" }}>
              <div style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: item.color }}>{item.value}</div>
            </div>
          ))}
        </div>

        {data.length > 0 && (
          <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333", marginBottom: 40 }}>
            <h3 style={{ color: "var(--text)", marginBottom: 16 }}>Savings Growth to Retirement</h3>
            <svg viewBox={`0 0 ${Math.max(data.length * 18 + 50, 300)} 200`} style={{ width: "100%", overflow: "visible" }}>
              {data.map((d, i) => {
                const totalH = (d.balance / maxBal) * 170;
                const contribH = (d.contributions / maxBal) * 170;
                const x = i * 18 + 35;
                return (
                  <g key={i}>
                    <rect x={x} y={190 - totalH} width="13" height={totalH} fill="var(--orange)" rx="1" opacity="0.7" />
                    <rect x={x} y={190 - contribH} width="13" height={contribH} fill="#444" rx="1" />
                    {(i === 0 || i === data.length - 1 || (i + 1) % 5 === 0) && (
                      <text x={x + 6} y="204" fill="var(--text-muted)" fontSize="7" textAnchor="middle">{d.age}</text>
                    )}
                  </g>
                );
              })}
            </svg>
            <div style={{ display: "flex", gap: 20, marginTop: 8 }}>
              <span style={{ fontSize: 12, color: "#444" }}>■ Contributions ({fmt(totalContrib)})</span>
              <span style={{ fontSize: 12, color: "var(--orange)" }}>■ Total incl. earnings ({fmt(retirementBalance)})</span>
            </div>
          </div>
        )}

        <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333", marginBottom: 40 }}>
          <h2 style={{ color: "var(--text)", marginBottom: 12 }}>The 4% Rule Explained</h2>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>The 4% rule suggests withdrawing 4% of your portfolio in the first year of retirement, then adjusting for inflation each year. Research shows this strategy has historically sustained a portfolio for 30+ years. More conservative planners use 3-3.5%, while others argue for 4.5-5% with flexibility.</p>
        </div>

        <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333" }}>
          <h2 style={{ color: "var(--text)", marginBottom: 16 }}>FAQ</h2>
          {[
            { q: "How much do I need to retire?", a: "A common rule of thumb is 25x your annual expenses. If you spend $60,000/year, you'd need about $1.5 million. This aligns with the 4% withdrawal rate." },
            { q: "Should I invest more aggressively when young?", a: "Generally yes. With decades until retirement, you can tolerate more volatility for potentially higher returns. Gradually shift to bonds/conservative investments as you approach retirement." },
            { q: "What about Social Security?", a: "Social Security provides a base income but typically replaces only 30-40% of pre-retirement income. Factor it in, but don't rely on it exclusively." },
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
