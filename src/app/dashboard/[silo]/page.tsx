"use client";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { SILO_LABELS, SILO_ICONS, SILOS } from "@/lib/types";
import { silos as siloData } from "@/lib/silo-data";

export default function SiloDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const slug = params.silo as string;
  const [resources, setResources] = useState<any[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login?callbackUrl=/dashboard/" + slug);
  }, [status, router, slug]);

  useEffect(() => {
    fetch("/api/admin/resources").then(r => r.json()).then((data) => {
      if (Array.isArray(data)) setResources(data.filter((r: any) => r.silo === slug));
    }).catch(() => {});
  }, [slug]);

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-[#FF8900] text-xl font-bold">Loading...</div>
    </div>;
  }

  if (!session?.user) return null;

  const label = SILO_LABELS[slug] || slug;
  const icon = SILO_ICONS[slug] || "🎯";
  const silo = siloData.find(s => s.slug === slug);

  const tools = [
    { name: "Disruption Quiz", desc: "Identify your biggest technology opportunities", href: "/quiz", icon: "🎯" },
    { name: "Resource Library", desc: `Curated resources for ${label}`, href: `/resources/${slug}`, icon: "📚" },
    { name: "Book a Call", desc: "1-on-1 strategy session with Jeff", href: "/contact", icon: "📞" },
  ];

  return (
    <section className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 flex items-center gap-2 mb-6">
          <Link href="/dashboard" className="hover:text-[#FF8900]">Dashboard</Link>
          <span>/</span>
          <span className="text-gray-300">{label}</span>
        </nav>

        {/* Hero */}
        <div className="mb-10 animate-fade-in-up">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{icon}</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-black">
                <span className="text-[#FF8900]">{label}</span> Dashboard
              </h1>
              <p className="text-gray-400">{silo?.heroSub || `Tools and resources for ${label.toLowerCase()}`}</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Tools */}
            <div>
              <h2 className="text-xl font-bold mb-4">🛠️ Tools & Actions</h2>
              <div className="grid gap-4">
                {tools.map((tool) => (
                  <Link key={tool.name} href={tool.href}
                    className="card-hover bg-[#1a1a1a] border border-white/5 rounded-xl p-5 flex items-center gap-4 group">
                    <span className="text-3xl">{tool.icon}</span>
                    <div>
                      <h3 className="font-bold group-hover:text-[#FF8900] transition-colors">{tool.name}</h3>
                      <p className="text-gray-500 text-sm">{tool.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Resources */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">📚 Resources</h2>
                <Link href={`/resources/${slug}`} className="text-[#FF8900] text-sm font-semibold hover:text-[#ffa033]">
                  View All →
                </Link>
              </div>
              <div className="grid gap-3">
                {resources.length === 0 ? (
                  <p className="text-gray-500 text-sm">No resources yet. Check back soon!</p>
                ) : (
                  resources.slice(0, 6).map((r: any, i: number) => (
                    <div key={i} className="bg-[#1a1a1a] border border-white/5 rounded-xl p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-200">{r.title}</h4>
                          <p className="text-gray-500 text-sm mt-1">{r.description}</p>
                        </div>
                        <span className="text-xs bg-[#FF8900]/20 text-[#FF8900] px-2 py-1 rounded whitespace-nowrap ml-3">
                          {r.type}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Deep Dives */}
            {silo && (
              <div>
                <h2 className="text-xl font-bold mb-4">🔍 Deep Dives</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {silo.subPages.map((sub) => (
                    <Link key={sub.slug} href={`/${slug}/${sub.slug}`}
                      className="card-hover bg-[#1a1a1a] border border-white/5 rounded-xl p-4 group">
                      <h4 className="font-bold text-sm group-hover:text-[#FF8900] transition-colors">{sub.title}</h4>
                      <p className="text-gray-500 text-xs mt-1">{sub.heroSub}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress */}
            <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-5">
              <h3 className="font-bold mb-4">📊 Your Progress</h3>
              <div className="space-y-3">
                {[
                  { label: "Quiz Completed", done: true },
                  { label: "Resources Viewed", done: resources.length > 0 },
                  { label: "Strategy Call Booked", done: false },
                  { label: "Implementation Started", done: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                      item.done ? "bg-[#FF8900] text-black" : "bg-white/10 text-gray-600"
                    }`}>
                      {item.done ? "✓" : i + 1}
                    </div>
                    <span className={`text-sm ${item.done ? "text-gray-300" : "text-gray-500"}`}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Problems */}
            {silo && (
              <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-5">
                <h3 className="font-bold mb-4 text-[#DC2626]">🔥 Common Problems</h3>
                <div className="space-y-3">
                  {silo.problems.map((p, i) => (
                    <div key={i} className="text-sm">
                      <div className="font-semibold text-gray-300">{p.title}</div>
                      <div className="text-gray-500 text-xs mt-1">{p.solution}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="bg-gradient-to-br from-[#FF8900]/10 to-[#DC2626]/10 border border-[#FF8900]/20 rounded-xl p-5 text-center">
              <h3 className="font-bold mb-2">Let&apos;s <span className="text-[#FF8900]">Talk</span></h3>
              <p className="text-gray-400 text-sm mb-3">Ready to weaponize technology for your {label.toLowerCase()}?</p>
              <Link href="/contact" className="btn-primary text-sm !py-2 !px-5">
                Contact Jeff
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
