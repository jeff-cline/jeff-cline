"use client";
import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const registered = searchParams.get("registered");

  const [form, setForm] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full animate-fade-in-up">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black mb-2">
            Welcome <span className="text-[#FF8900]">Back</span>
          </h1>
          <p className="text-gray-400">Sign in to your account</p>
        </div>

        {registered && (
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3 mb-6 text-center text-green-400 text-sm">
            Account created successfully! Please sign in.
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 mb-6 text-center text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#FF8900] focus:outline-none transition-colors"
              placeholder="you@company.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#FF8900] focus:outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="rounded border-white/20 bg-[#1a1a1a] text-[#FF8900] focus:ring-[#FF8900]"
              />
              Remember me
            </label>
            <Link href="/forgot-password" className="text-sm text-[#FF8900] hover:text-[#ffa033]">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full text-center disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-[#FF8900] hover:text-[#ffa033] font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-[#FF8900] text-xl font-bold">Loading...</div></div>}>
      <LoginForm />
    </Suspense>
  );
}
