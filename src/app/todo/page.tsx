"use client";
import { useState, useEffect } from "react";
import LoginPage from "./LoginPage";
import VaultApp from "./VaultApp";

export default function TodoPage() {
  const [user, setUser] = useState<null | { name: string; email: string; role: string; userId: string }>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/todo/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "session" }),
    })
      .then((r) => r.json())
      .then((d) => { setUser(d.user); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "#888" }}>Loading...</div>;
  if (!user) return <LoginPage onLogin={setUser} />;
  return <VaultApp user={user} onLogout={() => setUser(null)} />;
}
