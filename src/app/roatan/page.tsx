"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface SubProject {
  type: string;
  description: string;
  notes: string;
  acres: string;
  units: string;
  returnType: string;
  costToBuild: string;
  totalRevenue: string;
  totalProfit: string;
  timeToBuild: string;
  irr: string;
  devStage: string;
  capitalStatus: string;
  capitalTarget: string;
  capitalRaised: string;
  fundingProgress: string;
}

interface RawProject {
  name: string;
  subprojects: SubProject[];
  presentation_link: string;
  maps_link: string;
}

interface MergedProject {
  name: string;
  slug: string;
  subprojects: SubProject[];
  presentation_link: string;
  maps_link: string;
  image: string;
  totalInvestment: number;
  types: string[];
  irrRange: string;
  devStage: string;
  capitalStatus: string;
  acres: string;
}

const IMAGE_MAP: Record<string, string> = {
  "Altitude": "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80",
  "Camp Bay Estates": "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
  "Caribbean Bliss": "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
  "Cliffside": "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80",
  "Cruise Port Beach Club": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
  "Cruise Port Terminal": "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=800&q=80",
  "La Champa": "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80",
  "Lending Company": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
  "Lime Cay": "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&q=80",
  "Oceana": "https://images.unsplash.com/photo-1615571022219-eb45cf7faa36?w=800&q=80",
  "Pristine Bay": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
  "Sea Breeze": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
  "Sunset Vista": "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80",
  "Turquoise Bay": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
};

function parseCurrency(s: string): number {
  if (!s) return 0;
  return parseFloat(s.replace(/[^0-9.]/g, "")) || 0;
}

function formatCurrency(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function mergeProjects(raw: RawProject[]): MergedProject[] {
  const merged: MergedProject[] = [];
  let seaBreeze: MergedProject | null = null;

  for (const p of raw) {
    const isSeaBreeze = p.name === "Sea Breeze" || p.name === "Seabreeze" || p.name === "Seabreeze waterfront condos";
    
    if (isSeaBreeze) {
      if (!seaBreeze) {
        seaBreeze = {
          name: "Sea Breeze",
          slug: "sea-breeze",
          subprojects: [...p.subprojects],
          presentation_link: p.presentation_link || "",
          maps_link: p.maps_link || "",
          image: IMAGE_MAP["Sea Breeze"],
          totalInvestment: 0,
          types: [],
          irrRange: "",
          devStage: "",
          capitalStatus: "",
          acres: "",
        };
      } else {
        seaBreeze.subprojects.push(...p.subprojects);
        if (p.presentation_link && !seaBreeze.presentation_link) seaBreeze.presentation_link = p.presentation_link;
        if (p.maps_link && !seaBreeze.maps_link) seaBreeze.maps_link = p.maps_link;
      }
    } else {
      merged.push({
        name: p.name,
        slug: slugify(p.name),
        subprojects: p.subprojects,
        presentation_link: p.presentation_link,
        maps_link: p.maps_link,
        image: IMAGE_MAP[p.name] || IMAGE_MAP["Altitude"],
        totalInvestment: 0,
        types: [],
        irrRange: "",
        devStage: "",
        capitalStatus: "",
        acres: "",
      });
    }
  }

  if (seaBreeze) merged.push(seaBreeze);

  // Compute aggregated fields
  for (const p of merged) {
    p.totalInvestment = p.subprojects.reduce((sum, sp) => sum + parseCurrency(sp.costToBuild), 0);
    
    const typeSet = new Set<string>();
    p.subprojects.forEach(sp => {
      sp.type.split(",").map(t => t.trim()).filter(Boolean).forEach(t => typeSet.add(t));
    });
    p.types = Array.from(typeSet);

    const irrs = p.subprojects.map(sp => parseFloat(sp.irr)).filter(n => !isNaN(n) && n > 0);
    if (irrs.length > 1) {
      p.irrRange = `${Math.min(...irrs).toFixed(1)}% - ${Math.max(...irrs).toFixed(1)}%`;
    } else if (irrs.length === 1) {
      p.irrRange = `${irrs[0].toFixed(1)}%`;
    } else {
      p.irrRange = "TBD";
    }

    const stages = p.subprojects.map(sp => sp.devStage).filter(Boolean);
    p.devStage = stages[0] || "Planning";

    const statuses = p.subprojects.map(sp => sp.capitalStatus).filter(Boolean);
    p.capitalStatus = statuses[0] || "TBD";

    const acresSet = p.subprojects.map(sp => sp.acres).filter(Boolean);
    p.acres = acresSet[0] || "";
  }

  return merged;
}

function TopBar() {
  return (
    <div className="w-full border-b border-[#1a1a1a] bg-[#0a0a0a]/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center text-sm">
        <a href="https://investordiscoverytour.com" target="_blank" rel="noopener noreferrer"
          className="text-[#C9A96E] hover:text-[#D4AF37] transition-colors font-medium">
          InvestorDiscoveryTour.com
        </a>
        <span className="text-gray-400">
          Jeff Cline | <a href="tel:9728006670" className="text-white hover:text-[#C9A96E] transition-colors">972-800-6670</a>
        </span>
      </div>
    </div>
  );
}

function FooterSection() {
  return (
    <footer className="border-t border-[#1a1a1a] bg-[#0a0a0a] py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-[#C9A96E] text-lg font-medium mb-2">Investor Discovery Tour</p>
        <p className="text-gray-400 mb-4">Contact Jeff Cline | 972-800-6670</p>
        <a href="https://investordiscoverytour.com" target="_blank" rel="noopener noreferrer"
          className="text-[#C9A96E] hover:text-[#D4AF37] transition-colors text-sm">
          InvestorDiscoveryTour.com
        </a>
        <div className="mt-8">
          <a href="https://jeff-cline.com" className="text-[6px]" style={{ opacity: 0.08 }}>JC</a>
        </div>
      </div>
    </footer>
  );
}

export default function RoatanPage() {
  const [step, setStep] = useState<"password" | "lead" | "dashboard">("password");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [leadForm, setLeadForm] = useState({ name: "", email: "", phone: "" });
  const [leadError, setLeadError] = useState("");
  const [leadLoading, setLeadLoading] = useState(false);
  const [projects, setProjects] = useState<MergedProject[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check for existing cookie
    if (document.cookie.includes("roatan_access=granted")) {
      // Check for lead cookie too
      if (document.cookie.includes("roatan_lead=done")) {
        setStep("dashboard");
        loadProjects();
      } else {
        setStep("lead");
      }
    }
  }, []);

  async function loadProjects() {
    const res = await fetch("/roatan/projects.json");
    const data: RawProject[] = await res.json();
    setProjects(mergeProjects(data));
  }

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setPasswordError("");
    try {
      const res = await fetch("/api/roatan/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        setStep("lead");
      } else {
        setPasswordError("Invalid password. Please try again.");
      }
    } catch {
      setPasswordError("Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  async function handleLead(e: React.FormEvent) {
    e.preventDefault();
    setLeadLoading(true);
    setLeadError("");
    try {
      const res = await fetch("/api/roatan/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadForm),
      });
      const data = await res.json();
      if (data.success) {
        document.cookie = "roatan_lead=done; path=/; max-age=" + (60 * 60 * 24 * 30);
        setStep("dashboard");
        loadProjects();
      } else {
        setLeadError("Please fill in all fields.");
      }
    } catch {
      setLeadError("Something went wrong. Please try again.");
    }
    setLeadLoading(false);
  }

  if (step === "password") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
        <TopBar />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md w-full animate-fadeIn">
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full border-2 border-[#C9A96E] flex items-center justify-center">
                <svg className="w-10 h-10 text-[#C9A96E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
                ROATAN INVESTMENT<br />PORTFOLIO
              </h1>
              <p className="text-[#C9A96E] text-lg tracking-widest uppercase">Investor Discovery Tour</p>
              <p className="text-gray-500 text-sm mt-4">Roatan, Bay Islands, Honduras</p>
            </div>
            <form onSubmit={handlePassword} className="space-y-4">
              <input
                type="password"
                placeholder="Enter Access Code"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-6 py-4 bg-[#111111] border border-[#1a1a1a] rounded-lg text-white text-center text-lg placeholder-gray-600 focus:outline-none focus:border-[#C9A96E] transition-colors"
                autoFocus
              />
              {passwordError && <p className="text-red-400 text-sm">{passwordError}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-[#C9A96E] to-[#D4AF37] text-black font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 text-lg"
              >
                {loading ? "Verifying..." : "Access Portfolio"}
              </button>
            </form>
          </div>
        </div>
        <FooterSection />
        <style jsx>{`
          @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          .animate-fadeIn { animation: fadeIn 0.8s ease-out; }
        `}</style>
      </div>
    );
  }

  if (step === "lead") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
        <TopBar />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md w-full animate-fadeIn">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-3">Welcome, Investor</h2>
              <p className="text-gray-400">Please provide your contact information to access the portfolio.</p>
            </div>
            <form onSubmit={handleLead} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={leadForm.name}
                onChange={e => setLeadForm(f => ({ ...f, name: e.target.value }))}
                required
                className="w-full px-6 py-4 bg-[#111111] border border-[#1a1a1a] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#C9A96E] transition-colors"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={leadForm.email}
                onChange={e => setLeadForm(f => ({ ...f, email: e.target.value }))}
                required
                className="w-full px-6 py-4 bg-[#111111] border border-[#1a1a1a] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#C9A96E] transition-colors"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={leadForm.phone}
                onChange={e => setLeadForm(f => ({ ...f, phone: e.target.value }))}
                required
                className="w-full px-6 py-4 bg-[#111111] border border-[#1a1a1a] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#C9A96E] transition-colors"
              />
              {leadError && <p className="text-red-400 text-sm">{leadError}</p>}
              <button
                type="submit"
                disabled={leadLoading}
                className="w-full py-4 bg-gradient-to-r from-[#C9A96E] to-[#D4AF37] text-black font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 text-lg"
              >
                {leadLoading ? "Submitting..." : "View Portfolio"}
              </button>
            </form>
            <p className="text-gray-600 text-xs mt-6">Your information is kept confidential and used only for investment communications.</p>
          </div>
        </div>
        <FooterSection />
        <style jsx>{`
          @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          .animate-fadeIn { animation: fadeIn 0.8s ease-out; }
        `}</style>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <TopBar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-16 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
            Roatan Investment Portfolio
          </h1>
          <p className="text-[#C9A96E] text-lg tracking-widest uppercase mb-2">Investor Discovery Tour</p>
          <p className="text-gray-500">Bay Islands, Honduras &mdash; {projects.length} Development Projects</p>
          <div className="mt-6 flex justify-center gap-8 text-sm text-gray-400">
            <div>
              <span className="text-2xl font-bold text-white block">
                {formatCurrency(projects.reduce((s, p) => s + p.totalInvestment, 0))}
              </span>
              Total Portfolio Value
            </div>
            <div>
              <span className="text-2xl font-bold text-white block">{projects.length}</span>
              Projects
            </div>
            <div>
              <span className="text-2xl font-bold text-white block">
                {projects.reduce((s, p) => s + p.subprojects.length, 0)}
              </span>
              Sub-Projects
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <Link
              key={p.slug}
              href={`/roatan/${p.slug}`}
              className="group block bg-[#111111] border border-[#1a1a1a] rounded-xl overflow-hidden hover:border-[#C9A96E]/50 transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(201,169,110,0.1)]"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
                  {p.types.slice(0, 3).map(t => (
                    <span key={t} className="px-2 py-0.5 bg-[#C9A96E]/20 text-[#C9A96E] text-xs rounded-full backdrop-blur-sm border border-[#C9A96E]/30">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#C9A96E] transition-colors">
                  {p.name}
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                  <div>
                    <span className="text-gray-500 block text-xs uppercase tracking-wider">Investment</span>
                    <span className="text-white font-semibold">
                      {p.totalInvestment > 0 ? formatCurrency(p.totalInvestment) : "TBD"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-xs uppercase tracking-wider">IRR</span>
                    <span className="text-[#C9A96E] font-semibold">{p.irrRange}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-xs uppercase tracking-wider">Stage</span>
                    <span className="text-white">{p.devStage}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-xs uppercase tracking-wider">Capital</span>
                    <span className="text-white">{p.capitalStatus}</span>
                  </div>
                </div>
                {p.acres && (
                  <p className="text-gray-500 text-xs mb-3">{p.acres}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">{p.subprojects.length} sub-project{p.subprojects.length !== 1 ? "s" : ""}</span>
                  <span className="text-[#C9A96E] text-sm font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    View Details
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <FooterSection />
      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out; }
      `}</style>
    </div>
  );
}
