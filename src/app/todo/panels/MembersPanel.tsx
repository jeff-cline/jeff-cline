"use client";
import { useState, useEffect, useCallback } from "react";

interface Member {
  name: string;
  email: string;
  source: string;
  sourceUrl: string;
  sourceDb: string;
  createdAt: string;
  rawId: string;
}

export default function MembersPanel() {
  const [members, setMembers] = useState<Member[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), search });
      const res = await fetch(`/api/todo/members?${params}`);
      const data = await res.json();
      setMembers(data.members || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch {
      // ignore
    }
    setLoading(false);
  }, [page, search]);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const addToTodo = async (m: Member) => {
    const key = m.rawId + m.sourceDb;
    setAddingId(key);
    try {
      await fetch("/api/todo/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `Follow up: ${m.name} (${m.source})`,
          notes: `Email: ${m.email}\nPlatform: ${m.source} (${m.sourceUrl})`,
          status: "pending",
        }),
      });
      alert("Todo created!");
    } catch {
      alert("Failed to create todo");
    }
    setAddingId(null);
  };

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
    } catch { return d; }
  };

  return (
    <div style={{ padding: "24px", maxWidth: 1100, margin: "0 auto" }}>
      <h1 style={{ color: "#FF8900", fontSize: 22, fontWeight: 700, letterSpacing: 3, margin: "0 0 20px" }}>
        ACCOUNTS CREATED
      </h1>

      {/* Search */}
      <div style={{ marginBottom: 16, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Search by name, email, or platform..."
          value={search}
          onChange={e => handleSearch(e.target.value)}
          style={{
            flex: 1, minWidth: 200, padding: "10px 14px", background: "#1a1a1a",
            border: "1px solid #333", borderRadius: 6, color: "#eee", fontSize: 14,
          }}
        />
        <span style={{ color: "#666", fontSize: 13 }}>{total} accounts</span>
      </div>

      {/* Table */}
      <div style={{ background: "#1a1a1a", borderRadius: 8, border: "1px solid #222", overflow: "hidden" }}>
        {/* Header */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 140px 160px 100px",
          padding: "12px 16px", borderBottom: "1px solid #333", color: "#666",
          fontSize: 11, fontWeight: 600, letterSpacing: 1,
        }}>
          <div>NAME</div><div>EMAIL</div><div>PLATFORM</div><div>CREATED</div><div></div>
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#555" }}>Loading...</div>
        ) : members.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#555" }}>No accounts found</div>
        ) : members.map((m, i) => (
          <div
            key={m.rawId + m.sourceDb + i}
            style={{
              display: "grid", gridTemplateColumns: "1fr 1fr 140px 160px 100px",
              padding: "10px 16px", borderBottom: "1px solid #1f1f1f",
              alignItems: "center", fontSize: 13,
            }}
          >
            <div style={{ color: "#eee", fontWeight: 500 }}>{m.name}</div>
            <div style={{ color: "#aaa", overflow: "hidden", textOverflow: "ellipsis" }}>{m.email || "—"}</div>
            <div>
              <a href={m.sourceUrl} target="_blank" rel="noopener noreferrer"
                style={{ color: "#FF8900", textDecoration: "none", fontSize: 12 }}>
                {m.source} ↗
              </a>
            </div>
            <div style={{ color: "#777", fontSize: 12 }}>{formatDate(m.createdAt)}</div>
            <div>
              <button
                onClick={() => addToTodo(m)}
                disabled={addingId === m.rawId + m.sourceDb}
                style={{
                  padding: "5px 10px", background: "#222", border: "1px solid #444",
                  borderRadius: 4, color: "#FF8900", cursor: "pointer", fontSize: 11,
                  fontWeight: 600, opacity: addingId === m.rawId + m.sourceDb ? 0.5 : 1,
                }}
              >
                + Todo
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16 }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1}
            style={{ padding: "8px 16px", background: "#222", border: "1px solid #333", borderRadius: 4, color: page <= 1 ? "#444" : "#aaa", cursor: "pointer" }}
          >Prev</button>
          <span style={{ color: "#666", lineHeight: "36px", fontSize: 13 }}>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            style={{ padding: "8px 16px", background: "#222", border: "1px solid #333", borderRadius: 4, color: page >= totalPages ? "#444" : "#aaa", cursor: "pointer" }}
          >Next</button>
        </div>
      )}

      {/* Mobile override */}
      <style>{`
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
            gap: 4px;
          }
        }
      `}</style>
    </div>
  );
}
