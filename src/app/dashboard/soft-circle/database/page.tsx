"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import DashboardNav from "@/components/dashboard/DashboardNav";
import SoftCircleSubNav from "../SubNav";

const emptyContact = { name: "", title: "", email: "", phone: "" };
const emptyInvestor = {
  name: "", website: "", sector: "", stage: "", checkSize: "", thesis: "",
  contacts: [{ ...emptyContact }], source: "manual", tags: [] as string[], score: 0,
};

export default function SoftCircleDatabasePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [investors, setInvestors] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [form, setForm] = useState<any>({ ...emptyInvestor });
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login?callbackUrl=/dashboard/soft-circle/database");
  }, [status, router]);

  const fetchInvestors = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ search, limit: "100" });
    const res = await fetch(`/api/soft-circle/investors?${params}`);
    const data = await res.json();
    setInvestors(data.investors || []);
    setTotal(data.total || 0);
    setLoading(false);
  }, [search]);

  useEffect(() => { if (session) fetchInvestors(); }, [session, fetchInvestors]);

  const openAdd = () => { setEditData(null); setForm({ ...emptyInvestor, contacts: [{ ...emptyContact }] }); setShowModal(true); };
  const openEdit = (inv: any) => { setEditData(inv); setForm({ ...inv, tags: inv.tags || [] }); setShowModal(true); };

  const handleSave = async () => {
    const method = editData?._id ? "PUT" : "POST";
    const body = { ...form, tags: typeof form.tags === "string" ? form.tags.split(",").map((t: string) => t.trim()) : form.tags };
    if (editData?._id) body._id = editData._id;
    await fetch("/api/soft-circle/investors", {
      method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    });
    setShowModal(false);
    fetchInvestors();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this investor?")) return;
    await fetch(`/api/soft-circle/investors?id=${id}`, { method: "DELETE" });
    fetchInvestors();
  };

  if (status === "loading") return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
  if (!session) return null;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <DashboardNav />
        <SoftCircleSubNav active="database" />

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Investor Database</h1>
            <p className="text-gray-400 text-sm">{total} investors total</p>
          </div>
          <div className="flex gap-3">
            <a href="/api/soft-circle/investors/export" className="text-sm text-[#FF8900] hover:underline py-2">Export CSV</a>
            <button onClick={openAdd} className="bg-[#FF8900] hover:bg-[#FF8900]/80 text-black font-bold px-4 py-2 rounded-lg text-sm">
              + Add Investor
            </button>
          </div>
        </div>

        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, sector, tags..."
          className="w-full bg-black/50 border border-white/20 rounded-lg p-3 text-white text-sm mb-6" />

        {loading ? <p className="text-gray-500">Loading...</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-gray-400">
                  <th className="text-left py-3 px-2">Name</th>
                  <th className="text-left py-3 px-2">Sector</th>
                  <th className="text-left py-3 px-2">Stage</th>
                  <th className="text-left py-3 px-2">Check Size</th>
                  <th className="text-left py-3 px-2">Source</th>
                  <th className="text-left py-3 px-2">Score</th>
                  <th className="text-left py-3 px-2"></th>
                </tr>
              </thead>
              <tbody>
                {investors.map((inv: any) => (
                  <>
                    <tr key={inv._id} className="border-b border-white/5 hover:bg-white/5 cursor-pointer"
                      onClick={() => setExpanded(expanded === inv._id ? null : inv._id)}>
                      <td className="py-3 px-2 font-medium">{inv.name}</td>
                      <td className="py-3 px-2 text-gray-400">{inv.sector}</td>
                      <td className="py-3 px-2 text-gray-400">{inv.stage}</td>
                      <td className="py-3 px-2 text-gray-400">{inv.checkSize}</td>
                      <td className="py-3 px-2 text-gray-500 text-xs">{inv.source}</td>
                      <td className="py-3 px-2">{inv.score}</td>
                      <td className="py-3 px-2 flex gap-2" onClick={e => e.stopPropagation()}>
                        <button onClick={() => openEdit(inv)} className="text-xs text-blue-400 hover:underline">Edit</button>
                        <button onClick={() => handleDelete(inv._id)} className="text-xs text-red-400 hover:underline">Delete</button>
                      </td>
                    </tr>
                    {expanded === inv._id && inv.contacts?.length > 0 && (
                      <tr key={inv._id + "-contacts"}>
                        <td colSpan={7} className="bg-white/5 px-6 py-3">
                          <p className="text-xs text-gray-400 mb-2 font-semibold">Contacts:</p>
                          {inv.contacts.map((c: any, i: number) => (
                            <div key={i} className="text-xs text-gray-300 mb-1">
                              {c.name} {c.title && `(${c.title})`} {c.email && `• ${c.email}`} {c.phone && `• ${c.phone}`}
                            </div>
                          ))}
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-white/10 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">{editData?._id ? "Edit" : "Add"} Investor</h2>
              <div className="space-y-3">
                {["name", "website", "sector", "stage", "checkSize", "thesis"].map(field => (
                  <div key={field}>
                    <label className="block text-xs text-gray-400 mb-1 capitalize">{field}</label>
                    {field === "thesis" ? (
                      <textarea value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })}
                        className="w-full bg-black/50 border border-white/20 rounded-lg p-2 text-white text-sm" />
                    ) : (
                      <input value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })}
                        className="w-full bg-black/50 border border-white/20 rounded-lg p-2 text-white text-sm" />
                    )}
                  </div>
                ))}
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Tags (comma-separated)</label>
                  <input value={Array.isArray(form.tags) ? form.tags.join(", ") : form.tags}
                    onChange={e => setForm({ ...form, tags: e.target.value })}
                    className="w-full bg-black/50 border border-white/20 rounded-lg p-2 text-white text-sm" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-2 font-semibold">Contacts</p>
                  {(form.contacts || []).map((c: any, i: number) => (
                    <div key={i} className="grid grid-cols-2 gap-2 mb-2">
                      {["name", "title", "email", "phone"].map(f => (
                        <input key={f} placeholder={f} value={c[f]}
                          onChange={e => {
                            const contacts = [...form.contacts];
                            contacts[i] = { ...contacts[i], [f]: e.target.value };
                            setForm({ ...form, contacts });
                          }}
                          className="bg-black/50 border border-white/20 rounded p-2 text-white text-xs" />
                      ))}
                    </div>
                  ))}
                  <button onClick={() => setForm({ ...form, contacts: [...form.contacts, { ...emptyContact }] })}
                    className="text-xs text-[#FF8900] hover:underline">+ Add Contact</button>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white text-sm">Cancel</button>
                <button onClick={handleSave} className="bg-[#FF8900] hover:bg-[#FF8900]/80 text-black font-bold px-4 py-2 rounded-lg text-sm">Save</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
