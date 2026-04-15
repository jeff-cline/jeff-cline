"use client";

import { useState, useEffect, useCallback } from "react";

const ORANGE = "#F97316";
const BG = "#0A1628";
const BG_CARD = "#0F1D32";
const TEXT = "#E2E8F0";
const TEXT_DIM = "#94A3B8";
const GREEN = "#22C55E";

const ALL_PRODUCTS = [
  { name: "VoiceDrips.com", key: "voicedrips", rate: "25%", price: "$200 - $32,500/mo", desc: "AI-powered voice drip campaigns" },
  { name: "Kreeper.ai", key: "kreeper", rate: "25%", price: "$1,500/mo", desc: "AI-powered found leads platform" },
  { name: "IntentTriggers.com", key: "intenttriggers", rate: "25%", price: "Custom pricing", desc: "Intent data and trigger-based lead intelligence" },
  { name: "MoneyWords.org", key: "moneywords", rate: "25%", price: "Custom pricing", desc: "Keyword intelligence and SEO data" },
  { name: "Niche Platform Fast Start", key: "nicheplatform", rate: "25%", price: "Custom pricing", desc: "Multi-level niche platform portals" },
  { name: "Agents.biz", key: "agents", rate: "6%", price: "$750 - $1,500/agent", desc: "Custom AI agency workforce" },
  { name: "Keyword Calls", key: "keywordcalls", rate: "6%", price: "Performance-based", desc: "Pay-per-call bidding platform" },
  { name: "Fast Start Program", key: "faststart", rate: "6%", price: "~$35k", desc: "Custom platform development" },
];

interface PartnerData {
  email: string;
  firstName: string;
  lastName: string;
  referralCode: string;
  status: string;
}

interface DashboardData {
  stats: {
    totalReferrals: number;
    activeCustomers: number;
    pendingCommissions: number;
    totalEarned: number;
  };
  commissions: Array<{
    date: string;
    customerEmail: string;
    product: string;
    revenue: number;
    commissionRate: number;
    commissionAmount: number;
    status: string;
    paidAt: string | null;
  }>;
  referralCode: string;
  partnerName: string;
  status: string;
}

export default function JVDashboard() {
  const [partner, setPartner] = useState<PartnerData | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [copied, setCopied] = useState("");
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async (email: string) => {
    try {
      const res = await fetch(`/api/jv/dashboard?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        setDashboard(data);
      }
    } catch {
      console.warn("Failed to load dashboard data");
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("jv_partner");
    if (stored) {
      try {
        const p = JSON.parse(stored) as PartnerData;
        setPartner(p);
        loadDashboard(p.email);
      } catch {
        localStorage.removeItem("jv_partner");
      }
    }
    setLoading(false);
  }, [loadDashboard]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError("");

    try {
      const res = await fetch("/api/jv/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoginError(data.error || "Login failed");
        setLoggingIn(false);
        return;
      }

      const partnerData: PartnerData = {
        email: data.partner.email,
        firstName: data.partner.firstName,
        lastName: data.partner.lastName,
        referralCode: data.partner.referralCode,
        status: data.partner.status,
      };

      localStorage.setItem("jv_partner", JSON.stringify(partnerData));
      setPartner(partnerData);
      loadDashboard(partnerData.email);
    } catch {
      setLoginError("Something went wrong. Please try again.");
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jv_partner");
    setPartner(null);
    setDashboard(null);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: BG, color: TEXT }}
      >
        <p>Loading...</p>
      </div>
    );
  }

  // Login Screen
  if (!partner) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: BG, color: TEXT, padding: "24px" }}
      >
        <div
          className="w-full max-w-md p-8 rounded-2xl border"
          style={{ backgroundColor: BG_CARD, borderColor: `${ORANGE}33` }}
        >
          <h1
            className="text-2xl font-bold text-center mb-2"
            style={{ color: "#FFFFFF" }}
          >
            JV Partner Login
          </h1>
          <p className="text-center text-sm mb-8" style={{ color: TEXT_DIM }}>
            Access your partner dashboard
          </p>

          {loginError && (
            <div
              className="mb-4 p-3 rounded-lg text-sm text-center"
              style={{ backgroundColor: "#7F1D1D", color: "#FCA5A5" }}
            >
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: TEXT_DIM }}
              >
                Email
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg text-sm outline-none"
                style={{
                  backgroundColor: BG,
                  color: TEXT,
                  border: `1px solid ${TEXT_DIM}44`,
                }}
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: TEXT_DIM }}
              >
                Password
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg text-sm outline-none"
                style={{
                  backgroundColor: BG,
                  color: TEXT,
                  border: `1px solid ${TEXT_DIM}44`,
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loggingIn}
              className="w-full px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50"
              style={{ backgroundColor: ORANGE, color: "#FFFFFF" }}
            >
              {loggingIn ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: TEXT_DIM }}>
            Not a partner yet?{" "}
            <a href="/jv" style={{ color: ORANGE }} className="hover:underline">
              Apply here
            </a>
          </p>
        </div>
      </div>
    );
  }

  // Dashboard
  const stats = dashboard?.stats || {
    totalReferrals: 0,
    activeCustomers: 0,
    pendingCommissions: 0,
    totalEarned: 0,
  };

  const referralCode = partner.referralCode;
  const baseLink = `jeff-cline.com/jv?ref=${referralCode}`;

  const nextPayoutDate = new Date();
  nextPayoutDate.setMonth(nextPayoutDate.getMonth() + 1);
  nextPayoutDate.setDate(1);

  return (
    <div style={{ backgroundColor: BG, color: TEXT, minHeight: "100vh" }}>
      {/* Header */}
      <header
        className="flex items-center justify-between px-6 py-4 border-b"
        style={{ borderColor: `${TEXT_DIM}22` }}
      >
        <div>
          <h1 className="text-xl font-bold" style={{ color: "#FFFFFF" }}>
            JV Partner Dashboard
          </h1>
          <p className="text-sm" style={{ color: TEXT_DIM }}>
            Welcome back, {partner.firstName}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span
            className="text-xs px-3 py-1 rounded-full font-medium"
            style={{
              backgroundColor:
                partner.status === "active"
                  ? `${GREEN}22`
                  : `${ORANGE}22`,
              color: partner.status === "active" ? GREEN : ORANGE,
            }}
          >
            {partner.status.toUpperCase()}
          </span>
          <button
            onClick={handleLogout}
            className="text-sm px-4 py-2 rounded-lg border cursor-pointer hover:opacity-80"
            style={{ borderColor: `${TEXT_DIM}44`, color: TEXT_DIM }}
          >
            Sign Out
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Referrals", value: stats.totalReferrals.toString() },
            { label: "Active Customers", value: stats.activeCustomers.toString() },
            {
              label: "Pending Commissions",
              value: `$${stats.pendingCommissions.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
            },
            {
              label: "Total Earned (Lifetime)",
              value: `$${stats.totalEarned.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-6 rounded-xl border"
              style={{ backgroundColor: BG_CARD, borderColor: `${TEXT_DIM}11` }}
            >
              <p className="text-sm mb-1" style={{ color: TEXT_DIM }}>
                {stat.label}
              </p>
              <p
                className="text-2xl font-bold"
                style={{ color: "#FFFFFF" }}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Referral Link */}
        <div
          className="p-6 rounded-xl border"
          style={{ backgroundColor: BG_CARD, borderColor: `${TEXT_DIM}11` }}
        >
          <h2 className="text-lg font-bold mb-4" style={{ color: "#FFFFFF" }}>
            Your Referral Link
          </h2>
          <div className="flex items-center gap-3">
            <div
              className="flex-1 px-4 py-3 rounded-lg text-sm font-mono"
              style={{ backgroundColor: BG, color: ORANGE }}
            >
              {baseLink}
            </div>
            <button
              onClick={() => copyToClipboard(`https://${baseLink}`, "main")}
              className="px-6 py-3 rounded-lg font-semibold text-sm cursor-pointer hover:opacity-90 transition-all"
              style={{ backgroundColor: ORANGE, color: "#FFFFFF" }}
            >
              {copied === "main" ? "Copied" : "Copy"}
            </button>
          </div>
          <p className="text-xs mt-2" style={{ color: TEXT_DIM }}>
            Referral Code: {referralCode}
          </p>
        </div>

        {/* Products */}
        <div>
          <h2 className="text-lg font-bold mb-4" style={{ color: "#FFFFFF" }}>
            Products to Promote
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ALL_PRODUCTS.map((product) => (
              <div
                key={product.key}
                className="p-5 rounded-xl border"
                style={{
                  backgroundColor: BG_CARD,
                  borderColor: `${TEXT_DIM}11`,
                }}
              >
                <h3
                  className="font-bold text-sm mb-1"
                  style={{ color: "#FFFFFF" }}
                >
                  {product.name}
                </h3>
                <p
                  className="text-xs mb-3 leading-relaxed"
                  style={{ color: TEXT_DIM }}
                >
                  {product.desc}
                </p>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      backgroundColor:
                        product.rate === "25%" ? `${ORANGE}22` : `${TEXT_DIM}22`,
                      color: product.rate === "25%" ? ORANGE : TEXT_DIM,
                    }}
                  >
                    {product.rate} commission
                  </span>
                  <span className="text-xs" style={{ color: TEXT_DIM }}>
                    {product.price}
                  </span>
                </div>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `https://jeff-cline.com/api/jv/track?ref=${referralCode}&product=${product.key}`,
                      product.key
                    )
                  }
                  className="w-full py-2 rounded-lg text-xs font-semibold cursor-pointer hover:opacity-90 transition-all border"
                  style={{
                    borderColor: ORANGE,
                    color: ORANGE,
                    backgroundColor: "transparent",
                  }}
                >
                  {copied === product.key ? "Link Copied" : "Get Link"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Commissions Table */}
        <div
          className="p-6 rounded-xl border"
          style={{ backgroundColor: BG_CARD, borderColor: `${TEXT_DIM}11` }}
        >
          <h2 className="text-lg font-bold mb-4" style={{ color: "#FFFFFF" }}>
            Commissions
          </h2>
          {(!dashboard?.commissions || dashboard.commissions.length === 0) ? (
            <div className="text-center py-12">
              <p className="text-sm" style={{ color: TEXT_DIM }}>
                No commissions yet. Share your referral links to start earning.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${TEXT_DIM}22` }}>
                    {["Date", "Customer", "Product", "Revenue", "Rate", "Commission", "Status", "Payout Date"].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left py-3 px-3 font-medium"
                          style={{ color: TEXT_DIM }}
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {dashboard.commissions.map((c, i) => (
                    <tr
                      key={i}
                      style={{ borderBottom: `1px solid ${TEXT_DIM}11` }}
                    >
                      <td className="py-3 px-3" style={{ color: TEXT }}>
                        {new Date(c.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-3" style={{ color: TEXT_DIM }}>
                        {c.customerEmail}
                      </td>
                      <td className="py-3 px-3" style={{ color: TEXT }}>
                        {c.product}
                      </td>
                      <td className="py-3 px-3" style={{ color: TEXT }}>
                        ${c.revenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-3" style={{ color: ORANGE }}>
                        {(c.commissionRate * 100).toFixed(0)}%
                      </td>
                      <td className="py-3 px-3 font-semibold" style={{ color: GREEN }}>
                        ${c.commissionAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor:
                              c.status === "paid" ? `${GREEN}22` : `${ORANGE}22`,
                            color: c.status === "paid" ? GREEN : ORANGE,
                          }}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3 px-3" style={{ color: TEXT_DIM }}>
                        {c.paidAt
                          ? new Date(c.paidAt).toLocaleDateString()
                          : "--"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Payout Summary */}
        <div
          className="p-6 rounded-xl border"
          style={{ backgroundColor: BG_CARD, borderColor: `${TEXT_DIM}11` }}
        >
          <h2 className="text-lg font-bold mb-4" style={{ color: "#FFFFFF" }}>
            Payout Summary
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <p className="text-sm mb-1" style={{ color: TEXT_DIM }}>
                Next Payout Date
              </p>
              <p className="text-lg font-semibold" style={{ color: "#FFFFFF" }}>
                {nextPayoutDate.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="text-sm mb-1" style={{ color: TEXT_DIM }}>
                Amount Pending
              </p>
              <p className="text-lg font-semibold" style={{ color: ORANGE }}>
                ${stats.pendingCommissions.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="text-sm mb-1" style={{ color: TEXT_DIM }}>
                Payout Method
              </p>
              <button
                className="mt-1 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer border hover:opacity-80 transition-all"
                style={{ borderColor: `${TEXT_DIM}44`, color: TEXT_DIM }}
                onClick={() =>
                  alert("Stripe Connect integration coming soon.")
                }
              >
                Connect Stripe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom spacer */}
      <div style={{ height: "40px" }} />
    </div>
  );
}
