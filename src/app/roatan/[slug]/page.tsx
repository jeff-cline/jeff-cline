"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

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

const IMAGE_MAP: Record<string, string> = {
  "altitude": "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200&q=80",
  "camp-bay-estates": "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80",
  "caribbean-bliss": "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=80",
  "cliffside": "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200&q=80",
  "cruise-port-beach-club": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80",
  "cruise-port-terminal": "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=1200&q=80",
  "la-champa": "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=80",
  "lending-company": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
  "lime-cay": "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=1200&q=80",
  "oceana": "https://images.unsplash.com/photo-1615571022219-eb45cf7faa36?w=1200&q=80",
  "pristine-bay": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
  "sea-breeze": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
  "sunset-vista": "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&q=80",
  "turquoise-bay": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
};

function parseCurrency(s: string): number {
  if (!s) return 0;
  return parseFloat(s.replace(/[^0-9.]/g, "")) || 0;
}

function formatCurrency(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  if (n === 0) return "TBD";
  return `$${n.toLocaleString()}`;
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
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

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [project, setProject] = useState<{
    name: string;
    slug: string;
    subprojects: SubProject[];
    presentation_link: string;
    maps_link: string;
    image: string;
  } | null>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  useEffect(() => {
    // Check auth
    if (!document.cookie.includes("roatan_access=granted")) {
      router.push("/roatan");
      return;
    }

    fetch("/roatan/projects.json")
      .then(r => r.json())
      .then((data: RawProject[]) => {
        // Handle sea-breeze merge
        if (slug === "sea-breeze") {
          const seaBreezeParts = data.filter(p =>
            p.name === "Sea Breeze" || p.name === "Seabreeze" || p.name === "Seabreeze waterfront condos"
          );
          const merged = {
            name: "Sea Breeze",
            slug: "sea-breeze",
            subprojects: seaBreezeParts.flatMap(p => p.subprojects),
            presentation_link: seaBreezeParts.find(p => p.presentation_link)?.presentation_link || "",
            maps_link: seaBreezeParts.find(p => p.maps_link)?.maps_link || "",
            image: IMAGE_MAP["sea-breeze"],
          };
          setProject(merged);
          return;
        }

        const found = data.find(p => slugify(p.name) === slug);
        if (found) {
          setProject({
            name: found.name,
            slug,
            subprojects: found.subprojects,
            presentation_link: found.presentation_link,
            maps_link: found.maps_link,
            image: IMAGE_MAP[slug] || IMAGE_MAP["altitude"],
          });
        }
      });
  }, [slug, router]);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-[#C9A96E] text-lg">Loading project...</div>
      </div>
    );
  }

  const totalInvestment = project.subprojects.reduce((s, sp) => s + parseCurrency(sp.costToBuild), 0);
  const totalRevenue = project.subprojects.reduce((s, sp) => s + parseCurrency(sp.totalRevenue), 0);
  const totalProfit = project.subprojects.reduce((s, sp) => s + parseCurrency(sp.totalProfit), 0);
  const irrs = project.subprojects.map(sp => parseFloat(sp.irr)).filter(n => !isNaN(n) && n > 0);
  const irrDisplay = irrs.length > 1 ? `${Math.min(...irrs).toFixed(1)}% - ${Math.max(...irrs).toFixed(1)}%` : irrs.length === 1 ? `${irrs[0].toFixed(1)}%` : "TBD";
  const buildTimes = project.subprojects.map(sp => parseFloat(sp.timeToBuild)).filter(n => !isNaN(n) && n > 0);
  const buildTimeDisplay = buildTimes.length ? `${Math.min(...buildTimes)} - ${Math.max(...buildTimes)} yrs` : "TBD";
  const acresDisplay = project.subprojects.map(sp => sp.acres).filter(Boolean)[0] || "";
  const isAltitude = slug === "altitude";

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <TopBar />

      {/* Hero */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <img src={project.image} alt={project.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto">
          <Link href="/roatan" className="text-[#C9A96E] text-sm hover:text-[#D4AF37] transition-colors mb-4 inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to Portfolio
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold text-white mt-2">{project.name}</h1>
          <p className="text-[#C9A96E] text-lg mt-2 tracking-wider">Roatan, Bay Islands, Honduras</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Key Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12 -mt-8 relative z-10">
          {[
            { label: "Total Investment", value: formatCurrency(totalInvestment), gold: false },
            { label: "Total Revenue", value: formatCurrency(totalRevenue), gold: false },
            { label: "Total Profit", value: formatCurrency(totalProfit), gold: true },
            { label: "IRR", value: irrDisplay, gold: true },
            { label: "Build Time", value: buildTimeDisplay, gold: false },
            { label: "Land", value: acresDisplay || "TBD", gold: false },
          ].map((m) => (
            <div key={m.label} className="bg-[#111111] border border-[#1a1a1a] rounded-xl p-4 text-center">
              <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1">{m.label}</span>
              <span className={`text-lg font-bold ${m.gold ? "text-[#C9A96E]" : "text-white"}`}>{m.value}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-12">
          {project.maps_link && (
            <a href={project.maps_link} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#111111] border border-[#1a1a1a] rounded-lg text-white hover:border-[#C9A96E] transition-colors">
              <svg className="w-5 h-5 text-[#C9A96E]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              View on Google Maps
            </a>
          )}
          {project.presentation_link && project.presentation_link !== "n/a, not yet planned" && (
            <a href={project.presentation_link} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#111111] border border-[#1a1a1a] rounded-lg text-white hover:border-[#C9A96E] transition-colors">
              <svg className="w-5 h-5 text-[#C9A96E]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              View Presentation
            </a>
          )}
          <a href={`/api/roatan/pdf/${slug}`} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#C9A96E] to-[#D4AF37] text-black font-bold rounded-lg hover:opacity-90 transition-opacity">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Download Summary (PDF)
          </a>
        </div>

        {/* Sub-Projects */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="w-8 h-0.5 bg-[#C9A96E]" />
            Sub-Projects ({project.subprojects.length})
          </h2>
          <div className="grid gap-4">
            {project.subprojects.map((sp, i) => (
              <div key={i} className="bg-[#111111] border border-[#1a1a1a] rounded-xl p-6 hover:border-[#C9A96E]/30 transition-colors">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-white">{sp.description}</h3>
                      <span className="px-2 py-0.5 bg-[#C9A96E]/20 text-[#C9A96E] text-xs rounded-full">{sp.type}</span>
                    </div>
                    {sp.notes && <p className="text-gray-400 text-sm mb-3">{sp.notes}</p>}
                    {sp.units && <p className="text-gray-500 text-xs">{sp.units}</p>}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm min-w-0 md:min-w-[400px]">
                    <div>
                      <span className="text-gray-500 text-xs block">Cost to Build</span>
                      <span className="text-white font-semibold">{sp.costToBuild || "TBD"}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs block">Profit</span>
                      <span className="text-[#C9A96E] font-semibold">{sp.totalProfit || "TBD"}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs block">IRR</span>
                      <span className="text-[#C9A96E] font-semibold">{sp.irr || "TBD"}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs block">Return Type</span>
                      <span className="text-white">{sp.returnType || "TBD"}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
                  {sp.devStage && <span>Stage: <span className="text-gray-300">{sp.devStage}</span></span>}
                  {sp.capitalStatus && <span>Capital: <span className="text-gray-300">{sp.capitalStatus}</span></span>}
                  {sp.timeToBuild && <span>Build: <span className="text-gray-300">{sp.timeToBuild} yrs</span></span>}
                  {sp.acres && <span>Land: <span className="text-gray-300">{sp.acres}</span></span>}
                  {sp.fundingProgress && <span>Funded: <span className="text-gray-300">{sp.fundingProgress}</span></span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Breakdown */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="w-8 h-0.5 bg-[#C9A96E]" />
            Financial Summary
          </h2>
          <div className="bg-[#111111] border border-[#1a1a1a] rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1a1a1a]">
                  <th className="text-left p-4 text-gray-500 font-medium">Sub-Project</th>
                  <th className="text-right p-4 text-gray-500 font-medium">Cost to Build</th>
                  <th className="text-right p-4 text-gray-500 font-medium hidden md:table-cell">Revenue</th>
                  <th className="text-right p-4 text-gray-500 font-medium">Profit</th>
                  <th className="text-right p-4 text-gray-500 font-medium hidden md:table-cell">IRR</th>
                </tr>
              </thead>
              <tbody>
                {project.subprojects.map((sp, i) => (
                  <tr key={i} className="border-b border-[#1a1a1a]/50 hover:bg-[#1a1a1a]/30">
                    <td className="p-4 text-white">{sp.description}</td>
                    <td className="p-4 text-right text-white">{sp.costToBuild || "TBD"}</td>
                    <td className="p-4 text-right text-white hidden md:table-cell">{sp.totalRevenue || "TBD"}</td>
                    <td className="p-4 text-right text-[#C9A96E] font-semibold">{sp.totalProfit || "TBD"}</td>
                    <td className="p-4 text-right text-[#C9A96E] hidden md:table-cell">{sp.irr || "TBD"}</td>
                  </tr>
                ))}
                <tr className="bg-[#1a1a1a]/50">
                  <td className="p-4 text-white font-bold">Total</td>
                  <td className="p-4 text-right text-white font-bold">{formatCurrency(totalInvestment)}</td>
                  <td className="p-4 text-right text-white font-bold hidden md:table-cell">{formatCurrency(totalRevenue)}</td>
                  <td className="p-4 text-right text-[#C9A96E] font-bold">{formatCurrency(totalProfit)}</td>
                  <td className="p-4 text-right text-[#C9A96E] font-bold hidden md:table-cell">{irrDisplay}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Altitude Image Gallery */}
        {isAltitude && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-0.5 bg-[#C9A96E]" />
              Project Gallery (82 Pages)
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {Array.from({ length: 82 }, (_, i) => {
                const num = i.toString().padStart(2, "0");
                return (
                  <button
                    key={i}
                    onClick={() => { setGalleryIndex(i); setGalleryOpen(true); }}
                    className="relative aspect-[3/4] rounded-lg overflow-hidden border border-[#1a1a1a] hover:border-[#C9A96E]/50 transition-colors group"
                  >
                    <img
                      src={`/roatan/altitude/page-${num}.jpg`}
                      alt={`Page ${i + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs text-center py-1">
                      Page {i + 1}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Gallery Modal */}
        {isAltitude && galleryOpen && (
          <div className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center p-4" onClick={() => setGalleryOpen(false)}>
            <button className="absolute top-4 right-4 text-white text-3xl hover:text-[#C9A96E]" onClick={() => setGalleryOpen(false)}>&times;</button>
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-[#C9A96E] p-2"
              onClick={(e) => { e.stopPropagation(); setGalleryIndex(i => Math.max(0, i - 1)); }}
            >&lsaquo;</button>
            <img
              src={`/roatan/altitude/page-${galleryIndex.toString().padStart(2, "0")}.jpg`}
              alt={`Page ${galleryIndex + 1}`}
              className="max-h-[85vh] max-w-[90vw] object-contain"
              onClick={e => e.stopPropagation()}
            />
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-[#C9A96E] p-2"
              onClick={(e) => { e.stopPropagation(); setGalleryIndex(i => Math.min(81, i + 1)); }}
            >&rsaquo;</button>
            <div className="absolute bottom-4 text-white text-sm">Page {galleryIndex + 1} of 82</div>
          </div>
        )}

        {/* Contact Section */}
        <div className="bg-[#111111] border border-[#C9A96E]/20 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Interested in This Project?</h2>
          <p className="text-gray-400 mb-6">Contact Jeff Cline to discuss investment opportunities.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="tel:9728006670" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#C9A96E] to-[#D4AF37] text-black font-bold rounded-lg hover:opacity-90 transition-opacity">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              Call 972-800-6670
            </a>
            <a href="mailto:jeff@jeff-cline.com" className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a1a1a] border border-[#C9A96E]/30 text-[#C9A96E] font-bold rounded-lg hover:bg-[#C9A96E]/10 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              Email Jeff
            </a>
          </div>
          <p className="text-gray-600 text-sm mt-6">
            <a href="https://investordiscoverytour.com" target="_blank" rel="noopener noreferrer" className="text-[#C9A96E] hover:text-[#D4AF37]">InvestorDiscoveryTour.com</a>
          </p>
        </div>
      </div>

      {/* Footer */}
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
    </div>
  );
}
