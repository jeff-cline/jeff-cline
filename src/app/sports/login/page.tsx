"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SportsLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/sports/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        // Redirect to dashboard on success
        router.push("/sports/dashboard");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0a0a0a] to-black" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#FF8900]/5 rounded-full blur-[120px]" />

      <div className="relative w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#FF8900]/10 border border-[#FF8900]/20 rounded-full px-4 py-1.5 mb-4">
            <div className="w-2 h-2 rounded-full bg-[#FF8900] animate-pulse" />
            <span className="text-[#FF8900] text-xs font-bold uppercase tracking-wider">JC Sports Intelligence</span>
          </div>
          
          <h1 className="text-4xl font-black mb-2">
            Welcome <span className="text-[#FF8900]">Back</span>
          </h1>
          <p className="text-gray-400">
            Access your sports betting intelligence dashboard
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-[#111] border border-white/10 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-gray-400 text-sm font-medium block mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#FF8900] focus:outline-none transition-colors"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm font-medium block mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#FF8900] focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#FF8900] to-[#DC2626] text-white font-bold py-3 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 uppercase tracking-wider"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Forgot Password */}
          <div className="mt-6 text-center">
            <a
              href="#"
              className="text-gray-400 hover:text-[#FF8900] text-sm transition-colors"
            >
              Forgot your password?
            </a>
          </div>

          {/* Divider */}
          <div className="mt-8 pt-8 border-t border-white/10 text-center">
            <p className="text-gray-400 text-sm mb-4">
              Don&apos;t have an account?
            </p>
            <a
              href="/sports/signup"
              className="inline-block bg-white/10 text-white font-bold px-6 py-2 rounded-lg hover:bg-white/20 transition-colors"
            >
              Create Account
            </a>
          </div>
        </div>

        {/* Demo Access */}
        <div className="mt-6 bg-[#111]/50 border border-white/5 rounded-xl p-4 text-center">
          <p className="text-gray-500 text-xs mb-2">Demo Access Available</p>
          <div className="text-gray-400 text-xs">
            <strong>Email:</strong> demo@example.com<br />
            <strong>Password:</strong> demo123
          </div>
        </div>

        {/* Links */}
        <div className="mt-8 text-center space-x-4 text-sm">
          <a href="/sports" className="text-gray-400 hover:text-white transition-colors">
            ← Back to Sports
          </a>
          <span className="text-gray-600">|</span>
          <a href="/sports/pricing" className="text-gray-400 hover:text-white transition-colors">
            View Pricing
          </a>
        </div>
      </div>
    </div>
  );
}