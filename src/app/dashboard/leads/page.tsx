"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import DashboardNav from "@/components/dashboard/DashboardNav";
import { SILO_LABELS } from "@/lib/types";
import type { LeadStatus } from "@/lib/expense-types";

const STATUSES: LeadStatus[] = ["new", "contacted", "qualified", "converted"];
const STATUS_COLORS: Record<LeadStatus, string> = {
  new: "#3B82F6",
  contacted: "#F59E0B",
  qualified: "#FF8900",
  converted: "#22C55E",
};

export default function LeadsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [leads, setLeads] = useState<any[]>([]);
  const [filterSilo, setFilterSilo] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [expandedLead, setExpandedLead] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login?callbackUrl=/dashboard/leads");
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      // Fetch from both APIs and merge
      Promise.all([
        fetch("/api/leads").then(r => r.json()).catch(() => []),
        fetch("/api/quiz").then(r => r.json()).catch(() => []),
      ]).then(([crmLeads, quizLeads]) => {
        const crmArr = Array.isArray(crmLeads) ? crmLeads : [];
        const quizArr = Array.isArray(quizLeads) ? quizLeads : [];

        // Index CRM leads by email for dedup
        const byEmail = new Map<string, any>();
        crmArr.forEach((l: any) => {
          const key = (l.email || "").toLowerCase();
          if (key) byEmail.set(key, { ...l, source: "quiz (full)" });
        });

        // Add quiz-only leads that aren't already in CRM
        quizArr.forEach((q: any) => {
          const key = (q.email || "").toLowerCase();
          if (key && !byEmail.has(key)) {
            byEmail.set(key, { ...q, status: q.status || "new", source: "quiz" });
          }
        });

        setLeads(Array.from(byEmail.values()).sort((a, b) =>
          new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        ));
      });
    }
  }, [session]);

  const filtered = useMemo(() => {
    return leads.filter(l => {
      if (filterSilo && l.silo !== filterSilo) return false;
      if (filterStatus && l.status !== filterStatus) return false;
      if (dateFrom && new Date(l.createdAt) < new Date(dateFrom)) return false;
      if (dateTo && new Date(l.createdAt) > new Date(dateTo + "T23:59:59")) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const searchable = [l.name, l.email, l.phone, l.businessName, l.website, l.geekProblem, l.quizTitle, l.report, l.status, l.silo,
          ...(l.answers || []).map((a: any) => `${a.question} ${a.answer}`)].filter(Boolean).join(" ").toLowerCase();
        if (!searchable.includes(q)) return false;
      }
      return true;
    });
  }, [leads, filterSilo, filterStatus, dateFrom, dateTo, searchQuery]);

  const funnelCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    STATUSES.forEach(s => { counts[s] = filtered.filter(l => l.status === s).length; });
    return counts;
  }, [filtered]);

  const maxFunnel = Math.max(...Object.values(funnelCounts), 1);

  if (status === "loading") return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-[#FF8900] text-xl font-bold">Loading...</div></div>;
  if (!session?.user) return null;

  const statusBadge = (s: string) => {
    const colors: Record<string, string> = {
      new: "bg-blue-500/20 text-blue-400",
      contacted: "bg-yellow-500/20 text-yellow-400",
      qualified: "bg-[#FF8900]/20 text-[#FF8900]",
      converted: "bg-green-500/20 text-green-400",
      called: "bg-blue-500/20 text-blue-400",
      not_interested: "bg-red-500/20 text-red-400",
    };
    return colors[s] || "bg-white/5 text-gray-500";
  };

  const updateLeadStatus = async (id: string, newStatus: string) => {
    try {
      await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setLeads(leads.map(l => l._id === id ? { ...l, status: newStatus, updatedAt: new Date().toISOString() } : l));
    } catch {}
  };

  return (
    <section className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <DashboardNav />
        <h1 className="text-3xl font-black mb-6">Lead <span className="text-[#FF8900]">Funnel</span></h1>

        {/* MASTERMIND Leads - Pink Box */}
        {(() => {
          const mmLeads = filtered.filter(l => l.type === "MASTERMIND" || l.silo === "mastermind" || l.quizTitle === "MASTERMIND");
          if (mmLeads.length === 0) return null;
          return (
            <div className="mb-8 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border-2 border-pink-500 rounded-xl p-6">
              <h2 className="text-lg font-bold text-pink-400 mb-4 flex items-center gap-2">
                🏝️ MASTERMIND <span className="text-xs bg-pink-500/20 px-2 py-1 rounded-full">{mmLeads.length}</span>
              </h2>
              <div className="space-y-2">
                {mmLeads.map((l: any) => (
                  <div key={l._id || l.email} className={`flex items-center justify-between p-3 rounded-lg ${l.status === "converted" ? "bg-green-500/10 border border-green-500/30" : "bg-white/5"}`}>
                    <div className="flex items-center gap-4">
                      <div>
                        <span className="font-semibold text-white">{l.name}</span>
                        <span className="text-gray-400 text-sm ml-3">{l.email}</span>
                        {l.businessName && <span className="text-gray-500 text-sm ml-3">({l.businessName})</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {l.creditsRequested && <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded">CREDITS REQUESTED</span>}
                      {l.selectedProgram && <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded">{l.selectedProgram}</span>}
                      <span className={`text-xs px-2 py-1 rounded ${l.status === "converted" ? "bg-green-500/20 text-green-400" : statusBadge(l.status)}`}>
                        {l.status === "converted" ? "READY" : l.status}
                      </span>
                      <span className="text-xs text-gray-500">{l.createdAt ? new Date(l.createdAt).toLocaleDateString() + " " + new Date(l.createdAt).toLocaleTimeString() : ""}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Funnel Visualization */}
        <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-6 mb-8">
          <h2 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wide">Funnel Overview</h2>
          <div className="space-y-3">
            {STATUSES.map(s => (
              <div key={s} className="flex items-center gap-4">
                <span className="text-sm font-semibold w-24 capitalize text-gray-300">{s}</span>
                <div className="flex-1 bg-[#111] rounded-full h-8 overflow-hidden">
                  <div
                    className="h-full rounded-full flex items-center px-3 text-xs font-bold text-black transition-all duration-500"
                    style={{ width: `${Math.max((funnelCounts[s] / maxFunnel) * 100, 8)}%`, backgroundColor: STATUS_COLORS[s] }}
                  >
                    {funnelCounts[s]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search leads by name, email, phone, business, notes, quiz answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 pl-10 text-white text-sm focus:border-[#FF8900] focus:outline-none transition-colors"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-xs">✕</button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6 items-center">
          <select value={filterSilo} onChange={e => setFilterSilo(e.target.value)} className="bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white">
            <option value="">All Silos</option>
            {Object.entries(SILO_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white">
            <option value="">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
          <span className="text-gray-500 text-xs ml-auto">{filtered.length} lead{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        {/* Leads Table */}
        <div className="bg-[#1a1a1a] border border-white/5 rounded-xl overflow-hidden mb-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-left">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Business</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">No leads found</td></tr>
                )}
                {filtered.map((lead, i) => (
                  <tr
                    key={lead._id || i}
                    className={`border-b border-white/5 hover:bg-white/5 cursor-pointer ${expandedLead === (lead._id || i) ? "bg-white/5" : ""}`}
                    onClick={() => setExpandedLead(expandedLead === (lead._id || i) ? null : (lead._id || i))}
                  >
                    <td className="px-4 py-3 text-white font-medium">{lead.name}</td>
                    <td className="px-4 py-3 text-gray-400">{lead.email}</td>
                    <td className="px-4 py-3 text-gray-400">{lead.phone || "—"}</td>
                    <td className="px-4 py-3 text-gray-400">{lead.businessName || "—"}</td>
                    <td className="px-4 py-3 text-[#FF8900] font-bold">{lead.score ?? "—"}</td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={lead.status || "new"}
                        onChange={(e) => updateLeadStatus(lead._id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded border-0 focus:outline-none ${statusBadge(lead.status || "new")}`}
                      >
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{lead.createdAt ? new Date(lead.createdAt).toLocaleString() : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expanded Lead Detail */}
        {expandedLead && (() => {
          const l = filtered.find((x: any) => (x._id || filtered.indexOf(x)) === expandedLead);
          if (!l) return null;
          return (
            <div className="bg-[#1a1a1a] border border-[#FF8900]/20 rounded-xl p-6 space-y-6 animate-fade-in-up">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-xl">{l.name} {l.score != null && <span className="text-[#FF8900]">— {l.score}/100</span>}</h3>
                <button onClick={() => setExpandedLead(null)} className="text-gray-500 hover:text-white text-lg">✕</button>
              </div>

              {/* Contact Info */}
              <div>
                <h4 className="font-semibold text-[#FF8900] text-sm mb-3 uppercase tracking-wider">Contact Information</h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { label: "Name", value: l.name },
                    { label: "Email", value: l.email, type: "email" },
                    { label: "Phone", value: l.phone, type: "phone" },
                    { label: "Business Name", value: l.businessName },
                    { label: "Website", value: l.website, type: "url" },
                    { label: "Silo", value: SILO_LABELS[l.silo] || l.silo },
                  ].filter(f => f.value).map((f, i) => (
                    <div key={i} className="bg-black/20 rounded-lg px-4 py-3">
                      <div className="text-gray-500 text-xs uppercase tracking-wide">{f.label}</div>
                      <div className="text-gray-200 text-sm mt-1">
                        {f.type === "email" ? <a href={`mailto:${f.value}`} className="text-[#FF8900] hover:underline">{f.value}</a>
                          : f.type === "phone" ? <a href={`tel:${f.value}`} className="text-[#FF8900] hover:underline">{f.value}</a>
                          : f.type === "url" ? <a href={f.value} target="_blank" rel="noopener noreferrer" className="text-[#FF8900] hover:underline">{f.value}</a>
                          : f.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Geek Problem / Notes */}
              {l.geekProblem && (
                <div>
                  <h4 className="font-semibold text-[#FF8900] text-sm mb-2 uppercase tracking-wider">What Problem Can a Geek Solve?</h4>
                  <div className="bg-black/20 rounded-lg px-4 py-3 text-gray-300 text-sm whitespace-pre-wrap">{l.geekProblem}</div>
                </div>
              )}

              {/* Quiz Answers */}
              {l.answers && l.answers.length > 0 && (
                <div>
                  <h4 className="font-semibold text-[#FF8900] text-sm mb-3 uppercase tracking-wider">Quiz Answers</h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {l.answers.map((a: any, i: number) => (
                      <div key={i} className="bg-black/20 rounded-lg px-4 py-3">
                        <div className="text-gray-500 text-xs">{a.question}</div>
                        <div className="text-gray-200 text-sm font-medium mt-1">{a.answer}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pain Points (from old quiz format) */}
              {l.painPoints && (
                <div>
                  <h4 className="font-semibold text-[#FF8900] text-sm mb-2 uppercase tracking-wider">Pain Points</h4>
                  <div className="bg-black/20 rounded-lg px-4 py-3 text-gray-300 text-sm">{l.painPoints}</div>
                </div>
              )}

              {/* Industry */}
              {l.industry && (
                <div>
                  <h4 className="font-semibold text-[#FF8900] text-sm mb-2 uppercase tracking-wider">Industry</h4>
                  <div className="bg-black/20 rounded-lg px-4 py-3 text-gray-300 text-sm">{l.industry}</div>
                </div>
              )}

              {/* Full Report */}
              {l.report && (
                <div>
                  <h4 className="font-semibold text-[#FF8900] text-sm mb-2 uppercase tracking-wider">Disruption Readiness Report</h4>
                  <pre className="text-gray-300 text-sm whitespace-pre-wrap bg-black/30 rounded-lg p-4 leading-relaxed">{l.report}</pre>
                </div>
              )}

              {/* CRM Metadata */}
              <div className="border-t border-white/5 pt-4">
                <h4 className="font-semibold text-[#FF8900] text-sm mb-3 uppercase tracking-wider">CRM Data</h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="bg-black/20 rounded-lg px-4 py-3">
                    <div className="text-gray-500 text-xs uppercase">Status</div>
                    <div className="mt-1"><span className={`text-xs px-2 py-1 rounded font-bold ${statusBadge(l.status || "new")}`}>{l.status || "new"}</span></div>
                  </div>
                  <div className="bg-black/20 rounded-lg px-4 py-3">
                    <div className="text-gray-500 text-xs uppercase">Source</div>
                    <div className="text-gray-200 text-sm mt-1">{l.source || l.quizTitle || "quiz"}</div>
                  </div>
                  <div className="bg-black/20 rounded-lg px-4 py-3">
                    <div className="text-gray-500 text-xs uppercase">Created</div>
                    <div className="text-gray-200 text-sm mt-1">{l.createdAt ? new Date(l.createdAt).toLocaleString() : "—"}</div>
                  </div>
                  <div className="bg-black/20 rounded-lg px-4 py-3">
                    <div className="text-gray-500 text-xs uppercase">Last Updated</div>
                    <div className="text-gray-200 text-sm mt-1">{l.updatedAt ? new Date(l.updatedAt).toLocaleString() : "—"}</div>
                  </div>
                  {l.score != null && (
                    <div className="bg-black/20 rounded-lg px-4 py-3">
                      <div className="text-gray-500 text-xs uppercase">Quiz Score</div>
                      <div className="text-[#FF8900] text-lg font-black mt-1">{l.score}/100</div>
                    </div>
                  )}
                  {l.quizTitle && (
                    <div className="bg-black/20 rounded-lg px-4 py-3">
                      <div className="text-gray-500 text-xs uppercase">Quiz</div>
                      <div className="text-gray-200 text-sm mt-1">{l.quizTitle}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </section>
  );
}
