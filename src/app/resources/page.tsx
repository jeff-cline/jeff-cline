"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { SILO_LABELS, SILO_ICONS } from "@/lib/types";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function ResourcesPage() {
  const [resources, setResources] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    fetch("/api/admin/resources").then(r => r.json()).then(setResources).catch(() => {});
  }, []);

  const filtered = resources.filter((r) => {
    if (filter !== "all" && r.silo !== filter) return false;
    if (typeFilter !== "all" && r.type !== typeFilter) return false;
    return true;
  });

  const types = [...new Set(resources.map(r => r.type))];

  return (
    <><Breadcrumbs items={[{ label: "Resources" }]} />
    <section className="min-h-screen pt-8 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-fade-in-up">
          <p className="text-[#DC2626] font-bold text-sm tracking-[0.3em] uppercase mb-4">LIBRARY</p>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Resources & <span className="text-[#FF8900]">Frameworks</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Curated guides, templates, and frameworks for every path to profit at scale.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          <button onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              filter === "all" ? "bg-[#FF8900] text-black" : "bg-[#1a1a1a] text-gray-400 hover:text-white"
            }`}>All Paths</button>
          {Object.entries(SILO_LABELS).map(([slug, label]) => (
            <button key={slug} onClick={() => setFilter(slug)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                filter === slug ? "bg-[#FF8900] text-black" : "bg-[#1a1a1a] text-gray-400 hover:text-white"
              }`}>{SILO_ICONS[slug]} {label}</button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          <button onClick={() => setTypeFilter("all")}
            className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
              typeFilter === "all" ? "bg-[#DC2626] text-white" : "bg-white/5 text-gray-500 hover:text-white"
            }`}>All Types</button>
          {types.map((t) => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-3 py-1 rounded text-xs font-semibold capitalize transition-colors ${
                typeFilter === t ? "bg-[#DC2626] text-white" : "bg-white/5 text-gray-500 hover:text-white"
              }`}>{t}</button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((r: any, i: number) => (
            <div key={i} className="card-hover bg-[#1a1a1a] border border-white/5 rounded-xl p-6">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs bg-[#FF8900]/20 text-[#FF8900] px-2 py-1 rounded capitalize">{r.type}</span>
                <span className="text-lg">{SILO_ICONS[r.silo]}</span>
              </div>
              <h3 className="font-bold text-gray-200 mb-2">{r.title}</h3>
              <p className="text-gray-500 text-sm mb-4">{r.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">{SILO_LABELS[r.silo]}</span>
                {r.featured && <span className="text-xs text-[#DC2626] font-bold">⭐ Featured</span>}
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl mb-2">No resources found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </section>
    </>
  );
}
