"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardNav from "@/components/dashboard/DashboardNav";
import { SILO_LABELS, SILO_ICONS } from "@/lib/types";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [quizResults, setQuizResults] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login?callbackUrl=/dashboard");
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetch("/api/admin/resources").then(r => r.json()).then(setResources).catch(() => {});
      // Fetch user's quiz results
      fetch("/api/quiz").then(r => r.json()).then((data) => {
        if (Array.isArray(data)) {
          setQuizResults(data.filter((q: any) => q.email === session.user?.email));
        }
      }).catch(() => {});
    }
  }, [session]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-[#FF8900] text-xl font-bold">Loading...</div>
      </div>
    );
  }

  if (!session?.user) return null;

  const user = session.user as any;
  const silo = user.siloInterest;
  const siloLabel = silo ? SILO_LABELS[silo] : null;
  const siloIcon = silo ? SILO_ICONS[silo] : "🎯";
  const siloResources = resources.filter((r: any) => r.silo === silo).slice(0, 5);

  return (
    <section className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <DashboardNav />
        {/* Welcome */}
        <div className="mb-10 animate-fade-in-up">
          <h1 className="text-3xl md:text-4xl font-black mb-2">
            Welcome back, <span className="text-[#FF8900]">{user.name?.split(" ")[0] || "Champion"}</span>
          </h1>
          <p className="text-gray-400 text-lg">
            {siloLabel ? `${siloIcon} ${siloLabel} Path` : "Choose your path to get personalized content"}
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Quiz Results", value: quizResults.length, icon: "📋" },
            { label: "Resources Available", value: resources.filter(r => !silo || r.silo === silo).length, icon: "📚" },
            { label: "Your Silo", value: siloLabel || "Not Set", icon: siloIcon },
            { label: "Member Since", value: "2024", icon: "⭐" },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#1a1a1a] border border-white/5 rounded-xl p-5">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-black text-white">{stat.value}</div>
              <div className="text-gray-500 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Silo Dashboards */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-bold mb-4">Your <span className="text-[#FF8900]">Paths</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(SILO_LABELS).map(([slug, label]) => (
                <Link
                  key={slug}
                  href={`/dashboard/${slug}`}
                  className={`card-hover bg-[#1a1a1a] border rounded-xl p-5 group ${
                    slug === silo ? "border-[#FF8900]/50" : "border-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{SILO_ICONS[slug]}</span>
                    <h3 className="font-bold group-hover:text-[#FF8900] transition-colors">{label}</h3>
                  </div>
                  <p className="text-gray-500 text-sm">
                    Tools, resources, and insights for {label.toLowerCase()}
                  </p>
                  {slug === silo && (
                    <span className="mt-2 inline-block text-xs bg-[#FF8900]/20 text-[#FF8900] px-2 py-1 rounded">
                      Your Path
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quiz Results */}
            <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-5">
              <h3 className="font-bold mb-3">📋 Quiz Results</h3>
              {quizResults.length === 0 ? (
                <div>
                  <p className="text-gray-500 text-sm mb-3">No quiz results yet.</p>
                  <Link href="/quiz" className="text-[#FF8900] text-sm font-semibold hover:text-[#ffa033]">
                    Take the Disruption Quiz →
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {quizResults.slice(0, 3).map((q: any, i: number) => (
                    <div key={i} className="text-sm text-gray-400 bg-[#111] rounded-lg p-3">
                      <span className="text-[#FF8900] font-semibold">{SILO_LABELS[q.silo] || q.silo}</span>
                      <span className="text-gray-600 ml-2">{new Date(q.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recommended Resources */}
            <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-5">
              <h3 className="font-bold mb-3">📚 Recommended Resources</h3>
              {siloResources.length > 0 ? (
                <div className="space-y-2">
                  {siloResources.map((r: any, i: number) => (
                    <div key={i} className="text-sm text-gray-400 bg-[#111] rounded-lg p-3">
                      <div className="font-semibold text-gray-300">{r.title}</div>
                      <div className="text-xs text-gray-600 mt-1">{r.type}</div>
                    </div>
                  ))}
                  <Link href="/resources" className="text-[#FF8900] text-sm font-semibold hover:text-[#ffa033] block mt-2">
                    View all resources →
                  </Link>
                </div>
              ) : (
                <div>
                  <p className="text-gray-500 text-sm mb-3">Select a silo to see recommended resources.</p>
                  <Link href="/resources" className="text-[#FF8900] text-sm font-semibold hover:text-[#ffa033]">
                    Browse all resources →
                  </Link>
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-[#FF8900]/10 to-[#DC2626]/10 border border-[#FF8900]/20 rounded-xl p-5 text-center">
              <h3 className="font-bold mb-2">Ready to Scale?</h3>
              <p className="text-gray-400 text-sm mb-3">Book a call with Jeff to discuss your roadmap.</p>
              <Link href="/contact" className="btn-primary text-sm !py-2 !px-5">
                Book a Call
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
