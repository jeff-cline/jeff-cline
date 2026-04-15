"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SportsSignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/sports/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await res.json();

      if (res.ok) {
        // Auto-redirect to dashboard after successful signup
        router.push("/sports/dashboard");
      } else {
        setError(data.error || "Signup failed");
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
            Start <span className="text-[#FF8900]">Winning</span>
          </h1>
          <p className="text-gray-400">
            Create your account and get 50 free credits instantly
          </p>
        </div>

        {/* Free Credits Highlight */}
        <div className="bg-gradient-to-r from-green-500/10 to-green-500/5 border border-green-500/20 rounded-xl p-4 mb-6 text-center">
          <div className="text-green-400 font-bold text-lg mb-1">50 Free Credits</div>
          <div className="text-gray-400 text-sm">No credit card required • Start picking immediately</div>
        </div>

        {/* Signup Form */}
        <div className="bg-[#111] border border-white/10 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-gray-400 text-sm font-medium block mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#FF8900] focus:outline-none transition-colors"
                placeholder="John Doe"
              />
            </div>

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
                minLength={6}
              />
              <p className="text-gray-500 text-xs mt-1">Minimum 6 characters</p>
            </div>

            <div>
              <label className="text-gray-400 text-sm font-medium block mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
              {loading ? "Creating Account..." : "Create Account & Get 50 Credits"}
            </button>
          </form>

          {/* Terms */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-xs">
              By creating an account, you agree to our{" "}
              <a href="/privacy" className="text-[#FF8900] hover:underline">
                Privacy Policy
              </a>{" "}
              and{" "}
              <a href="/terms" className="text-[#FF8900] hover:underline">
                Terms of Service
              </a>
            </p>
          </div>

          {/* Divider */}
          <div className="mt-8 pt-8 border-t border-white/10 text-center">
            <p className="text-gray-400 text-sm mb-4">
              Already have an account?
            </p>
            <a
              href="/sports/login"
              className="inline-block bg-white/10 text-white font-bold px-6 py-2 rounded-lg hover:bg-white/20 transition-colors"
            >
              Sign In
            </a>
          </div>
        </div>

        {/* What You Get */}
        <div className="mt-8 bg-[#111]/50 border border-white/5 rounded-xl p-6">
          <h3 className="text-white font-bold text-sm mb-4 text-center">What You Get Free:</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span className="text-gray-300">50 free credits (50 picks)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span className="text-gray-300">1 daily pick forever</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span className="text-gray-300">Access to basic dashboard</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span className="text-gray-300">Email delivery of picks</span>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="mt-8 text-center space-x-4 text-sm">
          <a href="/sports" className="text-gray-400 hover:text-white transition-colors">
            ← Back to Sports
          </a>
          <span className="text-gray-600">|</span>
          <a href="/sports/pricing" className="text-gray-400 hover:text-white transition-colors">
            View All Plans
          </a>
        </div>
      </div>
    </div>
  );
}