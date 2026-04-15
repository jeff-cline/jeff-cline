"use client";
import { useState, useRef, useCallback } from "react";

interface CardEntry {
  id: string;
  file: File;
  preview: string;
  scanning: boolean;
  scanDone: boolean;
  saved: boolean;
  saving: boolean;
  error: string;
  fields: {
    name: string; business: string; email: string;
    phone: string; address: string; website: string; notes: string;
  };
}

function emptyFields() {
  return { name: "", business: "", email: "", phone: "", address: "", website: "", notes: "" };
}

export default function BulkAddPage() {
  const [cards, setCards] = useState<CardEntry[]>([]);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [assign, setAssign] = useState("Jeff");
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const scanCard = useCallback(async (entry: CardEntry): Promise<CardEntry> => {
    try {
      const fd = new FormData();
      fd.append("image", entry.file);
      const res = await fetch("/api/todo/ocr", { method: "POST", body: fd });
      if (res.ok) {
        const data = await res.json();
        const f = entry.fields;
        if (data.fields) {
          return {
            ...entry,
            scanning: false,
            scanDone: true,
            fields: {
              name: data.fields.name || f.name,
              business: data.fields.business || f.business,
              email: data.fields.email || f.email,
              phone: data.fields.phone || f.phone,
              address: data.fields.address || f.address,
              website: data.fields.website || f.website,
              notes: data.fields.misc ? (f.notes ? f.notes + "\n" + data.fields.misc : data.fields.misc) : f.notes,
            },
          };
        }
      }
    } catch (e) { console.error("[bulk scan]", e); }
    return { ...entry, scanning: false, scanDone: true };
  }, []);

  const addFiles = useCallback(async (files: FileList | File[]) => {
    const newEntries: CardEntry[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const preview = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      newEntries.push({
        id, file, preview, scanning: true, scanDone: false,
        saved: false, saving: false, error: "", fields: emptyFields(),
      });
    }
    setCards(prev => [...prev, ...newEntries]);
    // Auto-open first card if none active
    if (newEntries.length > 0) {
      setCards(prev => {
        // scan all new entries
        newEntries.forEach((entry) => {
          scanCard(entry).then(scanned => {
            setCards(cur => cur.map(c => c.id === scanned.id ? scanned : c));
          });
        });
        return prev;
      });
    }
  }, [scanCard]);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
      e.target.value = "";
    }
  };

  const updateField = (idx: number, field: string, value: string) => {
    setCards(prev => prev.map((c, i) => i === idx ? { ...c, fields: { ...c.fields, [field]: value } } : c));
  };

  const removeCard = (idx: number) => {
    setCards(prev => prev.filter((_, i) => i !== idx));
    if (activeIdx === idx) setActiveIdx(null);
    else if (activeIdx !== null && activeIdx > idx) setActiveIdx(activeIdx - 1);
  };

  const saveCard = async (idx: number) => {
    const card = cards[idx];
    if (!card || card.saved || card.saving) return;
    const { name, email, phone } = card.fields;
    if (!name && !phone && !email) {
      setCards(prev => prev.map((c, i) => i === idx ? { ...c, error: "Need at least a name, phone, or email" } : c));
      return;
    }
    setCards(prev => prev.map((c, i) => i === idx ? { ...c, saving: true, error: "" } : c));
    try {
      const fd = new FormData();
      fd.append("image", card.file);
      fd.append("name", card.fields.name);
      fd.append("business", card.fields.business);
      fd.append("email", card.fields.email);
      fd.append("phone", card.fields.phone);
      fd.append("address", card.fields.address);
      fd.append("website", card.fields.website);
      fd.append("notes", card.fields.notes);
      fd.append("assignTo", assign);
      const res = await fetch("/api/todo/quick-add-public", { method: "POST", body: fd });
      if (res.ok) {
        setCards(prev => prev.map((c, i) => i === idx ? { ...c, saving: false, saved: true } : c));
        // Auto-advance to next unsaved
        const nextUnsaved = cards.findIndex((c, i) => i > idx && !c.saved);
        if (nextUnsaved !== -1) setActiveIdx(nextUnsaved);
      } else {
        const data = await res.json().catch(() => ({}));
        setCards(prev => prev.map((c, i) => i === idx ? { ...c, saving: false, error: data.error || "Failed to save" } : c));
      }
    } catch {
      setCards(prev => prev.map((c, i) => i === idx ? { ...c, saving: false, error: "Network error" } : c));
    }
  };

  const savedCount = cards.filter(c => c.saved).length;
  const totalCount = cards.length;

  return (
    <div style={{ minHeight: "100dvh", background: "#0a0a0a", padding: "20px 16px" }}>
      <style>{`
        .bulk-page input, .bulk-page textarea, .bulk-page select {
          width: 100%; padding: 12px 14px; background: #111; border: 1px solid #333;
          border-radius: 8px; color: #ddd; font-size: 15px; margin-bottom: 8px;
          box-sizing: border-box; outline: none; -webkit-appearance: none;
        }
        .bulk-page input:focus, .bulk-page textarea:focus { border-color: #FF8900; }
        .bulk-page textarea { min-height: 60px; resize: vertical; }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>

      <div className="bulk-page" style={{ maxWidth: 500, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <img src="/vault-icon-192.png" alt="The Vault" style={{ width: 52, height: 52, borderRadius: 12, margin: "0 auto 10px", display: "block", border: "2px solid #333" }} />
          <h1 style={{ color: "#FF8900", fontSize: 20, margin: "0 0 4px", letterSpacing: 2 }}>BULK ADD LEADS</h1>
          <p style={{ color: "#666", fontSize: 13, margin: 0 }}>Snap or upload multiple business cards at once</p>
        </div>

        {/* Upload buttons */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <button onClick={() => cameraRef.current?.click()} style={{
            flex: 1, padding: "16px 10px", background: "#1a1a1a", border: "1px solid #333",
            borderRadius: 10, color: "#ccc", cursor: "pointer", textAlign: "center", fontSize: 13
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF8900" strokeWidth="2" style={{ display: "block", margin: "0 auto 4px" }}>
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
            </svg>
            Take Photo
          </button>
          <button onClick={() => fileRef.current?.click()} style={{
            flex: 1, padding: "16px 10px", background: "#1a1a1a", border: "1px solid #333",
            borderRadius: 10, color: "#ccc", cursor: "pointer", textAlign: "center", fontSize: 13
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF8900" strokeWidth="2" style={{ display: "block", margin: "0 auto 4px" }}>
              <rect x="2" y="4" width="20" height="16" rx="2"/><line x1="6" y1="9" x2="12" y2="9"/>
              <line x1="6" y1="13" x2="18" y2="13"/><line x1="6" y1="17" x2="14" y2="17"/>
            </svg>
            Upload Cards
          </button>
        </div>

        <input ref={cameraRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={handleFiles} />
        <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handleFiles} />

        {/* Assign to */}
        {cards.length > 0 && (
          <select value={assign} onChange={e => setAssign(e.target.value)} style={{ marginBottom: 16 }}>
            <option value="Jeff">Assign all to: Jeff</option>
            <option value="Krystal">Assign all to: Krystal</option>
          </select>
        )}

        {/* Progress */}
        {totalCount > 0 && (
          <div style={{ color: "#888", fontSize: 13, marginBottom: 12, textAlign: "center" }}>
            {savedCount} of {totalCount} saved
            {savedCount === totalCount && totalCount > 0 && (
              <span style={{ color: "#10B981", fontWeight: 700, marginLeft: 8 }}>All done!</span>
            )}
          </div>
        )}

        {/* Card thumbnails grid */}
        {cards.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))", gap: 8, marginBottom: 16 }}>
            {cards.map((card, idx) => (
              <div key={card.id} onClick={() => !card.saved && setActiveIdx(idx)} style={{
                position: "relative", borderRadius: 8, overflow: "hidden", cursor: card.saved ? "default" : "pointer",
                border: activeIdx === idx ? "2px solid #FF8900" : card.saved ? "2px solid #10B981" : "2px solid #333",
                opacity: card.saved ? 0.6 : 1,
              }}>
                <img src={card.preview} alt="" style={{ width: "100%", height: 80, objectFit: "cover", display: "block" }} />
                {card.scanning && (
                  <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 20, height: 20, border: "2px solid #FF8900", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                  </div>
                )}
                {card.saved && (
                  <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: "#10B981", fontSize: 28, fontWeight: 700 }}>&#10003;</span>
                  </div>
                )}
                {!card.saved && !card.scanning && (
                  <button onClick={(e) => { e.stopPropagation(); removeCard(idx); }} style={{
                    position: "absolute", top: 2, right: 2, background: "#000b", border: "none",
                    color: "#fff", borderRadius: "50%", width: 20, height: 20, cursor: "pointer", fontSize: 11, padding: 0, lineHeight: "20px"
                  }}>x</button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Active card editor */}
        {activeIdx !== null && cards[activeIdx] && !cards[activeIdx].saved && (
          <div style={{ background: "#151515", borderRadius: 12, padding: "16px", border: "1px solid #333", marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ color: "#FF8900", fontSize: 14, fontWeight: 700 }}>Card {activeIdx + 1} of {totalCount}</span>
              <div style={{ display: "flex", gap: 8 }}>
                <button disabled={activeIdx === 0} onClick={() => { const prev = cards.findLastIndex((c, i) => i < activeIdx! && !c.saved); if (prev !== -1) setActiveIdx(prev); }}
                  style={{ background: "none", border: "none", color: activeIdx === 0 ? "#333" : "#888", cursor: "pointer", fontSize: 18 }}>&larr;</button>
                <button onClick={() => { const next = cards.findIndex((c, i) => i > activeIdx! && !c.saved); if (next !== -1) setActiveIdx(next); }}
                  style={{ background: "none", border: "none", color: "#888", cursor: "pointer", fontSize: 18 }}>&rarr;</button>
              </div>
            </div>

            <img src={cards[activeIdx].preview} alt="" style={{ width: "100%", maxHeight: 180, objectFit: "contain", borderRadius: 8, background: "#000", marginBottom: 12 }} />

            {cards[activeIdx].scanning ? (
              <div style={{ textAlign: "center", padding: "20px 0", color: "#FF8900", fontSize: 14 }}>
                <img src="/favicon-192x192.png" alt="" style={{ width: 40, height: 40, animation: "pulse 1.5s ease-in-out infinite", display: "block", margin: "0 auto 8px" }} />
                SCANNING...
              </div>
            ) : (
              <>
                <input placeholder="Name" value={cards[activeIdx].fields.name} onChange={e => updateField(activeIdx, "name", e.target.value)} />
                <input placeholder="Business" value={cards[activeIdx].fields.business} onChange={e => updateField(activeIdx, "business", e.target.value)} />
                <input type="email" placeholder="Email" value={cards[activeIdx].fields.email} onChange={e => updateField(activeIdx, "email", e.target.value)} />
                <input type="tel" placeholder="Phone" value={cards[activeIdx].fields.phone} onChange={e => updateField(activeIdx, "phone", e.target.value)} />
                <input placeholder="Address" value={cards[activeIdx].fields.address} onChange={e => updateField(activeIdx, "address", e.target.value)} />
                <input type="url" placeholder="Website" value={cards[activeIdx].fields.website} onChange={e => updateField(activeIdx, "website", e.target.value)} />
                <textarea placeholder="Notes" value={cards[activeIdx].fields.notes} onChange={e => updateField(activeIdx, "notes", e.target.value)} />

                {cards[activeIdx].error && (
                  <div style={{ color: "#ef4444", fontSize: 13, marginBottom: 8, textAlign: "center" }}>{cards[activeIdx].error}</div>
                )}

                <button onClick={() => saveCard(activeIdx)} disabled={cards[activeIdx].saving} style={{
                  width: "100%", padding: "14px", background: "#FF8900", color: "#000",
                  border: "none", borderRadius: 8, fontSize: 16, fontWeight: 700, cursor: "pointer", letterSpacing: 1
                }}>
                  {cards[activeIdx].saving ? "SAVING..." : "SAVE LEAD"}
                </button>
              </>
            )}
          </div>
        )}

        {/* All saved state */}
        {totalCount > 0 && savedCount === totalCount && (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <div style={{ color: "#10B981", fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{totalCount} Lead{totalCount > 1 ? "s" : ""} Saved</div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => { setCards([]); setActiveIdx(null); }} style={{ padding: "14px 28px", background: "#FF8900", color: "#000", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>ADD MORE</button>
              <a href="/todo" style={{ padding: "14px 28px", background: "transparent", color: "#FF8900", border: "1px solid #FF8900", borderRadius: 8, fontSize: 15, fontWeight: 700, textDecoration: "none" }}>VIEW LEADS</a>
            </div>
          </div>
        )}

        {/* Empty state */}
        {cards.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#444", fontSize: 14 }}>
            Take photos or upload business card images to get started
          </div>
        )}

        <div style={{ marginTop: 20, textAlign: "center", display: "flex", gap: 16, justifyContent: "center" }}>
          <a href="/todo/add" style={{ color: "#555", fontSize: 12, textDecoration: "none" }}>Single Add</a>
          <a href="/todo" style={{ color: "#555", fontSize: 12, textDecoration: "none" }}>Back to The Vault</a>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
