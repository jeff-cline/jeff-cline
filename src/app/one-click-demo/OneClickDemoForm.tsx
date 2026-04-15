"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OneClickDemoForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    websiteUrl: "",
    websiteName: "",
    keyword1: "",
    keyword2: "",
    keyword3: "",
    businessContext: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setStatus("Analyzing keywords with live search data...");

    try {
      // Use V2 API for enhanced structure
      const res = await fetch("/api/one-click-demo-v2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      setStatus(`🎉 Demo site built with ${data.totalPages} pages! Choose your starting point...`);
      
      // Show options for which keyword to visit first
      const keywordButtons = data.keywordSlugs.map((slug: string, i: number) => 
        `<a href="/d/${slug}" class="inline-block mx-2 mt-3 px-4 py-2 bg-[#FF8900] text-black font-bold rounded hover:bg-[#FF9A20] transition-colors">${data.keywords[i]}</a>`
      ).join('');
      
      setTimeout(() => {
        const choiceHtml = `
          <div class="text-center">
            <p class="mb-4">Your ${data.totalPages}-page demo site is ready! Choose a starting point:</p>
            ${keywordButtons}
            <div class="mt-4 text-sm text-gray-500">
              Each keyword now has its own section with 5 service areas and 25 supporting pages.
            </div>
          </div>
        `;
        document.getElementById('demo-results')!.innerHTML = choiceHtml;
      }, 2000);

    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-white mb-2">Website URL</label>
        <input
          type="url"
          placeholder="https://example.com"
          value={form.websiteUrl}
          onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
          required
          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF8900] transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-white mb-2">Business / Website Name</label>
        <input
          type="text"
          placeholder="Acme Corporation"
          value={form.websiteName}
          onChange={(e) => setForm({ ...form, websiteName: e.target.value })}
          required
          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF8900] transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-white mb-3">Top 3 Money Keywords</label>
        <p className="text-gray-500 text-xs mb-3">The keywords your business would pay to rank #1 for.</p>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Keyword 1 (e.g., personal injury lawyer)"
            value={form.keyword1}
            onChange={(e) => setForm({ ...form, keyword1: e.target.value })}
            required
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF8900] transition-colors"
          />
          <input
            type="text"
            placeholder="Keyword 2 (e.g., car accident attorney)"
            value={form.keyword2}
            onChange={(e) => setForm({ ...form, keyword2: e.target.value })}
            required
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF8900] transition-colors"
          />
          <input
            type="text"
            placeholder="Keyword 3 (e.g., slip and fall lawyer)"
            value={form.keyword3}
            onChange={(e) => setForm({ ...form, keyword3: e.target.value })}
            required
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF8900] transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-white mb-2">Business Story &amp; Goal</label>
        <p className="text-gray-500 text-xs mb-2">What does this business do? What&rsquo;s the goal of the site? This context shapes the demo content.</p>
        <textarea
          placeholder="e.g., We're a personal injury law firm in Dallas serving accident victims for 20 years. Goal: generate qualified leads from people searching for legal help after an accident."
          value={form.businessContext}
          onChange={(e) => setForm({ ...form, businessContext: e.target.value })}
          required
          rows={4}
          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF8900] transition-colors resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-white mb-2">Phone Number (for Call-to-Action)</label>
        <input
          type="tel"
          placeholder="(555) 123-4567"
          value={form.phoneNumber}
          onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF8900] transition-colors"
        />
        <p className="text-gray-600 text-xs mt-1">Optional. Adds a click-to-call button on every demo page.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {status && !error && (
        <div className="p-4 bg-[#FF8900]/10 border border-[#FF8900]/30 rounded-lg text-[#FF8900] text-sm">
          {status}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-[#FF8900] text-black font-black text-lg rounded-lg hover:bg-[#FF9A20] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Building Your Demo Site..." : "Build My Demo Site"}
      </button>

      <p className="text-gray-600 text-xs text-center">
        Enhanced V2 demo sites with deeper content architecture and advanced SEO.
      </p>

      <div id="demo-results" className="mt-6"></div>
    </form>
  );
}
