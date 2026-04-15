"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  PRIORITIES,
  COLORS,
  SEED_STATUSES,
  PRIORITY_DOT,
  COLOR_HEX,
  ROLE_LABELS,
  type Priority,
  type SeedColor,
  type SeedStatus,
  type Role,
} from "@/lib/dumpster";

const STATUS_LABELS: Record<SeedStatus, string> = {
  raw: "Raw Seeds",
  triaging: "Triaging",
  assigned: "Assigned",
  archived: "Archived",
};

type Seed = {
  _id: string;
  createdBy: string;
  createdByName?: string;
  kind: "note" | "photo" | "file" | "voice";
  title: string;
  note: string;
  attachment?: { mime: string; name: string; dataUrl: string; size: number };
  status: SeedStatus;
  companyId?: string | null;
  projectId?: string | null;
  priority: Priority;
  color: SeedColor;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

type Company = { _id: string; name: string; color: SeedColor; frameStyle: string };
type Comment = { _id: string; userName: string; body: string; createdAt: string };

const MAX_BYTES = 1_500_000;

export default function DumpsterPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [seeds, setSeeds] = useState<Seed[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filterStatus, setFilterStatus] = useState<SeedStatus | "all">("all");
  const [filterCompany, setFilterCompany] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [drawer, setDrawer] = useState<Seed | null>(null);

  const role = ((session?.user as any)?.role || "user") as Role;
  const canTriage = role === "admin" || role === "coordinator" || role === "executive_assistant";
  const canManageCompanies = role === "admin" || role === "coordinator";

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login?callbackUrl=/dumpster");
  }, [status, router]);

  const loadSeeds = async () => {
    const r = await fetch("/api/dumpster/seeds");
    if (r.ok) setSeeds(await r.json());
  };
  const loadCompanies = async () => {
    const r = await fetch("/api/dumpster/companies");
    if (r.ok) setCompanies(await r.json());
  };

  useEffect(() => {
    if (status !== "authenticated") return;
    loadSeeds();
    loadCompanies();
    const t = setInterval(loadSeeds, 10000);
    return () => clearInterval(t);
  }, [status]);

  const filtered = useMemo(() => {
    return seeds.filter((s) => {
      if (filterStatus !== "all" && s.status !== filterStatus) return false;
      if (filterCompany !== "all" && (s.companyId || "") !== filterCompany) return false;
      return true;
    });
  }, [seeds, filterStatus, filterCompany]);

  const lanes: Record<SeedStatus, Seed[]> = { raw: [], triaging: [], assigned: [], archived: [] };
  filtered.forEach((s) => lanes[s.status]?.push(s));

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-[#FF8900] text-xl font-bold">Loading dumpster…</div>
      </div>
    );
  }
  if (!session?.user) return null;

  return (
    <section className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <h1 className="text-3xl font-black flex-1">
            The <span className="text-[#FF8900]">Dumpster</span>
          </h1>
          <span className="text-xs px-3 py-1 rounded-full bg-white/5 text-gray-400">
            {ROLE_LABELS[role] || role}
          </span>
          <button
            onClick={() => setOpen(true)}
            className="bg-[#FF8900] text-black font-bold px-5 py-2 rounded-lg hover:opacity-90"
          >
            + Drop something
          </button>
        </div>

        <p className="text-gray-400 text-sm mb-6 max-w-3xl">
          Snap a photo, jot a note, upload anything. The team picks it up from <b>Raw Seeds</b> and
          routes it to a company or project. Color = priority, left border = company.
        </p>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
          >
            <option value="all">All status</option>
            {SEED_STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
          <select
            value={filterCompany}
            onChange={(e) => setFilterCompany(e.target.value)}
            className="bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
          >
            <option value="all">All companies</option>
            <option value="">— No company —</option>
            {companies.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
          {canManageCompanies && (
            <button
              onClick={async () => {
                const name = prompt("New company name?");
                if (!name) return;
                const r = await fetch("/api/dumpster/companies", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ name, color: "purple", frameStyle: "solid" }),
                });
                if (r.ok) loadCompanies();
              }}
              className="text-sm px-3 py-2 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10"
            >
              + Company
            </button>
          )}
          <span className="text-gray-500 text-xs ml-auto self-center">
            {filtered.length} of {seeds.length}
          </span>
        </div>

        {/* Lanes */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {SEED_STATUSES.map((statusKey) => (
            <div key={statusKey} className="bg-[#1a1a1a] border border-white/5 rounded-xl p-3 min-h-[200px]">
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-sm font-bold text-gray-300">{STATUS_LABELS[statusKey]}</h3>
                <span className="text-xs text-gray-500">{lanes[statusKey].length}</span>
              </div>
              <div className="space-y-2">
                {lanes[statusKey].map((s) => (
                  <SeedCard key={s._id} seed={s} companies={companies} onOpen={() => setDrawer(s)} />
                ))}
                {lanes[statusKey].length === 0 && (
                  <p className="text-gray-600 text-xs text-center py-6">empty</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {open && (
        <DropModal
          companies={companies}
          onClose={() => setOpen(false)}
          onCreated={() => { setOpen(false); loadSeeds(); }}
        />
      )}

      {drawer && (
        <SeedDrawer
          seed={drawer}
          companies={companies}
          canTriage={canTriage}
          onClose={() => setDrawer(null)}
          onChanged={(updated) => {
            setSeeds((cur) => cur.map((s) => (s._id === updated._id ? updated : s)));
            setDrawer(updated);
          }}
          onDeleted={(id) => {
            setSeeds((cur) => cur.filter((s) => s._id !== id));
            setDrawer(null);
          }}
        />
      )}
    </section>
  );
}

function SeedCard({ seed, companies, onOpen }: { seed: Seed; companies: Company[]; onOpen: () => void }) {
  const company = companies.find((c) => c._id === seed.companyId);
  const borderColor = company ? COLOR_HEX[company.color] : "#3a3a3a";
  return (
    <button
      onClick={onOpen}
      className="w-full text-left bg-[#0e1116] hover:bg-[#161b22] rounded-lg p-3 border-l-4 transition-colors"
      style={{ borderLeftColor: borderColor }}
    >
      <div className="flex items-start gap-2">
        <span
          className="inline-block w-2.5 h-2.5 rounded-full mt-1 shrink-0"
          style={{ background: PRIORITY_DOT[seed.priority] }}
          title={seed.priority}
        />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-gray-200 truncate">{seed.title}</div>
          {seed.attachment?.mime.startsWith("image/") && (
            <img
              src={seed.attachment.dataUrl}
              alt=""
              className="mt-2 rounded max-h-32 object-cover w-full"
            />
          )}
          {seed.note && <p className="text-xs text-gray-400 mt-1 line-clamp-3">{seed.note}</p>}
          <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-500">
            <span>{seed.createdByName || "—"}</span>
            <span>·</span>
            <span>{new Date(seed.createdAt).toLocaleString()}</span>
            {company && (
              <>
                <span>·</span>
                <span style={{ color: COLOR_HEX[company.color] }}>{company.name}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

function DropModal({
  companies, onClose, onCreated,
}: { companies: Company[]; onClose: () => void; onCreated: () => void }) {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [priority, setPriority] = useState<Priority>("normal");
  const [color, setColor] = useState<SeedColor>("gray");
  const [companyId, setCompanyId] = useState<string>("");
  const [attachment, setAttachment] = useState<Seed["attachment"] | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = (f: File | null) => {
    setErr(null);
    if (!f) { setAttachment(null); return; }
    if (f.size > MAX_BYTES) { setErr("Max 1.5MB in MVP"); return; }
    const reader = new FileReader();
    reader.onload = () => {
      setAttachment({
        mime: f.type || "application/octet-stream",
        name: f.name,
        dataUrl: String(reader.result),
        size: f.size,
      });
    };
    reader.readAsDataURL(f);
  };

  const submit = async () => {
    if (!note.trim() && !attachment) { setErr("Add a note or a file"); return; }
    setBusy(true);
    const r = await fetch("/api/dumpster/seeds", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.trim() || undefined,
        note: note.trim(),
        priority,
        color,
        companyId: companyId || null,
        attachment,
      }),
    });
    setBusy(false);
    if (!r.ok) { setErr((await r.json()).error || "Failed"); return; }
    onCreated();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-[#0e1116] border border-white/10 rounded-xl p-6 w-full max-w-lg space-y-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">Drop into the dumpster</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white">✕</button>
        </div>

        <input
          type="text"
          placeholder="Title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm"
        />
        <textarea
          rows={4}
          placeholder="What is it? (paste a note, idea, opportunity)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm"
        />

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="text-sm px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10"
          >
            📎 {attachment ? attachment.name : "Add photo / file"}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*,audio/*,application/pdf,.txt,.md,.csv"
            capture="environment"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0] || null)}
          />
          {attachment && (
            <button type="button" onClick={() => setAttachment(null)} className="text-xs text-gray-500 hover:text-white">
              clear
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="bg-[#111] border border-white/10 rounded-lg px-2 py-2 text-sm"
          >
            {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <select
            value={color}
            onChange={(e) => setColor(e.target.value as SeedColor)}
            className="bg-[#111] border border-white/10 rounded-lg px-2 py-2 text-sm"
          >
            {COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            className="bg-[#111] border border-white/10 rounded-lg px-2 py-2 text-sm"
          >
            <option value="">— company —</option>
            {companies.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>

        {err && <div className="text-red-400 text-xs">{err}</div>}

        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-400 hover:text-white">Cancel</button>
          <button
            onClick={submit}
            disabled={busy}
            className="bg-[#FF8900] text-black font-bold px-5 py-2 rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {busy ? "Dropping…" : "Drop it"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SeedDrawer({
  seed, companies, canTriage, onClose, onChanged, onDeleted,
}: {
  seed: Seed;
  companies: Company[];
  canTriage: boolean;
  onClose: () => void;
  onChanged: (s: Seed) => void;
  onDeleted: (id: string) => void;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    fetch(`/api/dumpster/seeds/${seed._id}/comments`).then(r => r.ok ? r.json() : []).then(setComments);
  }, [seed._id]);

  const patch = async (body: any) => {
    const r = await fetch(`/api/dumpster/seeds/${seed._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (r.ok) onChanged(await r.json());
  };

  const addComment = async () => {
    const body = text.trim();
    if (!body) return;
    const r = await fetch(`/api/dumpster/seeds/${seed._id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });
    if (r.ok) {
      const c = await r.json();
      setComments((cur) => [...cur, c]);
      setText("");
    }
  };

  const del = async () => {
    if (!confirm("Delete this seed?")) return;
    const r = await fetch(`/api/dumpster/seeds/${seed._id}`, { method: "DELETE" });
    if (r.ok) onDeleted(seed._id);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex justify-end" onClick={onClose}>
      <div
        className="bg-[#0e1116] border-l border-white/10 w-full max-w-lg h-full overflow-y-auto p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-bold">{seed.title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white">✕</button>
        </div>

        {seed.attachment?.mime.startsWith("image/") && (
          <img src={seed.attachment.dataUrl} alt="" className="rounded max-h-80 w-full object-contain bg-black" />
        )}
        {seed.note && <p className="text-sm text-gray-300 whitespace-pre-wrap">{seed.note}</p>}

        <div className="grid grid-cols-2 gap-2 text-sm">
          <label className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">Status</span>
            <select
              value={seed.status}
              onChange={(e) => patch({ status: e.target.value })}
              className="bg-[#111] border border-white/10 rounded px-2 py-1"
            >
              {SEED_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">Priority</span>
            <select
              value={seed.priority}
              onChange={(e) => patch({ priority: e.target.value })}
              className="bg-[#111] border border-white/10 rounded px-2 py-1"
            >
              {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">Color</span>
            <select
              value={seed.color}
              onChange={(e) => patch({ color: e.target.value })}
              className="bg-[#111] border border-white/10 rounded px-2 py-1"
            >
              {COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">Company</span>
            <select
              value={seed.companyId || ""}
              onChange={(e) => patch({ companyId: e.target.value || null })}
              className="bg-[#111] border border-white/10 rounded px-2 py-1"
            >
              <option value="">—</option>
              {companies.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </label>
        </div>

        <div className="text-xs text-gray-500">
          By {seed.createdByName || "—"} · {new Date(seed.createdAt).toLocaleString()}
        </div>

        <div className="border-t border-white/5 pt-4 space-y-2">
          <h4 className="text-sm font-semibold text-gray-300">Comments</h4>
          {comments.map((c) => (
            <div key={c._id} className="bg-[#111] rounded px-3 py-2 text-sm">
              <div className="text-xs text-gray-500 mb-1">
                {c.userName} · {new Date(c.createdAt).toLocaleString()}
              </div>
              <div className="text-gray-200 whitespace-pre-wrap">{c.body}</div>
            </div>
          ))}
          <div className="flex gap-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addComment()}
              placeholder="Write a comment…"
              className="flex-1 bg-[#111] border border-white/10 rounded px-3 py-2 text-sm"
            />
            <button onClick={addComment} className="text-sm px-3 py-2 rounded bg-white/5 hover:bg-white/10">
              Send
            </button>
          </div>
        </div>

        {canTriage && (
          <button onClick={del} className="text-xs text-red-400 hover:underline">Delete seed</button>
        )}
      </div>
    </div>
  );
}
