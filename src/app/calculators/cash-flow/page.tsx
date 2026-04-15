"use client";
import { useState } from "react";
import Link from "next/link";

interface FlowItem { name: string; amount: number; }

export default function CashFlowCalculator() {
  const [incomes, setIncomes] = useState<FlowItem[]>([
    { name: "Revenue", amount: 50000 },
    { name: "Investment Income", amount: 2000 },
    { name: "Other Income", amount: 1000 },
  ]);
  const [expenses, setExpenses] = useState<FlowItem[]>([
    { name: "Payroll", amount: 20000 },
    { name: "Rent", amount: 5000 },
    { name: "Marketing", amount: 3000 },
    { name: "Supplies", amount: 2000 },
    { name: "Utilities", amount: 1500 },
    { name: "Other", amount: 2500 },
  ]);

  const totalIncome = incomes.reduce((s, i) => s + i.amount, 0);
  const totalExpenses = expenses.reduce((s, i) => s + i.amount, 0);
  const netCashFlow = totalIncome - totalExpenses;
  const cashFlowMargin = totalIncome > 0 ? (netCashFlow / totalIncome) * 100 : 0;
  const fmt = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  const updateItem = (list: FlowItem[], setList: (l: FlowItem[]) => void, idx: number, field: "name" | "amount", value: string | number) => {
    const updated = [...list];
    if (field === "amount") updated[idx] = { ...updated[idx], amount: Number(value) };
    else updated[idx] = { ...updated[idx], name: String(value) };
    setList(updated);
  };

  const maxAmount = Math.max(totalIncome, totalExpenses, 1);

  return (
    <>
      <head>
        <title>Cash Flow Calculator | Jeff Cline</title>
        <meta name="description" content="Free cash flow calculator. Track income streams and expenses to analyze net cash flow and optimize your finances." />
        <meta name="keywords" content="cash flow calculator, cash flow analysis, income expenses, net cash flow, business cash flow, personal cash flow" />
        <meta property="og:title" content="Cash Flow Calculator | Jeff Cline" />
        <meta property="og:description" content="Analyze your cash flow with income and expense tracking." />
        <meta property="og:url" content="https://jeff-cline.com/calculators/cash-flow" />
        <link rel="canonical" href="https://jeff-cline.com/calculators/cash-flow" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication", name: "Cash Flow Calculator", url: "https://jeff-cline.com/calculators/cash-flow", applicationCategory: "FinanceApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }) }} />
      </head>
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "40px 20px" }}>
        <nav style={{ marginBottom: 24, fontSize: 14, color: "var(--text-muted)" }}>
          <Link href="/" style={{ color: "var(--orange)", textDecoration: "none" }}>Home</Link><span style={{ margin: "0 8px" }}>›</span>
          <Link href="/calculators" style={{ color: "var(--orange)", textDecoration: "none" }}>Calculators</Link><span style={{ margin: "0 8px" }}>›</span><span>Cash Flow</span>
        </nav>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: 8, color: "var(--text)" }}>Cash Flow Calculator</h1>
        <p style={{ color: "var(--text-muted)", marginBottom: 32, fontSize: "1.05rem" }}>Track income and expenses to understand your net cash flow position.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 24, marginBottom: 40 }}>
          {/* Income */}
          <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333" }}>
            <h3 style={{ color: "#22c55e", marginBottom: 16, fontSize: 16 }}>Income Streams</h3>
            {incomes.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input type="text" value={item.name} onChange={(e) => updateItem(incomes, setIncomes, i, "name", e.target.value)} style={{ flex: 1, padding: "8px 12px", borderRadius: 6, border: "1px solid #444", background: "var(--bg)", color: "var(--text)", fontSize: 14 }} />
                <input type="text" value={`$${item.amount.toLocaleString()}`} onChange={(e) => { const v = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10); if (!isNaN(v)) updateItem(incomes, setIncomes, i, "amount", v); }} style={{ width: 130, padding: "8px 12px", borderRadius: 6, border: "1px solid #444", background: "var(--bg)", color: "#22c55e", fontSize: 14, fontWeight: 600 }} />
                <button onClick={() => setIncomes(incomes.filter((_, idx) => idx !== i))} style={{ background: "none", border: "none", color: "var(--red)", cursor: "pointer", fontSize: 18 }}>×</button>
              </div>
            ))}
            <button onClick={() => setIncomes([...incomes, { name: "New Income", amount: 0 }])} style={{ marginTop: 8, padding: "6px 14px", borderRadius: 6, border: "1px solid #444", background: "var(--bg)", color: "var(--orange)", cursor: "pointer", fontSize: 13 }}>+ Add Income</button>
          </div>
          {/* Expenses */}
          <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333" }}>
            <h3 style={{ color: "var(--red)", marginBottom: 16, fontSize: 16 }}>Expenses</h3>
            {expenses.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input type="text" value={item.name} onChange={(e) => updateItem(expenses, setExpenses, i, "name", e.target.value)} style={{ flex: 1, padding: "8px 12px", borderRadius: 6, border: "1px solid #444", background: "var(--bg)", color: "var(--text)", fontSize: 14 }} />
                <input type="text" value={`$${item.amount.toLocaleString()}`} onChange={(e) => { const v = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10); if (!isNaN(v)) updateItem(expenses, setExpenses, i, "amount", v); }} style={{ width: 130, padding: "8px 12px", borderRadius: 6, border: "1px solid #444", background: "var(--bg)", color: "var(--red)", fontSize: 14, fontWeight: 600 }} />
                <button onClick={() => setExpenses(expenses.filter((_, idx) => idx !== i))} style={{ background: "none", border: "none", color: "var(--red)", cursor: "pointer", fontSize: 18 }}>×</button>
              </div>
            ))}
            <button onClick={() => setExpenses([...expenses, { name: "New Expense", amount: 0 }])} style={{ marginTop: 8, padding: "6px 14px", borderRadius: 6, border: "1px solid #444", background: "var(--bg)", color: "var(--orange)", cursor: "pointer", fontSize: 13 }}>+ Add Expense</button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 40 }}>
          {[
            { label: "Total Income", value: fmt(totalIncome), color: "#22c55e" },
            { label: "Total Expenses", value: fmt(totalExpenses), color: "var(--red)" },
            { label: "Net Cash Flow", value: fmt(netCashFlow), color: netCashFlow >= 0 ? "var(--orange)" : "var(--red)" },
            { label: "Cash Flow Margin", value: `${cashFlowMargin.toFixed(1)}%`, color: cashFlowMargin >= 0 ? "var(--orange)" : "var(--red)" },
          ].map(item => (
            <div key={item.label} style={{ background: "var(--bg-card)", borderRadius: 12, padding: 20, border: "1px solid #333", textAlign: "center" }}>
              <div style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: item.color }}>{item.value}</div>
            </div>
          ))}
        </div>

        <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333", marginBottom: 40 }}>
          <h3 style={{ color: "var(--text)", marginBottom: 16 }}>Income vs Expenses</h3>
          <svg viewBox="0 0 400 80" style={{ width: "100%", maxWidth: 500 }}>
            <rect x="100" y="5" width={totalIncome / maxAmount * 260} height="28" fill="#22c55e" rx="4" />
            <text x="95" y="24" fill="var(--text-muted)" fontSize="11" textAnchor="end">Income</text>
            <rect x="100" y="42" width={totalExpenses / maxAmount * 260} height="28" fill="var(--red)" rx="4" />
            <text x="95" y="61" fill="var(--text-muted)" fontSize="11" textAnchor="end">Expenses</text>
          </svg>
        </div>

        <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333", marginBottom: 40 }}>
          <h2 style={{ color: "var(--text)", marginBottom: 12 }}>Why Cash Flow Matters</h2>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>Cash flow is the lifeblood of any business or household. Profitable companies can fail from poor cash flow management. Track your inflows and outflows monthly to ensure you always have liquidity for operations and opportunities.</p>
        </div>

        <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333" }}>
          <h2 style={{ color: "var(--text)", marginBottom: 16 }}>FAQ</h2>
          {[
            { q: "What's the difference between cash flow and profit?", a: "Profit is an accounting concept (revenue minus expenses). Cash flow is actual money moving in and out. You can be profitable on paper but cash-flow negative if customers pay late or you carry inventory." },
            { q: "What's a healthy cash flow margin?", a: "For businesses, 10-20% operating cash flow margin is generally healthy. For personal finances, saving/investing 20%+ of gross income is the standard benchmark." },
            { q: "How often should I review cash flow?", a: "Monthly at minimum for businesses. Weekly during tight periods. Personal finances benefit from monthly review with quarterly deep dives." },
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
