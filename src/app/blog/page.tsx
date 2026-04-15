"use client";

import Link from "next/link";
import { useState } from "react";
import { blogPosts } from "@/lib/blog-data";
import Breadcrumbs from "@/components/Breadcrumbs";

const categories = ["All", "Business", "Entrepreneur", "Start-Ups", "Investors", "Family Offices"];

export default function BlogPage() {
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? blogPosts : blogPosts.filter((p) => p.category === active);

  return (
    <>
      <Breadcrumbs items={[{ label: "Blog" }]} />
      {/* Hero */}
      <section className="pt-8 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
          <p className="text-[#DC2626] font-bold text-sm tracking-[0.3em] uppercase mb-4">Blog</p>
          <h1 className="text-4xl md:text-6xl font-black mb-6">
            Insights from the <span className="text-[#FF8900]">GEEK</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Technology disruption, profit strategies, and the occasional rant about spreadsheets.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="pb-8 px-4">
        <div className="max-w-4xl mx-auto flex flex-wrap gap-3 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                active === cat
                  ? "bg-[#FF8900] text-black"
                  : "bg-[#1a1a1a] text-gray-400 hover:text-[#FF8900] border border-white/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Posts */}
      <section className="py-8 px-4 pb-24">
        <div className="max-w-4xl mx-auto space-y-8">
          {filtered.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block bg-[#1a1a1a] border border-white/5 rounded-2xl p-8 group hover:border-[#FF8900]/30 transition-colors"
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#FF8900]">
                  {post.category}
                </span>
                <span className="text-xs text-gray-600">{post.date}</span>
                <span className="text-xs text-gray-600">{post.readTime}</span>
              </div>
              <h2 className="text-2xl font-black mb-3 group-hover:text-[#FF8900] transition-colors">
                {post.title}
              </h2>
              <p className="text-gray-400 leading-relaxed">{post.excerpt}</p>
              <span className="inline-block mt-4 text-[#DC2626] text-sm font-semibold group-hover:translate-x-2 transition-transform">
                Read more →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
