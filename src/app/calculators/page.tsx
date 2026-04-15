"use client";

import Link from "next/link";

const calculators = [
  { title: "Mortgage Amortization", desc: "Visualize mortgage payment breakdowns over 7, 15, or 30 years with interactive amortization schedules.", href: "/amortization", icon: "🏠" },
  { title: "ROI Calculator", desc: "Calculate return on investment for any venture. Compare scenarios and measure profitability.", href: "/calculators/roi", icon: "📈" },
  { title: "Compound Interest", desc: "See how compound interest grows your money over time with different compounding frequencies.", href: "/calculators/compound-interest", icon: "💰" },
  { title: "Business Valuation", desc: "Estimate your business value using revenue multiples, earnings multiples, and industry benchmarks.", href: "/calculators/business-valuation", icon: "🏢" },
  { title: "Profit Margin", desc: "Calculate gross, net, and operating profit margins. Understand your true profitability.", href: "/calculators/profit-margin", icon: "💵" },
  { title: "Break-Even Analysis", desc: "Find your break-even point. Know exactly how many units or revenue you need to cover costs.", href: "/calculators/break-even", icon: "⚖️" },
  { title: "Loan Payment", desc: "Calculate monthly payments, total interest, and payoff schedules for any loan type.", href: "/calculators/loan-payment", icon: "🏦" },
  { title: "Investment Return", desc: "Project investment growth with monthly contributions and compound returns over time.", href: "/calculators/investment-return", icon: "🚀" },
  { title: "Debt Payoff", desc: "Create a debt payoff plan. See how extra payments accelerate your debt-free date.", href: "/calculators/debt-payoff", icon: "🎯" },
  { title: "Retirement Savings", desc: "Plan your retirement. Calculate how much you need to save to retire comfortably.", href: "/calculators/retirement", icon: "🌴" },
  { title: "Cash Flow Analysis", desc: "Track income streams and expenses. Analyze net cash flow and identify optimization opportunities.", href: "/calculators/cash-flow", icon: "💸" },
  { title: "Cap Rate", desc: "Calculate capitalization rates for real estate investments. Compare property returns.", href: "/calculators/cap-rate", icon: "🏘️" },
  { title: "Customer Acquisition Cost", desc: "Measure CAC, lifetime value, and LTV:CAC ratio to optimize marketing spend.", href: "/calculators/customer-acquisition-cost", icon: "👥" },
  { title: "Revenue Growth Rate", desc: "Calculate year-over-year growth, CAGR, and project future revenue trajectories.", href: "/calculators/revenue-growth", icon: "📊" },
  { title: "Net Worth", desc: "Track your total net worth across assets and liabilities with categorized breakdowns.", href: "/calculators/net-worth", icon: "🏆" },
];

export default function CalculatorsHub() {
  return (
    <>
      <head>
        <title>Free Financial Calculators | Jeff Cline</title>
        <meta name="description" content="15 free financial calculators for business owners, investors, and entrepreneurs. ROI, compound interest, business valuation, profit margin, and more." />
        <meta name="keywords" content="financial calculators, business calculators, ROI calculator, compound interest calculator, business valuation, profit margin calculator, free calculator tools" />
        <meta property="og:title" content="Free Financial Calculators | Jeff Cline" />
        <meta property="og:description" content="15 free financial calculators for business owners, investors, and entrepreneurs." />
        <meta property="og:url" content="https://jeff-cline.com/calculators" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://jeff-cline.com/calculators" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Financial Calculators",
          description: "Free financial calculators for business and investment decisions",
          url: "https://jeff-cline.com/calculators",
          numberOfItems: calculators.length,
          itemListElement: calculators.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.title,
            url: `https://jeff-cline.com${c.href}`,
          })),
        }) }} />
      </head>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 20px" }}>
        <nav style={{ marginBottom: 24, fontSize: 14, color: "var(--text-muted)" }}>
          <Link href="/" style={{ color: "var(--orange)", textDecoration: "none" }}>Home</Link>
          <span style={{ margin: "0 8px" }}>›</span>
          <span>Calculators</span>
        </nav>

        <h1 style={{ fontSize: "2.4rem", fontWeight: 800, marginBottom: 8, color: "var(--text)" }}>
          Financial Calculators
        </h1>
        <p style={{ color: "var(--text-muted)", marginBottom: 48, fontSize: "1.1rem", maxWidth: 700 }}>
          Free tools to help you make smarter financial decisions. From mortgage amortization to business valuation — calculate, visualize, and plan with confidence.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 24,
        }}>
          {calculators.map((c) => (
            <Link key={c.href} href={c.href} style={{ textDecoration: "none" }}>
              <div style={{
                background: "var(--bg-card)",
                borderRadius: 12,
                padding: 28,
                border: "1px solid #333",
                transition: "border-color 0.2s, transform 0.2s",
                cursor: "pointer",
                height: "100%",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--orange)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#333"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{ fontSize: 32, marginBottom: 12 }}>{c.icon}</div>
                <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>{c.title}</h2>
                <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6, margin: 0 }}>{c.desc}</p>
                <div style={{ marginTop: 16, color: "var(--orange)", fontSize: 14, fontWeight: 600 }}>
                  Calculate →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
