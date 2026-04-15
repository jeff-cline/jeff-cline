"use client";

import { useState, useEffect, useCallback } from "react";

const ADMIN_EMAIL = "jeff.cline@me.com";

interface LaunchUser {
  email: string;
  name: string;
  phone: string;
  credits: number;
  unlockCodeUsed: string | null;
  active: boolean;
  createdAt: string;
}

interface LaunchCode {
  code: string;
  credits: number;
  maxUses: number;
  usedCount: number;
  usedBy: string[];
  expiresAt: string | null;
  createdAt: string;
}

interface Transaction {
  email: string;
  type: string;
  amount: number;
  balance: number;
  description: string;
  createdAt: string;
}

type Tab = "users" | "credits" | "codes";

export default function LaunchAdmin() {
  const [authed, setAuthed] = useState(false);
  const [activeAdminEmail, setActiveAdminEmail] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authError, setAuthError] = useState("");
  const [tab, setTab] = useState<Tab>("users");
  const [users, setUsers] = useState<LaunchUser[]>([]);
  const [codes, setCodes] = useState<LaunchCode[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  // Credit form
  const [creditEmail, setCreditEmail] = useState("");
  const [creditAmount, setCreditAmount] = useState("");
  const [creditDesc, setCreditDesc] = useState("");
  const [creditMsg, setCreditMsg] = useState("");

  // Code form
  const [newCode, setNewCode] = useState("");
  const [newCodeCredits, setNewCodeCredits] = useState("50");
  const [newCodeMaxUses, setNewCodeMaxUses] = useState("0");
  const [newCodeExpires, setNewCodeExpires] = useState("");
  const [codeMsg, setCodeMsg] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [adminRes, txRes] = await Promise.all([
        fetch(`/api/launch/admin?adminEmail=${encodeURIComponent(activeAdminEmail || ADMIN_EMAIL)}`),
        fetch(`/api/launch/transactions?adminEmail=${encodeURIComponent(activeAdminEmail || ADMIN_EMAIL)}`),
      ]);
      const adminData = await adminRes.json();
      const txData = await txRes.json();

      if (adminRes.ok) {
        setUsers(adminData.users || []);
        setCodes(adminData.codes || []);
      }
      if (txRes.ok) {
        setTransactions(txData.transactions || []);
      }
    } catch {
      console.error("Failed to load admin data");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authed) loadData();
  }, [authed, loadData]);

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");

    try {
      const res = await fetch(`/api/launch/admin?adminEmail=${encodeURIComponent(authEmail.toLowerCase())}`);
      const data = await res.json();

      if (!res.ok) {
        setAuthError(data.error || "Unauthorized");
        return;
      }

      const normalized = authEmail.toLowerCase();
      if (normalized !== ADMIN_EMAIL) {
        setAuthError("Unauthorized");
        return;
      }

      setAuthed(true);
      setActiveAdminEmail(normalized);
      setUsers(data.users || []);
      setCodes(data.codes || []);
      setTransactions(data.transactions || []);
    } catch {
      setAuthError("Unable to verify admin access");
    }
  }

  async function handleAddCredits(e: React.FormEvent) {
    e.preventDefault();
    setCreditMsg("");
    try {
      const res = await fetch("/api/launch/credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminEmail: activeAdminEmail || ADMIN_EMAIL,
          email: creditEmail,
          amount: parseInt(creditAmount),
          description: creditDesc || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCreditMsg(`Success. New balance: ${data.credits}`);
      setCreditEmail("");
      setCreditAmount("");
      setCreditDesc("");
      loadData();
    } catch (err: unknown) {
      setCreditMsg(err instanceof Error ? err.message : "Failed");
    }
  }

  async function handleCreateCode(e: React.FormEvent) {
    e.preventDefault();
    setCodeMsg("");
    try {
      const res = await fetch("/api/launch/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminEmail: activeAdminEmail || ADMIN_EMAIL,
          code: newCode,
          credits: parseInt(newCodeCredits),
          maxUses: parseInt(newCodeMaxUses),
          expiresAt: newCodeExpires || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCodeMsg(`Code "${newCode.toUpperCase()}" created`);
      setNewCode("");
      setNewCodeCredits("50");
      setNewCodeMaxUses("0");
      setNewCodeExpires("");
      loadData();
    } catch (err: unknown) {
      setCodeMsg(err instanceof Error ? err.message : "Failed");
    }
  }

  async function toggleUser(email: string, active: boolean) {
    await fetch("/api/launch/admin", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminEmail: activeAdminEmail || ADMIN_EMAIL, email, active: !active }),
    });
    loadData();
  }

  // Auth gate
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "#0a0a0a" }}>
        <div className="max-w-md w-full rounded-xl p-8 border" style={{ background: "#111", borderColor: "#222" }}>
          <h1 className="text-2xl font-bold text-center mb-6">
            <span style={{ color: "#FF8900" }}>LAUNCH</span> Admin
          </h1>
          <form onSubmit={handleAuth} className="space-y-4">
            <input
              type="email"
              required
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              className="w-full rounded-lg px-4 py-3 text-white outline-none"
              style={{ background: "#1a1a1a" }}
              placeholder="Admin email"
            />
            <button
              type="submit"
              className="w-full py-3 rounded-lg font-bold text-black"
              style={{ background: "#FF8900" }}
            >
              Access Admin
            </button>
            {authError && <p className="text-sm text-red-400 text-center">{authError}</p>}
          </form>
        </div>
      </div>
    );
  }

  const tabStyle = (t: Tab) => ({
    background: tab === t ? "#FF8900" : "#1a1a1a",
    color: tab === t ? "#000" : "#888",
  });

  return (
    <div className="min-h-screen px-6 py-12" style={{ background: "#0a0a0a" }}>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          <span style={{ color: "#FF8900" }}>LAUNCH</span> Admin
        </h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {(["users", "credits", "codes"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-5 py-2 rounded-lg font-medium text-sm capitalize transition-colors"
              style={tabStyle(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {loading && <p className="text-gray-500">Loading...</p>}

        {/* ── USERS TAB ── */}
        {tab === "users" && !loading && (
          <div className="rounded-xl border overflow-hidden" style={{ background: "#111", borderColor: "#222" }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "#1a1a1a" }}>
                    <th className="text-left px-4 py-3 text-gray-400 font-medium">Name</th>
                    <th className="text-left px-4 py-3 text-gray-400 font-medium">Email</th>
                    <th className="text-left px-4 py-3 text-gray-400 font-medium">Phone</th>
                    <th className="text-right px-4 py-3 text-gray-400 font-medium">Credits</th>
                    <th className="text-left px-4 py-3 text-gray-400 font-medium">Code</th>
                    <th className="text-left px-4 py-3 text-gray-400 font-medium">Signed Up</th>
                    <th className="text-center px-4 py-3 text-gray-400 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.email} className="border-t" style={{ borderColor: "#1a1a1a" }}>
                      <td className="px-4 py-3">{u.name}</td>
                      <td className="px-4 py-3 text-gray-400">{u.email}</td>
                      <td className="px-4 py-3 text-gray-400">{u.phone}</td>
                      <td className="px-4 py-3 text-right font-mono" style={{ color: "#FF8900" }}>
                        {u.credits}
                      </td>
                      <td className="px-4 py-3 text-gray-500 font-mono text-xs">
                        {u.unlockCodeUsed || "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => toggleUser(u.email, u.active)}
                          className="text-xs px-3 py-1 rounded-full"
                          style={{
                            background: u.active ? "#22c55e20" : "#dc262620",
                            color: u.active ? "#22c55e" : "#dc2626",
                          }}
                        >
                          {u.active ? "Active" : "Inactive"}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                        No users yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── CREDITS TAB ── */}
        {tab === "credits" && !loading && (
          <div className="space-y-8">
            {/* Add credits form */}
            <div className="rounded-xl p-6 border" style={{ background: "#111", borderColor: "#222" }}>
              <h3 className="font-bold mb-4">Add / Subtract Credits</h3>
              <form onSubmit={handleAddCredits} className="grid sm:grid-cols-4 gap-4">
                <input
                  type="email"
                  required
                  value={creditEmail}
                  onChange={(e) => setCreditEmail(e.target.value)}
                  className="rounded-lg px-4 py-2 text-white outline-none"
                  style={{ background: "#1a1a1a" }}
                  placeholder="User email"
                />
                <input
                  type="number"
                  required
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(e.target.value)}
                  className="rounded-lg px-4 py-2 text-white outline-none"
                  style={{ background: "#1a1a1a" }}
                  placeholder="Amount (neg to subtract)"
                />
                <input
                  type="text"
                  value={creditDesc}
                  onChange={(e) => setCreditDesc(e.target.value)}
                  className="rounded-lg px-4 py-2 text-white outline-none"
                  style={{ background: "#1a1a1a" }}
                  placeholder="Description (optional)"
                />
                <button
                  type="submit"
                  className="rounded-lg py-2 font-bold text-black"
                  style={{ background: "#FF8900" }}
                >
                  Apply
                </button>
              </form>
              {creditMsg && (
                <p className="text-sm mt-3" style={{ color: "#FF8900" }}>
                  {creditMsg}
                </p>
              )}
            </div>

            {/* All transactions */}
            <div className="rounded-xl border overflow-hidden" style={{ background: "#111", borderColor: "#222" }}>
              <h3 className="font-bold px-6 py-4" style={{ background: "#1a1a1a" }}>
                All Transactions
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: "#151515" }}>
                      <th className="text-left px-4 py-3 text-gray-400 font-medium">Date</th>
                      <th className="text-left px-4 py-3 text-gray-400 font-medium">Email</th>
                      <th className="text-left px-4 py-3 text-gray-400 font-medium">Type</th>
                      <th className="text-left px-4 py-3 text-gray-400 font-medium">Description</th>
                      <th className="text-right px-4 py-3 text-gray-400 font-medium">Amount</th>
                      <th className="text-right px-4 py-3 text-gray-400 font-medium">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx, i) => (
                      <tr key={i} className="border-t" style={{ borderColor: "#1a1a1a" }}>
                        <td className="px-4 py-3 text-gray-500">
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-gray-400">{tx.email}</td>
                        <td className="px-4 py-3">
                          <span
                            className="text-xs px-2 py-1 rounded-full"
                            style={{
                              background: tx.amount > 0 ? "#22c55e15" : "#dc262615",
                              color: tx.amount > 0 ? "#22c55e" : "#dc2626",
                            }}
                          >
                            {tx.type.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500">{tx.description}</td>
                        <td
                          className="px-4 py-3 text-right font-mono"
                          style={{ color: tx.amount > 0 ? "#22c55e" : "#dc2626" }}
                        >
                          {tx.amount > 0 ? "+" : ""}
                          {tx.amount}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-gray-400">
                          {tx.balance}
                        </td>
                      </tr>
                    ))}
                    {transactions.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                          No transactions yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── CODES TAB ── */}
        {tab === "codes" && !loading && (
          <div className="space-y-8">
            {/* Create code form */}
            <div className="rounded-xl p-6 border" style={{ background: "#111", borderColor: "#222" }}>
              <h3 className="font-bold mb-4">Create Unlock Code</h3>
              <form onSubmit={handleCreateCode} className="grid sm:grid-cols-5 gap-4">
                <input
                  type="text"
                  required
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  className="rounded-lg px-4 py-2 text-white outline-none font-mono"
                  style={{ background: "#1a1a1a" }}
                  placeholder="CODE"
                />
                <input
                  type="number"
                  required
                  value={newCodeCredits}
                  onChange={(e) => setNewCodeCredits(e.target.value)}
                  className="rounded-lg px-4 py-2 text-white outline-none"
                  style={{ background: "#1a1a1a" }}
                  placeholder="Credits"
                />
                <input
                  type="number"
                  value={newCodeMaxUses}
                  onChange={(e) => setNewCodeMaxUses(e.target.value)}
                  className="rounded-lg px-4 py-2 text-white outline-none"
                  style={{ background: "#1a1a1a" }}
                  placeholder="Max uses (0=unlimited)"
                />
                <input
                  type="date"
                  value={newCodeExpires}
                  onChange={(e) => setNewCodeExpires(e.target.value)}
                  className="rounded-lg px-4 py-2 text-white outline-none"
                  style={{ background: "#1a1a1a" }}
                />
                <button
                  type="submit"
                  className="rounded-lg py-2 font-bold text-black"
                  style={{ background: "#FF8900" }}
                >
                  Create
                </button>
              </form>
              {codeMsg && (
                <p className="text-sm mt-3" style={{ color: "#FF8900" }}>
                  {codeMsg}
                </p>
              )}
            </div>

            {/* Codes table */}
            <div className="rounded-xl border overflow-hidden" style={{ background: "#111", borderColor: "#222" }}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: "#1a1a1a" }}>
                      <th className="text-left px-4 py-3 text-gray-400 font-medium">Code</th>
                      <th className="text-right px-4 py-3 text-gray-400 font-medium">Credits</th>
                      <th className="text-center px-4 py-3 text-gray-400 font-medium">Usage</th>
                      <th className="text-left px-4 py-3 text-gray-400 font-medium">Expires</th>
                      <th className="text-left px-4 py-3 text-gray-400 font-medium">Used By</th>
                      <th className="text-left px-4 py-3 text-gray-400 font-medium">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {codes.map((c) => (
                      <tr key={c.code} className="border-t" style={{ borderColor: "#1a1a1a" }}>
                        <td className="px-4 py-3 font-mono font-bold" style={{ color: "#FF8900" }}>
                          {c.code}
                        </td>
                        <td className="px-4 py-3 text-right font-mono">{c.credits}</td>
                        <td className="px-4 py-3 text-center text-gray-400">
                          {c.usedCount} / {c.maxUses === 0 ? "∞" : c.maxUses}
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : "Never"}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">
                          {c.usedBy.length > 0 ? c.usedBy.join(", ") : "—"}
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                    {codes.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                          No codes yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
