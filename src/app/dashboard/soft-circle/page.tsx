"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardNav from "@/components/dashboard/DashboardNav";
import SoftCircleSubNav from "./SubNav";

const STAGES = ["Pre-seed", "Seed", "Series A", "Series B", "Growth", "Established"];

export default function SoftCirclePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [stage, setStage] = useState("");
  const [raiseAmount, setRaiseAmount] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [minScore, setMinScore] = useState(0);
  const [topN, setTopN] = useState(50);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login?callbackUrl=/dashboard/soft-circle");
  }, [status, router]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/soft-circle/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, tags, stage, raiseAmount: parseFloat(raiseAmount) || 0 }),
      });
      const data = await res.json();
      setResults(data.results || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleSave = async (investor: any) => {
    setSaving(investor._id);
    try {
      await fetch("/api/soft-circle/investors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: investor.name,
          website: investor.website,
          sector: investor.sector,
          stage: investor.stage,
          checkSize: investor.checkSize,
          thesis: investor.thesis,
          contacts: investor.contacts,
          score: investor.score,
          source: "proctor",
          tags: investor.tags,
        }),
      });
    } catch (e) { console.error(e); }
    setSaving(null);
  };

  const exportCSV = () => {
    const filtered = filteredResults();
    const headers = "Rank,Score,Investor,Sector,Stage,Check Size,Match Reasoning\n";
    const rows = filtered.map((r: any, i: number) =>
      `${i + 1},${r.score},"${r.name}","${r.sector}","${r.stage}","${r.checkSize}","${r.matchReasoning}"`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "soft-circle-results.csv"; a.click();
  };

  const filteredResults = () => results.filter(r => r.score >= minScore).slice(0, topN);

  if (status === "loading") return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
  if (!session) return null;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <DashboardNav />
        <SoftCircleSubNav active="search" />
        <h1 className="text-2xl font-bold mb-6">Investor Discovery</h1>

        {/* Search Form */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8 space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Business Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              className="w-full bg-black/50 border border-white/20 rounded-lg p-3 text-white text-sm min-h-[80px]"
              placeholder="Describe your business, product, or investment thesis..." />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Sector Tags (comma-separated)</label>
              <input value={tags} onChange={e => setTags(e.target.value)}
                className="w-full bg-black/50 border border-white/20 rounded-lg p-3 text-white text-sm"
                placeholder="FinTech, AI, Real Estate" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Current Stage</label>
              <select value={stage} onChange={e => setStage(e.target.value)}
                className="w-full bg-black/50 border border-white/20 rounded-lg p-3 text-white text-sm">
                <option value="">All Stages</option>
                {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Raise Amount ($)</label>
              <input type="number" value={raiseAmount} onChange={e => setRaiseAmount(e.target.value)}
                className="w-full bg-black/50 border border-white/20 rounded-lg p-3 text-white text-sm"
                placeholder="1000000" />
            </div>
          </div>
          <button onClick={handleSearch} disabled={loading}
            className="bg-[#FF8900] hover:bg-[#FF8900]/80 text-black font-bold px-6 py-3 rounded-lg transition-colors disabled:opacity-50">
            {loading ? "Searching..." : "Find Investors"}
          </button>
        </div>

        {/* Filters */}
        {results.length > 0 && (
          <div className="flex flex-wrap items-center gap-6 mb-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-400">Min Score:</label>
              <input type="range" min={0} max={100} value={minScore} onChange={e => setMinScore(+e.target.value)} className="w-32" />
              <span className="text-sm text-white w-8">{minScore}</span>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-400">Top N:</label>
              <input type="range" min={5} max={200} value={topN} onChange={e => setTopN(+e.target.value)} className="w-32" />
              <span className="text-sm text-white w-8">{topN}</span>
            </div>
            <button onClick={exportCSV} className="text-sm text-[#FF8900] hover:underline">Export CSV</button>
            <span className="text-sm text-gray-500">{filteredResults().length} results</span>
          </div>
        )}

        {/* Results Table */}
        {results.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-gray-400">
                  <th className="text-left py-3 px-2">#</th>
                  <th className="text-left py-3 px-2">Score</th>
                  <th className="text-left py-3 px-2">Investor</th>
                  <th className="text-left py-3 px-2">Sector</th>
                  <th className="text-left py-3 px-2">Stage</th>
                  <th className="text-left py-3 px-2">Check Size</th>
                  <th className="text-left py-3 px-2">Match Reasoning</th>
                  <th className="text-left py-3 px-2"></th>
                </tr>
              </thead>
              <tbody>
                {filteredResults().map((r: any, i: number) => (
                  <tr key={r._id || i} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 px-2">{i + 1}</td>
                    <td className="py-3 px-2">
                      <span className={`font-bold ${r.score >= 70 ? "text-green-400" : r.score >= 40 ? "text-yellow-400" : "text-gray-400"}`}>
                        {r.score}
                      </span>
                    </td>
                    <td className="py-3 px-2 font-medium">{r.name}</td>
                    <td className="py-3 px-2 text-gray-400">{r.sector}</td>
                    <td className="py-3 px-2 text-gray-400">{r.stage}</td>
                    <td className="py-3 px-2 text-gray-400">{r.checkSize}</td>
                    <td className="py-3 px-2 text-gray-500 text-xs">{r.matchReasoning}</td>
                    <td className="py-3 px-2">
                      <button onClick={() => handleSave(r)} disabled={saving === r._id}
                        className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded transition-colors">
                        {saving === r._id ? "Saving..." : "Save"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
