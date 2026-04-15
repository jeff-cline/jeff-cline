"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function EmailLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/email/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        router.push("/email/dashboard");
      } else {
        const data = await res.json();
        setError(data.error || "Invalid credentials");
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0A1628", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 420, padding: 40, background: "#0F172A", borderRadius: 12, border: "1px solid #1E293B" }}>
        <h1 style={{ color: "#E2E8F0", fontSize: 28, fontWeight: 700, marginBottom: 8, textAlign: "center" }}>Email Tool Login</h1>
        <p style={{ color: "#94A3B8", fontSize: 14, textAlign: "center", marginBottom: 32 }}>Sign in to access your AI email dashboard</p>

        {error && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "12px 16px", marginBottom: 20, color: "#EF4444", fontSize: 14 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label style={{ display: "block", color: "#94A3B8", fontSize: 13, marginBottom: 6 }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "12px 16px", background: "#0A1628", border: "1px solid #1E293B", borderRadius: 8, color: "#E2E8F0", fontSize: 15, marginBottom: 20, outline: "none", boxSizing: "border-box" }}
          />

          <label style={{ display: "block", color: "#94A3B8", fontSize: 13, marginBottom: 6 }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "12px 16px", background: "#0A1628", border: "1px solid #1E293B", borderRadius: 8, color: "#E2E8F0", fontSize: 15, marginBottom: 28, outline: "none", boxSizing: "border-box" }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", padding: "14px 0", background: loading ? "#B45309" : "#F97316", color: "#fff", fontWeight: 700, fontSize: 16, border: "none", borderRadius: 8, cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={{ color: "#64748B", fontSize: 13, textAlign: "center", marginTop: 24 }}>
          <a href="/email" style={{ color: "#F97316", textDecoration: "none" }}>Back to Email Tool</a>
        </p>
      </div>
    </div>
  );
}
