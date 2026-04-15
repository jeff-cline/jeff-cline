import { blogPosts } from "@/lib/blog-data";
import { silos } from "@/lib/silo-data";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const post = blogPosts.find((p) => p.slug === resolvedParams.slug);
  if (!post) return {};
  return {
    title: `${post.title} | Jeff Cline Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://jeff-cline.com/blog/${post.slug}`,
      type: "article",
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = blogPosts.find((p) => p.slug === resolvedParams.slug);
  if (!post) notFound();

  const relatedSilo = silos.find(
    (s) => s.name.toLowerCase() === post.category.toLowerCase() || s.slug === post.category.toLowerCase()
  );

  const relatedPosts = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            author: { "@type": "Person", name: "Jeff Cline" },
            url: `https://jeff-cline.com/blog/${post.slug}`,
          }),
        }}
      />

      {/* Breadcrumb */}
      <Breadcrumbs items={[
        { label: "Blog", href: "/blog" },
        { label: post.title },
      ]} />

      <div className="max-w-6xl mx-auto px-4 pb-24 lg:flex gap-12">
        {/* Main Content */}
        <article className="flex-1 pt-8">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF8900]">
              {post.category}
            </span>
            <span className="text-xs text-gray-600">{post.date}</span>
            <span className="text-xs text-gray-600">{post.readTime}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-8 leading-tight">{post.title}</h1>
          <div className="prose prose-invert prose-lg max-w-none">
            {post.content.split("\n\n").map((block, i) => {
              if (block.startsWith("## ")) {
                return (
                  <h2 key={i} className="text-2xl font-black mt-12 mb-4 text-[#FF8900]">
                    {block.replace("## ", "")}
                  </h2>
                );
              }
              if (block.startsWith("**") && block.endsWith("**")) {
                return (
                  <h3 key={i} className="text-xl font-bold mt-8 mb-2 text-gray-200">
                    {block.replace(/\*\*/g, "")}
                  </h3>
                );
              }
              if (block.startsWith("**")) {
                const parts = block.split("\n");
                return (
                  <div key={i} className="mb-4">
                    {parts.map((line, j) => {
                      const boldMatch = line.match(/^\*\*(.+?)\*\*$/);
                      if (boldMatch) {
                        return (
                          <h3 key={j} className="text-xl font-bold mt-8 mb-2 text-gray-200">
                            {boldMatch[1]}
                          </h3>
                        );
                      }
                      return (
                        <p key={j} className="text-gray-300 text-lg leading-relaxed mb-4">
                          {line}
                        </p>
                      );
                    })}
                  </div>
                );
              }
              return (
                <p key={i} className="text-gray-300 text-lg leading-relaxed mb-6">
                  {block}
                </p>
              );
            })}
          </div>
        </article>

        {/* Sidebar */}
        <aside className="lg:w-80 mt-12 lg:mt-8 space-y-8">
          {/* Related Silo */}
          {relatedSilo && (
            <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#FF8900] mb-4">
                Explore {relatedSilo.name}
              </h3>
              <p className="text-gray-400 text-sm mb-4">{relatedSilo.heroSub}</p>
              <Link
                href={`/${relatedSilo.slug}`}
                className="text-[#DC2626] text-sm font-semibold hover:underline"
              >
                Go to {relatedSilo.name} →
              </Link>
            </div>
          )}

          {/* Related Posts */}
          <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#FF8900] mb-4">
              More Articles
            </h3>
            <div className="space-y-4">
              {relatedPosts.map((rp) => (
                <Link
                  key={rp.slug}
                  href={`/blog/${rp.slug}`}
                  className="block group"
                >
                  <h4 className="text-sm font-bold text-gray-300 group-hover:text-[#FF8900] transition-colors">
                    {rp.title}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">{rp.readTime}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-[#0a0a0a] border border-[#FF8900]/20 rounded-2xl p-6 text-center">
            <p className="text-lg font-black mb-3">Ready to Disrupt?</p>
            <Link href="/quiz" className="btn-primary text-sm w-full block text-center">
              Take the Quiz →
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
