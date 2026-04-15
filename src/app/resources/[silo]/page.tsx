"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { SILO_LABELS, SILO_ICONS } from "@/lib/types";
import { silos as siloData } from "@/lib/silo-data";

export default function SiloResourcesPage() {
  const params = useParams();
  const slug = params.silo as string;
  const [resources, setResources] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/resources").then(r => r.json()).then((data) => {
      if (Array.isArray(data)) setResources(data.filter((r: any) => r.silo === slug));
    }).catch(() => {});
  }, [slug]);

  const label = SILO_LABELS[slug] || slug;
  const icon = SILO_ICONS[slug] || "📚";
  const silo = siloData.find(s => s.slug === slug);

  return (
    <section className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 flex items-center gap-2 mb-6">
          <Link href="/" className="hover:text-[#FF8900] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/resources" className="hover:text-[#FF8900] transition-colors">Resources</Link>
          <span>/</span>
          <span className="text-gray-300">{label}</span>
        </nav>

        <div className="text-center mb-12 animate-fade-in-up">
          <span className="text-5xl block mb-4">{icon}</span>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            <span className="text-[#FF8900]">{label}</span> Resources
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {silo?.heroSub || `Curated tools, guides, and frameworks for ${label.toLowerCase()}.`}
          </p>
        </div>

        {/* Featured */}
        {resources.filter(r => r.featured).length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold mb-4">⭐ Featured</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {resources.filter(r => r.featured).map((r: any, i: number) => (
                <div key={i} className="bg-gradient-to-br from-[#FF8900]/5 to-[#DC2626]/5 border border-[#FF8900]/20 rounded-xl p-6">
                  <span className="text-xs bg-[#FF8900]/20 text-[#FF8900] px-2 py-1 rounded capitalize">{r.type}</span>
                  <h3 className="font-bold text-lg text-gray-200 mt-3 mb-2">{r.title}</h3>
                  <p className="text-gray-500 text-sm">{r.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Resources */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.filter(r => !r.featured).map((r: any, i: number) => (
            <div key={i} className="card-hover bg-[#1a1a1a] border border-white/5 rounded-xl p-6">
              <span className="text-xs bg-white/5 text-gray-400 px-2 py-1 rounded capitalize">{r.type}</span>
              <h3 className="font-bold text-gray-200 mt-3 mb-2">{r.title}</h3>
              <p className="text-gray-500 text-sm">{r.description}</p>
            </div>
          ))}
        </div>

        {resources.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl mb-2">YEP, You need a geek.</p>
            <p className="text-sm">Send a TEXT to 223-400-8146 and just ask for help or request FREE TOOLS</p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-black mb-3">Need Custom <span className="text-[#FF8900]">Guidance</span>?</h2>
            <p className="text-gray-400 mb-6">These resources are a starting point. For personalized strategy, let&apos;s talk.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/quiz" className="btn-primary text-sm">Take the Quiz →</Link>
              <Link href="/contact" className="btn-secondary text-sm">Contact Jeff</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
