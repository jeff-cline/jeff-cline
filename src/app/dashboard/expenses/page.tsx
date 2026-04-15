"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import DashboardNav from "@/components/dashboard/DashboardNav";
import type { Expense, ExpenseCategory, ExpensePlatform } from "@/lib/expense-types";

const CATEGORIES: ExpenseCategory[] = ["ads", "tools", "services", "other"];
const PLATFORMS: ExpensePlatform[] = ["Google", "Meta", "LinkedIn", "Other"];
const CAT_COLORS: Record<string, string> = { ads: "#FF8900", tools: "#3B82F6", services: "#22C55E", other: "#A855F7" };

export default function ExpensesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", amount: "", category: "ads" as ExpenseCategory, platform: "Google" as ExpensePlatform, date: new Date().toISOString().split("T")[0], recurring: false, notes: "" });

  useEffect(() => { if (status === "unauthenticated") router.push("/login?callbackUrl=/dashboard/expenses"); }, [status, router]);

  const fetchExpenses = () => {
    fetch("/api/expenses").then(r => r.json()).then(d => { if (Array.isArray(d)) setExpenses(d); }).catch(() => {});
  };

  useEffect(() => { if (session?.user) fetchExpenses(); }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/expenses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setForm({ name: "", amount: "", category: "ads", platform: "Google", date: new Date().toISOString().split("T")[0], recurring: false, notes: "" });
    setShowForm(false);
    fetchExpenses();
  };

  const deleteExpense = async (id: string) => {
    await fetch("/api/expenses", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    fetchExpenses();
  };

  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthlyExpenses = expenses.filter(e => e.date?.startsWith(monthKey));
  const totalMonthly = monthlyExpenses.reduce((s, e) => s + e.amount, 0);

  const byCategory = useMemo(() => {
    const map: Record<string, number> = {};
    CATEGORIES.forEach(c => { map[c] = monthlyExpenses.filter(e => e.category === c).reduce((s, e) => s + e.amount, 0); });
    return map;
  }, [monthlyExpenses]);

  const byPlatform = useMemo(() => {
    const map: Record<string, number> = {};
    PLATFORMS.forEach(p => { map[p] = monthlyExpenses.filter(e => e.platform === p).reduce((s, e) => s + e.amount, 0); });
    return map;
  }, [monthlyExpenses]);

  if (status === "loading") return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-[#FF8900] text-xl font-bold">Loading...</div></div>;
  if (!session?.user) return null;

  return (
    <section className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <DashboardNav />
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-black">Expense <span className="text-[#FF8900]">Tracker</span></h1>
          <button onClick={() => setShowForm(!showForm)} className="bg-[#FF8900] text-black font-bold px-4 py-2 rounded-lg text-sm hover:bg-[#ffa033] transition-colors">
            {showForm ? "Cancel" : "+ Add Expense"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-[#1a1a1a] border border-white/5 rounded-xl p-6 mb-8 grid grid-cols-2 md:grid-cols-3 gap-4">
            <input placeholder="Name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
            <input placeholder="Amount" type="number" step="0.01" required value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value as ExpenseCategory })} className="bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value as ExpensePlatform })} className="bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white">
              {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input type="checkbox" checked={form.recurring} onChange={e => setForm({ ...form, recurring: e.target.checked })} className="accent-[#FF8900]" /> Recurring
            </label>
            <input placeholder="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white col-span-2" />
            <button type="submit" className="bg-[#FF8900] text-black font-bold px-4 py-2 rounded-lg text-sm hover:bg-[#ffa033]">Save</button>
          </form>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-5">
            <div className="text-gray-500 text-xs uppercase mb-1">Monthly Spend</div>
            <div className="text-2xl font-black text-[#FF8900]">${totalMonthly.toLocaleString()}</div>
          </div>
          {CATEGORIES.slice(0, 3).map(c => (
            <div key={c} className="bg-[#1a1a1a] border border-white/5 rounded-xl p-5">
              <div className="text-gray-500 text-xs uppercase mb-1">{c}</div>
              <div className="text-2xl font-black" style={{ color: CAT_COLORS[c] }}>${byCategory[c]?.toLocaleString() || 0}</div>
            </div>
          ))}
        </div>

        {/* Category Breakdown (CSS pie-like bars) */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase">By Category</h3>
            <div className="space-y-3">
              {CATEGORIES.map(c => (
                <div key={c} className="flex items-center gap-3">
                  <span className="text-xs w-16 capitalize text-gray-300">{c}</span>
                  <div className="flex-1 bg-[#111] rounded-full h-6 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${totalMonthly ? (byCategory[c] / totalMonthly) * 100 : 0}%`, backgroundColor: CAT_COLORS[c] }} />
                  </div>
                  <span className="text-xs text-gray-400 w-16 text-right">${byCategory[c]?.toLocaleString() || 0}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase">By Platform</h3>
            <div className="space-y-3">
              {PLATFORMS.map(p => (
                <div key={p} className="flex items-center gap-3">
                  <span className="text-xs w-16 text-gray-300">{p}</span>
                  <div className="flex-1 bg-[#111] rounded-full h-6 overflow-hidden">
                    <div className="h-full rounded-full bg-[#FF8900]" style={{ width: `${totalMonthly ? (byPlatform[p] / totalMonthly) * 100 : 0}%` }} />
                  </div>
                  <span className="text-xs text-gray-400 w-16 text-right">${byPlatform[p]?.toLocaleString() || 0}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Expense List */}
        <div className="bg-[#1a1a1a] border border-white/5 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-left">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Platform</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">🔄</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {expenses.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">No expenses yet</td></tr>}
              {expenses.map((e, i) => (
                <tr key={e._id || i} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3 text-white">{e.name}</td>
                  <td className="px-4 py-3 text-[#FF8900] font-bold">${e.amount?.toLocaleString()}</td>
                  <td className="px-4 py-3 capitalize text-gray-300">{e.category}</td>
                  <td className="px-4 py-3 text-gray-400">{e.platform}</td>
                  <td className="px-4 py-3 text-gray-500">{e.date}</td>
                  <td className="px-4 py-3">{e.recurring ? "✅" : ""}</td>
                  <td className="px-4 py-3"><button onClick={() => deleteExpense(e._id)} className="text-red-500 hover:text-red-400 text-xs">Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
