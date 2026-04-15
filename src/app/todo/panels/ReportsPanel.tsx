"use client";
import { useState, useEffect } from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface Stats {
  totalVisits: number; totalRevenue: number; totalCredits: number; totalLeads: number; totalTodos: number; openTodos: number;
  leadsOverTime: { date: string; count: number }[];
  leadsBySource: { source: string; count: number }[];
  hittsOverTime: { date: string; count: number }[];
  hittsBySource: { source: string; count: number }[];
}

const COLORS = ["#FF8900", "#4ade80", "#60a5fa", "#c084fc", "#f87171", "#fbbf24", "#34d399", "#a78bfa", "#fb923c", "#38bdf8"];

export default function ReportsPanel() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/todo/stats").then(r => r.json()).then(setStats);
  }, []);

  if (!stats) return <div style={{ padding: 24, color: "#666" }}>Loading reports...</div>;

  const cards = [
    { label: "Total Leads", value: stats.totalLeads, color: "#FF8900" },
    { label: "Total Visits", value: stats.totalVisits, color: "#4ade80" },
    { label: "Total Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, color: "#60a5fa" },
    { label: "Total Credits", value: stats.totalCredits, color: "#c084fc" },
    { label: "Total Todos", value: stats.totalTodos, color: "#f59e0b" },
    { label: "Open Todos", value: stats.openTodos, color: "#f87171" },
  ];

  const tooltipStyle = { contentStyle: { background: "#1a1a1a", border: "1px solid #333", borderRadius: 8, fontSize: 13 }, labelStyle: { color: "#FF8900" } };

  return (
    <div style={{ padding: 16, maxWidth: 1200, margin: "0 auto" }}>
      <h2 style={{ color: "#FF8900", marginBottom: 16, fontSize: 17 }}>📈 Reports</h2>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10, marginBottom: 24 }}>
        {cards.map(c => (
          <div key={c.label} style={{ background: "#1a1a1a", border: "1px solid #222", borderRadius: 8, padding: 14 }}>
            <div style={{ color: "#888", fontSize: 12, marginBottom: 6 }}>{c.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: c.color }}>{typeof c.value === "number" ? c.value.toLocaleString() : c.value}</div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
        {/* Leads Over Time */}
        <div style={{ background: "#1a1a1a", border: "1px solid #222", borderRadius: 10, padding: 16 }}>
          <h3 style={{ color: "#FF8900", fontSize: 15, margin: "0 0 4px" }}>Leads Over Time</h3>
          <p style={{ color: "#666", fontSize: 12, margin: "0 0 12px" }}>New leads captured per day</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={stats.leadsOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis dataKey="date" tick={{ fill: "#666", fontSize: 10 }} tickFormatter={v => v.slice(5)} />
              <YAxis tick={{ fill: "#666", fontSize: 10 }} allowDecimals={false} />
              <Tooltip {...tooltipStyle} />
              <Line type="monotone" dataKey="count" stroke="#FF8900" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Leads by Source */}
        <div style={{ background: "#1a1a1a", border: "1px solid #222", borderRadius: 10, padding: 16 }}>
          <h3 style={{ color: "#FF8900", fontSize: 15, margin: "0 0 4px" }}>Leads by Source</h3>
          <p style={{ color: "#666", fontSize: 12, margin: "0 0 12px" }}>Where your leads come from</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={stats.leadsBySource} dataKey="count" nameKey="source" cx="50%" cy="50%" outerRadius={80} label={((props: any) => `${props.name || ''} ${((props.percent as number) * 100).toFixed(0)}%`) as any} labelLine={false} fontSize={11}>
                {stats.leadsBySource.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip {...tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* HITTs Over Time */}
        <div style={{ background: "#1a1a1a", border: "1px solid #222", borderRadius: 10, padding: 16 }}>
          <h3 style={{ color: "#4ade80", fontSize: 15, margin: "0 0 4px" }}>Visits Over Time</h3>
          <p style={{ color: "#666", fontSize: 12, margin: "0 0 12px" }}>Daily site visitor activity</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={stats.hittsOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis dataKey="date" tick={{ fill: "#666", fontSize: 10 }} tickFormatter={v => v.slice(5)} />
              <YAxis tick={{ fill: "#666", fontSize: 10 }} allowDecimals={false} />
              <Tooltip {...tooltipStyle} />
              <Line type="monotone" dataKey="count" stroke="#4ade80" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Visits by Source */}
        <div style={{ background: "#1a1a1a", border: "1px solid #222", borderRadius: 10, padding: 16 }}>
          <h3 style={{ color: "#60a5fa", fontSize: 15, margin: "0 0 4px" }}>Visits by Source</h3>
          <p style={{ color: "#666", fontSize: 12, margin: "0 0 12px" }}>Traffic sources breakdown</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.hittsBySource}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis dataKey="source" tick={{ fill: "#666", fontSize: 10 }} />
              <YAxis tick={{ fill: "#666", fontSize: 10 }} allowDecimals={false} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {stats.hittsBySource.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
