"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SILO_LABELS } from "@/lib/types";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    company: "",
    siloInterest: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          company: form.company,
          siloInterest: form.siloInterest,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      router.push("/login?registered=1");
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-24">
      <div className="max-w-md w-full animate-fade-in-up">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black mb-2">
            Join the <span className="text-[#FF8900]">Revolution</span>
          </h1>
          <p className="text-gray-400">Create your account to access tools, resources, and your personalized dashboard.</p>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 mb-6 text-center text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">Full Name *</label>
            <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#FF8900] focus:outline-none" placeholder="Jeff Cline" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">Email *</label>
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#FF8900] focus:outline-none" placeholder="you@company.com" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1">Password *</label>
              <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#FF8900] focus:outline-none" placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1">Confirm *</label>
              <input type="password" required value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#FF8900] focus:outline-none" placeholder="••••••••" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1">Phone</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#FF8900] focus:outline-none" placeholder="223-400-8146" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1">Company</label>
              <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#FF8900] focus:outline-none" placeholder="Acme Inc." />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">I&apos;m a...</label>
            <select value={form.siloInterest} onChange={(e) => setForm({ ...form, siloInterest: e.target.value })}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#FF8900] focus:outline-none">
              <option value="">Select your path</option>
              {Object.entries(SILO_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full text-center disabled:opacity-50">
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-[#FF8900] hover:text-[#ffa033] font-semibold">Sign in</Link>
        </p>
      </div>
    </section>
  );
}
