"use client";
import { useState, useMemo } from "react";
import Link from "next/link";

export default function LoanPaymentCalculator() {
  const [amount, setAmount] = useState(25000);
  const [rate, setRate] = useState(5.5);
  const [termMonths, setTermMonths] = useState(60);

  const { monthlyPayment, totalPaid, totalInterest, schedule } = useMemo(() => {
    const r = rate / 100 / 12;
    const n = termMonths;
    let mp = 0;
    if (r === 0) { mp = amount / n; }
    else { mp = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1); }
    let bal = amount;
    const sched: { month: number; payment: number; principal: number; interest: number; balance: number }[] = [];
    for (let i = 1; i <= n; i++) {
      const intPmt = bal * r;
      const prinPmt = mp - intPmt;
      bal = Math.max(0, bal - prinPmt);
      sched.push({ month: i, payment: mp, principal: prinPmt, interest: intPmt, balance: bal });
    }
    return { monthlyPayment: mp, totalPaid: mp * n, totalInterest: mp * n - amount, schedule: sched };
  }, [amount, rate, termMonths]);

  const fmt = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  const fmt2 = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
  const intPct = totalPaid > 0 ? (totalInterest / totalPaid) * 100 : 0;

  return (
    <>
      <head>
        <title>Loan Payment Calculator | Jeff Cline</title>
        <meta name="description" content="Free loan payment calculator. Calculate monthly payments, total interest, and amortization schedules for any loan." />
        <meta name="keywords" content="loan payment calculator, loan calculator, monthly payment, loan amortization, auto loan calculator, personal loan calculator" />
        <meta property="og:title" content="Loan Payment Calculator | Jeff Cline" />
        <meta property="og:description" content="Calculate monthly loan payments and total interest for any loan type." />
        <meta property="og:url" content="https://jeff-cline.com/calculators/loan-payment" />
        <link rel="canonical" href="https://jeff-cline.com/calculators/loan-payment" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication", name: "Loan Payment Calculator", url: "https://jeff-cline.com/calculators/loan-payment", applicationCategory: "FinanceApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }) }} />
      </head>
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "40px 20px" }}>
        <nav style={{ marginBottom: 24, fontSize: 14, color: "var(--text-muted)" }}>
          <Link href="/" style={{ color: "var(--orange)", textDecoration: "none" }}>Home</Link><span style={{ margin: "0 8px" }}>›</span>
          <Link href="/calculators" style={{ color: "var(--orange)", textDecoration: "none" }}>Calculators</Link><span style={{ margin: "0 8px" }}>›</span><span>Loan Payment</span>
        </nav>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: 8, color: "var(--text)" }}>Loan Payment Calculator</h1>
        <p style={{ color: "var(--text-muted)", marginBottom: 32, fontSize: "1.05rem" }}>Calculate monthly payments and total cost for auto loans, personal loans, or any fixed-rate loan.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 40, background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333" }}>
          <div>
            <label style={{ display: "block", color: "var(--text-muted)", marginBottom: 6, fontSize: 14 }}>Loan Amount</label>
            <input type="text" value={`$${amount.toLocaleString()}`} onChange={(e) => { const v = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10); if (!isNaN(v)) setAmount(v); }} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #444", background: "var(--bg)", color: "var(--text)", fontSize: 18, fontWeight: 600 }} />
            <input type="range" min={1000} max={500000} step={1000} value={amount} onChange={(e) => setAmount(Number(e.target.value))} style={{ width: "100%", marginTop: 8, accentColor: "var(--orange)" }} />
          </div>
          <div>
            <label style={{ display: "block", color: "var(--text-muted)", marginBottom: 6, fontSize: 14 }}>Interest Rate (%)</label>
            <input type="number" step={0.125} min={0} max={30} value={rate} onChange={(e) => setRate(Number(e.target.value))} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #444", background: "var(--bg)", color: "var(--text)", fontSize: 18, fontWeight: 600 }} />
            <input type="range" min={0} max={30} step={0.125} value={rate} onChange={(e) => setRate(Number(e.target.value))} style={{ width: "100%", marginTop: 8, accentColor: "var(--orange)" }} />
          </div>
          <div>
            <label style={{ display: "block", color: "var(--text-muted)", marginBottom: 6, fontSize: 14 }}>Term (Months)</label>
            <input type="number" min={6} max={360} value={termMonths} onChange={(e) => setTermMonths(Number(e.target.value))} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #444", background: "var(--bg)", color: "var(--text)", fontSize: 18, fontWeight: 600 }} />
            <input type="range" min={6} max={360} step={6} value={termMonths} onChange={(e) => setTermMonths(Number(e.target.value))} style={{ width: "100%", marginTop: 8, accentColor: "var(--orange)" }} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 40 }}>
          {[
            { label: "Monthly Payment", value: fmt2(monthlyPayment), color: "var(--orange)" },
            { label: "Total Paid", value: fmt(totalPaid), color: "var(--text)" },
            { label: "Total Interest", value: fmt(totalInterest), color: "var(--red)" },
            { label: "Interest % of Total", value: `${intPct.toFixed(1)}%`, color: "var(--text-muted)" },
          ].map(item => (
            <div key={item.label} style={{ background: "var(--bg-card)", borderRadius: 12, padding: 20, border: "1px solid #333", textAlign: "center" }}>
              <div style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: item.color }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* Pie-like visualization */}
        <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333", marginBottom: 40 }}>
          <h3 style={{ color: "var(--text)", marginBottom: 16 }}>Principal vs Interest</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ width: "100%", height: 24, borderRadius: 12, overflow: "hidden", background: "#333", display: "flex" }}>
              <div style={{ width: `${100 - intPct}%`, background: "var(--orange)", height: "100%" }} />
              <div style={{ width: `${intPct}%`, background: "var(--red)", height: "100%" }} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 24, marginTop: 12 }}>
            <span style={{ fontSize: 13, color: "var(--orange)" }}>■ Principal {fmt(amount)}</span>
            <span style={{ fontSize: 13, color: "var(--red)" }}>■ Interest {fmt(totalInterest)}</span>
          </div>
        </div>

        <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333", marginBottom: 40 }}>
          <h2 style={{ color: "var(--text)", marginBottom: 12 }}>How Loan Payments Work</h2>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>Fixed-rate loans have equal monthly payments throughout the term. Early payments are mostly interest; later payments are mostly principal. This is called amortization. Understanding this helps you decide whether to pay extra toward principal or invest elsewhere.</p>
        </div>

        <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333" }}>
          <h2 style={{ color: "var(--text)", marginBottom: 16 }}>FAQ</h2>
          {[
            { q: "Should I choose a shorter or longer loan term?", a: "Shorter terms have higher monthly payments but much less total interest. A 36-month auto loan typically costs thousands less in interest than a 72-month loan at the same rate." },
            { q: "How does making extra payments help?", a: "Extra payments go directly to principal, reducing the balance faster and cutting total interest. Even small extra payments can shave months or years off your loan." },
            { q: "What's the difference between APR and interest rate?", a: "APR includes the interest rate plus fees and other costs, giving you the true annual cost of borrowing. Always compare APRs when shopping for loans." },
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
