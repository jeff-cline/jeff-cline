"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import DashboardNav from "@/components/dashboard/DashboardNav";
import { SILO_LABELS } from "@/lib/types";

export default function ReportsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [leads, setLeads] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => { if (status === "unauthenticated") router.push("/login?callbackUrl=/dashboard/reports"); }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetch("/api/quiz").then(r => r.json()).then(d => { if (Array.isArray(d)) setLeads(d); }).catch(() => {});
      fetch("/api/expenses").then(r => r.json()).then(d => { if (Array.isArray(d)) setExpenses(d); }).catch(() => {});
    }
  }, [session]);

  const filtered = useMemo(() => {
    return {
      leads: leads.filter(l => {
        if (dateFrom && new Date(l.createdAt) < new Date(dateFrom)) return false;
        if (dateTo && new Date(l.createdAt) > new Date(dateTo + "T23:59:59")) return false;
        return true;
      }),
      expenses: expenses.filter(e => {
        if (dateFrom && e.date < dateFrom) return false;
        if (dateTo && e.date > dateTo) return false;
        return true;
      }),
    };
  }, [leads, expenses, dateFrom, dateTo]);

  const totalLeads = filtered.leads.length;
  const converted = filtered.leads.filter(l => l.status === "converted").length;
  const conversionRate = totalLeads ? ((converted / totalLeads) * 100).toFixed(1) : "0";
  const totalSpend = filtered.expenses.reduce((s, e) => s + (e.amount || 0), 0);
  const costPerLead = totalLeads ? (totalSpend / totalLeads).toFixed(2) : "0";

  const siloCounts = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.leads.forEach(l => { map[l.silo] = (map[l.silo] || 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [filtered.leads]);

  const downloadCSV = () => {
    const headers = ["Name", "Email", "Silo", "Status", "Date"];
    const rows = filtered.leads.map(l => [l.name, l.email, l.silo, l.status || "new", new Date(l.createdAt).toLocaleDateString()]);
    const csv = [headers, ...rows].map(r => r.map((c: string) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leads-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (status === "loading") return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-[#FF8900] text-xl font-bold">Loading...</div></div>;
  if (!session?.user) return null;

  return (
    <section className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <DashboardNav />
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-black">Reports <span className="text-[#FF8900]">Summary</span></h1>
          <button onClick={downloadCSV} className="bg-[#FF8900] text-black font-bold px-4 py-2 rounded-lg text-sm hover:bg-[#ffa033] transition-colors">
            📥 Download CSV
          </button>
        </div>

        {/* Date Filter */}
        <div className="flex gap-3 mb-8">
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Total Leads", value: totalLeads, color: "#3B82F6" },
            { label: "Converted", value: converted, color: "#22C55E" },
            { label: "Conversion Rate", value: `${conversionRate}%`, color: "#FF8900" },
            { label: "Total Spend", value: `$${totalSpend.toLocaleString()}`, color: "#DC2626" },
            { label: "Cost / Lead", value: `$${costPerLead}`, color: "#A855F7" },
          ].map(m => (
            <div key={m.label} className="bg-[#1a1a1a] border border-white/5 rounded-xl p-5">
              <div className="text-gray-500 text-xs uppercase mb-1">{m.label}</div>
              <div className="text-2xl font-black" style={{ color: m.color }}>{m.value}</div>
            </div>
          ))}
        </div>

        {/* Top Silos */}
        <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase">Top Performing Silos</h3>
          {siloCounts.length === 0 && <p className="text-gray-500">No data available</p>}
          <div className="space-y-3">
            {siloCounts.map(([silo, count]) => (
              <div key={silo} className="flex items-center gap-4">
                <span className="text-sm w-32 text-gray-300">{SILO_LABELS[silo] || silo}</span>
                <div className="flex-1 bg-[#111] rounded-full h-6 overflow-hidden">
                  <div className="h-full rounded-full bg-[#FF8900]" style={{ width: `${(count / totalLeads) * 100}%` }} />
                </div>
                <span className="text-sm text-gray-400 w-12 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
