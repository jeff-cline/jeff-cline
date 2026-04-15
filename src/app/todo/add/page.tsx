"use client";
import { useState, useRef } from "react";

export default function QuickAddPage() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [notes, setNotes] = useState("");
  const [assign, setAssign] = useState("Jeff");
  const [submitting, setSubmitting] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanDone, setScanDone] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"person" | "card" | null>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setImage(null); setPreview(""); setName(""); setBusiness("");
    setEmail(""); setPhone(""); setAddress(""); setWebsite(""); setNotes("");
    setAssign("Jeff"); setSuccess(false); setError(""); setMode(null); setScanDone(false);
  };

  const handlePersonPhoto = (file: File | null) => {
    if (!file) return;
    setImage(file); setMode("person");
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleCardPhoto = (file: File | null) => {
    if (!file) return;
    setImage(file); setMode("card"); setScanDone(false);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
    scanCard(file);
  };

  const scanCard = async (file?: File | null) => {
    const f = file || image;
    if (!f) return;
    setScanning(true); setScanDone(false);
    try {
      const fd = new FormData();
      fd.append("image", f);
      const res = await fetch("/api/todo/ocr", { method: "POST", body: fd });
      if (res.ok) {
        const data = await res.json();
        if (data.fields) {
          if (data.fields.name) setName(data.fields.name);
          if (data.fields.business) setBusiness(data.fields.business);
          if (data.fields.email) setEmail(data.fields.email);
          if (data.fields.phone) setPhone(data.fields.phone);
          if (data.fields.address) setAddress(data.fields.address);
          if (data.fields.website) setWebsite(data.fields.website);
          if (data.fields.misc) setNotes(prev => prev ? prev + "\n" + data.fields.misc : data.fields.misc);
        }
        setScanDone(true);
      }
    } catch (err) { console.error("[scanCard] error:", err); }
    setScanning(false);
  };

  const submit = async () => {
    if (!name && !phone && !email) return;
    setSubmitting(true); setError("");
    try {
      const fd = new FormData();
      if (image) fd.append("image", image);
      fd.append("name", name);
      fd.append("business", business);
      fd.append("email", email);
      fd.append("phone", phone);
      fd.append("address", address);
      fd.append("website", website);
      fd.append("notes", notes);
      fd.append("assignTo", assign);
      const res = await fetch("/api/todo/quick-add-public", { method: "POST", body: fd });
      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to add lead. Try again.");
      }
    } catch {
      setError("Network error. Check your connection and try again.");
    }
    setSubmitting(false);
  };

  return (
    <div style={{ minHeight: "100dvh", background: "#0a0a0a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 16px" }}>
      <style>{`
        .qa-page input, .qa-page textarea, .qa-page select {
          width: 100%; padding: 14px 16px; background: #111; border: 1px solid #333;
          border-radius: 8px; color: #ddd; font-size: 16px; margin-bottom: 10px;
          box-sizing: border-box; outline: none; -webkit-appearance: none;
        }
        .qa-page input:focus, .qa-page textarea:focus { border-color: #FF8900; }
        .qa-page textarea { min-height: 70px; resize: vertical; }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>

      <div className="qa-page" style={{ width: "100%", maxWidth: 440, background: "#111", borderRadius: 16, padding: "28px 20px", border: "1px solid #222" }}>
        {success ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>&#10003;</div>
            <h2 style={{ color: "#10B981", fontSize: 22, margin: "0 0 12px" }}>Lead Added</h2>
            <p style={{ color: "#888", fontSize: 14, marginBottom: 24 }}>Your lead has been saved to The Vault.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={reset} style={{ padding: "14px 32px", background: "#FF8900", color: "#000", border: "none", borderRadius: 8, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>ADD ANOTHER</button>
              <a href="/todo" style={{ padding: "14px 32px", background: "transparent", color: "#FF8900", border: "1px solid #FF8900", borderRadius: 8, fontSize: 16, fontWeight: 700, textDecoration: "none", display: "inline-block" }}>LOG IN</a>
            </div>
          </div>
        ) : (
          <>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <img src="/vault-icon-192.png" alt="The Vault" style={{ width: 64, height: 64, borderRadius: 14, margin: "0 auto 12px", display: "block", border: "2px solid #333" }} />
              <h1 style={{ color: "#FF8900", fontSize: 22, margin: "0 0 4px", letterSpacing: 2 }}>QUICK ADD LEAD</h1>
              <p style={{ color: "#666", fontSize: 13, margin: 0 }}>Snap a business card or enter details manually</p>
            </div>

            {preview ? (
              <div style={{ position: "relative", marginBottom: 14 }}>
                <img src={preview} alt="preview" style={{ width: "100%", maxHeight: 220, objectFit: "contain", borderRadius: 8, background: "#000" }} />
                <button onClick={() => { setImage(null); setPreview(""); setMode(null); setScanDone(false); }} style={{ position: "absolute", top: 6, right: 6, background: "#000c", border: "none", color: "#fff", borderRadius: "50%", width: 30, height: 30, cursor: "pointer", fontSize: 15, zIndex: 5 }}>X</button>
                {scanning && (
                  <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.85)", borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
                    <img src="/favicon-192x192.png" alt="" style={{ width: 56, height: 56, animation: "pulse 1.5s ease-in-out infinite" }} />
                    <span style={{ color: "#FF8900", fontSize: 15, fontWeight: 700, letterSpacing: 1 }}>SCANNING CARD...</span>
                  </div>
                )}
                {!scanning && mode === "card" && scanDone && !name && !phone && !email && (
                  <button onClick={() => scanCard()} style={{ display: "block", margin: "10px auto 0", padding: "12px 28px", borderRadius: 28, background: "#FF8900", border: "none", cursor: "pointer", color: "#000", fontSize: 15, fontWeight: 700 }}>RETRY SCAN</button>
                )}
              </div>
            ) : (
              <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                <button onClick={() => cameraRef.current?.click()} style={{ flex: 1, padding: "18px 12px", background: "#1a1a1a", border: "1px solid #333", borderRadius: 10, color: "#ccc", cursor: "pointer", textAlign: "center", fontSize: 13 }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF8900" strokeWidth="2" style={{ display: "block", margin: "0 auto 6px" }}><circle cx="12" cy="8" r="4"/><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/></svg>
                  Take Photo
                </button>
                <button onClick={() => cardRef.current?.click()} style={{ flex: 1, padding: "18px 12px", background: "#1a1a1a", border: "1px solid #333", borderRadius: 10, color: "#ccc", cursor: "pointer", textAlign: "center", fontSize: 13 }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF8900" strokeWidth="2" style={{ display: "block", margin: "0 auto 6px" }}><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="6" y1="9" x2="12" y2="9"/><line x1="6" y1="13" x2="18" y2="13"/><line x1="6" y1="17" x2="14" y2="17"/></svg>
                  Business Card
                </button>
              </div>
            )}

            <input ref={cameraRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={e => handlePersonPhoto(e.target.files?.[0] || null)} />
            <input ref={cardRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={e => handleCardPhoto(e.target.files?.[0] || null)} />

            <input placeholder="Name *" value={name} onChange={e => setName(e.target.value)} />
            <input placeholder="Business" value={business} onChange={e => setBusiness(e.target.value)} />
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input type="tel" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
            <input placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} />
            <input type="url" placeholder="Website" value={website} onChange={e => setWebsite(e.target.value)} />
            <textarea placeholder="Notes" value={notes} onChange={e => setNotes(e.target.value)} />
            <select value={assign} onChange={e => setAssign(e.target.value)} style={{ marginBottom: 16 }}>
              <option value="Jeff">Assign to: Jeff</option>
              <option value="Krystal">Assign to: Krystal</option>
            </select>

            {error && <div style={{ color: "#ef4444", fontSize: 13, marginBottom: 10, textAlign: "center" }}>{error}</div>}

            <button onClick={submit} disabled={submitting || (!name && !phone && !email)} style={{
              width: "100%", padding: "16px", background: (!name && !phone && !email) ? "#444" : "#FF8900",
              color: "#000", border: "none", borderRadius: 8, fontSize: 18, fontWeight: 700,
              cursor: (!name && !phone && !email) ? "not-allowed" : "pointer", letterSpacing: 1
            }}>
              {submitting ? "Adding..." : "ADD LEAD"}
            </button>
          </>
        )}
      </div>

      <div style={{ marginTop: 20, textAlign: "center", display: "flex", gap: 16, justifyContent: "center" }}>
        <a href="/todo/add/bulk" style={{ color: "#FF8900", fontSize: 13, textDecoration: "none", fontWeight: 600 }}>BULK ADD</a>
        <a href="/todo" style={{ color: "#555", fontSize: 12, textDecoration: "none" }}>Back to The Vault</a>
      </div>
    </div>
  );
}
