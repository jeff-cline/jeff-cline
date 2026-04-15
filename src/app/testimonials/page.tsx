import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Referrals & Testimonials | Jeff Cline",
  description:
    "Hear what clients and partners say about working with Jeff Cline. Watch video testimonials and see Jeff Cline as seen on TV.",
};

const testimonials = [
  { id: "UsQzUOqSbHc" },
  { id: "L1XLl6J28SQ" },
  { id: "dkomqbL9ePk" },
];

const commercials = [
  { id: "HNBa0fTWnxM" },
  { id: "WHnSjoZJbGo" },
];

function YouTubeEmbed({ videoId }: { videoId: string }) {
  return (
    <div className="relative w-full pb-[56.25%] rounded-xl overflow-hidden bg-black/40 border border-white/10">
      <iframe
        className="absolute inset-0 w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

export default function TestimonialsPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Hero */}
      <section className="pt-32 pb-16 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-black mb-4">
          <span className="text-[#FF8900]">Referrals</span> &{" "}
          <span className="text-[#DC2626]">Testimonials</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Don&apos;t take our word for it. Hear directly from clients and partners who&apos;ve worked with Jeff Cline.
        </p>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
          <span className="text-[#FF8900]">Jeff Cline</span> Testimonials
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((v) => (
            <YouTubeEmbed key={v.id} videoId={v.id} />
          ))}
        </div>
      </section>

      {/* Written Recommendations */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
          <span className="text-[#FF8900]">People I</span>{" "}
          <span className="text-[#DC2626]">Recommend</span>
        </h2>
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FF8900] to-[#DC2626] flex items-center justify-center text-white font-bold text-xl">
                KC
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Krystalore Crews</h3>
                <p className="text-gray-400 text-sm">Life Transformation &amp; Healing</p>
              </div>
            </div>
            <blockquote className="text-gray-300 leading-relaxed space-y-4">
              <p>
                I am writing to offer my highest and most sincere recommendation for Krystalore Crews &mdash; a woman whose work, presence, and character have left an indelible mark on my life and the lives of countless others fortunate enough to cross her path.
              </p>
              <p>
                I have known Krystalore for well over a year, and in that time I have witnessed firsthand her extraordinary ability to hold space for others with a depth of compassion, intentionality, and genuine love that is exceedingly rare. She possesses an innate gift for meeting people exactly where they are and guiding them toward profound self-healing and self-awareness &mdash; not through platitudes or performance, but through an authenticity that disarms, empowers, and transforms.
              </p>
              <p>
                Krystalore has completely revolutionized the way I approach my own life. That is not a statement I make lightly. The individuals I have personally seen touched by her work have experienced shifts that go beyond incremental improvement &mdash; they have been fundamentally and deeply impacted. She elevates quality of life in a way that ripples outward, touching families, businesses, and communities far beyond the immediate moment.
              </p>
              <p>
                What makes Krystalore truly exceptional is the rare combination of power and tenderness she brings to everything she does. She is formidable in her own right &mdash; a leader, a visionary, and a force of nature &mdash; yet she channels that strength entirely in service of others. She leaves every person she encounters on a journey of discovery that is unlike any experience I have had in my professional or personal life.
              </p>
              <p>
                As a partner, a friend, and what I can only describe as a life extraordinaire, Krystalore operates at a level that defies easy categorization. She is equal parts strategist and healer, equal parts fierce and compassionate, and wholly committed to the elevation of those around her.
              </p>
              <p className="text-white font-medium italic">
                I would recommend Krystalore Crews without reservation to anyone seeking a genuinely life-changing experience.
              </p>
            </blockquote>
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-[#FF8900] font-semibold">Jeff Cline</p>
            </div>
          </div>
        </div>
      </section>

      {/* As Seen on TV */}
      <section className="max-w-5xl mx-auto px-4 pb-32">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">
          <span className="text-[#DC2626]">&ldquo;As Seen on TV&rdquo;</span>
        </h2>
        <p className="text-gray-400 text-center mb-8">Current TV Commercials</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {commercials.map((v) => (
            <YouTubeEmbed key={v.id} videoId={v.id} />
          ))}
        </div>
      </section>
    </main>
  );
}
