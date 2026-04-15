"use client";

import { useState, useEffect } from "react";

const tools = [
  { name: "LaunchAI", icon: "🤖", tagline: "AI Workforce", cost: 5, status: "Coming Soon" },
  { name: "LaunchCART", icon: "🛒", tagline: "E-Commerce", cost: 3, status: "Coming Soon" },
  { name: "LaunchCRM", icon: "📇", tagline: "CRM & Reputation", cost: 4, status: "Coming Soon" },
  { name: "LaunchADS", icon: "📡", tagline: "Ad Platform", cost: 10, status: "Coming Soon" },
  { name: "LaunchDATA", icon: "🔍", tagline: "Data Enrichment", cost: 2, status: "Coming Soon" },
  { name: "LaunchWEBINARS", icon: "🎥", tagline: "Live Streaming", cost: 8, status: "Coming Soon" },
  { name: "LaunchACADEMY", icon: "🎓", tagline: "Courses & Coaching", cost: 6, status: "Coming Soon" },
];

interface Transaction {
  type: string;
  amount: number;
  balance: number;
  description: string;
  createdAt: string;
}

export default function LaunchDashboard() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [credits, setCredits] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [loginEmail, setLoginEmail] = useState("");

  function getStoredEmail() {
    if (typeof window === "undefined") return "";
    const fromLocal = localStorage.getItem("launch_email");
    if (fromLocal) return fromLocal;

    const cookieMatch = document.cookie
      .split(";")
      .map((item) => item.trim())
      .find((item) => item.startsWith("launch_email="));
    return cookieMatch ? decodeURIComponent(cookieMatch.split("=")[1] || "") : "";
  }

  useEffect(() => {
    const stored = getStoredEmail();
    const storedName = localStorage.getItem("launch_name");
    if (stored) {
      setEmail(stored);
      setName(storedName || "");
      if (!localStorage.getItem("launch_email")) {
        localStorage.setItem("launch_email", stored);
      }
      loadData(stored);
    } else {
      setLoading(false);
    }
  }, []);

  async function loadData(userEmail: string) {
    setLoading(true);
    try {
      const [credRes, txRes] = await Promise.all([
        fetch(`/api/launch/credits?email=${encodeURIComponent(userEmail)}`),
        fetch(`/api/launch/transactions?email=${encodeURIComponent(userEmail)}`),
      ]);
      const credData = await credRes.json();
      const txData = await txRes.json();

      if (credRes.ok) {
        setCredits(credData.credits);
      }
      if (txRes.ok) {
        setTransactions(txData.transactions || []);
      }
    } catch {
      console.error("Failed to load dashboard data");
    }
    setLoading(false);
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (loginEmail.trim()) {
      localStorage.setItem("launch_email", loginEmail.trim().toLowerCase());
      document.cookie = `launch_email=${encodeURIComponent(loginEmail.trim().toLowerCase())}; path=/; max-age=2592000`;
      setEmail(loginEmail.trim().toLowerCase());
      loadData(loginEmail.trim().toLowerCase());
    }
  }

  function handleLogout() {
    localStorage.removeItem("launch_email");
    localStorage.removeItem("launch_name");
    setEmail("");
    setCredits(null);
    setTransactions([]);
  }

  // Not logged in
  if (!email && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "#0a0a0a" }}>
        <div className="max-w-md w-full rounded-xl p-8 border" style={{ background: "#111", borderColor: "#222" }}>
          <h1 className="text-2xl font-bold text-center mb-2">
            <span style={{ color: "#FF8900" }}>LAUNCH</span> Dashboard
          </h1>
          <p className="text-gray-500 text-center text-sm mb-6">Enter your email to access your dashboard</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              required
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="w-full rounded-lg px-4 py-3 text-white outline-none focus:ring-2"
              style={{ background: "#1a1a1a" }}
              placeholder="you@example.com"
            />
            <button
              type="submit"
              className="w-full py-3 rounded-lg font-bold text-black"
              style={{ background: "#FF8900" }}
            >
              Access Dashboard
            </button>
          </form>
          <p className="text-xs text-gray-600 text-center mt-4">
            Don&apos;t have an account?{" "}
            <a href="/launch" style={{ color: "#FF8900" }}>
              Sign up here
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-12" style={{ background: "#0a0a0a" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              <span style={{ color: "#FF8900" }}>LAUNCH</span> Dashboard
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {name ? `Welcome back, ${name}` : email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-white transition-colors"
          >
            Sign Out
          </button>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-20">Loading...</div>
        ) : (
          <>
            {/* Credit Balance */}
            <div
              className="rounded-xl p-8 border mb-10 text-center"
              style={{ background: "#111", borderColor: "#FF8900" }}
            >
              <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">
                Credit Balance
              </p>
              <p className="text-6xl font-black" style={{ color: "#FF8900" }}>
                {credits ?? 0}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                credits available across all tools
              </p>
            </div>

            {/* Tool Cards */}
            <h2 className="text-xl font-bold mb-6">Your Tools</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
              {tools.map((tool) => (
                <div
                  key={tool.name}
                  className="rounded-xl p-5 border transition-all hover:border-[#FF8900]/40"
                  style={{ background: "#111", borderColor: "#222" }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{tool.icon}</span>
                    <div>
                      <h3 className="font-bold text-sm" style={{ color: "#FF8900" }}>
                        {tool.name}
                      </h3>
                      <p className="text-xs text-gray-500">{tool.tagline}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">
                      {tool.cost} credits/use
                    </span>
                    <span
                      className="text-xs px-2 py-1 rounded-full"
                      style={{ background: "#1a1a1a", color: "#FF8900" }}
                    >
                      {tool.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Transaction History */}
            <h2 className="text-xl font-bold mb-6">Transaction History</h2>
            {transactions.length === 0 ? (
              <div
                className="rounded-xl p-8 border text-center"
                style={{ background: "#111", borderColor: "#222" }}
              >
                <p className="text-gray-500">No transactions yet</p>
              </div>
            ) : (
              <div
                className="rounded-xl border overflow-hidden"
                style={{ background: "#111", borderColor: "#222" }}
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: "#1a1a1a" }}>
                        <th className="text-left px-6 py-3 text-gray-400 font-medium">
                          Date
                        </th>
                        <th className="text-left px-6 py-3 text-gray-400 font-medium">
                          Type
                        </th>
                        <th className="text-left px-6 py-3 text-gray-400 font-medium">
                          Description
                        </th>
                        <th className="text-right px-6 py-3 text-gray-400 font-medium">
                          Amount
                        </th>
                        <th className="text-right px-6 py-3 text-gray-400 font-medium">
                          Balance
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx, i) => (
                        <tr
                          key={i}
                          className="border-t"
                          style={{ borderColor: "#1a1a1a" }}
                        >
                          <td className="px-6 py-3 text-gray-400">
                            {new Date(tx.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-3">
                            <span
                              className="text-xs px-2 py-1 rounded-full"
                              style={{
                                background:
                                  tx.type === "signup_bonus"
                                    ? "#FF890020"
                                    : tx.type === "admin_add"
                                    ? "#22c55e20"
                                    : "#dc262620",
                                color:
                                  tx.type === "signup_bonus"
                                    ? "#FF8900"
                                    : tx.type === "admin_add"
                                    ? "#22c55e"
                                    : "#dc2626",
                              }}
                            >
                              {tx.type.replace(/_/g, " ")}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-gray-400">
                            {tx.description}
                          </td>
                          <td
                            className="px-6 py-3 text-right font-mono"
                            style={{
                              color: tx.amount > 0 ? "#22c55e" : "#dc2626",
                            }}
                          >
                            {tx.amount > 0 ? "+" : ""}
                            {tx.amount}
                          </td>
                          <td className="px-6 py-3 text-right font-mono text-gray-400">
                            {tx.balance}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
