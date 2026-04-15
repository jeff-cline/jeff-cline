"use client";
import { useState, useEffect, useCallback, useRef } from "react";

interface User { name: string; email: string; role: string; userId: string }
interface Lead { _id: string; name: string; email: string; phone: string; source: string; sourcePage: string; createdAt: string; imagePath?: string; rawData: Record<string, unknown>; assignedTo?: string }
interface Todo { _id: string; title: string; notes: string; status: string; assignedTo: string; assignedBy: string; fromLead: string | null; leadId: string | null; followUpDate: string | null; createdAt: string }
interface Comment { _id: string; author: string; text: string; createdAt: string }
interface TeamUser { _id: string; name: string; email: string; role: string }
interface Hitt { _id: string; name: string; email: string; ip: string; page: string; source: string; createdAt: string; rawData: Record<string, unknown> }

export default function DashboardPanel({ user }: { user: User }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadsPage, setLeadsPage] = useState(1);
  const [leadsTotalPages, setLeadsTotalPages] = useState(1);
  const [leadsSearch, setLeadsSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [activeTab, setActiveTab] = useState(user.name);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [showAddTodo, setShowAddTodo] = useState(false);
  const [newTodo, setNewTodo] = useState({ title: "", notes: "", assignedTo: user.name, followUpDate: "" });
  const [teamUsers, setTeamUsers] = useState<TeamUser[]>([]);
  const [mobileView, setMobileView] = useState<"leads"|"todos"|"hitts">("leads");

  // HITTS state
  const [hitts, setHitts] = useState<Hitt[]>([]);
  const [hittsPage, setHittsPage] = useState(1);
  const [hittsTotalPages, setHittsTotalPages] = useState(1);
  const [hittsTotal, setHittsTotal] = useState(0);
  const [hittsSearch, setHittsSearch] = useState("");
  const [selectedHitt, setSelectedHitt] = useState<Hitt | null>(null);

  // Quick Add state
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [qaImage, setQaImage] = useState<File | null>(null);
  const [qaPreview, setQaPreview] = useState("");
  const [qaFields, setQaFields] = useState({ name: "", business: "", email: "", phone: "", address: "", website: "", notes: "", assignTo: "" });
  const [qaSubmitting, setQaSubmitting] = useState(false);
  const cameraRef = useRef<HTMLInputElement>(null);
  const uploadRef = useRef<HTMLInputElement>(null);

  const [qaScanning, setQaScanning] = useState(false);
  const [qaMode, setQaMode] = useState<"person"|"card"|null>(null);
  const [calling, setCalling] = useState(false);
  const [callStatus, setCallStatus] = useState("");
  const [callLogs, setCallLogs] = useState<{_id:string;direction:string;status:string;duration:number;notes:string;createdAt:string;from:string;to:string}[]>([]);
  const [editingNoteId, setEditingNoteId] = useState<string|null>(null);
  const [noteText, setNoteText] = useState("");

  const loadCallLogs = useCallback(async (leadId: string) => {
    try {
      const res = await fetch(`/api/todo/call?leadId=${leadId}`);
      const data = await res.json();
      if (data.logs) setCallLogs(data.logs);
    } catch { setCallLogs([]); }
  }, []);

  const saveCallNote = async (callId: string, notes: string) => {
    await fetch("/api/todo/call", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ callId, notes }),
    });
    setEditingNoteId(null);
    if (selectedLead) loadCallLogs(selectedLead._id);
  };

  const handlePersonPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setQaImage(file);
    setQaPreview(URL.createObjectURL(file));
    setQaMode("person");
  };

  const [qaScanDone, setQaScanDone] = useState(false);

  const handleCardPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setQaImage(file);
    setQaPreview(URL.createObjectURL(file));
    setQaMode("card");
    setQaScanDone(false);
  };

  const [qaScanError, setQaScanError] = useState("");

  const compressImage = (file: File, maxW = 1200): Promise<Blob> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scale = Math.min(1, maxW / Math.max(img.width, img.height));
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => resolve(blob!), "image/jpeg", 0.85);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const scanCard = async (file?: File | null) => {
    const f = file || qaImage;
    if (!f) return;
    setQaScanning(true);
    setQaScanDone(false);
    setQaScanError("");
    try {
      const compressed = await compressImage(f);
      const fd = new FormData();
      fd.append("image", compressed, "card.jpg");
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 45000);
      const res = await fetch("/api/todo/ocr", { method: "POST", body: fd, signal: ctrl.signal });
      clearTimeout(timer);
      const data = await res.json();
      if (res.ok && data.fields) {
        setQaFields(prev => ({
          ...prev,
          name: data.fields.name || prev.name,
          business: data.fields.business || prev.business,
          email: data.fields.email || prev.email,
          phone: data.fields.phone || prev.phone,
          address: data.fields.address || prev.address,
          website: data.fields.website || prev.website,
          notes: data.fields.misc ? (prev.notes ? prev.notes + "\n" + data.fields.misc : data.fields.misc) : prev.notes,
        }));
        setQaScanDone(true);
      } else {
        setQaScanError(data.error || "Scan failed");
        setQaScanDone(true);
      }
    } catch (err) {
      console.error("[scanCard] error:", err);
      setQaScanError("Network error");
      setQaScanDone(true);
    }
    setQaScanning(false);
  };

  const submitQuickAdd = async () => {
    if (qaSubmitting) return;
    setQaSubmitting(true);
    try {
      const fd = new FormData();
      if (qaImage) fd.append("image", qaImage);
      Object.entries(qaFields).forEach(([k, v]) => fd.append(k, v));
      const res = await fetch("/api/todo/quick-add", { method: "POST", body: fd });
      if (res.ok) {
        setShowQuickAdd(false); setQaImage(null); setQaPreview(""); setQaFields({ name: "", business: "", email: "", phone: "", address: "", website: "", notes: "", assignTo: "" });
        setMobileView("leads");
        fetchLeads();
      }
    } finally { setQaSubmitting(false); }
  };

  const fetchLeads = useCallback(() => {
    fetch(`/api/todo/leads?page=${leadsPage}&search=${leadsSearch}`).then(r => r.json()).then(d => { setLeads(d.leads || []); setLeadsTotalPages(d.totalPages || 1); });
  }, [leadsPage, leadsSearch]);

  const fetchTodos = useCallback(() => {
    const q = activeTab === "ALL" ? "" : `?assignedTo=${activeTab}`;
    fetch(`/api/todo/todos${q}`).then(r => r.json()).then(d => setTodos(Array.isArray(d) ? d : []));
  }, [activeTab]);

  const fetchHitts = useCallback(() => {
    fetch(`/api/todo/hitts?page=${hittsPage}&search=${hittsSearch}`).then(r => r.json()).then(d => {
      setHitts(d.hitts || []);
      setHittsTotalPages(d.totalPages || 1);
      setHittsTotal(d.total || 0);
    });
  }, [hittsPage, hittsSearch]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);
  useEffect(() => { fetchTodos(); }, [fetchTodos]);
  useEffect(() => { fetchHitts(); }, [fetchHitts]);
  useEffect(() => { fetch("/api/todo/users").then(r => r.json()).then(d => setTeamUsers(Array.isArray(d) ? d : [])); }, []);

  const loadComments = (todoId: string) => {
    fetch(`/api/todo/todos/${todoId}/comments`).then(r => r.json()).then(d => setComments(Array.isArray(d) ? d : []));
  };

  const addComment = async () => {
    if (!selectedTodo || !newComment.trim()) return;
    await fetch(`/api/todo/todos/${selectedTodo._id}/comments`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: newComment }) });
    setNewComment("");
    loadComments(selectedTodo._id);
  };

  const addTodoFromLead = async (lead: Lead, assignedTo: string) => {
    await fetch("/api/todo/todos", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: `Follow up: ${lead.name || lead.email}`, notes: `Lead from ${lead.source}. Email: ${lead.email}`, assignedTo, fromLead: lead.source, leadId: lead._id }),
    });
    setSelectedLead(null);
    fetchTodos();
  };

  const addManualTodo = async () => {
    if (!newTodo.title.trim()) return;
    await fetch("/api/todo/todos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newTodo) });
    setNewTodo({ title: "", notes: "", assignedTo: user.name, followUpDate: "" });
    setShowAddTodo(false);
    fetchTodos();
  };

  const updateTodo = async (id: string, updates: Record<string, unknown>) => {
    await fetch("/api/todo/todos", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ _id: id, ...updates }) });
    fetchTodos();
    if (selectedTodo?._id === id) setSelectedTodo({ ...selectedTodo, ...updates } as Todo);
  };

  const tabs = ["ALL", ...teamUsers.map(u => u.name)];
  if (tabs.length < 2) tabs.push(user.name);

  return (
    <>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.1); } }
        @keyframes vault-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .dash-container { display: flex; gap: 12px; padding: 12px; height: 100%; }
        .dash-col { flex: 1; display: flex; flex-direction: column; min-width: 0; }
        .dash-toggle { display: none; }
        .dash-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; justify-content: center; align-items: center; z-index: 1000; padding: 16px; }
        .dash-modal { background: #1e1e1e; border-radius: 12px; padding: 20px; width: 100%; max-width: 560px; max-height: 85vh; overflow: auto; border: 1px solid #333; }
        .dash-card { background: #1a1a1a; border-radius: 8px; border: 1px solid #222; padding: 10px 14px; margin-bottom: 6px; cursor: pointer; }
        .dash-card:active { background: #222; }
        @keyframes hotBlink { 0%, 100% { border-color: #FF8900; box-shadow: 0 0 8px rgba(255,137,0,0.3); } 50% { border-color: #994f00; box-shadow: none; } }
        .dash-card-hot { animation: hotBlink 1.2s ease-in-out infinite; border: 2px solid #FF8900 !important; }
        .dash-input { padding: 10px 12px; background: #222; border: 1px solid #333; border-radius: 6px; color: #f0f0f0; font-size: 16px; width: 100%; box-sizing: border-box; -webkit-appearance: none; appearance: none; }
        .dash-input[type="datetime-local"] { min-height: 44px; color-scheme: dark; }
        .dash-input[type="datetime-local"]::-webkit-calendar-picker-indicator { filter: invert(0.7); cursor: pointer; padding: 4px; }
        .dash-btn { padding: 8px 16px; background: #FF8900; color: #000; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 13px; }
        .dash-btn-sm { padding: 6px 12px; background: #222; color: #aaa; border: 1px solid #333; border-radius: 4px; cursor: pointer; font-size: 12px; }
        .dash-badge { display: inline-block; padding: 2px 8px; background: #FF890022; color: #FF8900; border-radius: 4px; font-size: 11px; font-weight: 600; }
        .dash-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-wrap: wrap; gap: 8px; }
        .dash-search { max-width: 200px; }
        .dash-total { background: #FF890015; border: 1px solid #FF890033; border-radius: 6px; padding: 8px 12px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; }
        .dash-total-num { color: #FF8900; font-size: 20px; font-weight: 700; }
        .dash-total-label { color: #888; font-size: 12px; }
        @media (max-width: 768px) {
          .dash-container { flex-direction: column; padding: 6px; height: calc(100dvh - 40px); gap: 6px; overflow-x: hidden !important; width: 100%; max-width: 100vw; box-sizing: border-box; }
          .dash-col { flex: 1; min-height: 0; overflow: hidden; display: flex; flex-direction: column; max-width: 100%; }
          .dash-col.hidden-mobile { display: none !important; }
          .dash-toggle {
            display: flex; gap: 0; margin: 0; padding: 0 6px 4px; width: 100%; max-width: 100vw; box-sizing: border-box;
          }
          .dash-toggle button {
            flex: 1; padding: 8px 4px; border: 1px solid #333; background: #1a1a1a;
            color: #888; font-weight: 700; font-size: 12px; cursor: pointer;
          }
          .dash-toggle button:first-child { border-radius: 6px 0 0 6px; }
          .dash-toggle button:last-child { border-radius: 0 6px 6px 0; }
          .dash-toggle button.active { background: #FF8900; color: #000; border-color: #FF8900; }
          .dash-header { margin-bottom: 8px !important; }
          .dash-header h2 { font-size: 15px !important; }
          .dash-search { max-width: 100% !important; flex: 1; }
          .dash-card { padding: 8px 10px !important; margin-bottom: 4px !important; }
          .dash-btn { padding: 6px 12px !important; font-size: 12px !important; }
          .dash-btn-sm { padding: 5px 10px !important; font-size: 11px !important; }
          .dash-modal { padding: 14px; margin: 0; border-radius: 10px; max-height: 90vh; max-height: 90dvh; }
          .dash-modal-overlay { padding: 8px; }
          .dash-input { padding: 10px !important; font-size: 16px !important; min-height: 44px; }
          .dash-total { padding: 6px 10px; margin-bottom: 8px; }
          .dash-total-num { font-size: 18px; }
        }
      `}</style>

      {/* Quick Add Button */}
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "8px 12px 0", gap: 8 }}>
        <button onClick={() => setShowQuickAdd(true)} style={{
          display: "flex", alignItems: "center", gap: 6, padding: "10px 18px",
          background: "#FF8900", color: "#000", border: "none", borderRadius: 8,
          fontWeight: 700, fontSize: 14, cursor: "pointer", minHeight: 44,
        }}>
          📷 QUICK ADD
        </button>
      </div>

      {/* Mobile tab toggle */}
      <div className="dash-toggle">
        <button className={mobileView === "leads" ? "active" : ""} onClick={() => setMobileView("leads")}>LEADS</button>
        <button className={mobileView === "hitts" ? "active" : ""} onClick={() => setMobileView("hitts")}>HITTS</button>
        <button className={mobileView === "todos" ? "active" : ""} onClick={() => setMobileView("todos")}>TODOS</button>
      </div>

      <div className="dash-container">
        {/* Left: Leads */}
        <div className={`dash-col ${mobileView !== "leads" ? "hidden-mobile" : ""}`}>
          <div className="dash-header">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h2 style={{ margin: 0, fontSize: 18, color: "#FF8900" }}>LEADS</h2>
              <button
                onClick={() => { setRefreshing(true); setLeadsPage(1); fetch(`/api/todo/leads?page=1&search=${leadsSearch}`).then(r => r.json()).then(d => { setLeads(d.leads || []); setLeadsTotalPages(d.totalPages || 1); setRefreshing(false); }).catch(() => setRefreshing(false)); }}
                style={{ background: "none", border: "1px solid #FF8900", borderRadius: 6, padding: "4px 10px", cursor: "pointer", color: "#FF8900", fontSize: 13, display: "flex", alignItems: "center", gap: 4, transition: "background 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,137,0,0.15)")}
                onMouseLeave={e => (e.currentTarget.style.background = "none")}
                title="Refresh leads"
              >
                <span style={{ display: "inline-block", animation: refreshing ? "vault-spin 0.8s linear" : "none", fontSize: 15 }}>&#x21bb;</span>
              </button>
            </div>
            <input
              className="dash-input dash-search"
              placeholder="Search leads..."
              value={leadsSearch}
              onChange={e => { setLeadsSearch(e.target.value); setLeadsPage(1); }}
            />
          </div>
          <div style={{ flex: 1, overflow: "auto" }}>
            {leads.map(lead => {
              const isMastermind = (lead as any).type === 'MASTERMIND' || (lead as any).source === 'mastermind';
              const isSJSC = (lead as any).type === 'SJSC_DECK_REQUEST' || (lead as any).type === 'sjsc_deck_request';
              const isDeck = !isSJSC && ((lead as any).type === 'DECK_REQUEST' || (lead as any).type === 'deck_request' || (lead as any).source === 'jeff-cline.com/deck');
              const isHot = (lead as any).priority === 'hot' || (lead as any).priority === 'high' || (lead as any).priority === 'mastermind' || isMastermind || isDeck || isSJSC;
              const isLOC = (lead as any).type === 'credit_application' || (lead as any).source === 'softcircle-ai-loc';
              const accentColor = isSJSC ? '#39FF14' : isDeck ? '#A855F7' : isMastermind ? '#EC4899' : isLOC ? '#10B981' : '#FF8900';
              const bgColor = isSJSC ? '#0a1a08' : isDeck ? '#1a0a1f' : isMastermind ? '#1a0a14' : isLOC ? '#0a1a12' : '#1a1200';
              const bannerText = isSJSC ? 'SJSC DECK REQUEST' : isDeck ? 'DECK REQUEST' : isMastermind ? 'MASTERMIND' : isLOC ? 'LINE OF CREDIT' : 'REQUEST CREDITS';
              return (
              <div key={lead._id} className={`dash-card ${isHot ? 'dash-card-hot' : ''}`} onClick={() => { setSelectedLead(lead); setCallLogs([]); if (lead.phone) loadCallLogs(lead._id); }}
                style={isHot ? { border: `2px solid ${accentColor}`, background: bgColor, position: 'relative', overflow: 'hidden' } : {}}>
                {isHot && (
                  <div style={{ background: accentColor, color: isLOC ? '#fff' : '#000', fontWeight: 800, fontSize: 11, textAlign: 'center', padding: '4px 0', marginTop: -10, marginLeft: -14, marginRight: -14, marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' }}>
                    {bannerText}
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 4 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: isHot ? accentColor : undefined }}>{(lead.name || "(no name)").slice(0, 30)}</div>
                  <span style={{ color: isHot ? accentColor : "#666", fontSize: 11, fontWeight: isHot ? 700 : 400 }}>{lead.source || ''}</span>
                </div>
                <div style={{ color: isHot ? '#ccc' : "#888", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lead.email}</div>
                {(lead as any).message && <div style={{ color: accentColor, fontSize: 11, marginTop: 4, fontWeight: 500 }}>{(lead as any).message.slice(0, 100)}</div>}
                <div style={{ color: "#555", fontSize: 11, marginTop: 2 }}>{new Date(lead.createdAt).toLocaleDateString()}</div>
                {(lead as any).assignedTo && (
                  <div style={{ marginTop: 4 }}>
                    <span style={{ display: "inline-block", padding: "1px 6px", background: "#FF890022", color: "#FF8900", borderRadius: 3, fontSize: 10, fontWeight: 600 }}>
                      → {(lead as any).assignedTo}
                    </span>
                  </div>
                )}
              </div>
              );
            })}
            {leads.length === 0 && <div style={{ color: "#555", textAlign: "center", padding: 40, fontSize: 14 }}>No leads found.</div>}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, paddingTop: 8 }}>
            <button className="dash-btn-sm" onClick={() => setLeadsPage(p => Math.max(1, p - 1))} disabled={leadsPage <= 1}>Prev</button>
            <span style={{ color: "#666", fontSize: 12, lineHeight: "28px" }}>{leadsPage} / {leadsTotalPages}</span>
            <button className="dash-btn-sm" onClick={() => setLeadsPage(p => Math.min(leadsTotalPages, p + 1))} disabled={leadsPage >= leadsTotalPages}>Next</button>
          </div>
        </div>

        {/* Center: HITTS */}
        <div className={`dash-col ${mobileView !== "hitts" ? "hidden-mobile" : ""}`}>
          <div className="dash-header">
            <h2 style={{ margin: 0, fontSize: 18, color: "#FF8900" }}>HITTS</h2>
            <input
              className="dash-input dash-search"
              placeholder="Search hitts..."
              value={hittsSearch}
              onChange={e => { setHittsSearch(e.target.value); setHittsPage(1); }}
            />
          </div>
          <div className="dash-total">
            <span className="dash-total-label">Total Site Visitors</span>
            <span className="dash-total-num">{hittsTotal.toLocaleString()}</span>
          </div>
          <div style={{ flex: 1, overflow: "auto" }}>
            {hitts.map(hitt => (
              <div key={hitt._id} className="dash-card" onClick={() => setSelectedHitt(hitt)}>
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 4 }}>
                  <div style={{ fontWeight: 500, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{hitt.name || hitt.ip || "(anonymous)"}</div>
                  <span style={{ color: "#666", fontSize: 11, flexShrink: 0 }}>{hitt.source}</span>
                </div>
                <div style={{ color: "#888", fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{hitt.page || "/"}</div>
                <div style={{ color: "#555", fontSize: 11 }}>{new Date(hitt.createdAt).toLocaleString()}</div>
              </div>
            ))}
            {hitts.length === 0 && <div style={{ color: "#555", textAlign: "center", padding: 40, fontSize: 14 }}>No site visitors yet.</div>}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, paddingTop: 8 }}>
            <button className="dash-btn-sm" onClick={() => setHittsPage(p => Math.max(1, p - 1))} disabled={hittsPage <= 1}>Prev</button>
            <span style={{ color: "#666", fontSize: 12, lineHeight: "28px" }}>{hittsPage} / {hittsTotalPages}</span>
            <button className="dash-btn-sm" onClick={() => setHittsPage(p => Math.min(hittsTotalPages, p + 1))} disabled={hittsPage >= hittsTotalPages}>Next</button>
          </div>
        </div>

        {/* Right: Todos */}
        <div className={`dash-col ${mobileView !== "todos" ? "hidden-mobile" : ""}`}>
          <div className="dash-header">
            <h2 style={{ margin: 0, fontSize: 18, color: "#FF8900" }}>TODO LIST</h2>
            <button className="dash-btn" onClick={() => setShowAddTodo(true)}>+ ADD TODO</button>
          </div>
          <div style={{ display: "flex", gap: 4, marginBottom: 10, flexWrap: "wrap" }}>
            {tabs.map(tab => (
              <button key={tab} className="dash-btn-sm" onClick={() => setActiveTab(tab)}
                style={{ background: activeTab === tab ? "#FF8900" : "#222", color: activeTab === tab ? "#000" : "#aaa" }}>
                {tab}
              </button>
            ))}
          </div>
          <div style={{ flex: 1, overflow: "auto" }}>
            {todos.map(todo => (
              <div key={todo._id} className="dash-card" onClick={() => { setSelectedTodo(todo); loadComments(todo._id); }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 4 }}>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{todo.title}</div>
                  <span style={{ color: todo.status === "open" ? "#FF8900" : todo.status === "done" ? "#666" : "#f59e0b", fontSize: 11, textTransform: "uppercase" }}>{todo.status}</span>
                </div>
                {todo.fromLead && <span className="dash-badge">ASSIGNED FROM LEADS</span>}
                <div style={{ color: "#666", fontSize: 12, marginTop: 2 }}>Assigned to: {todo.assignedTo} &bull; {new Date(todo.createdAt).toLocaleDateString()}</div>
                {todo.followUpDate && <div style={{ color: "#f59e0b", fontSize: 11 }}>Follow-up: {new Date(todo.followUpDate).toLocaleDateString()}</div>}
              </div>
            ))}
            {todos.length === 0 && <div style={{ color: "#555", textAlign: "center", padding: 40, fontSize: 14 }}>No todos yet.</div>}
          </div>
        </div>
      </div>

      {/* Lead Modal */}
      {selectedLead && (
        <div className="dash-modal-overlay" onClick={() => setSelectedLead(null)} onTouchEnd={e => { if (e.target === e.currentTarget) setSelectedLead(null); }}>
          <div className="dash-modal" onClick={e => e.stopPropagation()} onTouchEnd={e => e.stopPropagation()}>
            {(() => {
              const isLeadLOC = (selectedLead as any).type === 'credit_application' || (selectedLead as any).source === 'softcircle-ai-loc';
              const modalAccent = isLeadLOC ? '#10B981' : '#FF8900';
              const leadData = selectedLead.rawData?.data || selectedLead.rawData || {};
              return (<>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 style={{ margin: 0, color: modalAccent, fontSize: 16 }}>{isLeadLOC ? 'Line of Credit Application' : 'Lead Details'}</h3>
              <button onClick={() => setSelectedLead(null)} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: 18 }}>✕</button>
            </div>
            {isLeadLOC && (
              <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, padding: '12px 16px', marginBottom: 16 }}>
                <div style={{ color: '#10B981', fontWeight: 700, fontSize: 13, marginBottom: 8 }}>APPLICATION DETAILS</div>
                <div style={{ fontSize: 13, lineHeight: 2, color: '#ccc' }}>
                  <div><strong style={{ color: '#fff' }}>Avg 3-Month Cash Balance:</strong> {(leadData as any).avgCashBalance ? `$${Number((leadData as any).avgCashBalance).toLocaleString()}` : 'N/A'}</div>
                  <div><strong style={{ color: '#fff' }}>Amount Requesting:</strong> {(leadData as any).requestedAmount ? `$${Number((leadData as any).requestedAmount).toLocaleString()}` : 'N/A'}</div>
                  <div><strong style={{ color: '#fff' }}>$495 Fee Agreed:</strong> <span style={{ color: '#10B981' }}>Yes</span></div>
                  <div><strong style={{ color: '#fff' }}>Platform:</strong> {(leadData as any).platform || 'Soft Circle AI'}</div>
                </div>
              </div>
            )}
            {selectedLead.imagePath && (
              <div style={{ marginBottom: 12, textAlign: "center" }}>
                <img src={selectedLead.imagePath} alt="Lead" style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 8, border: "1px solid #333" }} />
              </div>
            )}
            <div style={{ marginBottom: 12, fontSize: 14, lineHeight: 1.8 }}>
              <div><strong>Name:</strong> {selectedLead.name}</div>
              {(selectedLead.rawData?.business as string) && <div><strong>Business:</strong> {selectedLead.rawData.business as string}</div>}
              {(selectedLead.rawData?.company as string) && <div><strong>Company:</strong> {selectedLead.rawData.company as string}</div>}
              <div style={{ wordBreak: "break-all" }}><strong>Email:</strong> {selectedLead.email}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <strong>Phone:</strong> {selectedLead.phone || "N/A"}
                {selectedLead.phone && user.role === "admin" && (
                  <button
                    onClick={async () => {
                      setCalling(true);
                      setCallStatus("Ringing your phone...");
                      try {
                        const res = await fetch("/api/todo/call", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            to: selectedLead.phone,
                            leadName: selectedLead.name,
                            leadSource: selectedLead.source,
                            leadId: selectedLead._id,
                          }),
                        });
                        const data = await res.json();
                        if (data.success) {
                          setCallStatus("Pick up your phone!");
                          loadCallLogs(selectedLead._id);
                          setTimeout(() => { setCalling(false); setCallStatus(""); loadCallLogs(selectedLead._id); }, 30000);
                        } else {
                          setCallStatus(`Error: ${data.error}`);
                          setTimeout(() => { setCalling(false); setCallStatus(""); }, 5000);
                        }
                      } catch {
                        setCallStatus("Call failed");
                        setTimeout(() => { setCalling(false); setCallStatus(""); }, 5000);
                      }
                    }}
                    disabled={calling}
                    style={{
                      padding: "3px 10px",
                      background: calling ? "#333" : "#22c55e",
                      border: "none",
                      borderRadius: 6,
                      color: "#fff",
                      cursor: calling ? "not-allowed" : "pointer",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {calling ? "Calling..." : "Call"}
                  </button>
                )}
                {callStatus && <span style={{ fontSize: 12, color: callStatus.startsWith("Error") ? "#f87171" : "#22c55e" }}>{callStatus}</span>}
              </div>
              {(selectedLead.rawData?.address as string) && <div><strong>Address:</strong> {selectedLead.rawData.address as string}</div>}
              {(selectedLead.rawData?.website as string) && <div style={{ wordBreak: "break-all" }}><strong>Website:</strong> <a href={selectedLead.rawData.website as string} target="_blank" rel="noopener noreferrer" style={{ color: modalAccent }}>{selectedLead.rawData.website as string}</a></div>}
              <div><strong>Source:</strong> {selectedLead.source}</div>
              <div><strong>Page:</strong> {selectedLead.sourcePage || "N/A"}</div>
              <div><strong>Date:</strong> {new Date(selectedLead.createdAt).toLocaleString()}</div>
              {(selectedLead.rawData?.notes as string) && <div style={{ marginTop: 8, padding: "8px 12px", background: "#111", borderRadius: 6, border: "1px solid #222" }}><strong style={{ color: modalAccent }}>Notes:</strong><br/><span style={{ color: "#ccc", whiteSpace: "pre-wrap" }}>{selectedLead.rawData.notes as string}</span></div>}

              {/* Call History */}
              {callLogs.length > 0 && (
                <div style={{ marginTop: 12, padding: "10px 12px", background: "#0a0a0a", borderRadius: 8, border: "1px solid #222" }}>
                  <strong style={{ color: "#22c55e", fontSize: 13 }}>Call History ({callLogs.length})</strong>
                  <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
                    {callLogs.map(log => (
                      <div key={log._id} style={{ padding: "8px 10px", background: "#111", borderRadius: 6, border: "1px solid #1a1a1a" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12 }}>
                          <span style={{ color: log.direction === "inbound" ? "#60a5fa" : "#22c55e", fontWeight: 600 }}>
                            {log.direction === "inbound" ? "Inbound" : "Outbound"}
                          </span>
                          <span style={{ color: "#666" }}>{new Date(log.createdAt).toLocaleString()}</span>
                        </div>
                        <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>
                          Status: <span style={{ color: log.status === "completed" ? "#22c55e" : log.status === "no-answer" ? "#f59e0b" : "#999" }}>{log.status}</span>
                          {log.duration > 0 && <span> &middot; {Math.floor(log.duration / 60)}m {log.duration % 60}s</span>}
                        </div>
                        {/* Notes */}
                        {editingNoteId === log._id ? (
                          <div style={{ marginTop: 6 }}>
                            <textarea
                              value={noteText}
                              onChange={e => setNoteText(e.target.value)}
                              placeholder="Add call notes..."
                              style={{ width: "100%", minHeight: 60, background: "#0a0a0a", border: "1px solid #333", borderRadius: 4, color: "#eee", padding: 6, fontSize: 12, resize: "vertical" }}
                            />
                            <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                              <button onClick={() => saveCallNote(log._id, noteText)} style={{ padding: "3px 10px", background: "#22c55e", border: "none", borderRadius: 4, color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Save</button>
                              <button onClick={() => setEditingNoteId(null)} style={{ padding: "3px 10px", background: "#333", border: "none", borderRadius: 4, color: "#999", fontSize: 11, cursor: "pointer" }}>Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <div style={{ marginTop: 4, display: "flex", gap: 6, alignItems: "flex-start" }}>
                            {log.notes ? (
                              <span style={{ fontSize: 12, color: "#ccc", whiteSpace: "pre-wrap", flex: 1 }}>{log.notes}</span>
                            ) : null}
                            <button
                              onClick={() => { setEditingNoteId(log._id); setNoteText(log.notes || ""); }}
                              style={{ padding: "2px 8px", background: "#222", border: "1px solid #333", borderRadius: 4, color: "#888", fontSize: 11, cursor: "pointer", whiteSpace: "nowrap" }}
                            >
                              {log.notes ? "Edit" : "+ Note"}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
              </>);
            })()}
            {/* Lead Ownership Assignment (admin only) */}
            {user.role === "admin" && (
              <div style={{ marginBottom: 16, padding: "10px 12px", background: "#111", borderRadius: 8, border: "1px solid #222" }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ color: "#FF8900", fontSize: 13, fontWeight: 600 }}>Owner:</span>
                  <select className="dash-input" style={{ width: "auto", flex: 1, minWidth: 120 }}
                    value={(selectedLead as any).assignedTo || ""}
                    onChange={async (e) => {
                      const val = e.target.value;
                      await fetch(`/api/todo/leads/${selectedLead._id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ assignedTo: val || null }),
                      });
                      setSelectedLead({ ...selectedLead, assignedTo: val || undefined } as Lead);
                      fetchLeads();
                    }}>
                    <option value="">Unassigned</option>
                    {teamUsers.map(u => <option key={u._id} value={u.name}>{u.name}</option>)}
                  </select>
                </div>
              </div>
            )}
            {/* Show current owner for non-admins */}
            {user.role !== "admin" && (selectedLead as any).assignedTo && (
              <div style={{ marginBottom: 16, padding: "8px 12px", background: "#111", borderRadius: 8, border: "1px solid #222" }}>
                <span style={{ color: "#888", fontSize: 13 }}>Assigned to: </span>
                <span style={{ color: "#FF8900", fontWeight: 600, fontSize: 13 }}>{(selectedLead as any).assignedTo}</span>
              </div>
            )}
            <details style={{ marginBottom: 16 }}>
              <summary style={{ color: "#888", cursor: "pointer", fontSize: 13 }}>Raw Data</summary>
              <pre style={{ background: "#111", padding: 12, borderRadius: 6, fontSize: 11, overflow: "auto", maxHeight: 200, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{JSON.stringify(selectedLead.rawData, null, 2)}</pre>
            </details>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ color: "#888", fontSize: 13 }}>Create todo for:</span>
              <select className="dash-input" style={{ width: "auto", flex: 1, minWidth: 120 }} defaultValue={user.name} id="assign-lead-select">
                {teamUsers.map(u => <option key={u._id} value={u.name}>{u.name}</option>)}
              </select>
              <button className="dash-btn" onClick={() => {
                const sel = (document.getElementById("assign-lead-select") as HTMLSelectElement)?.value || user.name;
                addTodoFromLead(selectedLead, sel);
              }}>ADD TO TODO</button>
            </div>
          </div>
        </div>
      )}

      {/* Hitt Modal */}
      {selectedHitt && (
        <div className="dash-modal-overlay" onClick={() => setSelectedHitt(null)} onTouchEnd={e => { if (e.target === e.currentTarget) setSelectedHitt(null); }}>
          <div className="dash-modal" onClick={e => e.stopPropagation()} onTouchEnd={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 style={{ margin: 0, color: "#FF8900", fontSize: 16 }}>Visitor Details</h3>
              <button onClick={() => setSelectedHitt(null)} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: 18 }}>✕</button>
            </div>
            <div style={{ marginBottom: 12, fontSize: 14, lineHeight: 1.8 }}>
              <div><strong>Name/ID:</strong> {selectedHitt.name}</div>
              {selectedHitt.email && <div style={{ wordBreak: "break-all" }}><strong>Email:</strong> {selectedHitt.email}</div>}
              <div><strong>IP:</strong> {selectedHitt.ip || "N/A"}</div>
              <div style={{ wordBreak: "break-all" }}><strong>Page:</strong> {selectedHitt.page || "/"}</div>
              <div><strong>Source:</strong> {selectedHitt.source}</div>
              <div><strong>Visited:</strong> {new Date(selectedHitt.createdAt).toLocaleString()}</div>
            </div>
            <details style={{ marginBottom: 16 }}>
              <summary style={{ color: "#888", cursor: "pointer", fontSize: 13 }}>Raw Data</summary>
              <pre style={{ background: "#111", padding: 12, borderRadius: 6, fontSize: 11, overflow: "auto", maxHeight: 200, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{JSON.stringify(selectedHitt.rawData, null, 2)}</pre>
            </details>
          </div>
        </div>
      )}

      {/* Todo Modal */}
      {selectedTodo && (
        <div className="dash-modal-overlay" onClick={() => setSelectedTodo(null)} onTouchEnd={e => { if (e.target === e.currentTarget) setSelectedTodo(null); }}>
          <div className="dash-modal" onClick={e => e.stopPropagation()} onTouchEnd={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 style={{ margin: 0, color: "#FF8900", fontSize: 16, wordBreak: "break-word" }}>{selectedTodo.title}</h3>
              <button onClick={() => setSelectedTodo(null)} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: 18, flexShrink: 0 }}>✕</button>
            </div>
            <div style={{ marginBottom: 12, fontSize: 14, lineHeight: 1.6 }}>
              <div><strong>Notes:</strong> {selectedTodo.notes || "None"}</div>
              <div><strong>Status:</strong> {selectedTodo.status}</div>
              <div><strong>Assigned to:</strong> {selectedTodo.assignedTo}</div>
              {selectedTodo.fromLead && <div><span className="dash-badge">FROM LEAD: {selectedTodo.fromLead}</span></div>}
            </div>
            <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
              {["open", "in-progress", "done"].map(s => (
                <button key={s} className="dash-btn-sm" onClick={() => updateTodo(selectedTodo._id, { status: s })}
                  style={{ background: selectedTodo.status === s ? "#FF8900" : "#222", color: selectedTodo.status === s ? "#000" : "#aaa" }}>{s}</button>
              ))}
              <select className="dash-input" style={{ width: "auto", minWidth: 120 }}
                value={selectedTodo.assignedTo}
                onChange={e => {
                  const note = prompt("Note for reassignment:");
                  if (note !== null) updateTodo(selectedTodo._id, { assignedTo: e.target.value, reassignNote: note });
                }}>
                {teamUsers.map(u => <option key={u._id} value={u.name}>{u.name}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 4 }}>Follow-up Date</label>
              <input type="datetime-local" className="dash-input" style={{ width: "auto" }}
                value={selectedTodo.followUpDate ? new Date(selectedTodo.followUpDate).toISOString().slice(0, 16) : ""}
                onChange={e => updateTodo(selectedTodo._id, { followUpDate: e.target.value })} />
            </div>
            <div>
              <h4 style={{ color: "#888", fontSize: 13, marginBottom: 8 }}>Comments</h4>
              <div style={{ maxHeight: 200, overflow: "auto", marginBottom: 8 }}>
                {comments.map(c => (
                  <div key={c._id} style={{ background: "#111", borderRadius: 6, padding: "8px 10px", marginBottom: 4, fontSize: 13 }}>
                    <span style={{ color: "#FF8900", fontWeight: 600 }}>{c.author}</span>
                    <span style={{ color: "#555", fontSize: 11, marginLeft: 8 }}>{new Date(c.createdAt).toLocaleString()}</span>
                    <div style={{ color: "#ccc", marginTop: 2, wordBreak: "break-word" }}>{c.text}</div>
                  </div>
                ))}
                {comments.length === 0 && <div style={{ color: "#555", fontSize: 12 }}>No comments yet.</div>}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <input className="dash-input" style={{ flex: 1 }} placeholder="Add comment..." value={newComment} onChange={e => setNewComment(e.target.value)} onKeyDown={e => e.key === "Enter" && addComment()} />
                <button className="dash-btn" onClick={addComment}>Add</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Add Modal */}
      {showQuickAdd && (
        <div className="dash-modal-overlay" onClick={() => setShowQuickAdd(false)}>
          <div className="dash-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 style={{ margin: 0, color: "#FF8900", fontSize: 16 }}>📷 Quick Add Lead</h3>
              <button onClick={() => setShowQuickAdd(false)} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: 18 }}>✕</button>
            </div>

            <input ref={cameraRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={handlePersonPhoto} />
            <input ref={uploadRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={handleCardPhoto} />

            {!qaPreview ? (
              <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                <button onClick={() => cameraRef.current?.click()} style={{ flex: 1, padding: "16px 12px", background: "#222", border: "1px solid #333", borderRadius: 8, color: "#f0f0f0", cursor: "pointer", fontSize: 14, minHeight: 44 }}>
                  Take Photo
                </button>
                <button onClick={() => uploadRef.current?.click()} style={{ flex: 1, padding: "16px 12px", background: "#222", border: "1px solid #333", borderRadius: 8, color: "#f0f0f0", cursor: "pointer", fontSize: 14, minHeight: 44 }}>
                  Business Card
                </button>
              </div>
            ) : (
              <div style={{ marginBottom: 16, textAlign: "center", position: "relative" }}>
                <img src={qaPreview} alt="Preview" style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 8, border: "1px solid #333" }} />
                <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 10 }}>
                  <button onClick={() => { setQaImage(null); setQaPreview(""); setQaMode(null); setQaScanDone(false); setQaFields({ name: "", business: "", email: "", phone: "", address: "", website: "", notes: "", assignTo: "" }); }} style={{ padding: "10px 20px", background: "#333", border: "1px solid #444", borderRadius: 8, color: "#f87171", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>Remove</button>
                  {qaMode === "card" && (
                    <button onClick={() => scanCard()} disabled={qaScanning} style={{
                      padding: "10px 28px", borderRadius: 8,
                      background: qaScanning ? "#555" : "#FF8900", border: "none", cursor: qaScanning ? "default" : "pointer",
                      color: qaScanning ? "#ccc" : "#000",
                      fontSize: 14, fontWeight: 700,
                      boxShadow: qaScanning ? "none" : "0 4px 16px rgba(255,137,0,0.4)",
                      opacity: qaScanning ? 0.7 : 1,
                    }}>{qaScanning ? "SCANNING..." : qaScanDone ? "RESCAN" : "SCAN CARD"}</button>
                  )}
                </div>
                {qaScanError && <div style={{ color: "#f87171", fontSize: 13, marginTop: 6 }}>{qaScanError}</div>}
                {qaScanDone && !qaScanError && (qaFields.name || qaFields.phone || qaFields.email) && <div style={{ color: "#4ade80", fontSize: 13, marginTop: 6 }}>Data extracted -- review below</div>}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input className="dash-input" placeholder="Name" value={qaFields.name} onChange={e => setQaFields({ ...qaFields, name: e.target.value })} />
              <input className="dash-input" placeholder="Business" value={qaFields.business} onChange={e => setQaFields({ ...qaFields, business: e.target.value })} />
              <input className="dash-input" placeholder="Email" type="email" value={qaFields.email} onChange={e => setQaFields({ ...qaFields, email: e.target.value })} />
              <input className="dash-input" placeholder="Phone" type="tel" value={qaFields.phone} onChange={e => setQaFields({ ...qaFields, phone: e.target.value })} />
              <input className="dash-input" placeholder="Address" value={qaFields.address} onChange={e => setQaFields({ ...qaFields, address: e.target.value })} />
              <input className="dash-input" placeholder="Website" type="url" value={qaFields.website} onChange={e => setQaFields({ ...qaFields, website: e.target.value })} />
              <textarea className="dash-input" placeholder="Notes" value={qaFields.notes} onChange={e => setQaFields({ ...qaFields, notes: e.target.value })} style={{ minHeight: 60, resize: "vertical" as const }} />
              <select className="dash-input" value={qaFields.assignTo} onChange={e => setQaFields({ ...qaFields, assignTo: e.target.value })}>
                <option value="">Assign To...</option>
                {teamUsers.map(u => <option key={u._id} value={u.name}>{u.name}</option>)}
              </select>
              <button className="dash-btn" onClick={submitQuickAdd} disabled={qaSubmitting} style={{ width: "100%", padding: 14, fontSize: 16, minHeight: 48, opacity: qaSubmitting ? 0.6 : 1 }}>
                {qaSubmitting ? "ADDING..." : "ADD LEAD"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Todo Modal */}
      {showAddTodo && (
        <div className="dash-modal-overlay" onClick={() => setShowAddTodo(false)} onTouchEnd={e => { if (e.target === e.currentTarget) setShowAddTodo(false); }}>
          <div className="dash-modal" onClick={e => e.stopPropagation()} onTouchEnd={e => e.stopPropagation()}>
            <h3 style={{ margin: "0 0 16px", color: "#FF8900" }}>Add Todo</h3>
            <input className="dash-input" placeholder="Title" value={newTodo.title} onChange={e => setNewTodo({ ...newTodo, title: e.target.value })} style={{ marginBottom: 12 }} />
            <textarea className="dash-input" placeholder="Notes" value={newTodo.notes} onChange={e => setNewTodo({ ...newTodo, notes: e.target.value })} style={{ marginBottom: 12, minHeight: 80, resize: "vertical" as const }} />
            <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
              <select className="dash-input" style={{ width: "auto", flex: 1, minWidth: 120 }} value={newTodo.assignedTo} onChange={e => setNewTodo({ ...newTodo, assignedTo: e.target.value })}>
                {teamUsers.map(u => <option key={u._id} value={u.name}>{u.name}</option>)}
              </select>
              <input type="datetime-local" className="dash-input" style={{ width: "auto", flex: 1 }} value={newTodo.followUpDate} onChange={e => setNewTodo({ ...newTodo, followUpDate: e.target.value })} />
            </div>
            <button className="dash-btn" onClick={addManualTodo} style={{ width: "100%" }}>Create Todo</button>
          </div>
        </div>
      )}
    </>
  );
}
