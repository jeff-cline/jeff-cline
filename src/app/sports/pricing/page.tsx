"use client";

import { useState } from "react";

export default function SportsPricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  
  const tiers = [
    {
      id: "free",
      name: "FREE",
      badge: "Loss Leader",
      price: "$0",
      description: "1 free pick per day (the \"Daily Free Pick\")",
      credits: "50 credits on signup",
      features: [
        "1 pick per day",
        "50 credits on signup", 
        "Basic dashboard access",
        "Email delivery",
      ],
      cta: "Get Started",
      href: "/sports/signup",
      popular: false,
      color: "border-gray-500/30",
      bgColor: "bg-gray-500/5",
      textColor: "text-gray-400"
    },
    {
      id: "starter",
      name: "STARTER",
      badge: "$49/mo",
      price: "$49",
      description: "Perfect for casual bettors",
      credits: "100 credits/month",
      features: [
        "100 credits/month",
        "3 picks per day",
        "All sports covered",
        "Email delivery",
        "Basic analytics"
      ],
      cta: "Start Now",
      href: "/api/sports/checkout?plan=starter",
      popular: false,
      color: "border-blue-500/30",
      bgColor: "bg-blue-500/5",
      textColor: "text-blue-400"
    },
    {
      id: "pro",
      name: "PRO",
      badge: "MOST POPULAR",
      price: "$199",
      description: "Unlimited daily picks",
      credits: "500 credits/month",
      features: [
        "500 credits/month",
        "Unlimited daily picks", 
        "All sports + props",
        "SMS + Email delivery",
        "Line movement alerts",
        "ROI tracking dashboard"
      ],
      cta: "Go Pro",
      href: "/api/sports/checkout?plan=pro",
      popular: true,
      color: "border-[#FF8900]/40",
      bgColor: "bg-[#FF8900]/10",
      textColor: "text-[#FF8900]"
    },
    {
      id: "elite",
      name: "ELITE",
      badge: "$499/mo",
      price: "$499",
      description: "Everything in Pro plus premium features",
      credits: "2,000 credits/month",
      features: [
        "2,000 credits/month",
        "Everything in Pro",
        "1-on-1 strategy calls (monthly)",
        "Priority Telegram/Discord alerts",
        "Custom bet sizing recommendations",
        "Early access to new models"
      ],
      cta: "Go Elite",
      href: "/api/sports/checkout?plan=elite",
      popular: false,
      color: "border-purple-500/30",
      bgColor: "bg-purple-500/5",
      textColor: "text-purple-400"
    },
    {
      id: "unlimited",
      name: "UNLIMITED",
      badge: billingCycle === "annual" ? "$999/mo" : "$1,500/mo",
      price: billingCycle === "annual" ? "$999" : "$1,500",
      description: billingCycle === "annual" ? "Prepaid 12-month" : "Month-to-month",
      credits: "Unlimited credits",
      features: [
        "Unlimited credits",
        "Everything in Elite",
        "AI Q&A assistant (ask questions about any game)",
        "Personal bankroll management",
        "Arbitrage alerts",
        "White-label API access",
        "Dedicated account manager"
      ],
      cta: "Go Unlimited",
      href: `/api/sports/checkout?plan=unlimited${billingCycle === "annual" ? "&billing=annual" : ""}`,
      popular: false,
      color: "border-[#DC2626]/40",
      bgColor: "bg-[#DC2626]/10",
      textColor: "text-[#DC2626]"
    }
  ];

  const faqs = [
    {
      question: "What is a credit?",
      answer: "1 credit = 1 pick. Each pick you consume costs 1 credit. Unused credits roll over for 30 days."
    },
    {
      question: "Can I change plans anytime?",
      answer: "Yes! You can upgrade or downgrade at any time. Changes take effect immediately and you'll be prorated."
    },
    {
      question: "What sports are covered?",
      answer: "All major US sports (NFL, NBA, MLB, NHL, NCAAF, NCAAB) plus international soccer, UFC, tennis, golf, and more."
    },
    {
      question: "How accurate are the picks?",
      answer: "Our models maintain 55-58% win rates long-term. We track all performance publicly on the dashboard."
    },
    {
      question: "Do unused credits expire?",
      answer: "Credits roll over for 30 days. After 30 days of inactivity, unused credits expire."
    },
    {
      question: "Is there a free trial?",
      answer: "New users get 50 free credits to try the service. No credit card required for the free tier."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-12 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0a0a0a] to-black" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#FF8900]/5 rounded-full blur-[120px]" />
        
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#FF8900]/10 border border-[#FF8900]/20 rounded-full px-4 py-1.5 mb-6">
            <div className="w-2 h-2 rounded-full bg-[#FF8900] animate-pulse" />
            <span className="text-[#FF8900] text-xs font-bold uppercase tracking-wider">Professional Sports Intelligence</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black mb-4">
            CHOOSE YOUR
            <br />
            <span className="bg-gradient-to-r from-[#FF8900] to-[#DC2626] bg-clip-text text-transparent">
              EDGE
            </span>
          </h1>
          
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            From free daily picks to unlimited premium intelligence. Find the plan that fits your betting strategy.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm ${billingCycle === "monthly" ? "text-white" : "text-gray-500"}`}>Monthly</span>
            <button
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")}
              className="relative w-14 h-8 bg-[#1a1a1a] border border-white/10 rounded-full transition-all"
            >
              <div className={`absolute top-1 left-1 w-6 h-6 bg-[#FF8900] rounded-full transition-transform ${billingCycle === "annual" ? "translate-x-6" : ""}`} />
            </button>
            <span className={`text-sm ${billingCycle === "annual" ? "text-white" : "text-gray-500"}`}>Annual</span>
            <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded border border-green-500/30">
              Save 33%
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-12 px-4 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {tiers.map((tier, index) => (
              <div
                key={tier.id}
                className={`relative bg-[#111] border-2 rounded-2xl p-6 transition-all hover:scale-105 hover:border-[#FF8900]/40 ${
                  tier.popular 
                    ? "border-[#FF8900]/40 shadow-lg shadow-[#FF8900]/10" 
                    : tier.color
                }`}
              >
                {/* Popular Badge */}
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-[#FF8900] to-[#DC2626] text-white text-xs font-bold px-4 py-1 rounded-full">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-black mb-1">{tier.name}</h3>
                  <div className="text-4xl font-black mb-2">
                    <span className={tier.popular ? "text-[#FF8900]" : "text-white"}>
                      {tier.price}
                    </span>
                    {tier.price !== "$0" && <span className="text-gray-500 text-lg">/mo</span>}
                  </div>
                  <p className="text-gray-400 text-sm">{tier.description}</p>
                  <div className={`text-xs font-bold mt-2 px-2 py-1 rounded ${
                    tier.popular ? "bg-[#FF8900]/20 text-[#FF8900]" : "bg-white/5 text-gray-400"
                  }`}>
                    {tier.credits}
                  </div>
                </div>

                <ul className="space-y-3 mb-8 min-h-[160px]">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-green-400 mt-0.5">✓</span>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={tier.href}
                  className={`block w-full text-center py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all ${
                    tier.popular
                      ? "bg-gradient-to-r from-[#FF8900] to-[#DC2626] text-white hover:opacity-90"
                      : tier.id === "free"
                      ? "bg-white/10 text-white hover:bg-white/20"
                      : "bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10"
                  }`}
                >
                  {tier.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Credit Explainer */}
      <section className="py-12 px-4 bg-black">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#111] border border-white/5 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-black mb-4">How Credits Work</h3>
            <p className="text-gray-400 text-lg mb-6">
              <strong className="text-[#FF8900]">1 credit = 1 pick.</strong> Each sports pick you consume costs 1 credit.
              Unused credits roll over for 30 days, so you never lose value.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-4">
                <div className="text-[#FF8900] text-2xl font-bold mb-2">50</div>
                <div className="text-white font-bold text-sm">Free Tier Credits</div>
                <div className="text-gray-500 text-xs">1 pick per day for 50 days</div>
              </div>
              <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-4">
                <div className="text-[#FF8900] text-2xl font-bold mb-2">500</div>
                <div className="text-white font-bold text-sm">Pro Tier Credits</div>
                <div className="text-gray-500 text-xs">Unlimited daily access</div>
              </div>
              <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-4">
                <div className="text-[#FF8900] text-2xl font-bold mb-2">∞</div>
                <div className="text-white font-bold text-sm">Unlimited Tier</div>
                <div className="text-gray-500 text-xs">No credit limits ever</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black mb-8 text-center">
            Frequently Asked <span className="text-[#FF8900]">Questions</span>
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details key={i} className="group bg-[#111] border border-white/5 rounded-xl">
                <summary className="px-6 py-4 cursor-pointer text-white font-medium text-sm flex justify-between items-center hover:text-[#FF8900] transition-colors list-none">
                  {faq.question}
                  <span className="text-gray-600 group-open:rotate-45 transition-transform text-lg">+</span>
                </summary>
                <div className="px-6 pb-4 text-gray-400 text-sm leading-relaxed">{faq.answer}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 px-4 bg-black">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-4">
            Need a Custom Plan?
          </h2>
          <p className="text-gray-400 mb-8">
            High-volume bettors, syndicates, and enterprise clients get custom pricing and white-label solutions.
          </p>
          <a
            href="mailto:jeff@jeff-cline.com"
            className="inline-block bg-gradient-to-r from-[#FF8900] to-[#DC2626] text-white font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-all"
          >
            Contact Sales
          </a>
          <div className="mt-6">
            <a
              href="tel:2234008146"
              className="text-white font-bold text-xl hover:text-[#FF8900] transition-colors"
            >
              (223) 400-8146
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}