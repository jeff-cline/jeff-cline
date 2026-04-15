"use client";

import { useState, useMemo } from "react";

export default function AmortizationCalculator() {
  const [loanAmount, setLoanAmount] = useState(300000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [termYears, setTermYears] = useState(30);

  const schedule = useMemo(() => {
    const monthlyRate = interestRate / 100 / 12;
    const totalPayments = termYears * 12;
    if (monthlyRate === 0) {
      const mp = loanAmount / totalPayments;
      return Array.from({ length: totalPayments }, (_, i) => ({
        month: i + 1,
        payment: mp,
        principal: mp,
        interest: 0,
        balance: loanAmount - mp * (i + 1),
      }));
    }
    const monthlyPayment =
      (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
      (Math.pow(1 + monthlyRate, totalPayments) - 1);
    let balance = loanAmount;
    const rows: {
      month: number;
      payment: number;
      principal: number;
      interest: number;
      balance: number;
    }[] = [];
    for (let i = 1; i <= totalPayments; i++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      balance = Math.max(0, balance - principalPayment);
      rows.push({
        month: i,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance,
      });
    }
    return rows;
  }, [loanAmount, interestRate, termYears]);

  const totalPaid = schedule.reduce((s, r) => s + r.payment, 0);
  const totalInterest = totalPaid - loanAmount;
  const monthlyPayment = schedule[0]?.payment ?? 0;

  // Yearly summary for chart
  const yearlySummary = useMemo(() => {
    const years: { year: number; principal: number; interest: number; balance: number }[] = [];
    for (let y = 0; y < termYears; y++) {
      const slice = schedule.slice(y * 12, (y + 1) * 12);
      const yPrincipal = slice.reduce((s, r) => s + r.principal, 0);
      const yInterest = slice.reduce((s, r) => s + r.interest, 0);
      const endBalance = slice[slice.length - 1]?.balance ?? 0;
      years.push({ year: y + 1, principal: yPrincipal, interest: yInterest, balance: endBalance });
    }
    return years;
  }, [schedule, termYears]);

  const fmt = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  const fmt2 = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

  const interestPct = totalPaid > 0 ? (totalInterest / totalPaid) * 100 : 0;
  const principalPct = 100 - interestPct;

  // Bar chart max
  const maxAnnual = Math.max(...yearlySummary.map((y) => y.principal + y.interest));

  return (
    <>
      <head>
        <title>Mortgage Amortization Calculator | Jeff Cline</title>
        <meta
          name="description"
          content="Free mortgage amortization calculator. Visualize your 30, 15, or 7 year mortgage breakdown with interactive charts showing principal vs interest over time."
        />
        <meta
          name="keywords"
          content="amortization calculator, mortgage calculator, mortgage amortization, loan calculator, 30 year mortgage, 15 year mortgage, interest rate calculator, home loan, mortgage payment, principal vs interest"
        />
        <meta property="og:title" content="Mortgage Amortization Calculator | Jeff Cline" />
        <meta
          property="og:description"
          content="Free visual mortgage amortization calculator. See exactly how your payments break down over 7, 15, or 30 years."
        />
        <meta property="og:url" content="https://jeff-cline.com/amortization" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://jeff-cline.com/amortization" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Mortgage Amortization Calculator",
              url: "https://jeff-cline.com/amortization",
              applicationCategory: "FinanceApplication",
              operatingSystem: "Any",
              description:
                "Free mortgage amortization calculator with visual breakdowns for 30, 15, and 7 year mortgages.",
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            }),
          }}
        />
      </head>

      <main style={{ maxWidth: 960, margin: "0 auto", padding: "40px 20px" }}>
        <h1
          style={{
            fontSize: "2.2rem",
            fontWeight: 800,
            marginBottom: 8,
            color: "var(--text)",
          }}
        >
          Mortgage Amortization Calculator
        </h1>
        <p style={{ color: "var(--text-muted)", marginBottom: 32, fontSize: "1.05rem" }}>
          See exactly how your mortgage payments break down over time. Adjust the loan amount,
          interest rate, and term to visualize your amortization schedule.
        </p>

        {/* Input Controls */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 20,
            marginBottom: 40,
            background: "var(--bg-card)",
            borderRadius: 12,
            padding: 24,
            border: "1px solid #333",
          }}
        >
          <div>
            <label style={{ display: "block", color: "var(--text-muted)", marginBottom: 6, fontSize: 14 }}>
              Loan Amount
            </label>
            <input
              type="text"
              value={`$${loanAmount.toLocaleString()}`}
              onChange={(e) => {
                const v = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10);
                if (!isNaN(v)) setLoanAmount(v);
              }}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 8,
                border: "1px solid #444",
                background: "var(--bg)",
                color: "var(--text)",
                fontSize: 18,
                fontWeight: 600,
              }}
            />
            <input
              type="range"
              min={50000}
              max={2000000}
              step={5000}
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              style={{ width: "100%", marginTop: 8, accentColor: "var(--orange)" }}
            />
          </div>
          <div>
            <label style={{ display: "block", color: "var(--text-muted)", marginBottom: 6, fontSize: 14 }}>
              Interest Rate (%)
            </label>
            <input
              type="number"
              step={0.125}
              min={0}
              max={15}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 8,
                border: "1px solid #444",
                background: "var(--bg)",
                color: "var(--text)",
                fontSize: 18,
                fontWeight: 600,
              }}
            />
            <input
              type="range"
              min={0}
              max={15}
              step={0.125}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              style={{ width: "100%", marginTop: 8, accentColor: "var(--orange)" }}
            />
          </div>
          <div>
            <label style={{ display: "block", color: "var(--text-muted)", marginBottom: 6, fontSize: 14 }}>
              Loan Term
            </label>
            <select
              value={termYears}
              onChange={(e) => setTermYears(Number(e.target.value))}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 8,
                border: "1px solid #444",
                background: "var(--bg)",
                color: "var(--text)",
                fontSize: 18,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <option value={30}>30 Year Fixed</option>
              <option value={15}>15 Year Fixed</option>
              <option value={7}>7 Year Term</option>
            </select>
          </div>
        </div>

        {/* Summary Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 16,
            marginBottom: 40,
          }}
        >
          {[
            { label: "Monthly Payment", value: fmt2(monthlyPayment), accent: true },
            { label: "Total Paid", value: fmt(totalPaid) },
            { label: "Total Interest", value: fmt(totalInterest) },
            { label: "Principal", value: fmt(loanAmount) },
          ].map((card) => (
            <div
              key={card.label}
              style={{
                background: "var(--bg-card)",
                borderRadius: 12,
                padding: "20px 24px",
                border: card.accent ? "2px solid var(--orange)" : "1px solid #333",
                textAlign: "center",
              }}
            >
              <div style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 6 }}>
                {card.label}
              </div>
              <div
                style={{
                  fontSize: card.accent ? "1.8rem" : "1.5rem",
                  fontWeight: 700,
                  color: card.accent ? "var(--orange)" : "var(--text)",
                }}
              >
                {card.value}
              </div>
            </div>
          ))}
        </div>

        {/* Donut Chart - Principal vs Interest */}
        <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: 16, color: "var(--text)" }}>
          Principal vs. Interest Breakdown
        </h2>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 40,
            marginBottom: 48,
            flexWrap: "wrap",
            background: "var(--bg-card)",
            borderRadius: 12,
            padding: 32,
            border: "1px solid #333",
          }}
        >
          <svg width={200} height={200} viewBox="0 0 42 42">
            <circle cx={21} cy={21} r={15.91549431} fill="transparent" stroke="#333" strokeWidth={3} />
            <circle
              cx={21}
              cy={21}
              r={15.91549431}
              fill="transparent"
              stroke="var(--orange)"
              strokeWidth={3}
              strokeDasharray={`${principalPct} ${interestPct}`}
              strokeDashoffset={25}
              strokeLinecap="round"
            />
            <circle
              cx={21}
              cy={21}
              r={15.91549431}
              fill="transparent"
              stroke="#DC2626"
              strokeWidth={3}
              strokeDasharray={`${interestPct} ${principalPct}`}
              strokeDashoffset={25 - principalPct}
              strokeLinecap="round"
            />
            <text x={21} y={19} textAnchor="middle" fill="var(--text)" fontSize={4} fontWeight={700}>
              {principalPct.toFixed(0)}%
            </text>
            <text x={21} y={24} textAnchor="middle" fill="var(--text-muted)" fontSize={2.5}>
              Principal
            </text>
          </svg>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 4,
                  background: "var(--orange)",
                  display: "inline-block",
                }}
              />
              <span style={{ color: "var(--text)" }}>
                Principal: <strong>{fmt(loanAmount)}</strong> ({principalPct.toFixed(1)}%)
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 4,
                  background: "#DC2626",
                  display: "inline-block",
                }}
              />
              <span style={{ color: "var(--text)" }}>
                Interest: <strong>{fmt(totalInterest)}</strong> ({interestPct.toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Yearly Bar Chart */}
        <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: 16, color: "var(--text)" }}>
          Annual Payment Breakdown
        </h2>
        <div
          style={{
            background: "var(--bg-card)",
            borderRadius: 12,
            padding: "24px 16px",
            border: "1px solid #333",
            marginBottom: 48,
            overflowX: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 2,
              height: 220,
              minWidth: termYears * 20,
            }}
          >
            {yearlySummary.map((y) => {
              const pctP = maxAnnual > 0 ? (y.principal / maxAnnual) * 200 : 0;
              const pctI = maxAnnual > 0 ? (y.interest / maxAnnual) * 200 : 0;
              return (
                <div
                  key={y.year}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    height: "100%",
                    position: "relative",
                  }}
                  title={`Year ${y.year}\nPrincipal: ${fmt(y.principal)}\nInterest: ${fmt(y.interest)}\nBalance: ${fmt(y.balance)}`}
                >
                  <div
                    style={{
                      width: "70%",
                      background: "var(--orange)",
                      height: pctP,
                      borderRadius: "3px 3px 0 0",
                      minHeight: pctP > 0 ? 1 : 0,
                    }}
                  />
                  <div
                    style={{
                      width: "70%",
                      background: "#DC2626",
                      height: pctI,
                      borderRadius: "0 0 3px 3px",
                      minHeight: pctI > 0 ? 1 : 0,
                    }}
                  />
                  {termYears <= 15 || y.year % 5 === 0 || y.year === 1 ? (
                    <div
                      style={{
                        fontSize: 9,
                        color: "var(--text-muted)",
                        marginTop: 4,
                        whiteSpace: "nowrap",
                      }}
                    >
                      Yr {y.year}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
          <div
            style={{
              display: "flex",
              gap: 20,
              justifyContent: "center",
              marginTop: 16,
              fontSize: 13,
              color: "var(--text-muted)",
            }}
          >
            <span>
              <span style={{ color: "var(--orange)" }}>&#9632;</span> Principal
            </span>
            <span>
              <span style={{ color: "#DC2626" }}>&#9632;</span> Interest
            </span>
          </div>
        </div>

        {/* Balance Over Time */}
        <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: 16, color: "var(--text)" }}>
          Remaining Balance Over Time
        </h2>
        <div
          style={{
            background: "var(--bg-card)",
            borderRadius: 12,
            padding: "24px 16px",
            border: "1px solid #333",
            marginBottom: 48,
          }}
        >
          <svg
            viewBox={`0 0 ${termYears * 10 + 20} 120`}
            style={{ width: "100%", height: 200 }}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--orange)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="var(--orange)" stopOpacity={0} />
              </linearGradient>
            </defs>
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((pct) => (
              <line
                key={pct}
                x1={10}
                y1={10 + pct}
                x2={termYears * 10 + 10}
                y2={10 + pct}
                stroke="#333"
                strokeWidth={0.5}
              />
            ))}
            {/* Area */}
            <path
              d={`M10,110 ${yearlySummary
                .map((y) => `L${y.year * 10 + 10},${110 - (y.balance / loanAmount) * 100}`)
                .join(" ")} L${termYears * 10 + 10},110 Z`}
              fill="url(#balGrad)"
            />
            {/* Line */}
            <path
              d={`M10,10 ${yearlySummary
                .map((y) => `L${y.year * 10 + 10},${110 - (y.balance / loanAmount) * 100}`)
                .join(" ")}`}
              fill="none"
              stroke="var(--orange)"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Dots at key years */}
            {yearlySummary
              .filter((y) => y.year === 1 || y.year === termYears || y.year % 5 === 0)
              .map((y) => (
                <circle
                  key={y.year}
                  cx={y.year * 10 + 10}
                  cy={110 - (y.balance / loanAmount) * 100}
                  r={2.5}
                  fill="var(--orange)"
                />
              ))}
          </svg>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 12,
              color: "var(--text-muted)",
              padding: "0 10px",
            }}
          >
            <span>{fmt(loanAmount)}</span>
            <span>{fmt(0)}</span>
          </div>
        </div>

        {/* Amortization Table */}
        <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: 16, color: "var(--text)" }}>
          Yearly Amortization Schedule
        </h2>
        <div
          style={{
            background: "var(--bg-card)",
            borderRadius: 12,
            border: "1px solid #333",
            overflow: "auto",
            marginBottom: 48,
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #444" }}>
                {["Year", "Principal Paid", "Interest Paid", "Total Paid", "Remaining Balance"].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 16px",
                        textAlign: "right",
                        color: "var(--text-muted)",
                        fontWeight: 600,
                        fontSize: 12,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {yearlySummary.map((y) => (
                <tr
                  key={y.year}
                  style={{
                    borderBottom: "1px solid #2a2a2a",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(255,137,0,0.05)")
                  }
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "10px 16px", textAlign: "right", color: "var(--text)", fontWeight: 600 }}>
                    {y.year}
                  </td>
                  <td style={{ padding: "10px 16px", textAlign: "right", color: "var(--orange)" }}>
                    {fmt(y.principal)}
                  </td>
                  <td style={{ padding: "10px 16px", textAlign: "right", color: "#DC2626" }}>
                    {fmt(y.interest)}
                  </td>
                  <td style={{ padding: "10px 16px", textAlign: "right", color: "var(--text)" }}>
                    {fmt(y.principal + y.interest)}
                  </td>
                  <td style={{ padding: "10px 16px", textAlign: "right", color: "var(--text-muted)" }}>
                    {fmt(y.balance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SEO Content */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: 12, color: "var(--text)" }}>
            How Mortgage Amortization Works
          </h2>
          <div style={{ color: "var(--text-muted)", lineHeight: 1.7, fontSize: "0.95rem" }}>
            <p style={{ marginBottom: 12 }}>
              Amortization is the process of paying off a mortgage through regular monthly payments. Each
              payment is split between <strong style={{ color: "var(--orange)" }}>principal</strong> (reducing
              your loan balance) and <strong style={{ color: "#DC2626" }}>interest</strong> (the cost of
              borrowing).
            </p>
            <p style={{ marginBottom: 12 }}>
              In the early years of a mortgage, the majority of your payment goes toward interest. As the
              loan balance decreases, more of each payment is applied to principal. This is why the bar chart
              above shows a dramatic shift from red to orange over time.
            </p>
            <p style={{ marginBottom: 12 }}>
              <strong style={{ color: "var(--text)" }}>30-Year Fixed:</strong> Lower monthly payments but
              significantly more interest paid over the life of the loan. Best for buyers who want to
              minimize monthly expenses.
            </p>
            <p style={{ marginBottom: 12 }}>
              <strong style={{ color: "var(--text)" }}>15-Year Fixed:</strong> Higher monthly payments but
              dramatically less total interest. Ideal for buyers who can afford the higher payment and want to
              build equity faster.
            </p>
            <p>
              <strong style={{ color: "var(--text)" }}>7-Year Term:</strong> The shortest option with the
              highest payments but minimal interest paid. Often used for investment properties or buyers
              planning to refinance.
            </p>
          </div>
        </section>

        {/* FAQ for SEO */}
        <section>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: 16, color: "var(--text)" }}>
            Frequently Asked Questions
          </h2>
          {[
            {
              q: "What is an amortization schedule?",
              a: "An amortization schedule is a table showing each mortgage payment broken down into principal and interest, along with the remaining balance after each payment.",
            },
            {
              q: "How is the monthly mortgage payment calculated?",
              a: "The monthly payment is calculated using the formula: M = P[r(1+r)^n] / [(1+r)^n - 1], where P is the principal, r is the monthly interest rate, and n is the total number of payments.",
            },
            {
              q: "Should I choose a 15-year or 30-year mortgage?",
              a: "A 30-year mortgage has lower monthly payments but costs more in total interest. A 15-year mortgage has higher payments but saves tens of thousands in interest. Use the calculator above to compare both options.",
            },
            {
              q: "How much interest will I pay over the life of my mortgage?",
              a: "Total interest depends on your loan amount, interest rate, and term length. On a $300,000 loan at 6.5% over 30 years, you would pay approximately $382,000 in interest alone.",
            },
          ].map((faq) => (
            <details
              key={faq.q}
              style={{
                background: "var(--bg-card)",
                borderRadius: 10,
                border: "1px solid #333",
                padding: "16px 20px",
                marginBottom: 12,
                cursor: "pointer",
              }}
            >
              <summary
                style={{
                  fontWeight: 600,
                  color: "var(--text)",
                  fontSize: "1rem",
                  listStyle: "none",
                }}
              >
                {faq.q}
              </summary>
              <p style={{ color: "var(--text-muted)", marginTop: 10, lineHeight: 1.6 }}>{faq.a}</p>
            </details>
          ))}
        </section>
      </main>
    </>
  );
}
