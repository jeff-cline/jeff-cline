"use client";
import { useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function InvestPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", amount: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/sports/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          source: "jeff-cline.com/invest",
          leadType: "sports-fund-investor",
          investmentAmount: formData.amount,
        }),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    }
    setLoading(false);
  }

  const stats = [
    { label: "Target Weekly Return", value: "5-10%", note: "Compounding weekly" },
    { label: "Annual Target", value: "260-520%", note: "On invested capital" },
    { label: "Max Drawdown Cap", value: "15%", note: "Hard stop, principal protected" },
    { label: "Profit Split", value: "70/30", note: "70% investor, 30% manager" },
  ];

  const edges = [
    { stat: "56.4%", label: "11-Seed ATS Cover Rate", desc: "Most profitable seed in 40 years of March Madness data" },
    { stat: "63.9%", label: "NHL Home Underdogs ATS", desc: "2025-26 season cover rate -- market consistently undervalues home ice" },
    { stat: "58.2%", label: "BPI Divergence Plays", desc: "When ESPN's model disagrees with the line by 3+ points" },
    { stat: "56.0%", label: "NBA Rest Advantage", desc: "Teams on 2+ days rest vs back-to-back opponents" },
    { stat: "73.9%", label: "NHL Bounce-Back Dogs", desc: "Away underdogs after a 2+ goal loss -- last 14 days" },
    { stat: "53.9%", label: "12-Seed ATS Cover Rate", desc: "Public overvalues 5-seeds creating consistent underdog value" },
  ];

  const schedule = [
    { day: "Monday", focus: "NBA + NHL", strategy: "Sharp line capture, rest advantages", edge: "56.0%" },
    { day: "Tuesday", focus: "NBA + NHL", strategy: "Road underdogs, bounce-back spots", edge: "54.2%" },
    { day: "Wednesday", focus: "NBA + NHL", strategy: "Totals inefficiencies, arb scanning", edge: "57.1%" },
    { day: "Thursday", focus: "NBA + Props", strategy: "Player props, correlated parlays", edge: "55.8%" },
    { day: "Friday", focus: "NCAAB + NHL", strategy: "Weekend setup, early line capture", edge: "56.4%" },
    { day: "Saturday", focus: "All Sports", strategy: "Big board, seed trends, public fade", edge: "55.3%" },
    { day: "Sunday", focus: "NFL + Settlement", strategy: "Settlement, compound, weekly report", edge: "54.7%" },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Sports Intelligence Fund", href: "/invest" }]} />

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#1a0a00] to-black" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#FF8900]/5 rounded-full blur-[150px] -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#DC2626]/5 rounded-full blur-[120px] translate-y-1/2" />

        <div className="relative max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#FF8900]/10 border border-[#FF8900]/20 rounded-full px-4 py-1.5 mb-8">
            <div className="w-2 h-2 rounded-full bg-[#FF8900] animate-pulse" />
            <span className="text-[#FF8900] text-xs font-bold uppercase tracking-wider">Now Accepting Qualified Investors</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-[1.05] mb-6">
            Data-Driven<br />
            <span className="bg-gradient-to-r from-[#FF8900] to-[#DC2626] bg-clip-text text-transparent">Sports Intelligence</span><br />
            Fund
          </h1>

          <p className="text-gray-400 text-xl max-w-2xl mb-10 leading-relaxed">
            Quantitative sports analytics delivering 5-10% weekly returns through algorithmic edge detection,
            multi-book arbitrage, and Kelly Criterion bankroll optimization.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {stats.map((s, i) => (
              <div key={i} className="bg-[#111] border border-[#FF8900]/10 rounded-2xl p-5 text-center">
                <div className="text-gray-500 text-[10px] uppercase tracking-wider font-bold mb-2">{s.label}</div>
                <div className="text-4xl font-black bg-gradient-to-r from-[#FF8900] to-[#DC2626] bg-clip-text text-transparent">{s.value}</div>
                <div className="text-gray-600 text-xs mt-1">{s.note}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            <a
              href="/JC-Sports-Intelligence-Investor-Deck.pdf"
              target="_blank"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF8900] to-[#DC2626] text-white font-bold px-8 py-4 rounded-xl text-lg hover:opacity-90 transition-opacity"
            >
              Download Investor Deck (PDF)
            </a>
            <a
              href="#apply"
              className="inline-flex items-center gap-2 bg-[#111] border border-white/10 text-white font-bold px-8 py-4 rounded-xl text-lg hover:border-[#FF8900]/30 transition-colors"
            >
              Apply to Invest
            </a>
            <a
              href="/sports"
              className="inline-flex items-center gap-2 bg-[#111] border border-white/10 text-gray-400 font-bold px-8 py-4 rounded-xl text-lg hover:border-green-500/30 hover:text-green-400 transition-colors"
            >
              View Live Dashboard
            </a>
          </div>
        </div>
      </section>

      {/* The Edge */}
      <section className="py-16 px-4 bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4">The Statistical <span className="text-[#FF8900]">Edge</span></h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Sports betting markets are inefficient. Public money inflates favorites.
              Our AI system exploits these inefficiencies using 40 years of data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {edges.map((e, i) => (
              <div key={i} className="bg-[#111] border border-white/5 rounded-2xl p-6 hover:border-[#FF8900]/20 transition-colors">
                <div className="text-4xl font-black text-[#FF8900] mb-2">{e.stat}</div>
                <div className="text-white font-bold text-sm mb-2">{e.label}</div>
                <div className="text-gray-500 text-sm leading-relaxed">{e.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Three Layers */}
      <section className="py-16 px-4 bg-black">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-black mb-12 text-center">Three-Layer <span className="text-[#FF8900]">Protection</span></h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-b from-[#FF8900]/10 to-transparent border border-[#FF8900]/20 rounded-2xl p-8">
              <div className="text-[#FF8900] text-sm font-bold uppercase tracking-wider mb-3">Layer 1</div>
              <h3 className="text-2xl font-black mb-4">Kelly Criterion</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Every bet is sized using Quarter Kelly -- mathematically optimizes growth while limiting risk to 1-5% per wager.
                Reduces variance by 75% vs full Kelly while retaining 50% of growth rate.
              </p>
              <div className="bg-black/50 rounded-xl p-3 font-mono text-xs text-[#FF8900]">
                f* = (bp - q) / b / 4
              </div>
            </div>

            <div className="bg-gradient-to-b from-[#DC2626]/10 to-transparent border border-[#DC2626]/20 rounded-2xl p-8">
              <div className="text-[#DC2626] text-sm font-bold uppercase tracking-wider mb-3">Layer 2</div>
              <h3 className="text-2xl font-black mb-4">Fibonacci Recovery</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                After losses, stakes scale up methodically: 1, 1, 2, 3, 5, 8 units. Any win drops back 2 levels.
                Hard cap at level 5. 94% probability of recovery within 5 bets at our edge.
              </p>
              <div className="bg-black/50 rounded-xl p-3 font-mono text-xs text-[#DC2626]">
                Max drawdown: 8% of bankroll
              </div>
            </div>

            <div className="bg-gradient-to-b from-[#22C55E]/10 to-transparent border border-[#22C55E]/20 rounded-2xl p-8">
              <div className="text-[#22C55E] text-sm font-bold uppercase tracking-wider mb-3">Layer 3</div>
              <h3 className="text-2xl font-black mb-4">Parlay Laddering</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Only compound with house money. 50% of winnings roll into correlated 2-3 leg parlays.
                Adds 2-4% additional weekly return on winning weeks with zero additional risk to principal.
              </p>
              <div className="bg-black/50 rounded-xl p-3 font-mono text-xs text-[#22C55E]">
                Principal never at risk
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Schedule */}
      <section className="py-16 px-4 bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-black mb-8 text-center">Weekly Operating <span className="text-[#FF8900]">Schedule</span></h2>

          <div className="space-y-2">
            {schedule.map((s, i) => (
              <div key={i} className="bg-[#111] border border-white/5 rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-3 hover:border-[#FF8900]/10 transition-colors">
                <div className="w-28">
                  <span className="text-[#FF8900] font-black text-lg">{s.day}</span>
                </div>
                <div className="w-32">
                  <span className="text-gray-400 text-sm">{s.focus}</span>
                </div>
                <div className="flex-1">
                  <span className="text-white text-sm">{s.strategy}</span>
                </div>
                <div className="w-20 text-right">
                  <span className="text-[#22C55E] font-bold font-mono">{s.edge}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projections */}
      <section className="py-16 px-4 bg-black">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-black mb-4 text-center">$100K Bankroll <span className="text-[#22C55E]">Projections</span></h2>
          <p className="text-gray-500 text-center mb-10">Conservative, target, and aggressive scenarios with 50% profit reinvestment</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-[#111] border border-white/5 rounded-2xl p-8 text-center">
              <div className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-2">Conservative (5%/wk)</div>
              <div className="text-5xl font-black text-[#22C55E] mb-2">$260K</div>
              <div className="text-gray-600 text-sm">Year 1 total value</div>
              <div className="text-gray-500 text-xs mt-2">+$160K profit on $100K invested</div>
            </div>
            <div className="bg-[#111] border border-[#FF8900]/20 rounded-2xl p-8 text-center relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FF8900] text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">Target</div>
              <div className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-2">Target (7.5%/wk)</div>
              <div className="text-5xl font-black text-[#FF8900] mb-2">$390K</div>
              <div className="text-gray-600 text-sm">Year 1 total value</div>
              <div className="text-gray-500 text-xs mt-2">+$290K profit on $100K invested</div>
            </div>
            <div className="bg-[#111] border border-white/5 rounded-2xl p-8 text-center">
              <div className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-2">Aggressive (10%/wk)</div>
              <div className="text-5xl font-black text-[#22C55E] mb-2">$520K</div>
              <div className="text-gray-600 text-sm">Year 1 total value</div>
              <div className="text-gray-500 text-xs mt-2">+$420K profit on $100K invested</div>
            </div>
          </div>

          <div className="bg-[#111] border border-[#DC2626]/20 rounded-2xl p-6 text-center max-w-md mx-auto">
            <div className="text-[#DC2626] text-xs uppercase tracking-wider font-bold mb-2">Max Drawdown Protection</div>
            <div className="text-3xl font-black text-white mb-1">15% Hard Cap</div>
            <div className="text-gray-500 text-sm">Manager absorbs first 5% from personal capital. All activity pauses at 15%.</div>
          </div>
        </div>
      </section>

      {/* Terms */}
      <section className="py-16 px-4 bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-black mb-8 text-center">Investment <span className="text-[#FF8900]">Terms</span></h2>

          <div className="space-y-3">
            {[
              ["Minimum Investment", "$100,000"],
              ["Target Weekly Return", "5-10% ($5,000-$10,000/week)"],
              ["Profit Split", "70% Investor / 30% Manager"],
              ["Management Fee", "None -- manager paid only on profits"],
              ["Loss Protection", "Manager absorbs first 5% of drawdown"],
              ["Max Drawdown", "15% hard cap -- all activity pauses"],
              ["Withdrawal", "Weekly liquidity, 48-hour notice, via ACH"],
              ["Reporting", "Real-time dashboard + weekly PDF + monthly letter"],
              ["Term", "Rolling 90-day periods, 7-day exit notice"],
              ["Audit Rights", "Full access to all bet history and P&L at any time"],
            ].map(([label, value], i) => (
              <div key={i} className="bg-[#111] border border-white/5 rounded-xl px-6 py-4 flex justify-between items-center">
                <span className="text-gray-400 font-medium">{label}</span>
                <span className="text-white font-bold text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Proof */}
      <section className="py-16 px-4 bg-black">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-4">See It <span className="text-[#22C55E]">Live</span></h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Our platform is live right now with real money deployed on NCAA Tournament games.
            Full transparency -- every pick, every result, every dollar tracked in real-time.
          </p>
          <a
            href="/sports"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white font-bold px-10 py-5 rounded-xl text-xl hover:opacity-90 transition-opacity"
          >
            View Live Dashboard
          </a>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="py-16 px-4 bg-[#0a0a0a]">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-black mb-4 text-center">Apply to <span className="text-[#FF8900]">Invest</span></h2>
          <p className="text-gray-400 text-center mb-8">Submit your interest and we&apos;ll send the full prospectus and contract.</p>

          {submitted ? (
            <div className="bg-[#111] border border-[#22C55E]/30 rounded-2xl p-8 text-center">
              <div className="text-[#22C55E] text-4xl mb-4 font-black">Application Received</div>
              <p className="text-gray-400">We&apos;ll be in touch within 24 hours with the full prospectus, contract, and ACH authorization form.</p>
              <p className="text-gray-500 text-sm mt-4">In the meantime, review the live dashboard at <a href="/sports" className="text-[#FF8900] underline">jeff-cline.com/sports</a></p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-500 text-xs uppercase tracking-wider font-bold mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-[#FF8900]/50 focus:outline-none transition-colors"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 text-xs uppercase tracking-wider font-bold mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-[#FF8900]/50 focus:outline-none transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-500 text-xs uppercase tracking-wider font-bold mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-[#FF8900]/50 focus:outline-none transition-colors"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 text-xs uppercase tracking-wider font-bold mb-2">Investment Amount</label>
                  <select
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF8900]/50 focus:outline-none transition-colors"
                  >
                    <option value="">Select amount</option>
                    <option value="100000">$100,000</option>
                    <option value="250000">$250,000</option>
                    <option value="500000">$500,000</option>
                    <option value="1000000">$1,000,000+</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-gray-500 text-xs uppercase tracking-wider font-bold mb-2">Message (Optional)</label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-[#FF8900]/50 focus:outline-none transition-colors resize-none"
                  placeholder="Any questions or specific interests..."
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#FF8900] to-[#DC2626] text-white font-black py-4 rounded-xl text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
              <p className="text-gray-600 text-xs text-center">
                By submitting, you agree to receive the investor prospectus and related communications.
                Your information is kept strictly confidential.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-12 px-4 bg-gradient-to-r from-[#FF8900]/10 to-[#DC2626]/10 border-t border-[#FF8900]/10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex flex-wrap justify-center gap-8 mb-6">
            <div>
              <div className="text-gray-500 text-xs uppercase tracking-wider">Phone</div>
              <div className="text-white font-bold text-lg">(223) 400-8146</div>
            </div>
            <div>
              <div className="text-gray-500 text-xs uppercase tracking-wider">Email</div>
              <div className="text-white font-bold text-lg">jeff.cline@me.com</div>
            </div>
            <div>
              <div className="text-gray-500 text-xs uppercase tracking-wider">Dashboard</div>
              <a href="/sports" className="text-[#FF8900] font-bold text-lg">jeff-cline.com/sports</a>
            </div>
          </div>
          <a
            href="/JC-Sports-Intelligence-Investor-Deck.pdf"
            target="_blank"
            className="inline-flex items-center gap-2 bg-white text-black font-black px-8 py-4 rounded-xl text-lg hover:bg-gray-100 transition-colors"
          >
            Download Full Investor Deck (PDF)
          </a>
          <p className="text-gray-600 text-xs mt-6 max-w-xl mx-auto">
            Past performance and historical statistical trends do not guarantee future results.
            Sports wagering involves substantial risk. This is not a registered securities offering.
            Consult a qualified financial advisor before investing.
          </p>
        </div>
      </section>
    </div>
  );
}
