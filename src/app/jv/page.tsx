"use client";

import { useState } from "react";

const ORANGE = "#F97316";
const BG = "#0A1628";
const BG_CARD = "#0F1D32";
const BG_CARD_HOVER = "#132440";
const TEXT = "#E2E8F0";
const TEXT_DIM = "#94A3B8";

const PILLARS = [
  { name: "SCALE", desc: "Technology that scales operations beyond human capacity" },
  { name: "COST REDUCTION", desc: "Technology that reduces operating costs dramatically" },
  { name: "RISK REDUCTION", desc: "Technology that reduces risk through automation and intelligence" },
  { name: "OPTIMIZATION", desc: "Technology that optimizes current operations for peak performance" },
  { name: "PREDICTIVE AI", desc: "Technology that leverages predictive AI to automate the entire process" },
];

const SAAS_PRODUCTS = [
  {
    name: "VoiceDrips.com",
    desc: "Branded white label reseller package. AI-powered voice drip campaigns that nurture leads and close deals on autopilot.",
    price: "$200 - $32,500/mo",
    commission: "25% for life of paying customer over redline",
    key: "voicedrips",
  },
  {
    name: "Kreeper.ai",
    desc: "AI-powered found leads platform. Identifies and delivers high-intent prospects your competitors don't even know exist.",
    price: "$1,500/mo",
    commission: "25% for life of paying customer",
    key: "kreeper",
  },
  {
    name: "IntentTriggers.com",
    desc: "Intent data and trigger-based lead intelligence. Know exactly when prospects are ready to buy before they raise their hand.",
    price: "Custom pricing",
    commission: "25% for life",
    key: "intenttriggers",
  },
  {
    name: "MoneyWords.org",
    desc: "Keyword intelligence and SEO data platform. Find the exact words that drive revenue in any niche.",
    price: "Custom pricing",
    commission: "25% for life",
    key: "moneywords",
  },
  {
    name: "Niche Platform Fast Start",
    desc: "Multi-level niche platform portals. Turnkey branded platforms deployed in your vertical with built-in monetization.",
    price: "Custom pricing",
    commission: "25% for life",
    key: "nicheplatform",
  },
];

const CUSTOM_PRODUCTS = [
  {
    name: "Agents.biz",
    desc: "Custom AI agency workforce. Purpose-built AI agents that handle real business tasks -- sales, support, operations, and more.",
    price: "$750 - $1,500 per custom agent",
    commission: "6% referral for selling and servicing",
    key: "agents",
  },
  {
    name: "Keyword Calls",
    desc: "Pay-per-call bidding platform. Monetize high-intent phone calls in any vertical with precision targeting.",
    price: "Performance-based",
    commission: "6% for sales and service of client",
    key: "keywordcalls",
  },
  {
    name: "Fast Start Program",
    desc: "Custom platform development. Full-stack build-out including all tools for the first 90 days with the goal of cost acquisition and leverage to scale.",
    price: "~$35k (quote-based)",
    commission: "6% (includes all tools for first 90 days)",
    key: "faststart",
  },
];

const STEPS = [
  "Apply to become a JV Partner",
  "Get your unique tracking link + optional white-label landing page",
  "Share with your network",
  "Earn commission for the life of every customer you bring in",
  "Get paid 30 days after payment received",
];

export default function JVPage() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    company: "",
    website: "",
    referralSource: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/jv/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Joint Venture Partner Program",
            description:
              "White-labeled, branded lead-generating portals that create revenue and mailbox money for the life of the customer.",
            url: "https://jeff-cline.com/jv",
            publisher: {
              "@type": "Organization",
              name: "Jeff Cline",
              url: "https://jeff-cline.com",
            },
            offers: {
              "@type": "Offer",
              description: "JV Partner Program - Earn 25% commission for life on SaaS products",
              category: "Affiliate/JV Partnership",
            },
          }),
        }}
      />

      <div style={{ backgroundColor: BG, color: TEXT, minHeight: "100vh" }}>
        {/* Hero */}
        <section
          className="relative overflow-hidden"
          style={{ padding: "120px 24px 80px" }}
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{
              background: `radial-gradient(ellipse at 50% 0%, ${ORANGE}33, transparent 70%)`,
            }}
          />
          <div className="relative max-w-5xl mx-auto text-center">
            <h1
              className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
              style={{ color: "#FFFFFF" }}
            >
              Joint Venture Partner Program
            </h1>
            <p
              className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed"
              style={{ color: TEXT_DIM }}
            >
              White-labeled, branded lead-generating portals that create revenue
              and mailbox money for the life of the customer
            </p>
            <div
              className="flex flex-wrap justify-center gap-4 mb-10 text-sm"
              style={{ color: TEXT_DIM }}
            >
              {[
                "Scale Operations",
                "Reduce Costs",
                "Reduce Risk",
                "Create New Revenue",
                "Deal Flow at Scale",
              ].map((item) => (
                <span
                  key={item}
                  className="px-4 py-2 rounded-full border"
                  style={{ borderColor: `${ORANGE}44` }}
                >
                  {item}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => {
                  const el = document.getElementById("apply");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105 cursor-pointer"
                style={{ backgroundColor: ORANGE, color: "#FFFFFF" }}
              >
                Apply Now
              </button>
              <a
                href="/jvdashboard"
                className="px-8 py-4 rounded-lg font-semibold text-lg border transition-all hover:scale-105"
                style={{ borderColor: ORANGE, color: ORANGE }}
              >
                Partner Login
              </a>
            </div>
          </div>
        </section>

        {/* Thesis */}
        <section style={{ padding: "80px 24px", backgroundColor: BG_CARD }}>
          <div className="max-w-5xl mx-auto">
            <h2
              className="text-3xl md:text-4xl font-bold text-center mb-4"
              style={{ color: "#FFFFFF" }}
            >
              Every Industry is a Geek Away from Being Uberized
            </h2>
            <p
              className="text-center mb-12 text-lg"
              style={{ color: TEXT_DIM }}
            >
              Five technology pillars that transform any business
            </p>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {PILLARS.map((p, i) => (
                <div
                  key={p.name}
                  className="text-center p-6 rounded-xl transition-all hover:scale-105"
                  style={{ backgroundColor: BG }}
                >
                  <div
                    className="text-3xl font-bold mb-2"
                    style={{ color: ORANGE }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3
                    className="font-bold text-sm mb-2 tracking-wider"
                    style={{ color: "#FFFFFF" }}
                  >
                    {p.name}
                  </h3>
                  <p className="text-xs" style={{ color: TEXT_DIM }}>
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SaaS Products - 25% Commission */}
        <section style={{ padding: "80px 24px" }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span
                className="inline-block px-4 py-1 rounded-full text-sm font-bold mb-4"
                style={{ backgroundColor: `${ORANGE}22`, color: ORANGE }}
              >
                PREMIUM TIER
              </span>
              <h2
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ color: "#FFFFFF" }}
              >
                SaaS Products -- 25% Commission for Life
              </h2>
              <p style={{ color: TEXT_DIM }}>
                Recurring revenue on every customer you bring in, for as long as
                they stay
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SAAS_PRODUCTS.map((product) => (
                <div
                  key={product.key}
                  className="p-6 rounded-xl border transition-all hover:border-orange-500"
                  style={{
                    backgroundColor: BG_CARD,
                    borderColor: `${ORANGE}22`,
                  }}
                >
                  <h3
                    className="text-xl font-bold mb-2"
                    style={{ color: "#FFFFFF" }}
                  >
                    {product.name}
                  </h3>
                  <p
                    className="text-sm mb-4 leading-relaxed"
                    style={{ color: TEXT_DIM }}
                  >
                    {product.desc}
                  </p>
                  <div
                    className="text-sm font-semibold mb-1"
                    style={{ color: ORANGE }}
                  >
                    {product.price}
                  </div>
                  <div
                    className="text-xs font-medium px-3 py-1 rounded-full inline-block mt-2"
                    style={{ backgroundColor: `${ORANGE}22`, color: ORANGE }}
                  >
                    {product.commission}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Custom Products - 6% Commission */}
        <section style={{ padding: "80px 24px", backgroundColor: BG_CARD }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span
                className="inline-block px-4 py-1 rounded-full text-sm font-bold mb-4"
                style={{ backgroundColor: `${ORANGE}11`, color: TEXT_DIM }}
              >
                CUSTOM TIER
              </span>
              <h2
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ color: "#FFFFFF" }}
              >
                Custom Products -- 6% Commission
              </h2>
              <p style={{ color: TEXT_DIM }}>
                High-ticket custom solutions with strong referral payouts
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {CUSTOM_PRODUCTS.map((product) => (
                <div
                  key={product.key}
                  className="p-6 rounded-xl border transition-all hover:border-orange-500"
                  style={{
                    backgroundColor: BG,
                    borderColor: `${TEXT_DIM}22`,
                  }}
                >
                  <h3
                    className="text-xl font-bold mb-2"
                    style={{ color: "#FFFFFF" }}
                  >
                    {product.name}
                  </h3>
                  <p
                    className="text-sm mb-4 leading-relaxed"
                    style={{ color: TEXT_DIM }}
                  >
                    {product.desc}
                  </p>
                  <div
                    className="text-sm font-semibold mb-1"
                    style={{ color: TEXT }}
                  >
                    {product.price}
                  </div>
                  <div
                    className="text-xs mt-2"
                    style={{ color: TEXT_DIM }}
                  >
                    {product.commission}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Redline Explainer */}
        <section style={{ padding: "60px 24px" }}>
          <div
            className="max-w-3xl mx-auto p-8 rounded-xl border"
            style={{ backgroundColor: BG_CARD, borderColor: `${ORANGE}22` }}
          >
            <h3
              className="text-lg font-bold mb-3"
              style={{ color: ORANGE }}
            >
              What is the Redline?
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: TEXT_DIM }}>
              The redline is the cost to provide the service including
              development, backend costs, developers, programmers, staff,
              technology licenses, and overall expenses. JV partners earn
              commission on revenue above the redline. This ensures sustainable
              partnerships where everyone profits from growth.
            </p>
          </div>
        </section>

        {/* How It Works */}
        <section style={{ padding: "80px 24px", backgroundColor: BG_CARD }}>
          <div className="max-w-4xl mx-auto">
            <h2
              className="text-3xl md:text-4xl font-bold text-center mb-12"
              style={{ color: "#FFFFFF" }}
            >
              How It Works
            </h2>
            <div className="space-y-6">
              {STEPS.map((step, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                    style={{ backgroundColor: ORANGE, color: "#FFFFFF" }}
                  >
                    {i + 1}
                  </div>
                  <p
                    className="text-lg pt-1.5"
                    style={{ color: TEXT }}
                  >
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA / Apply Section */}
        <section id="apply" style={{ padding: "80px 24px" }}>
          <div className="max-w-2xl mx-auto text-center">
            {!showForm && !submitted && (
              <>
                <h2
                  className="text-3xl md:text-4xl font-bold mb-4"
                  style={{ color: "#FFFFFF" }}
                >
                  Ready to Build Passive Revenue?
                </h2>
                <p className="mb-8 text-lg" style={{ color: TEXT_DIM }}>
                  Apply to become a JV Partner and start earning commission for
                  life on every customer you refer.
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="px-10 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105 cursor-pointer"
                  style={{ backgroundColor: ORANGE, color: "#FFFFFF" }}
                >
                  Apply to Partner Program
                </button>
              </>
            )}

            {showForm && !submitted && (
              <div
                className="p-8 rounded-2xl border text-left"
                style={{ backgroundColor: BG_CARD, borderColor: `${ORANGE}33` }}
              >
                <h3
                  className="text-2xl font-bold mb-6 text-center"
                  style={{ color: "#FFFFFF" }}
                >
                  JV Partner Application
                </h3>
                {error && (
                  <div
                    className="mb-4 p-3 rounded-lg text-sm text-center"
                    style={{ backgroundColor: "#7F1D1D", color: "#FCA5A5" }}
                  >
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="First Name"
                      value={formData.firstName}
                      onChange={(v) => updateField("firstName", v)}
                      required
                    />
                    <InputField
                      label="Last Name"
                      value={formData.lastName}
                      onChange={(v) => updateField("lastName", v)}
                      required
                    />
                  </div>
                  <InputField
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(v) => updateField("email", v)}
                    required
                  />
                  <InputField
                    label="Password"
                    type="password"
                    value={formData.password}
                    onChange={(v) => updateField("password", v)}
                    required
                  />
                  <InputField
                    label="Phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(v) => updateField("phone", v)}
                  />
                  <InputField
                    label="Company"
                    value={formData.company}
                    onChange={(v) => updateField("company", v)}
                  />
                  <InputField
                    label="Website"
                    value={formData.website}
                    onChange={(v) => updateField("website", v)}
                  />
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: TEXT_DIM }}
                    >
                      How did you hear about us?
                    </label>
                    <select
                      value={formData.referralSource}
                      onChange={(e) =>
                        updateField("referralSource", e.target.value)
                      }
                      className="w-full px-4 py-3 rounded-lg text-sm outline-none focus:ring-2"
                      style={{
                        backgroundColor: BG,
                        color: TEXT,
                        borderColor: `${TEXT_DIM}44`,
                        border: "1px solid",
                      }}
                    >
                      <option value="">Select...</option>
                      <option value="referral">Referral</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="google">Google Search</option>
                      <option value="social">Social Media</option>
                      <option value="event">Event / Conference</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50"
                    style={{ backgroundColor: ORANGE, color: "#FFFFFF" }}
                  >
                    {submitting ? "Submitting..." : "Submit Application"}
                  </button>
                </form>
              </div>
            )}

            {submitted && (
              <div
                className="p-8 rounded-2xl border"
                style={{ backgroundColor: BG_CARD, borderColor: `${ORANGE}33` }}
              >
                <div
                  className="text-5xl font-bold mb-4"
                  style={{ color: ORANGE }}
                >
                  Application Received
                </div>
                <p className="text-lg mb-6" style={{ color: TEXT_DIM }}>
                  We will review your application and get back to you within 24-48
                  hours. Check your email for next steps.
                </p>
                <a
                  href="/jvdashboard"
                  className="inline-block px-8 py-3 rounded-lg font-semibold transition-all hover:scale-105"
                  style={{ backgroundColor: ORANGE, color: "#FFFFFF" }}
                >
                  Go to Partner Dashboard
                </a>
              </div>
            )}
          </div>
        </section>

        {/* Footer spacer */}
        <div style={{ height: "40px" }} />
      </div>
    </>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        className="block text-sm font-medium mb-1"
        style={{ color: TEXT_DIM }}
      >
        {label}
        {required && <span style={{ color: ORANGE }}> *</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full px-4 py-3 rounded-lg text-sm outline-none focus:ring-2"
        style={{
          backgroundColor: BG,
          color: TEXT,
          border: `1px solid ${TEXT_DIM}44`,
        }}
      />
    </div>
  );
}
