"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardNav from "@/components/dashboard/DashboardNav";
import SoftCircleSubNav from "../SubNav";

export default function SoftCircleReportsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<any>({});
  const [searches, setSearches] = useState<any[]>([]);
  const [growth, setGrowth] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login?callbackUrl=/dashboard/soft-circle/reports");
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetch("/api/soft-circle/reports").then(r => r.json()).then(d => {
        setStats(d.stats || {});
        setSearches(d.searches || []);
        setGrowth(d.growth || []);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [session]);

  const exportSearchCSV = () => {
    const headers = "Date,Description,Tags,Stage,Raise Amount,Results,Source\n";
    const rows = searches.map((s: any) =>
      `"${s.createdAt ? new Date(s.createdAt).toLocaleDateString() : ""}","${s.description}","${s.tags}","${s.stage}",${s.raiseAmount || 0},${s.resultsCount || 0},"${s.dataSource}"`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "soft-circle-searches.csv"; a.click();
  };

  if (status === "loading" || loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
  if (!session) return null;

  const maxGrowth = Math.max(...growth.map((g: any) => g.count), 1);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <DashboardNav />
        <SoftCircleSubNav active="reports" />
        <h1 className="text-2xl font-bold mb-6">Reports & Analytics</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Investors", value: stats.totalInvestors || 0, color: "text-[#FF8900]" },
            { label: "Total Searches", value: stats.totalSearches || 0, color: "text-blue-400" },
            { label: "With Phone", value: stats.withPhone || 0, color: "text-green-400" },
            { label: "With Email", value: stats.withEmail || 0, color: "text-purple-400" },
          ].map(card => (
            <div key={card.label} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-xs text-gray-400">{card.label}</p>
              <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* Growth Chart (simple bar chart) */}
        {growth.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
            <h2 className="text-sm font-semibold text-gray-400 mb-4">Collection Growth (Last 30 Days)</h2>
            <div className="flex items-end gap-1 h-32">
              {growth.map((g: any) => (
                <div key={g._id} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-[#FF8900]/60 rounded-t" style={{ height: `${(g.count / maxGrowth) * 100}%` }} />
                  <span className="text-[8px] text-gray-500 mt-1">{g._id.slice(5)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search History */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Search History</h2>
          <button onClick={exportSearchCSV} className="text-sm text-[#FF8900] hover:underline">Export CSV</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-gray-400">
                <th className="text-left py-3 px-2">Date</th>
                <th className="text-left py-3 px-2">Description</th>
                <th className="text-left py-3 px-2">Tags</th>
                <th className="text-left py-3 px-2">Stage</th>
                <th className="text-left py-3 px-2">Results</th>
              </tr>
            </thead>
            <tbody>
              {searches.map((s: any, i: number) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-2 text-gray-400">{s.createdAt ? new Date(s.createdAt).toLocaleDateString() : ""}</td>
                  <td className="py-3 px-2 max-w-xs truncate">{s.description}</td>
                  <td className="py-3 px-2 text-gray-400">{s.tags}</td>
                  <td className="py-3 px-2 text-gray-400">{s.stage}</td>
                  <td className="py-3 px-2">{s.resultsCount}</td>
                </tr>
              ))}
              {searches.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-gray-500">No searches yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
