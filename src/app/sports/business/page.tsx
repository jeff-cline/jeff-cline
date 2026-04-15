"use client";

export default function SportsBusinessPage() {
  const expenses = [
    {
      category: "Data & Intelligence Layer",
      items: [
        { name: "The Odds API (15M plan)", cost: 249, description: "70+ sports, 200+ books, real-time odds" },
        { name: "KenPom (NCAAB analytics)", cost: 2.08, description: "$24.95/yr for advanced college basketball data" },
        { name: "OddsJam Platinum (+EV finder)", cost: 199, description: "Professional arbitrage and value bet detection" },
        { name: "Unabated Edge+ (sharp lines, CLV)", cost: 99, description: "Closing line value and sharp money tracking" },
        { name: "Action Network PRO (bet %, sharp reports)", cost: 29.99, description: "$9.99/mo annual, betting percentages" },
        { name: "ESPN+ (BPI access)", cost: 11.99, description: "Basketball Power Index for model variance" },
        { name: "Dimers Pro", cost: 0, description: "Free tier sufficient for supplementary data" },
        { name: "SportsGameOdds API", cost: 99, description: "Backup odds feed, props coverage" }
      ],
      total: 690.06
    },
    {
      category: "Infrastructure",
      items: [
        { name: "Vultr VPS (current, shared)", cost: 0, description: "Already running jeff-cline.com infrastructure" },
        { name: "MongoDB Atlas (if scaling)", cost: 57, description: "M10 cluster for production workloads" },
        { name: "Vercel Pro (if migrating frontend)", cost: 20, description: "Enhanced performance and analytics" },
        { name: "Cloudflare Pro (WAF, CDN)", cost: 20, description: "Security and global content delivery" }
      ],
      total: 97
    },
    {
      category: "Communication & Delivery",
      items: [
        { name: "Twilio SMS (pick delivery)", cost: 150, description: "~5,000 SMS messages per month" },
        { name: "SendGrid (email delivery)", cost: 20, description: "40K emails/month for notifications" },
        { name: "Discord Bot hosting", cost: 0, description: "Already running on existing infrastructure" },
        { name: "Telegram Bot", cost: 0, description: "Free API, minimal hosting overhead" }
      ],
      total: 170
    },
    {
      category: "Payment Processing",
      items: [
        { name: "Stripe fees", cost: 1480, description: "2.9% + $0.30 per transaction on $50K MRR" }
      ],
      total: 1480
    },
    {
      category: "AI & Compute",
      items: [
        { name: "OpenClaw/Claude (pick generation)", cost: 0, description: "Already running on existing infrastructure" },
        { name: "GPT-4 API (Q&A for unlimited users)", cost: 100, description: "Estimated usage for premium features" }
      ],
      total: 100
    }
  ];

  const totalMonthlyExpenses = expenses.reduce((sum, category) => sum + category.total, 0);

  const revenueProjections = [
    { tier: "Free", users: 50, price: 0, revenue: 0, description: "Funnel users" },
    { tier: "Starter ($49)", users: 20, price: 49, revenue: 980, description: "Basic subscribers" },
    { tier: "Pro ($199)", users: 15, price: 199, revenue: 2985, description: "Core market" },
    { tier: "Elite ($499)", users: 5, price: 499, revenue: 2495, description: "Premium users" },
    { tier: "Unlimited ($999 annual)", users: 3, price: 999, revenue: 2997, description: "High-value annual" },
    { tier: "Unlimited ($1,500 monthly)", users: 2, price: 1500, revenue: 3000, description: "Premium monthly" }
  ];

  const totalMRR = revenueProjections.reduce((sum, tier) => sum + tier.revenue, 0);
  const monthlyProfit = totalMRR - totalMonthlyExpenses;
  const annualRunRate = monthlyProfit * 12;

  const breakEvenAnalysis = [
    { plan: "Pro subscribers", needed: Math.ceil(totalMonthlyExpenses / 199), description: "6 Pro subscribers" },
    { plan: "Unlimited subscribers", needed: Math.ceil(totalMonthlyExpenses / 999), description: "3 Unlimited subscribers" }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-12 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0a0a0a] to-black" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-[#FF8900]/5 to-[#DC2626]/5 rounded-full blur-[120px]" />
        
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF8900]/10 to-[#DC2626]/10 border border-[#FF8900]/20 rounded-full px-4 py-1.5 mb-6">
            <div className="w-2 h-2 rounded-full bg-[#FF8900] animate-pulse" />
            <span className="text-[#FF8900] text-xs font-bold uppercase tracking-wider">Investor Intelligence</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight">
            JC SPORTS
            <br />
            <span className="bg-gradient-to-r from-[#FF8900] to-[#DC2626] bg-clip-text text-transparent">
              BUSINESS PLAN
            </span>
          </h1>
          
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Full operating expenses, revenue projections, and financial model for our 
            picks-as-a-service sports intelligence platform.
          </p>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-[#111]/80 backdrop-blur border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-[#FF8900] mb-1">${totalMonthlyExpenses.toLocaleString()}</div>
              <div className="text-gray-400 text-xs uppercase tracking-wider">Monthly OpEx</div>
            </div>
            <div className="bg-[#111]/80 backdrop-blur border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-green-400 mb-1">${totalMRR.toLocaleString()}</div>
              <div className="text-gray-400 text-xs uppercase tracking-wider">Projected MRR</div>
            </div>
            <div className="bg-[#111]/80 backdrop-blur border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-blue-400 mb-1">${monthlyProfit.toLocaleString()}</div>
              <div className="text-gray-400 text-xs uppercase tracking-wider">Monthly Profit</div>
            </div>
            <div className="bg-[#111]/80 backdrop-blur border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-purple-400 mb-1">${annualRunRate.toLocaleString()}</div>
              <div className="text-gray-400 text-xs uppercase tracking-wider">Annual Run Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Operating Expenses Breakdown */}
      <section className="py-16 px-4 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-2 text-center">
            Monthly Operating Expenses
            <span className="text-[#FF8900]"> (Maximum Level)</span>
          </h2>
          <p className="text-gray-500 text-center mb-10">
            Full-scale operation with premium data feeds, enterprise infrastructure, and global delivery
          </p>

          <div className="space-y-8">
            {expenses.map((category, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-[#FF8900]/10 to-[#DC2626]/10 border-b border-white/10 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-white">{category.category}</h3>
                    <div className="text-right">
                      <div className="text-2xl font-black text-[#FF8900]">${category.total.toLocaleString()}</div>
                      <div className="text-gray-400 text-xs">per month</div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {category.items.map((item, j) => (
                      <div key={j} className="flex items-start justify-between py-3 border-b border-white/5 last:border-0">
                        <div className="flex-1">
                          <div className="text-white font-medium mb-1">{item.name}</div>
                          <div className="text-gray-400 text-sm">{item.description}</div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-white font-mono font-bold">
                            ${item.cost === 0 ? "0" : item.cost.toLocaleString()}
                          </div>
                          <div className="text-gray-500 text-xs">/mo</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total Summary */}
          <div className="mt-8 bg-gradient-to-r from-[#DC2626]/20 to-[#DC2626]/10 border-2 border-[#DC2626]/30 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-black text-white mb-4">Total Monthly Operating Cost</h3>
            <div className="text-5xl font-black text-[#DC2626] mb-4">${totalMonthlyExpenses.toLocaleString()}/mo</div>
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {breakEvenAnalysis.map((item, i) => (
                <div key={i} className="bg-black/20 rounded-xl p-4">
                  <div className="text-white font-bold text-lg">{item.description}</div>
                  <div className="text-gray-400 text-sm">breaks even</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Revenue Projections */}
      <section className="py-16 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-2 text-center">
            Revenue <span className="text-green-400">Projections</span>
          </h2>
          <p className="text-gray-500 text-center mb-10">
            Conservative estimates based on comparable SaaS penetration rates and market analysis
          </p>

          <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#1a1a1a] border-b border-white/10">
                    <th className="text-left px-6 py-4 text-gray-400 font-medium">Tier</th>
                    <th className="text-center px-6 py-4 text-gray-400 font-medium">Users</th>
                    <th className="text-center px-6 py-4 text-gray-400 font-medium">Price</th>
                    <th className="text-center px-6 py-4 text-gray-400 font-medium">Revenue</th>
                    <th className="text-left px-6 py-4 text-gray-400 font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {revenueProjections.map((tier, i) => (
                    <tr key={i} className={`border-b border-white/5 ${i % 2 === 0 ? "bg-[#111]" : "bg-[#0d0d0d]"}`}>
                      <td className="px-6 py-4">
                        <div className="text-white font-bold">{tier.tier}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="text-white font-mono">{tier.users}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="text-white font-mono">
                          ${tier.price === 0 ? "0" : tier.price.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className={`font-mono font-bold ${tier.revenue === 0 ? "text-gray-500" : "text-green-400"}`}>
                          ${tier.revenue.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-400 text-sm">{tier.description}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gradient-to-r from-green-500/10 to-green-500/5 border-t-2 border-green-500/30">
                    <td className="px-6 py-4">
                      <div className="text-white font-black text-lg">TOTAL MRR</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-white font-mono font-bold">
                        {revenueProjections.reduce((sum, tier) => sum + tier.users, 0)}
                      </div>
                    </td>
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-green-400 font-mono font-black text-xl">
                        ${totalMRR.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Profitability Summary */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 rounded-xl p-6 text-center">
              <div className="text-green-400 text-3xl font-black mb-2">${totalMRR.toLocaleString()}</div>
              <div className="text-white font-bold text-sm mb-1">Total MRR</div>
              <div className="text-gray-400 text-xs">Monthly Recurring Revenue</div>
            </div>

            <div className="bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20 rounded-xl p-6 text-center">
              <div className="text-red-400 text-3xl font-black mb-2">${totalMonthlyExpenses.toLocaleString()}</div>
              <div className="text-white font-bold text-sm mb-1">Monthly OpEx</div>
              <div className="text-gray-400 text-xs">Operating Expenses</div>
            </div>

            <div className="bg-gradient-to-br from-[#FF8900]/10 to-[#DC2626]/10 border border-[#FF8900]/20 rounded-xl p-6 text-center">
              <div className="text-[#FF8900] text-3xl font-black mb-2">${monthlyProfit.toLocaleString()}</div>
              <div className="text-white font-bold text-sm mb-1">Monthly Profit</div>
              <div className="text-gray-400 text-xs">{((monthlyProfit / totalMRR) * 100).toFixed(1)}% margin</div>
            </div>
          </div>

          {/* Annual Run Rate */}
          <div className="mt-8 bg-gradient-to-r from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-2xl p-8 text-center">
            <h3 className="text-white font-black text-xl mb-4">Annual Financial Projection</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="text-purple-400 text-4xl font-black mb-2">${annualRunRate.toLocaleString()}</div>
                <div className="text-white font-bold">Annual Run Rate</div>
                <div className="text-gray-400 text-sm">Based on current projections</div>
              </div>
              <div>
                <div className="text-purple-400 text-4xl font-black mb-2">{((monthlyProfit / totalMRR) * 100).toFixed(0)}%</div>
                <div className="text-white font-bold">Profit Margin</div>
                <div className="text-gray-400 text-sm">Highly scalable SaaS model</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Analysis & Assumptions */}
      <section className="py-16 px-4 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black mb-8 text-center">
            Key <span className="text-[#FF8900]">Assumptions</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#111] border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-bold text-lg mb-4">Market Dynamics</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span className="text-gray-300">US sports betting market: $7.5B in 2023, growing 15% annually</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span className="text-gray-300">Professional handicapping services: $500M+ market</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span className="text-gray-300">Our target: 0.02% market penetration for $12K MRR</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span className="text-gray-300">Conservative conversion rates: 2-5% free-to-paid</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-bold text-lg mb-4">Competitive Advantages</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-[#FF8900] mt-1">•</span>
                  <span className="text-gray-300">Real-time data aggregation from 200+ sources</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF8900] mt-1">•</span>
                  <span className="text-gray-300">AI-powered analysis vs manual handicapping</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF8900] mt-1">•</span>
                  <span className="text-gray-300">Transparent performance tracking & ROI</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF8900] mt-1">•</span>
                  <span className="text-gray-300">Credit-based pricing vs traditional subscriptions</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-bold text-lg mb-4">Growth Catalysts</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span className="text-gray-300">March Madness drives 40% of annual signups</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span className="text-gray-300">NFL season: September-February peak usage</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span className="text-gray-300">Referral program: 20% commission for influencers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span className="text-gray-300">API partnerships with betting platforms</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-bold text-lg mb-4">Risk Mitigation</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span className="text-gray-300">Multiple revenue streams: subscription + API</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span className="text-gray-300">Diversified sports coverage reduces seasonality</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span className="text-gray-300">Freemium model builds large user base</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span className="text-gray-300">Regulatory compliance across all legal states</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact/Investment CTA */}
      <section className="py-16 px-4 bg-black">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-4">
            Investment <span className="text-[#FF8900]">Opportunity</span>
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Seeking strategic partners and growth capital to accelerate market penetration 
            and scale our data infrastructure.
          </p>
          
          <div className="space-y-4">
            <a
              href="mailto:jeff@jeff-cline.com?subject=JC Sports Intelligence - Investment Inquiry"
              className="block bg-gradient-to-r from-[#FF8900] to-[#DC2626] text-white font-bold px-8 py-4 rounded-xl hover:opacity-90 transition-all text-lg"
            >
              Request Full Business Plan
            </a>
            <div className="text-gray-500 text-sm">
              <a href="tel:2234008146" className="text-white font-bold hover:text-[#FF8900] transition-colors">
                (223) 400-8146
              </a>
              <span className="mx-2">•</span>
              <a href="mailto:jeff@jeff-cline.com" className="text-white hover:text-[#FF8900] transition-colors">
                jeff@jeff-cline.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}