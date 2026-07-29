import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";

/* ---------------------------------------------------------------------------
 * Jeff Cline in the News  ·  /jeff-cline-in-the-news
 * "AS SEEN ON TV" media page — featured video hero, image gallery whose images
 * link out to the video set (image SEO), and a downloads library.
 *
 * VIDEOS is the single source of truth for the "set of videos". Add more items
 * and the hero + image links pick them up automatically (images are distributed
 * across the set so the gallery points at every video).
 * ------------------------------------------------------------------------- */

const SITE = "https://jeff-cline.com";
const PAGE_URL = `${SITE}/jeff-cline-in-the-news`;

type Video = { id: string; title: string; platform?: "youtube" };
const VIDEOS: Video[] = [
  { id: "575k7hWJSBY", title: "Jeff Cline Reveals How Data Creates Million-Dollar Opportunities" },
];
const ytWatch = (v: Video) => `https://www.youtube.com/watch?v=${v.id}`;
const ytEmbed = (v: Video) => `https://www.youtube.com/embed/${v.id}`;
const ytThumb = (v: Video) => `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`;
// Distribute gallery images across the whole video set (crawlable static hrefs).
const videoFor = (i: number) => VIDEOS[i % VIDEOS.length];

const HERO = VIDEOS[0];

type Media = { file: string; alt: string; w: number; h: number; featured?: boolean };
const IMAGES: Media[] = [
  { file: "jeff-cline-speaking-reel-tv", alt: "Jeff Cline speaking reel — as seen on TV", w: 1600, h: 894, featured: true },
  { file: "business-jeff-cline", alt: "Jeff Cline on the cover of Forbes as Tech Visionary of the Year", w: 1600, h: 2371, featured: true },
  { file: "Medigap-Man-Jeff-Cline", alt: "Jeff Cline as 'Medigap Man', the 1-800-MEDIGAP marketing superhero", w: 1600, h: 2425, featured: true },
  { file: "jeff-cline-super-geek", alt: "Jeff Cline, the Super Geek behind VRTCLS", w: 1600, h: 2371, featured: true },
  { file: "family-office-funded-jeff-cline", alt: "Jeff Cline, family-office-funded CEO featured in Inc. and Businessweek", w: 1600, h: 1909, featured: true },
  { file: "speaker-reel-jeff-cline", alt: "Jeff Cline speaker reel highlight", w: 1600, h: 894 },
  { file: "unique-data-jeff-cline", alt: "Jeff Cline explaining why unique data is gold", w: 1600, h: 1093 },
  { file: "jeff-cline-fake-it-til-you-make-it", alt: "Jeff Cline — fake it till you make it, from idea to empire", w: 1600, h: 1923 },
  { file: "tedtalx-ish-jeff-cline", alt: "Jeff Cline delivering a TED-style talk on technology disruption", w: 1600, h: 1201 },
  { file: "ARTLAB-jeff-cline", alt: "Jeff Cline in the AI ARTLAB building the future", w: 1600, h: 1374 },
  { file: "ai-trading-mml-jeff-cline-investor", alt: "Jeff Cline, AI trading and MultiFamilyOffice.AI investor", w: 1600, h: 1177 },
  { file: "interntaional-business-jeff-cline", alt: "Jeff Cline, international business and AI systems leader", w: 1600, h: 1374 },
  { file: "family-investor-jeff-cline-seed-fund-manager", alt: "Jeff Cline, seed fund manager and family-office investor", w: 1600, h: 1374 },
  { file: "island-time-jeff-cline-roatan", alt: "Jeff Cline on island time in Roatán", w: 1600, h: 1177 },
  { file: "jeff-cline-podcast", alt: "Jeff Cline on the podcast: The Value of Unique Data and People", w: 1600, h: 766 },
  { file: "Billionaire-jeff-cline-net-worth-point-zero-444-billion", alt: "Jeff Cline featured — net worth $0.444 billion", w: 1600, h: 766 },
];
const img = (m: Media) => `/news/images/${m.file}.jpg`;
const FEATURED = IMAGES.filter((m) => m.featured).slice(0, 5);

type Pdf = { file: string; title: string; blurb: string };
const FEATURED_PDF: Pdf = {
  file: "R0cketShip_Services_and_Tools",
  title: "R0cketShip — Services & Tools",
  blurb: "The full stack of growth services and AI tools Jeff Cline uses to launch and scale companies fast.",
};
const PDFS: Pdf[] = [
  { file: "Scale-to-Exit-People-Multiplier", title: "Scale to Exit: The People Multiplier", blurb: "How the right people compound enterprise value on the road to exit." },
  { file: "Scale-to-Exit-Winning-Combination", title: "Scale to Exit: The Winning Combination", blurb: "The operating combination that turns a good business into a sellable one." },
  { file: "1-800-MEDIGAP-Marketing-Playbook", title: "1-800-MEDIGAP Marketing Playbook", blurb: "The lead-gen and brand playbook behind the 1-800-MEDIGAP campaign." },
  { file: "The-Secret-Weapon-Sales-Sheet", title: "The Secret Weapon — Sales Sheet", blurb: "The one-page overview of Jeff Cline's demand-generation secret weapon." },
  { file: "VOS-PhD-Thesis", title: "Voter Operating System — PhD Thesis", blurb: "The research thesis behind the Voter Operating System (VOS)." },
  { file: "Voter-Operating-System-Proposal", title: "Voter Operating System — Proposal", blurb: "The build-and-deploy proposal for the Voter Operating System." },
  { file: "Doublewide-Growth-Guide-Terrance", title: "Doublewide Growth Guide", blurb: "A practical growth guide for scaling a real, operating business." },
];
const pdfUrl = (p: Pdf) => `/news/pdfs/${p.file}.pdf`;
const coverUrl = (p: Pdf) => `/news/covers/${p.file}.jpg`;

const FAQS = [
  {
    q: "Where has Jeff Cline been featured in the news?",
    a: "Jeff Cline has been featured across business and technology media — from magazine-style covers (Forbes, Businessweek, Inc.) to podcasts, speaking reels, and televised interviews. This page collects his 'as seen on TV' appearances, media gallery, and downloadable resources in one place.",
  },
  {
    q: "What does Jeff Cline talk about in interviews?",
    a: "Jeff Cline speaks about technology disruption, unique data as a competitive moat, AI integration, and how businesses, entrepreneurs, start-ups, investors, and family offices can achieve profit at scale. His signature idea: every industry is one geek away from being Uberized.",
  },
  {
    q: "Who is Jeff Cline?",
    a: "Jeff Cline is a technology strategist and business disruptor with 30+ years of enterprise technology leadership and the founder behind VRTCLS. He helps companies turn unique data and AI into scalable equity and profitable exits.",
  },
  {
    q: "Where can I watch Jeff Cline's videos?",
    a: "The featured interview plays at the top of this page. Every image in the media gallery below also links straight to a Jeff Cline video, so you can jump into an appearance from whichever photo catches your eye.",
  },
  {
    q: "What free resources and downloads does Jeff Cline offer?",
    a: "You can download Jeff Cline's playbooks and decks directly from this page, including the R0cketShip Services & Tools deck, the Scale-to-Exit guides, the 1-800-MEDIGAP Marketing Playbook, and the Voter Operating System research — no gate, just click and read.",
  },
  {
    q: "How can I book Jeff Cline for an interview, podcast, or speaking engagement?",
    a: "Use the contact page to request Jeff Cline for TV, podcast, or stage. He regularly appears on shows and panels covering AI, data, entrepreneurship, and investing.",
  },
];

export const metadata: Metadata = {
  title: "Jeff Cline in the News — As Seen on TV & Media | Jeff Cline",
  description:
    "Jeff Cline in the news: watch featured interviews, browse the 'as seen on TV' media gallery, and download his playbooks and decks — data, AI, and profit at scale.",
  alternates: { canonical: "/jeff-cline-in-the-news" },
  openGraph: {
    title: "Jeff Cline in the News — As Seen on TV",
    description:
      "Watch Jeff Cline's featured interviews, browse the media gallery, and download his playbooks and decks.",
    url: PAGE_URL,
    siteName: "Jeff Cline",
    type: "website",
    images: [{ url: `${SITE}/news/images/jeff-cline-speaking-reel-tv.jpg`, width: 1600, height: 894, alt: "Jeff Cline as seen on TV" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jeff Cline in the News — As Seen on TV",
    description: "Featured interviews, media gallery, and downloadable playbooks from Jeff Cline.",
    images: [`${SITE}/news/images/jeff-cline-speaking-reel-tv.jpg`],
  },
};

export default function JeffClineInTheNewsPage() {
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Jeff Cline in the News — As Seen on TV & Media",
    description: metadata.description,
    url: PAGE_URL,
    isPartOf: { "@type": "WebSite", name: "Jeff Cline", url: SITE },
    about: { "@type": "Person", name: "Jeff Cline", url: SITE, jobTitle: "Technology Strategist & Business Disruptor" },
    primaryImageOfPage: { "@type": "ImageObject", url: `${SITE}/news/images/jeff-cline-speaking-reel-tv.jpg` },
  };
  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: HERO.title,
    description: "Jeff Cline discusses how unique data creates million-dollar opportunities.",
    thumbnailUrl: [ytThumb(HERO)],
    uploadDate: "2024-05-01",
    contentUrl: ytWatch(HERO),
    embedUrl: ytEmbed(HERO),
    publisher: { "@type": "Organization", name: "Jeff Cline", logo: { "@type": "ImageObject", url: `${SITE}/favicon-192x192.png` } },
  };
  const gallerySchema = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: "Jeff Cline Media Gallery",
    url: PAGE_URL,
    associatedMedia: IMAGES.map((m) => ({
      "@type": "ImageObject",
      contentUrl: `${SITE}${img(m)}`,
      name: m.alt,
      description: m.alt,
    })),
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      {[webPageSchema, videoSchema, gallerySchema, faqSchema].map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}

      <Breadcrumbs items={[{ label: "Jeff Cline in the News" }]} />

      <main className="bg-[#0a0a0a] text-white">
        {/* ===================== HERO: AS SEEN ON TV ===================== */}
        <section className="px-4 pb-14 pt-2">
          <div className="max-w-6xl mx-auto text-center">
            <p className="inline-block text-xs font-black uppercase tracking-[0.25em] text-[#FF8900] border border-[#FF8900]/40 rounded-full px-4 py-1.5 mb-5">
              ★ As Seen on TV
            </p>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
              Jeff Cline <span className="text-[#FF8900]">in the News</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto mb-9">
              Featured interviews, televised appearances, and the media gallery — plus the playbooks and decks behind
              the headlines. Every image below links straight to a Jeff Cline video.
            </p>

            {/* Featured video — large, hero */}
            <div className="relative max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-black">
              <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={ytEmbed(HERO)}
                  title={HERO.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-3">{HERO.title}</p>

            {/* 3–5 featured images under the hero video */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {FEATURED.map((m, i) => (
                <a
                  key={m.file}
                  href={ytWatch(videoFor(i))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block overflow-hidden rounded-xl ring-1 ring-white/10 aspect-[3/4] bg-[#111]"
                  aria-label={`Watch: ${m.alt}`}
                >
                  <Image src={img(m)} alt={m.alt} fill sizes="(max-width:768px) 40vw, 18vw" className="object-cover object-top transition-transform duration-300 group-hover:scale-105" />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity h-11 w-11 rounded-full bg-[#FF8900] text-black flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="h-5 w-5 ml-0.5" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== INTRO COPY (SEO) ===================== */}
        <section className="px-4 py-12 border-t border-white/5">
          <div className="max-w-3xl mx-auto prose-invert">
            <h2 className="text-2xl md:text-3xl font-black mb-4">As Seen on TV: The Jeff Cline Media Hub</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              <strong>Jeff Cline in the news</strong> is the one place to watch his featured interviews, browse the
              &ldquo;as seen on TV&rdquo; gallery, and grab the resources behind the headlines. Jeff Cline is a
              technology strategist and business disruptor who helps{" "}
              <Link href="/business" className="text-[#FF8900] hover:underline">businesses</Link>,{" "}
              <Link href="/entrepreneur" className="text-[#FF8900] hover:underline">entrepreneurs</Link>,{" "}
              <Link href="/start-ups" className="text-[#FF8900] hover:underline">start-ups</Link>,{" "}
              <Link href="/investors" className="text-[#FF8900] hover:underline">investors</Link>, and{" "}
              <Link href="/family-offices" className="text-[#FF8900] hover:underline">family offices</Link> turn unique
              data and AI into profit at scale.
            </p>
            <p className="text-gray-400 leading-relaxed">
              His signature message — <em>every industry is one geek away from being Uberized</em> — has taken him from
              magazine covers to podcasts, keynote stages, and television. Below you&rsquo;ll find his{" "}
              <Link href="/portfolio-companies" className="text-[#FF8900] hover:underline">portfolio companies</Link>,{" "}
              media appearances, and a growing library of{" "}
              <Link href="/resources" className="text-[#FF8900] hover:underline">free resources</Link> you can download
              without a gate.
            </p>
          </div>
        </section>

        {/* ===================== IMAGE GALLERY ===================== */}
        <section className="px-4 py-12 border-t border-white/5">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-black mb-2">Jeff Cline — Featured Images</h2>
            <p className="text-gray-500 mb-8">Click any image to watch Jeff Cline in action.</p>
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 [column-fill:_balance]">
              {IMAGES.map((m, i) => (
                <a
                  key={m.file}
                  href={ytWatch(videoFor(i))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative mb-4 block break-inside-avoid overflow-hidden rounded-xl ring-1 ring-white/10 bg-[#111]"
                  aria-label={`Watch: ${m.alt}`}
                >
                  <Image src={img(m)} alt={m.alt} width={m.w} height={m.h} sizes="(max-width:768px) 50vw, 25vw" className="w-full h-auto transition-transform duration-300 group-hover:scale-[1.03]" />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/35 transition-colors">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity h-12 w-12 rounded-full bg-[#FF8900] text-black flex items-center justify-center shadow-lg">
                      <svg viewBox="0 0 24 24" className="h-6 w-6 ml-0.5" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== DOWNLOADS ===================== */}
        <section className="px-4 py-12 border-t border-white/5">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-black mb-2">Free Downloads &amp; Resources</h2>
            <p className="text-gray-500 mb-8">Playbooks, decks, and research from Jeff Cline — no gate, just click.</p>

            {/* Featured PDF: R0cketShip */}
            <a
              href={pdfUrl(FEATURED_PDF)}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid md:grid-cols-[280px_1fr] gap-6 items-center rounded-2xl border border-[#FF8900]/30 bg-gradient-to-br from-[#FF8900]/10 to-transparent p-5 md:p-7 mb-10 hover:border-[#FF8900]/60 transition-colors"
            >
              <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden ring-1 ring-white/10 bg-[#111] shadow-xl">
                <Image src={coverUrl(FEATURED_PDF)} alt={`${FEATURED_PDF.title} cover`} fill sizes="280px" className="object-cover object-top" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#FF8900] mb-2">★ Featured Deck</p>
                <h3 className="text-2xl md:text-3xl font-black mb-3">{FEATURED_PDF.title}</h3>
                <p className="text-gray-400 mb-5 max-w-xl">{FEATURED_PDF.blurb}</p>
                <span className="btn-primary inline-flex items-center gap-2 !py-3 !px-6">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" /></svg>
                  Download the R0cketShip deck
                </span>
              </div>
            </a>

            {/* Other PDFs */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {PDFS.map((p) => (
                <a
                  key={p.file}
                  href={pdfUrl(p)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col rounded-xl border border-white/10 bg-[#111] overflow-hidden hover:border-[#FF8900]/50 transition-colors"
                >
                  <div className="relative w-full aspect-[3/4] bg-[#0a0a0a] overflow-hidden">
                    <Image src={coverUrl(p)} alt={`${p.title} cover`} fill sizes="(max-width:768px) 50vw, 22vw" className="object-cover object-top transition-transform duration-300 group-hover:scale-105" />
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-sm leading-snug mb-1">{p.title}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed mb-3 flex-1">{p.blurb}</p>
                    <span className="text-[#FF8900] text-xs font-bold inline-flex items-center gap-1.5">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" /></svg>
                      Download PDF
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== FAQ ===================== */}
        <section className="px-4 py-12 border-t border-white/5">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-black mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {FAQS.map((f) => (
                <div key={f.q} className="border-b border-white/5 pb-6">
                  <h3 className="font-bold text-lg mb-2 text-white">{f.q}</h3>
                  <p className="text-gray-400 leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== KEY TAKEAWAYS (AEO) ===================== */}
        <section className="px-4 py-12 border-t border-white/5">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-black mb-5">Key Takeaways</h2>
            <ul className="space-y-3 text-gray-300">
              <li className="flex gap-3"><span className="text-[#FF8900]">▸</span> Jeff Cline&rsquo;s media appearances span TV-style features, podcasts, and speaking reels, all collected here.</li>
              <li className="flex gap-3"><span className="text-[#FF8900]">▸</span> His core thesis: unique data plus AI is the fastest path to profit at scale — every industry is one geek away from being Uberized.</li>
              <li className="flex gap-3"><span className="text-[#FF8900]">▸</span> Each media image links directly to a Jeff Cline video, so any photo is a doorway into an interview.</li>
              <li className="flex gap-3"><span className="text-[#FF8900]">▸</span> Free, ungated downloads include the R0cketShip deck, Scale-to-Exit guides, the 1-800-MEDIGAP playbook, and Voter Operating System research.</li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/about" className="btn-primary !py-2.5 !px-5 text-sm">About Jeff Cline</Link>
              <Link href="/contact" className="border border-white/15 rounded-lg px-5 py-2.5 text-sm font-semibold text-gray-200 hover:border-[#FF8900] hover:text-[#FF8900] transition-colors">Book Jeff for an interview</Link>
              <Link href="/books" className="border border-white/15 rounded-lg px-5 py-2.5 text-sm font-semibold text-gray-200 hover:border-[#FF8900] hover:text-[#FF8900] transition-colors">Read the free book</Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
