"use client";

import { useState } from "react";

/* eslint-disable @next/next/no-img-element */

const interestOptions = [
  "Technology Investment",
  "Real Estate Development",
  "Healthcare Infrastructure",
  "Digital Infrastructure",
  "All Opportunities",
];

export default function DeckPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    interest: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/todo/webhook/lead-ingest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CRM-Key": "jc-crm-2024",
        },
        body: JSON.stringify({
          source: "jeff-cline.com/deck",
          type: "SJSC_DECK_REQUEST",
          name: form.name,
          email: form.email,
          phone: form.phone,
          company: form.company,
          message: [
            form.interest ? `Interest: ${form.interest}` : "",
            form.message || "",
          ].filter(Boolean).join(" | "),
        }),
      });

      if (!res.ok) {
        // Still redirect even if webhook fails
        console.warn("Lead ingest returned", res.status);
      }
    } catch (err) {
      console.warn("Lead ingest failed:", err);
    }

    window.location.href = "/pitch-decks";
  };

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 16px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 8,
    color: "#fff",
    fontSize: 16,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  };

  return (
    <div style={{ background: "#0a0a0a", color: "#fff", minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif", position: "relative" }}>
      {/* Header */}
      <div style={{ padding: "48px 20px 0", textAlign: "center" }}>
        <div style={{
          display: "inline-block", padding: "6px 18px", borderRadius: 6,
          background: "rgba(220,38,38,0.12)", border: "1px solid rgba(220,38,38,0.3)",
          marginBottom: 24,
        }}>
          <span style={{ color: "#DC2626", fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>
            Application-Only &middot; Approval Required
          </span>
        </div>

        <h1 style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 900, marginBottom: 8 }}>
          <span style={{ color: "#FF8900" }}>Request</span> Our Deck
        </h1>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, letterSpacing: 3, textTransform: "uppercase" }}>
          VRTCLS &middot; Jeff Cline &middot; Profit at Scale
        </p>
      </div>

      {/* Deck Preview */}
      <div style={{ maxWidth: 700, margin: "40px auto", padding: "0 20px" }}>
        <div style={{
          borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,137,0,0.2)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}>
          <img
            src="/deck-preview.png"
            alt="VRTCLS Deck Preview"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>
      </div>

      {/* Form */}
      <div style={{ maxWidth: 520, margin: "40px auto 60px", padding: "0 20px" }}>
        <div style={{
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,137,0,0.2)",
          borderRadius: 16, padding: "40px 32px",
        }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, textAlign: "center", marginBottom: 24 }}>
            Request Access
          </h2>

          {error && (
            <p style={{ color: "#DC2626", fontSize: 14, textAlign: "center", marginBottom: 16 }}>{error}</p>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <input
              type="text" placeholder="Full Name *" required
              value={form.name} onChange={set("name")}
              style={inputStyle}
            />
            <input
              type="email" placeholder="Email Address *" required
              value={form.email} onChange={set("email")}
              style={inputStyle}
            />
            <input
              type="tel" placeholder="Phone Number"
              value={form.phone} onChange={set("phone")}
              style={inputStyle}
            />
            <input
              type="text" placeholder="Company / Organization"
              value={form.company} onChange={set("company")}
              style={inputStyle}
            />
            <select
              value={form.interest} onChange={set("interest")}
              style={{
                ...inputStyle,
                appearance: "none",
                WebkitAppearance: "none",
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23999' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 16px center",
                paddingRight: 40,
                color: form.interest ? "#fff" : "rgba(255,255,255,0.4)",
              }}
            >
              <option value="" disabled style={{ color: "#999" }}>What are you most interested in?</option>
              {interestOptions.map((opt) => (
                <option key={opt} value={opt} style={{ color: "#000" }}>{opt}</option>
              ))}
            </select>
            <textarea
              placeholder="Message / Notes"
              rows={3}
              value={form.message} onChange={set("message")}
              style={{ ...inputStyle, resize: "vertical", minHeight: 80 }}
            />
            <button
              type="submit" disabled={submitting}
              style={{
                width: "100%", padding: 16, marginTop: 8,
                background: submitting ? "#666" : "#FF8900", border: "none", borderRadius: 8,
                color: "#000", fontWeight: 700, fontSize: 16, cursor: submitting ? "not-allowed" : "pointer",
                letterSpacing: 2, textTransform: "uppercase",
              }}
            >
              {submitting ? "Submitting..." : "REQUEST ACCESS"}
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ padding: "30px 20px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>
          &copy; {new Date().getFullYear()} Jeff Cline. PROFIT AT SCALE.
        </p>
        <a href="https://jeff-cline.com" style={{ fontSize: 6, opacity: 0.08, color: "#999", textDecoration: "none" }}>JC</a>
      </footer>
    </div>
  );
}
