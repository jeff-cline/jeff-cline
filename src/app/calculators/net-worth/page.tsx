"use client";
import { useState } from "react";
import Link from "next/link";

interface Item { name: string; amount: number; }

export default function NetWorthCalculator() {
  const [assets, setAssets] = useState<Item[]>([
    { name: "Cash & Savings", amount: 25000 },
    { name: "Investment Accounts", amount: 150000 },
    { name: "Retirement (401k/IRA)", amount: 200000 },
    { name: "Real Estate", amount: 350000 },
    { name: "Vehicles", amount: 30000 },
    { name: "Other Assets", amount: 10000 },
  ]);
  const [liabilities, setLiabilities] = useState<Item[]>([
    { name: "Mortgage", amount: 250000 },
    { name: "Auto Loans", amount: 15000 },
    { name: "Student Loans", amount: 20000 },
    { name: "Credit Cards", amount: 5000 },
    { name: "Other Debt", amount: 0 },
  ]);

  const totalAssets = assets.reduce((s, i) => s + i.amount, 0);
  const totalLiabilities = liabilities.reduce((s, i) => s + i.amount, 0);
  const netWorth = totalAssets - totalLiabilities;
  const debtToAsset = totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0;
  const fmt = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  const updateItem = (list: Item[], setList: (l: Item[]) => void, idx: number, field: "name" | "amount", value: string | number) => {
    const updated = [...list];
    if (field === "amount") updated[idx] = { ...updated[idx], amount: Number(value) };
    else updated[idx] = { ...updated[idx], name: String(value) };
    setList(updated);
  };

  return (
    <>
      <head>
        <title>Net Worth Calculator | Jeff Cline</title>
        <meta name="description" content="Free net worth calculator. Track your total assets and liabilities with categorized breakdowns to see your true financial position." />
        <meta name="keywords" content="net worth calculator, net worth tracker, assets liabilities, financial position, wealth calculator, personal finance" />
        <meta property="og:title" content="Net Worth Calculator | Jeff Cline" />
        <meta property="og:description" content="Calculate your net worth with categorized asset and liability tracking." />
        <meta property="og:url" content="https://jeff-cline.com/calculators/net-worth" />
        <link rel="canonical" href="https://jeff-cline.com/calculators/net-worth" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication", name: "Net Worth Calculator", url: "https://jeff-cline.com/calculators/net-worth", applicationCategory: "FinanceApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }) }} />
      </head>
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "40px 20px" }}>
        <nav style={{ marginBottom: 24, fontSize: 14, color: "var(--text-muted)" }}>
          <Link href="/" style={{ color: "var(--orange)", textDecoration: "none" }}>Home</Link><span style={{ margin: "0 8px" }}>›</span>
          <Link href="/calculators" style={{ color: "var(--orange)", textDecoration: "none" }}>Calculators</Link><span style={{ margin: "0 8px" }}>›</span><span>Net Worth</span>
        </nav>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: 8, color: "var(--text)" }}>Net Worth Calculator</h1>
        <p style={{ color: "var(--text-muted)", marginBottom: 32, fontSize: "1.05rem" }}>Track your total financial position. Add all assets and liabilities to see your net worth.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 24, marginBottom: 40 }}>
          {/* Assets */}
          <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333" }}>
            <h3 style={{ color: "#22c55e", marginBottom: 16, fontSize: 16 }}>Assets</h3>
            {assets.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input type="text" value={item.name} onChange={(e) => updateItem(assets, setAssets, i, "name", e.target.value)} style={{ flex: 1, padding: "8px 12px", borderRadius: 6, border: "1px solid #444", background: "var(--bg)", color: "var(--text)", fontSize: 14 }} />
                <input type="text" value={`$${item.amount.toLocaleString()}`} onChange={(e) => { const v = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10); if (!isNaN(v)) updateItem(assets, setAssets, i, "amount", v); }} style={{ width: 140, padding: "8px 12px", borderRadius: 6, border: "1px solid #444", background: "var(--bg)", color: "#22c55e", fontSize: 14, fontWeight: 600 }} />
                <button onClick={() => setAssets(assets.filter((_, idx) => idx !== i))} style={{ background: "none", border: "none", color: "var(--red)", cursor: "pointer", fontSize: 18 }}>×</button>
              </div>
            ))}
            <button onClick={() => setAssets([...assets, { name: "New Asset", amount: 0 }])} style={{ marginTop: 8, padding: "6px 14px", borderRadius: 6, border: "1px solid #444", background: "var(--bg)", color: "var(--orange)", cursor: "pointer", fontSize: 13 }}>+ Add Asset</button>
            <div style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid #333", display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>Total Assets</span>
              <span style={{ color: "#22c55e", fontWeight: 800, fontSize: 18 }}>{fmt(totalAssets)}</span>
            </div>
          </div>
          {/* Liabilities */}
          <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333" }}>
            <h3 style={{ color: "var(--red)", marginBottom: 16, fontSize: 16 }}>Liabilities</h3>
            {liabilities.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input type="text" value={item.name} onChange={(e) => updateItem(liabilities, setLiabilities, i, "name", e.target.value)} style={{ flex: 1, padding: "8px 12px", borderRadius: 6, border: "1px solid #444", background: "var(--bg)", color: "var(--text)", fontSize: 14 }} />
                <input type="text" value={`$${item.amount.toLocaleString()}`} onChange={(e) => { const v = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10); if (!isNaN(v)) updateItem(liabilities, setLiabilities, i, "amount", v); }} style={{ width: 140, padding: "8px 12px", borderRadius: 6, border: "1px solid #444", background: "var(--bg)", color: "var(--red)", fontSize: 14, fontWeight: 600 }} />
                <button onClick={() => setLiabilities(liabilities.filter((_, idx) => idx !== i))} style={{ background: "none", border: "none", color: "var(--red)", cursor: "pointer", fontSize: 18 }}>×</button>
              </div>
            ))}
            <button onClick={() => setLiabilities([...liabilities, { name: "New Liability", amount: 0 }])} style={{ marginTop: 8, padding: "6px 14px", borderRadius: 6, border: "1px solid #444", background: "var(--bg)", color: "var(--orange)", cursor: "pointer", fontSize: 13 }}>+ Add Liability</button>
            <div style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid #333", display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>Total Liabilities</span>
              <span style={{ color: "var(--red)", fontWeight: 800, fontSize: 18 }}>{fmt(totalLiabilities)}</span>
            </div>
          </div>
        </div>

        {/* Net Worth Summary */}
        <div style={{ background: "var(--bg-card)", borderRadius: 16, padding: 32, border: `2px solid ${netWorth >= 0 ? "var(--orange)" : "var(--red)"}`, marginBottom: 40, textAlign: "center" }}>
          <div style={{ color: "var(--text-muted)", fontSize: 16, marginBottom: 8 }}>Your Net Worth</div>
          <div style={{ fontSize: 48, fontWeight: 800, color: netWorth >= 0 ? "var(--orange)" : "var(--red)" }}>{fmt(netWorth)}</div>
          <div style={{ marginTop: 16, display: "flex", justifyContent: "center", gap: 32 }}>
            <span style={{ color: "var(--text-muted)", fontSize: 14 }}>Debt-to-Asset: <strong style={{ color: "var(--text)" }}>{debtToAsset.toFixed(1)}%</strong></span>
          </div>
        </div>

        {/* Asset allocation bar */}
        <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333", marginBottom: 40 }}>
          <h3 style={{ color: "var(--text)", marginBottom: 16 }}>Asset Allocation</h3>
          {assets.filter(a => a.amount > 0).map((a, i) => {
            const pct = totalAssets > 0 ? (a.amount / totalAssets) * 100 : 0;
            const colors = ["var(--orange)", "#22c55e", "#3b82f6", "#a855f7", "#ef4444", "#eab308"];
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <span style={{ width: 150, color: "var(--text-muted)", fontSize: 13 }}>{a.name}</span>
                <div style={{ flex: 1, height: 20, borderRadius: 4, overflow: "hidden", background: "#222" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: colors[i % colors.length], borderRadius: 4 }} />
                </div>
                <span style={{ width: 100, textAlign: "right", color: "var(--text)", fontSize: 13 }}>{pct.toFixed(1)}%</span>
              </div>
            );
          })}
        </div>

        <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333", marginBottom: 40 }}>
          <h2 style={{ color: "var(--text)", marginBottom: 12 }}>Why Track Net Worth</h2>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>Net worth is the single best measure of financial health. Unlike income, it accounts for both what you own and what you owe. Track it quarterly or annually to measure progress toward financial goals. Focus on growing assets while reducing liabilities over time.</p>
        </div>

        <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: 24, border: "1px solid #333" }}>
          <h2 style={{ color: "var(--text)", marginBottom: 16 }}>FAQ</h2>
          {[
            { q: "Should I include my home in net worth?", a: "Yes, include it at fair market value (not purchase price). But also include the mortgage. Some people track 'investable net worth' separately (excluding home equity) for planning purposes." },
            { q: "What's a good debt-to-asset ratio?", a: "Below 50% is generally healthy. Below 30% is strong. Above 50% means more than half your assets are financed by debt, which increases financial risk." },
            { q: "How often should I calculate net worth?", a: "Quarterly is ideal. Monthly can cause anxiety from market fluctuations. Annual is the minimum. The trend over years matters more than any single snapshot." },
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
