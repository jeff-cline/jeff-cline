"use client";
import { useState, useMemo } from "react";
import Link from "next/link";

export default function DebtPayoffCalculator() {
  const [balance, setBalance] = useState(15000);
  const [rate, setRate] = useState(18);
  const [payment, setPayment] = useState(400);

  const { months, totalPaid, totalInterest, schedule } = useMemo(() => {
    const r = rate / 100 / 12;
    let bal = balance;
    const sched: { month: number; payment: number; principal: number; interest: number; balance: number }[] = [];
    let m = 0;
    const minPayment = bal * r + 1;
    if (payment <= bal * r && r > 0) return { months: Infinity, totalPaid: 0, totalInterest: 0, schedule: [] };
    while (bal > 0.01 && m < 600) {
      m++;
      const intPmt = bal * r;
      const pmt = Math.min(payment, bal + intPmt);
      const prinPmt = pmt - intPmt;
      bal = Math.max(0, bal - prinPmt);
      sched.push({ month: m, payment: pmt, principal: prinPmt, interest: intPmt, balance: bal });
    }
    const tp = sched.reduce((s, r) => s + r.payment, 0);
    return { months: m, totalPaid: tp, totalInterest: tp - balance, schedule: sched };
  }, [balance, rate, payment]);

  const fmt = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  const yearsMonths = months === Infinity ? "Never" : `${Math.floor(months / 12)}y ${months % 12}m`;

  return (
    <>
      <head>
        <title>Debt Payoff Calculator | Jeff Cline</title>
        <meta name="description" content="Free debt payoff calculator. See how long it takes to pay off debt and how extra payments save you money on interest." />
        <meta name="keywords" content="debt payoff calculator, debt calculator, pay off debt, credit card payoff, debt free calculator, extra payments" />
        <meta property="og:title" content="Debt Payoff Calculator | Jeff Cline" />
        <meta property="og:description" content="Calculate your debt payoff timeline and see how extra payments save money." />
        <meta property="og:url" content="https://jeff-cline.com/calculators/debt-payoff" />
        <link rel="canonical" href="https://jeff-cline.com/calculators/debt-payoff" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication", name: "Debt Payoff Calculator", url: "https://jeff-cline.com/calculators/debt-payoff", applicationCategory: "FinanceApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }) }} />
      </head>
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "40px 20px" }}>
        <nav style={{ marginBottom: 24, fontSize: 14, color: "var(--text-muted)" }}>
          <Link href="/" style={{ color: "var(--orange)", textDecoration: "none" }}>Home</Link><span style={{ margin: "0 8px" }}>›</span>
          <Link href="/calculators" style={{ color: "var(--orange)", textDecoration: "none" }}>Calculators</Link><span style={{ margin: "0 8px" }}>›</span><span>Debt Payoff</span>
        </nav>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: 8, color: "var(--text)" }}>Debt Payoff Calculator</h1>
        <p style={{ color: "var(--text-muted)", marginBottom: 32, fontSize: "1.05rem" }}>See when you&apos;ll be debt-free and how much interest you&apos;ll pay. Increase payments to accelerate your timeline.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 40, background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333" }}>
          <div>
            <label style={{ display: "block", color: "var(--text-muted)", marginBottom: 6, fontSize: 14 }}>Current Balance</label>
            <input type="text" value={`$${balance.toLocaleString()}`} onChange={(e) => { const v = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10); if (!isNaN(v)) setBalance(v); }} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #444", background: "var(--bg)", color: "var(--text)", fontSize: 18, fontWeight: 600 }} />
            <input type="range" min={500} max={100000} step={500} value={balance} onChange={(e) => setBalance(Number(e.target.value))} style={{ width: "100%", marginTop: 8, accentColor: "var(--orange)" }} />
          </div>
          <div>
            <label style={{ display: "block", color: "var(--text-muted)", marginBottom: 6, fontSize: 14 }}>Interest Rate (%)</label>
            <input type="number" step={0.5} min={0} max={35} value={rate} onChange={(e) => setRate(Number(e.target.value))} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #444", background: "var(--bg)", color: "var(--text)", fontSize: 18, fontWeight: 600 }} />
            <input type="range" min={0} max={35} step={0.5} value={rate} onChange={(e) => setRate(Number(e.target.value))} style={{ width: "100%", marginTop: 8, accentColor: "var(--orange)" }} />
          </div>
          <div>
            <label style={{ display: "block", color: "var(--text-muted)", marginBottom: 6, fontSize: 14 }}>Monthly Payment</label>
            <input type="text" value={`$${payment.toLocaleString()}`} onChange={(e) => { const v = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10); if (!isNaN(v)) setPayment(v); }} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #444", background: "var(--bg)", color: "var(--text)", fontSize: 18, fontWeight: 600 }} />
            <input type="range" min={50} max={5000} step={50} value={payment} onChange={(e) => setPayment(Number(e.target.value))} style={{ width: "100%", marginTop: 8, accentColor: "var(--orange)" }} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 40 }}>
          {[
            { label: "Payoff Time", value: yearsMonths, color: "var(--orange)" },
            { label: "Total Interest", value: months === Infinity ? "∞" : fmt(totalInterest), color: "var(--red)" },
            { label: "Total Paid", value: months === Infinity ? "∞" : fmt(totalPaid), color: "var(--text)" },
          ].map(item => (
            <div key={item.label} style={{ background: "var(--bg-card)", borderRadius: 12, padding: 20, border: "1px solid #333", textAlign: "center" }}>
              <div style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: item.color }}>{item.value}</div>
            </div>
          ))}
        </div>

        {months !== Infinity && schedule.length > 0 && (
          <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333", marginBottom: 40 }}>
            <h3 style={{ color: "var(--text)", marginBottom: 16 }}>Balance Over Time</h3>
            <svg viewBox="0 0 500 200" style={{ width: "100%" }}>
              <polyline fill="none" stroke="var(--orange)" strokeWidth="2.5"
                points={schedule.filter((_, i) => i % Math.max(1, Math.floor(schedule.length / 50)) === 0 || i === schedule.length - 1).map(d => `${(d.month / months) * 460 + 30},${180 - (d.balance / balance) * 160}`).join(" ")} />
              <line x1="30" y1="180" x2="490" y2="180" stroke="#333" strokeWidth="1" />
              <text x="20" y="25" fill="var(--text-muted)" fontSize="10">{fmt(balance)}</text>
              <text x="20" y="185" fill="var(--text-muted)" fontSize="10">$0</text>
              <text x="490" y="195" fill="var(--text-muted)" fontSize="10" textAnchor="end">{months} months</text>
            </svg>
          </div>
        )}

        <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333", marginBottom: 40 }}>
          <h2 style={{ color: "var(--text)", marginBottom: 12 }}>Debt Payoff Strategies</h2>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>The two most popular strategies are the Avalanche method (pay highest interest first) and the Snowball method (pay smallest balance first). Avalanche saves the most money; Snowball provides psychological wins. Either way, paying more than the minimum is the key to getting debt-free faster.</p>
        </div>

        <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333" }}>
          <h2 style={{ color: "var(--text)", marginBottom: 16 }}>FAQ</h2>
          {[
            { q: "Why does a small increase in payment make such a big difference?", a: "Extra payment goes entirely to principal, which reduces the balance that accrues interest. This creates a compounding effect in reverse — less interest means more of each payment goes to principal." },
            { q: "Should I pay off debt or invest?", a: "Generally, pay off high-interest debt (>7-8%) first. If your debt rate is low (3-4%), investing may earn more. Consider your risk tolerance and the guaranteed 'return' of debt payoff." },
            { q: "What if I can only pay the minimum?", a: "Minimum payments on credit cards (often 1-2% of balance) can take decades to pay off. Even adding $50-100/month above minimum can dramatically reduce payoff time." },
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
