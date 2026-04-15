"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardNav from "@/components/dashboard/DashboardNav";
import type { PixelType, PixelStatus } from "@/lib/expense-types";

const PIXEL_TYPES: PixelType[] = ["Meta Pixel", "Google Analytics", "Google Ads", "LinkedIn Insight", "TikTok", "Custom"];

function getSnippet(type: PixelType, pixelId: string): string {
  switch (type) {
    case "Meta Pixel": return `<!-- Meta Pixel -->\n<script>\n!function(f,b,e,v,n,t,s){...}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');\nfbq('init','${pixelId}');\nfbq('track','PageView');\n</script>`;
    case "Google Analytics": return `<!-- Google Analytics -->\n<script async src="https://www.googletagmanager.com/gtag/js?id=${pixelId}"></script>\n<script>\nwindow.dataLayer=window.dataLayer||[];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js',new Date());\ngtag('config','${pixelId}');\n</script>`;
    case "Google Ads": return `<!-- Google Ads -->\n<script async src="https://www.googletagmanager.com/gtag/js?id=${pixelId}"></script>\n<script>\ngtag('config','${pixelId}');\n</script>`;
    case "LinkedIn Insight": return `<!-- LinkedIn Insight -->\n<script type="text/javascript">\n_linkedin_partner_id="${pixelId}";\n</script>`;
    case "TikTok": return `<!-- TikTok Pixel -->\n<script>\n!function(w,d,t){...}(window,document,'ttq');\nttq.load('${pixelId}');\nttq.page();\n</script>`;
    default: return `<!-- Custom Pixel: ${pixelId} -->`;
  }
}

export default function PixelsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pixels, setPixels] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showSnippet, setShowSnippet] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", type: "Meta Pixel" as PixelType, pixelId: "" });

  useEffect(() => { if (status === "unauthenticated") router.push("/login?callbackUrl=/dashboard/pixels"); }, [status, router]);

  const fetchPixels = () => { fetch("/api/pixels").then(r => r.json()).then(d => { if (Array.isArray(d)) setPixels(d); }).catch(() => {}); };

  useEffect(() => { if (session?.user) fetchPixels(); }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/pixels", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setForm({ name: "", type: "Meta Pixel", pixelId: "" });
    setShowForm(false);
    fetchPixels();
  };

  const toggleStatus = async (id: string, current: PixelStatus) => {
    await fetch("/api/pixels", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status: current === "active" ? "paused" : "active" }) });
    fetchPixels();
  };

  const deletePixel = async (id: string) => {
    await fetch("/api/pixels", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    fetchPixels();
  };

  if (status === "loading") return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-[#FF8900] text-xl font-bold">Loading...</div></div>;
  if (!session?.user) return null;

  return (
    <section className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <DashboardNav />
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-black">Tracking <span className="text-[#FF8900]">Pixels</span></h1>
          <button onClick={() => setShowForm(!showForm)} className="bg-[#FF8900] text-black font-bold px-4 py-2 rounded-lg text-sm hover:bg-[#ffa033] transition-colors">
            {showForm ? "Cancel" : "+ Add Pixel"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-[#1a1a1a] border border-white/5 rounded-xl p-6 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <input placeholder="Pixel Name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as PixelType })} className="bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white">
              {PIXEL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <input placeholder="Pixel ID" required value={form.pixelId} onChange={e => setForm({ ...form, pixelId: e.target.value })} className="bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
            <button type="submit" className="bg-[#FF8900] text-black font-bold px-4 py-2 rounded-lg text-sm hover:bg-[#ffa033]">Save Pixel</button>
          </form>
        )}

        <div className="space-y-4">
          {pixels.length === 0 && <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-8 text-center text-gray-500">No tracking pixels configured</div>}
          {pixels.map((p, i) => (
            <div key={p._id || i} className="bg-[#1a1a1a] border border-white/5 rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-bold text-white">{p.name}</h3>
                  <p className="text-gray-500 text-sm">{p.type} · <span className="font-mono text-xs">{p.pixelId}</span></p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleStatus(p._id, p.status)} className={`px-3 py-1 rounded text-xs font-bold ${p.status === "active" ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}>
                    {p.status}
                  </button>
                  <button onClick={() => setShowSnippet(showSnippet === p._id ? null : p._id)} className="text-[#FF8900] text-xs hover:text-[#ffa033]">
                    {showSnippet === p._id ? "Hide Code" : "View Code"}
                  </button>
                  <button onClick={() => deletePixel(p._id)} className="text-red-500 text-xs hover:text-red-400">Delete</button>
                </div>
              </div>
              {showSnippet === p._id && (
                <pre className="bg-[#111] rounded-lg p-4 text-xs text-gray-400 overflow-x-auto mt-3">{getSnippet(p.type, p.pixelId)}</pre>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
