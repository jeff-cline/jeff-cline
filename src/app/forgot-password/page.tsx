"use client";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    setSent(true);
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full animate-fade-in-up">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black mb-2">
            Reset <span className="text-[#FF8900]">Password</span>
          </h1>
          <p className="text-gray-400">Enter your email and we&apos;ll send you a reset link.</p>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="text-5xl mb-4">📧</div>
            <p className="text-gray-300 mb-4">If an account with that email exists, we&apos;ve sent a reset link.</p>
            <Link href="/login" className="text-[#FF8900] hover:text-[#ffa033] font-semibold">
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#FF8900] focus:outline-none" placeholder="you@company.com" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full text-center disabled:opacity-50">
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
            <p className="text-center text-gray-500 text-sm">
              <Link href="/login" className="text-[#FF8900] hover:text-[#ffa033]">Back to Sign In</Link>
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
