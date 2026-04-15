"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SILO_LABELS, SILO_ICONS } from "@/lib/types";

type Tab = "overview" | "users" | "resources" | "quiz" | "leads" | "apikeys";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [analytics, setAnalytics] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [quizResults, setQuizResults] = useState<any[]>([]);
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [newKey, setNewKey] = useState({ service: "", key: "" });
  const [leads, setLeads] = useState<any[]>([]);
  const [leadFilter, setLeadFilter] = useState({ status: "all", sort: "date" });
  const [leadSearch, setLeadSearch] = useState("");
  const [expandedLead, setExpandedLead] = useState<string | null>(null);
  const [newResource, setNewResource] = useState({ title: "", silo: "business", type: "guide", description: "" });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login?callbackUrl=/admin");
    if (status === "authenticated" && (session?.user as any)?.role !== "admin") {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  useEffect(() => {
    if ((session?.user as any)?.role === "admin") {
      fetch("/api/admin/analytics").then(r => r.json()).then(setAnalytics).catch(() => {});
      fetch("/api/admin/users").then(r => r.json()).then(d => Array.isArray(d) ? setUsers(d) : null).catch(() => {});
      fetch("/api/admin/resources").then(r => r.json()).then(d => Array.isArray(d) ? setResources(d) : null).catch(() => {});
      fetch("/api/quiz").then(r => r.json()).then(d => Array.isArray(d) ? setQuizResults(d) : null).catch(() => {});
      fetch("/api/admin/api-keys").then(r => r.json()).then(d => Array.isArray(d) ? setApiKeys(d) : null).catch(() => {});
      fetch("/api/leads").then(r => r.json()).then(d => Array.isArray(d) ? setLeads(d) : null).catch(() => {});
    }
  }, [session]);

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-[#FF8900] text-xl font-bold">Loading...</div>
    </div>;
  }

  if (!session?.user || (session.user as any).role !== "admin") return null;

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "leads", label: `Leads${leads.length ? ` (${leads.length})` : ""}`, icon: "🎯" },
    { id: "users", label: "Users", icon: "👥" },
    { id: "quiz", label: "Quiz Results", icon: "📋" },
    { id: "resources", label: "Resources", icon: "📚" },
    { id: "apikeys", label: "API Keys", icon: "🔑" },
  ];

  const fetchLeads = async () => {
    const params = new URLSearchParams();
    if (leadFilter.status !== "all") params.set("status", leadFilter.status);
    params.set("sort", leadFilter.sort);
    const data = await fetch(`/api/leads?${params}`).then(r => r.json());
    if (Array.isArray(data)) setLeads(data);
  };

  const updateLeadStatus = async (id: string, status: string) => {
    await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setLeads(leads.map(l => l._id === id ? { ...l, status, updatedAt: new Date().toISOString() } : l));
  };

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      new: "bg-green-500/20 text-green-400",
      called: "bg-blue-500/20 text-blue-400",
      not_interested: "bg-red-500/20 text-red-400",
    };
    return colors[status] || "bg-white/5 text-gray-500";
  };

  const addResource = async () => {
    if (!newResource.title) return;
    await fetch("/api/admin/resources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newResource),
    });
    setNewResource({ title: "", silo: "business", type: "guide", description: "" });
    const data = await fetch("/api/admin/resources").then(r => r.json());
    if (Array.isArray(data)) setResources(data);
  };

  const addApiKey = async () => {
    if (!newKey.service || !newKey.key) return;
    await fetch("/api/admin/api-keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newKey),
    });
    setNewKey({ service: "", key: "" });
    const data = await fetch("/api/admin/api-keys").then(r => r.json());
    if (Array.isArray(data)) setApiKeys(data);
  };

  return (
    <section className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-black mb-6">
          Admin <span className="text-[#FF8900]">Portal</span>
        </h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
                tab === t.id ? "bg-[#FF8900] text-black" : "bg-[#1a1a1a] text-gray-400 hover:text-white"
              }`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === "overview" && analytics && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Users", value: analytics.totalUsers, icon: "👥" },
                { label: "Quiz Submissions", value: analytics.totalQuizResults, icon: "📋" },
                { label: "Resources", value: analytics.totalResources, icon: "📚" },
                { label: "New Users (7d)", value: analytics.recentUsers, icon: "🆕" },
              ].map((s) => (
                <div key={s.label} className="bg-[#1a1a1a] border border-white/5 rounded-xl p-5">
                  <div className="text-2xl mb-2">{s.icon}</div>
                  <div className="text-3xl font-black text-[#FF8900]">{s.value}</div>
                  <div className="text-gray-500 text-sm">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Silo Distribution */}
            <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-6">
              <h3 className="font-bold mb-4">📊 Silo Distribution</h3>
              <div className="space-y-3">
                {(analytics.siloDist || []).map((s: any) => {
                  const total = analytics.totalQuizResults || 1;
                  const pct = Math.round((s.count / total) * 100);
                  return (
                    <div key={s._id} className="flex items-center gap-3">
                      <span className="text-lg w-6">{SILO_ICONS[s._id] || "❓"}</span>
                      <span className="text-sm text-gray-300 w-32">{SILO_LABELS[s._id] || s._id}</span>
                      <div className="flex-1 bg-white/5 rounded-full h-3">
                        <div className="bg-[#FF8900] h-3 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-sm text-gray-400 w-16 text-right">{s.count} ({pct}%)</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Leads */}
        {tab === "leads" && (
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search leads by name, email, phone, business, notes..."
                value={leadSearch}
                onChange={(e) => setLeadSearch(e.target.value)}
                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 pl-10 text-white text-sm focus:border-[#FF8900] focus:outline-none transition-colors"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
              {leadSearch && (
                <button onClick={() => setLeadSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-xs">✕</button>
              )}
            </div>
            <div className="flex flex-wrap gap-3 items-center">
              <select value={leadFilter.status} onChange={(e) => { setLeadFilter({ ...leadFilter, status: e.target.value }); }}
                className="bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#FF8900] focus:outline-none">
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="called">Called</option>
                <option value="not_interested">Not Interested</option>
              </select>
              <select value={leadFilter.sort} onChange={(e) => { setLeadFilter({ ...leadFilter, sort: e.target.value }); }}
                className="bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#FF8900] focus:outline-none">
                <option value="date">Sort by Date</option>
                <option value="quiz">Sort by Quiz</option>
              </select>
              <button onClick={fetchLeads} className="btn-primary text-sm !py-2">Apply</button>
              <span className="text-gray-500 text-xs ml-auto">
                {leads.filter(l => {
                  if (leadFilter.status !== "all" && l.status !== leadFilter.status) return false;
                  if (!leadSearch.trim()) return true;
                  const q = leadSearch.toLowerCase();
                  const searchable = [l.name, l.email, l.phone, l.businessName, l.website, l.geekProblem, l.quizTitle, l.report, l.status,
                    ...(l.answers || []).map((a: any) => `${a.question} ${a.answer}`)].filter(Boolean).join(" ").toLowerCase();
                  return searchable.includes(q);
                }).length} results
              </span>
            </div>
            <div className="bg-[#1a1a1a] border border-white/5 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="text-left px-4 py-3 text-gray-400 font-semibold">Name</th>
                      <th className="text-left px-4 py-3 text-gray-400 font-semibold">Email</th>
                      <th className="text-left px-4 py-3 text-gray-400 font-semibold">Phone</th>
                      <th className="text-left px-4 py-3 text-gray-400 font-semibold">Business</th>
                      <th className="text-left px-4 py-3 text-gray-400 font-semibold">Score</th>
                      <th className="text-left px-4 py-3 text-gray-400 font-semibold">Status</th>
                      <th className="text-left px-4 py-3 text-gray-400 font-semibold">Date & Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {leads.filter(l => {
                      if (leadFilter.status !== "all" && l.status !== leadFilter.status) return false;
                      if (!leadSearch.trim()) return true;
                      const q = leadSearch.toLowerCase();
                      const searchable = [l.name, l.email, l.phone, l.businessName, l.website, l.geekProblem, l.quizTitle, l.report, l.status,
                        ...(l.answers || []).map((a: any) => `${a.question} ${a.answer}`)].filter(Boolean).join(" ").toLowerCase();
                      return searchable.includes(q);
                    }).map((l: any) => (
                      <tr key={l._id} className="hover:bg-white/5 cursor-pointer" onClick={() => setExpandedLead(expandedLead === l._id ? null : l._id)}>
                        <td className="px-4 py-3 text-gray-300 font-medium">{l.name}</td>
                        <td className="px-4 py-3 text-gray-400">{l.email}</td>
                        <td className="px-4 py-3 text-gray-400">{l.phone}</td>
                        <td className="px-4 py-3 text-gray-400">{l.businessName || "—"}</td>
                        <td className="px-4 py-3 text-[#FF8900] font-bold">{l.score}</td>
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <select value={l.status} onChange={(e) => updateLeadStatus(l._id, e.target.value)}
                            className={`text-xs px-2 py-1 rounded border-0 focus:outline-none ${statusBadge(l.status)}`}>
                            <option value="new">New</option>
                            <option value="called">Called</option>
                            <option value="not_interested">Not Interested</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{l.createdAt ? new Date(l.createdAt).toLocaleString() : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {leads.length === 0 && <div className="p-8 text-center text-gray-500">No leads yet</div>}
            </div>
            {/* Expanded lead detail */}
            {expandedLead && (() => {
              const l = leads.find(x => x._id === expandedLead);
              if (!l) return null;
              return (
                <div className="bg-[#1a1a1a] border border-[#FF8900]/20 rounded-xl p-6 space-y-6">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg">{l.name} — <span className="text-[#FF8900]">{l.score}/100</span></h3>
                    <button onClick={() => setExpandedLead(null)} className="text-gray-500 hover:text-white">✕</button>
                  </div>

                  {/* Contact Info */}
                  <div>
                    <h4 className="font-semibold text-[#FF8900] text-sm mb-3 uppercase tracking-wider">Contact Info</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {[
                        { label: "Name", value: l.name },
                        { label: "Email", value: l.email },
                        { label: "Phone", value: l.phone },
                        { label: "Business Name", value: l.businessName },
                        { label: "Website", value: l.website },
                      ].filter(f => f.value).map((f, i) => (
                        <div key={i} className="bg-black/20 rounded-lg px-4 py-2">
                          <div className="text-gray-500 text-xs">{f.label}</div>
                          <div className="text-gray-200 text-sm">{f.label === "Email" ? <a href={`mailto:${f.value}`} className="text-[#FF8900] hover:underline">{f.value}</a> : f.label === "Website" ? <a href={f.value} target="_blank" rel="noopener noreferrer" className="text-[#FF8900] hover:underline">{f.value}</a> : f.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Geek Problem */}
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
                      <div className="space-y-2">
                        {l.answers.map((a: any, i: number) => (
                          <div key={i} className="bg-black/20 rounded-lg px-4 py-2">
                            <div className="text-gray-500 text-xs">{a.question}</div>
                            <div className="text-gray-300 text-sm font-medium">{a.answer}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Report */}
                  {l.report && (
                    <div>
                      <h4 className="font-semibold text-[#FF8900] text-sm mb-2 uppercase tracking-wider">Report</h4>
                      <pre className="text-gray-300 text-sm whitespace-pre-wrap bg-black/30 rounded-lg p-4">{l.report}</pre>
                    </div>
                  )}

                  {/* Timestamps */}
                  <div className="flex gap-6 text-xs text-gray-500 border-t border-white/5 pt-4">
                    <span>Created: {l.createdAt ? new Date(l.createdAt).toLocaleString() : "—"}</span>
                    <span>Updated: {l.updatedAt ? new Date(l.updatedAt).toLocaleString() : "—"}</span>
                    <span>Status: <span className={`${statusBadge(l.status)} px-2 py-0.5 rounded`}>{l.status}</span></span>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Users */}
        {tab === "users" && (
          <div className="bg-[#1a1a1a] border border-white/5 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-white/5">
                  <tr>
                    <th className="text-left px-4 py-3 text-gray-400 font-semibold">Name</th>
                    <th className="text-left px-4 py-3 text-gray-400 font-semibold">Email</th>
                    <th className="text-left px-4 py-3 text-gray-400 font-semibold">Silo</th>
                    <th className="text-left px-4 py-3 text-gray-400 font-semibold">Role</th>
                    <th className="text-left px-4 py-3 text-gray-400 font-semibold">Quizzes</th>
                    <th className="text-left px-4 py-3 text-gray-400 font-semibold">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((u: any, i: number) => (
                    <tr key={i} className="hover:bg-white/5">
                      <td className="px-4 py-3 text-gray-300">{u.name || "—"}</td>
                      <td className="px-4 py-3 text-gray-400">{u.email}</td>
                      <td className="px-4 py-3">
                        {u.siloInterest ? (
                          <span className="text-xs bg-[#FF8900]/20 text-[#FF8900] px-2 py-1 rounded">
                            {SILO_ICONS[u.siloInterest]} {SILO_LABELS[u.siloInterest]}
                          </span>
                        ) : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded ${
                          u.role === "admin" ? "bg-[#DC2626]/20 text-[#DC2626]" : "bg-white/5 text-gray-500"
                        }`}>{u.role}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-400">{u.quizResults?.length || 0}</td>
                      <td className="px-4 py-3 text-gray-500">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {users.length === 0 && <div className="p-8 text-center text-gray-500">No users yet</div>}
          </div>
        )}

        {/* Quiz Results */}
        {tab === "quiz" && (
          <div className="bg-[#1a1a1a] border border-white/5 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-white/5">
                  <tr>
                    <th className="text-left px-4 py-3 text-gray-400 font-semibold">Name</th>
                    <th className="text-left px-4 py-3 text-gray-400 font-semibold">Email</th>
                    <th className="text-left px-4 py-3 text-gray-400 font-semibold">Silo</th>
                    <th className="text-left px-4 py-3 text-gray-400 font-semibold">Industry</th>
                    <th className="text-left px-4 py-3 text-gray-400 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {quizResults.map((q: any, i: number) => (
                    <tr key={i} className="hover:bg-white/5">
                      <td className="px-4 py-3 text-gray-300">{q.name}</td>
                      <td className="px-4 py-3 text-gray-400">{q.email}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs bg-[#FF8900]/20 text-[#FF8900] px-2 py-1 rounded">
                          {SILO_ICONS[q.silo]} {SILO_LABELS[q.silo] || q.silo}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400">{q.industry || "—"}</td>
                      <td className="px-4 py-3 text-gray-500">{new Date(q.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {quizResults.length === 0 && <div className="p-8 text-center text-gray-500">No quiz submissions yet</div>}
          </div>
        )}

        {/* Resources */}
        {tab === "resources" && (
          <div className="space-y-6">
            {/* Add Resource */}
            <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-6">
              <h3 className="font-bold mb-4">➕ Add Resource</h3>
              <div className="grid md:grid-cols-4 gap-3">
                <input placeholder="Title" value={newResource.title}
                  onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                  className="bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#FF8900] focus:outline-none" />
                <select value={newResource.silo}
                  onChange={(e) => setNewResource({ ...newResource, silo: e.target.value })}
                  className="bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#FF8900] focus:outline-none">
                  {Object.entries(SILO_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                <select value={newResource.type}
                  onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}
                  className="bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#FF8900] focus:outline-none">
                  {["guide", "framework", "template", "video", "tool", "article"].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <button onClick={addResource} className="btn-primary text-sm !py-2">Add</button>
              </div>
              <input placeholder="Description" value={newResource.description}
                onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                className="mt-3 w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#FF8900] focus:outline-none" />
            </div>

            {/* Resource List */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resources.map((r: any, i: number) => (
                <div key={i} className="bg-[#1a1a1a] border border-white/5 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs bg-[#FF8900]/20 text-[#FF8900] px-2 py-1 rounded capitalize">{r.type}</span>
                    <span className="text-sm">{SILO_ICONS[r.silo]}</span>
                  </div>
                  <h4 className="font-semibold text-gray-200 text-sm">{r.title}</h4>
                  <p className="text-gray-500 text-xs mt-1">{r.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* API Keys */}
        {tab === "apikeys" && (
          <div className="space-y-6">
            <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-6">
              <h3 className="font-bold mb-4">🔑 Add API Key</h3>
              <div className="grid md:grid-cols-3 gap-3">
                <select value={newKey.service} onChange={(e) => setNewKey({ ...newKey, service: e.target.value })}
                  className="bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#FF8900] focus:outline-none">
                  <option value="">Select Service</option>
                  <option value="gohighlevel">GoHighLevel</option>
                  <option value="openai">OpenAI</option>
                  <option value="stripe">Stripe</option>
                  <option value="sendgrid">SendGrid</option>
                  <option value="custom">Custom</option>
                </select>
                <input type="password" placeholder="API Key" value={newKey.key}
                  onChange={(e) => setNewKey({ ...newKey, key: e.target.value })}
                  className="bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-mono focus:border-[#FF8900] focus:outline-none" />
                <button onClick={addApiKey} className="btn-primary text-sm !py-2">Save Key</button>
              </div>
            </div>

            <div className="bg-[#1a1a1a] border border-white/5 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-white/5">
                  <tr>
                    <th className="text-left px-4 py-3 text-gray-400 font-semibold">Service</th>
                    <th className="text-left px-4 py-3 text-gray-400 font-semibold">Key (masked)</th>
                    <th className="text-left px-4 py-3 text-gray-400 font-semibold">Added By</th>
                    <th className="text-left px-4 py-3 text-gray-400 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {apiKeys.map((k: any, i: number) => (
                    <tr key={i} className="hover:bg-white/5">
                      <td className="px-4 py-3 text-gray-300 capitalize">{k.service}</td>
                      <td className="px-4 py-3 text-gray-400 font-mono">{k.key}</td>
                      <td className="px-4 py-3 text-gray-500">{k.createdBy}</td>
                      <td className="px-4 py-3 text-gray-500">{k.createdAt ? new Date(k.createdAt).toLocaleDateString() : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {apiKeys.length === 0 && <div className="p-8 text-center text-gray-500">No API keys configured</div>}
            </div>

            <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6 text-sm text-gray-500">
              <p className="font-semibold text-gray-400 mb-2">ℹ️ Notes</p>
              <ul className="space-y-1">
                <li>• API keys are stored encrypted in the database</li>
                <li>• GoHighLevel key is used for lead capture and webhook integration</li>
                <li>• Keys are masked in the UI for security</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
