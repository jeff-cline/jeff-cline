import type { Metadata } from "next";
import Link from "next/link";
import PPCClientContent from "./PPCClientContent";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Pay-Per-Click Management | Profit at Scale | Jeff Cline",
  description:
    "Expert PPC management services across Google Ads, Meta, TikTok, LinkedIn & 10+ platforms. Reduce wasted ad spend by 30-60%, lower CPA, and scale profitably with data-driven pay-per-click advertising management.",
  keywords:
    "PPC management, pay-per-click advertising, Google Ads management, Meta Ads, Facebook Ads, PPC agency, paid search management, SEM, cost per acquisition, ad spend optimization",
  openGraph: {
    title: "Pay-Per-Click Management | Profit at Scale | Jeff Cline",
    description:
      "Expert PPC management across 14+ advertising platforms. Reduce wasted ad spend, lower CPA, and scale profitably.",
    url: "https://jeff-cline.com/pay-per-click",
    siteName: "Jeff Cline",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pay-Per-Click Management | Profit at Scale | Jeff Cline",
    description:
      "Expert PPC management across 14+ advertising platforms. Reduce wasted ad spend, lower CPA, and scale profitably.",
  },
  alternates: {
    canonical: "https://jeff-cline.com/pay-per-click",
  },
};

const platforms = [
  { name: "Google Ads", initials: "G", color: "bg-blue-600", loginUrl: "https://ads.google.com", createUrl: "https://ads.google.com/start", description: "The dominant search advertising platform with the highest commercial intent. Captures users actively searching for your products and services.", why: "Primary platform, highest intent traffic" },
  { name: "Meta Ads", initials: "M", color: "bg-blue-500", loginUrl: "https://adsmanager.facebook.com", createUrl: "https://www.facebook.com/business/ads", description: "Facebook & Instagram advertising combined. Unmatched audience targeting with lookalike audiences and detailed demographic controls.", why: "Best B2C lead generation, powerful lookalike audiences" },
  { name: "TikTok Ads", initials: "TT", color: "bg-black", loginUrl: "https://ads.tiktok.com", createUrl: "https://ads.tiktok.com/i18n/signup", description: "Short-form video advertising reaching younger demographics with some of the cheapest CPMs in digital advertising.", why: "Cheapest CPMs, younger demographics, viral potential" },
  { name: "LinkedIn Ads", initials: "in", color: "bg-blue-700", loginUrl: "https://www.linkedin.com/campaignmanager", createUrl: "https://www.linkedin.com/campaignmanager/new", description: "Professional network advertising with unmatched B2B targeting by job title, company size, industry, and seniority.", why: "Best B2B leads — expensive but highest quality" },
  { name: "Microsoft Advertising", initials: "MS", color: "bg-cyan-600", loginUrl: "https://ads.microsoft.com", createUrl: "https://ads.microsoft.com/sign-up", description: "Bing, Yahoo, and AOL search advertising. Often overlooked, delivering 30-50% cheaper CPCs than Google with quality traffic.", why: "30-50% cheaper CPCs than Google Ads" },
  { name: "X Ads", initials: "X", color: "bg-neutral-800", loginUrl: "https://ads.x.com", createUrl: "https://ads.x.com", description: "Real-time conversation targeting and trend-jacking. Strong for brand awareness and engaging audiences during live events.", why: "Brand awareness, conversation targeting" },
  { name: "Pinterest Ads", initials: "P", color: "bg-red-600", loginUrl: "https://ads.pinterest.com", createUrl: "https://ads.pinterest.com", description: "Visual discovery platform where users actively plan purchases. Pins have long shelf life, delivering value for months.", why: "E-commerce powerhouse, long pin shelf life" },
  { name: "Snapchat Ads", initials: "SC", color: "bg-yellow-400", loginUrl: "https://ads.snapchat.com", createUrl: "https://ads.snapchat.com", description: "Reach Gen Z with immersive full-screen ads, AR lenses, and filters at surprisingly low CPMs.", why: "Gen Z audience, cheap CPMs, AR lenses" },
  { name: "Reddit Ads", initials: "R", color: "bg-orange-600", loginUrl: "https://ads.reddit.com", createUrl: "https://ads.reddit.com", description: "Target hyper-specific niche communities with some of the cheapest CPCs available. Authenticity wins here.", why: "Niche communities, cheap CPCs" },
  { name: "Amazon Advertising", initials: "A", color: "bg-amber-500", loginUrl: "https://advertising.amazon.com", createUrl: "https://advertising.amazon.com", description: "Reach shoppers at the exact moment of purchase intent. The highest conversion rates in digital advertising for product sales.", why: "Highest purchase intent of any platform" },
  { name: "YouTube Ads", initials: "YT", color: "bg-red-500", loginUrl: "https://ads.google.com", createUrl: "https://ads.google.com/start", description: "The world's second-largest search engine. Video ads with precise targeting, managed through Google Ads.", why: "Second largest search engine, video format" },
  { name: "Taboola", initials: "TB", color: "bg-indigo-600", loginUrl: "https://backstage.taboola.com", createUrl: "https://www.taboola.com/advertisers", description: "Native advertising on premium publisher sites like USA Today, NBC, and Business Insider. Content-driven discovery.", why: "Native ads on premium publishers" },
  { name: "Outbrain", initials: "OB", color: "bg-orange-500", loginUrl: "https://my.outbrain.com", createUrl: "https://www.outbrain.com/advertisers", description: "Premium native advertising platform placing your content alongside editorial on top-tier media properties.", why: "Premium native advertising network" },
  { name: "Quora Ads", initials: "Q", color: "bg-red-700", loginUrl: "https://www.quora.com/ads", createUrl: "https://www.quora.com/ads", description: "Reach users actively researching topics related to your business. Undervalued platform with high-quality, research-intent traffic.", why: "Undervalued, research-intent traffic" },
];

const faqs = [
  { q: "What is pay-per-click advertising?", a: "Pay-per-click (PPC) advertising is a digital marketing model where advertisers pay a fee each time their ad is clicked. Rather than earning visits organically, you're buying targeted visits to your website. The most common form is search engine advertising — when someone searches for a keyword related to your business, your ad appears at the top of results. You only pay when someone actually clicks. PPC spans multiple platforms including Google Ads, Meta (Facebook/Instagram), TikTok, LinkedIn, and more. Each platform offers unique targeting capabilities, from keyword intent on search engines to demographic and interest-based targeting on social platforms." },
  { q: "How do I set up a Google Ads account?", a: "Setting up a Google Ads account starts at ads.google.com. Click 'Start Now' and sign in with your Google account. Google will walk you through creating your first campaign, but here's the critical advice: switch to Expert Mode immediately instead of using Smart Campaign mode. Smart Campaigns severely limit your control. In Expert Mode, you'll set your campaign type (Search, Display, Video, etc.), define your geographic targeting, set your daily budget, create ad groups with targeted keywords, and write compelling ad copy. You'll also need to set up conversion tracking — this is essential for measuring ROI. Consider starting with a Search campaign targeting high-intent keywords related to your core service or product." },
  { q: "How do I set up a Facebook/Meta Ads account?", a: "To set up Meta Ads, go to business.facebook.com and create a Business Manager account. From there, navigate to Ads Manager (adsmanager.facebook.com). You'll need to add a payment method, install the Meta Pixel on your website for conversion tracking, and verify your domain. When creating your first campaign, choose your objective carefully — Conversions, Lead Generation, and Traffic are the most common. Build your audience using demographics, interests, behaviors, and custom audiences from your existing customer data. Create lookalike audiences based on your best customers for powerful prospecting. Upload compelling creative — video typically outperforms static images on Meta platforms." },
  { q: "What budget should I start with for PPC?", a: "The right starting budget depends on your industry, competition, and goals. For Google Ads in most industries, $1,500-$3,000/month provides enough data to optimize effectively. Highly competitive industries (legal, insurance, SaaS) may need $5,000+. For Meta/Facebook Ads, $1,000-$2,000/month is a solid starting point. The key principle: you need enough budget to generate statistically significant data. If your average cost-per-click is $5, a $300/month budget only gets you 60 clicks — not enough to optimize. We recommend starting with one platform, proving ROI, then expanding to additional platforms. Budget too little and you'll never get enough data to know what works." },
  { q: "How long before I see results from PPC?", a: "PPC can drive traffic immediately — ads can be live within hours. However, profitable results typically take 30-90 days of optimization. The first 2-4 weeks are a learning phase where you gather data on which keywords, audiences, and ads perform best. During weeks 4-8, you'll refine targeting, pause underperformers, and scale winners. By month 3, campaigns should be approaching optimal performance. Google Ads specifically has a 'learning period' for automated bid strategies that takes 1-2 weeks. Factors affecting timeline include budget size (more budget = faster data), industry competitiveness, landing page quality, and whether conversion tracking is properly configured from day one." },
  { q: "What's the difference between search ads and display ads?", a: "Search ads appear when someone actively searches for specific keywords — they capture existing demand. These are text-based ads shown on search engine results pages (Google, Bing). They have higher intent and typically higher conversion rates but also higher CPCs. Display ads are visual (banner/image) ads shown across websites in a network (Google Display Network reaches 90%+ of internet users). They're used for brand awareness, remarketing, and reaching audiences based on interests or demographics. Display CPCs are much cheaper but conversion rates are lower because you're interrupting users rather than answering their query. A complete strategy uses both: search for capturing demand, display for creating awareness and remarketing." },
  { q: "How do I choose the right keywords for PPC?", a: "Effective keyword selection starts with understanding search intent. Focus on commercial and transactional keywords — terms people use when ready to buy or hire. Use tools like Google Keyword Planner, SEMrush, or Ahrefs to research volume and competition. Start with exact match and phrase match keywords to maintain tight control. Build campaigns around keyword themes (ad groups). Include long-tail keywords (3-5 words) which are cheaper and more specific. Critically, build negative keyword lists to exclude irrelevant searches — this prevents wasted spend. Analyze competitor keywords to find opportunities. Review search term reports weekly to discover what people actually searched before clicking your ad, adding winners and negating losers." },
  { q: "What is Quality Score and why does it matter?", a: "Quality Score is Google's 1-10 rating of the quality and relevance of your keywords, ads, and landing pages. It directly impacts your cost-per-click and ad position. A higher Quality Score means you pay less per click and get better ad positions — you can literally outrank competitors while paying less. The three components are: Expected Click-Through Rate (is your ad compelling?), Ad Relevance (does your ad match the keyword intent?), and Landing Page Experience (does your page deliver on the ad's promise?). A Quality Score of 7+ is good; below 5 needs immediate attention. Improving Quality Score from 5 to 8 can reduce your CPC by 30-50%. Professional PPC managers obsess over Quality Score because it's a direct lever on profitability." },
  { q: "Why should I hire a PPC management professional?", a: "DIY PPC accounts waste 30-60% of their budget on average. A professional PPC manager pays for themselves through waste elimination alone. Beyond that, professionals bring: access to enterprise tools ($500-2,000+/month in software), pattern recognition from managing multiple accounts, expertise in bid strategies and automation, proper conversion tracking architecture, continuous optimization cycles, competitive intelligence, cross-platform strategy, and staying current with platform changes (Google makes 3,000+ changes per year). The cost of a PPC professional is almost always less than the cost of wasted ad spend in an unmanaged account. Most businesses see a 2-4x improvement in cost-per-acquisition within the first 90 days of professional management." },
  { q: "How much does PPC management cost?", a: "PPC management pricing varies by model. Common structures include: percentage of ad spend (typically 10-20% of monthly spend, with minimums of $500-1,500), flat monthly fee ($1,000-5,000+ depending on complexity and number of platforms), and performance-based pricing (fee tied to results). At Jeff Cline, we focus on ROI — our management fee should always be justified by improved performance. A typical engagement manages $3,000-50,000+ in monthly ad spend across multiple platforms. The real question isn't 'how much does management cost?' but 'how much is poor management costing you?' Most businesses waste thousands monthly on inefficient campaigns before engaging a professional." },
  { q: "What ROI can I expect from professional PPC management?", a: "ROI varies by industry, but well-managed PPC campaigns typically deliver 3-10x return on ad spend (ROAS). E-commerce averages 4-8x ROAS, lead generation businesses often see cost-per-lead decrease 40-60% within 90 days, and local services frequently achieve 5-15x returns. Key factors include your profit margins, average customer lifetime value, and industry competitiveness. We track ROI beyond the first conversion — factoring in customer lifetime value, repeat purchases, and referrals. Some of our best-performing campaigns deliver 20x+ ROAS because the initial acquisition leads to years of customer revenue. We provide transparent reporting so you always know exactly what your ad dollars produce." },
  { q: "How do professionals reduce wasted ad spend?", a: "Professionals reduce waste through: rigorous negative keyword management (blocking irrelevant searches that consume budget), dayparting (showing ads only during high-converting hours), geographic bid adjustments (spending more in high-performing locations), device optimization (adjusting bids by device type), audience layering (excluding low-quality traffic segments), search term analysis (weekly review of actual search queries), ad scheduling based on conversion data, Quality Score optimization to lower CPCs, landing page testing to improve conversion rates, and eliminating campaigns or keywords with poor ROI. A typical audit of a self-managed account reveals 30-60% of spend going to irrelevant clicks, wrong geographies, or poor-performing keywords that should be paused." },
  { q: "What tools do PPC professionals use that I don't have access to?", a: "Professional PPC managers use enterprise-grade tools including: SEMrush or Ahrefs ($100-400/month) for competitive intelligence and keyword research, Optmyzr or Adalysis for automated optimization rules, call tracking software (CallRail, CallTrackingMetrics) for phone conversion attribution, heat mapping tools (Hotjar, Microsoft Clarity) for landing page analysis, cross-platform attribution tools, bid management platforms, automated reporting dashboards, script libraries for Google Ads automation, and proprietary systems built from years of experience. The combined cost of these tools is $500-2,000+/month — far more than most individual advertisers can justify, but essential for maximizing performance across platforms." },
  { q: "How often should PPC campaigns be optimized?", a: "Effective PPC management requires multiple optimization frequencies: Daily — check for anomalies, budget pacing, disapproved ads. Weekly — search term review, negative keyword additions, bid adjustments, A/B test analysis. Bi-weekly — audience performance review, geographic analysis, device adjustments. Monthly — full performance review, budget reallocation, new campaign/ad group creation, competitor analysis. Quarterly — strategy review, platform mix evaluation, landing page overhaul, conversion tracking audit. The biggest mistake in PPC is 'set it and forget it.' Platforms, competition, and user behavior change constantly. Without regular optimization, campaigns degrade over time as competitors adapt and platforms evolve." },
  { q: "What is remarketing and why is it important?", a: "Remarketing (also called retargeting) shows ads to people who previously visited your website but didn't convert. Only 2-4% of website visitors convert on their first visit — remarketing brings back the other 96-98%. It works by placing a tracking pixel on your site that builds audience lists, then showing targeted ads to those visitors as they browse other websites, social media, or YouTube. Remarketing is typically the highest-ROI campaign type because you're targeting warm audiences who already know your brand. Advanced strategies include dynamic remarketing (showing the specific products someone viewed), sequential messaging (telling a story across multiple ad impressions), and cross-platform remarketing (reaching the same user on Google, Meta, and YouTube)." },
  { q: "How do you measure PPC success?", a: "PPC success is measured through multiple KPIs: Cost Per Acquisition (CPA) — what you pay for each conversion; Return on Ad Spend (ROAS) — revenue generated per dollar spent; Click-Through Rate (CTR) — percentage of impressions that result in clicks; Conversion Rate — percentage of clicks that become leads/sales; Quality Score — Google's relevance rating; Impression Share — how often your ads show vs. how often they could; Cost Per Click (CPC) — average cost of each click; Customer Lifetime Value vs. CPA — long-term profitability. We provide transparent monthly reports with clear visualizations, trend analysis, and actionable recommendations. Success isn't just about clicks — it's about profitable customer acquisition at scale." },
  { q: "What is cost per acquisition (CPA) and how do you lower it?", a: "Cost Per Acquisition (CPA) is the total cost to acquire one customer or lead — calculated as total ad spend divided by number of conversions. Lowering CPA is the primary goal of PPC optimization. Methods include: improving Quality Score (lowers CPC, which lowers CPA), better keyword targeting (eliminating expensive, low-converting keywords), ad copy optimization through A/B testing, landing page conversion rate optimization (more conversions from same spend), audience refinement (focusing budget on high-converting segments), bid strategy optimization (using smart bidding effectively), negative keyword expansion, dayparting and geo-optimization, and remarketing (converting warm traffic at lower cost). A 1% improvement in conversion rate can reduce CPA by 20-30%." },
  { q: "Can PPC and SEO work together?", a: "PPC and SEO are powerful together — they create a compounding effect. PPC provides immediate visibility while SEO builds over time. Data from PPC keyword performance informs SEO content strategy (you know which keywords convert before investing months in ranking). Dominating both paid and organic results for a keyword increases total click-through rate by 25-50%. PPC remarketing lists can be built from organic traffic. SEO landing pages can be tested with PPC traffic before investing in full optimization. Brand PPC campaigns protect your brand terms from competitors while SEO maintains organic rankings. The best digital marketing strategies use both channels — PPC for immediate results and testing, SEO for long-term sustainable traffic growth." },
];

const whyProfessional = [
  { icon: "💰", title: "Reduce Wasted Ad Spend", desc: "Most DIY accounts waste 30-60% of their budget on irrelevant clicks, wrong geographies, and poor-performing keywords. Professional management eliminates waste through rigorous negative keyword management, search term analysis, and continuous optimization." },
  { icon: "📉", title: "Lower Cost Per Acquisition", desc: "Expert optimization of Quality Scores, bid strategies, and landing pages systematically reduces what you pay per lead or sale. Our clients typically see 40-60% CPA reduction within the first 90 days." },
  { icon: "🤖", title: "AI & Automation Tools", desc: "Professionals leverage enterprise-grade tools worth $500-2,000+/month — competitive intelligence platforms, automated bid management, advanced attribution modeling, and custom scripts that automate thousands of optimizations." },
  { icon: "🧪", title: "Continuous A/B Testing", desc: "Systematic testing of ad copy, headlines, descriptions, extensions, landing pages, and audiences. Every element is tested and optimized based on statistical significance, not guesswork." },
  { icon: "📊", title: "Conversion Tracking Setup", desc: "Proper conversion tracking is the foundation of profitable PPC. We implement comprehensive tracking across all touchpoints — form fills, phone calls, chat, purchases — with proper attribution modeling." },
  { icon: "🚫", title: "Negative Keyword Management", desc: "The single biggest source of wasted spend. We build and maintain extensive negative keyword lists, reviewing search term reports weekly to block irrelevant queries that drain your budget." },
  { icon: "⚡", title: "Bid Strategy Optimization", desc: "Selecting and tuning the right bid strategy for each campaign objective — from manual CPC for new campaigns to Target ROAS for mature campaigns with rich conversion data." },
  { icon: "🌐", title: "Cross-Platform Synergy", desc: "Coordinating campaigns across Google, Meta, TikTok, LinkedIn, and more. Users convert across multiple touchpoints — a unified strategy ensures consistent messaging and proper attribution." },
  { icon: "⭐", title: "Quality Score Optimization", desc: "Higher Quality Scores mean lower CPCs and better ad positions. We optimize ad relevance, expected CTR, and landing page experience to achieve scores of 7-10 across your keywords." },
  { icon: "🎯", title: "Landing Page Optimization", desc: "Driving traffic to optimized landing pages — not generic homepages. We design and test conversion-focused pages that match ad intent, improving conversion rates by 50-200%." },
  { icon: "🔄", title: "Remarketing Strategy", desc: "Only 2-4% convert on the first visit. Remarketing brings back the other 96-98% with targeted messaging across display, social, and video — typically the highest-ROI campaign type." },
  { icon: "💼", title: "Budget Allocation", desc: "Strategic distribution of budget across platforms, campaigns, and ad groups based on performance data. We shift spend to what's working and pull from what isn't — in real time." },
];

export default function PayPerClickPage() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Pay-Per-Click Management",
    description: "Professional PPC management services across Google Ads, Meta, TikTok, LinkedIn, and 10+ advertising platforms.",
    provider: {
      "@type": "Organization",
      name: "Jeff Cline",
      url: "https://jeff-cline.com",
    },
    areaServed: "Worldwide",
    serviceType: "Pay-Per-Click Advertising Management",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://jeff-cline.com" },
      { "@type": "ListItem", position: 2, name: "PPC Management", item: "https://jeff-cline.com/pay-per-click" },
    ],
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Jeff Cline",
    url: "https://jeff-cline.com",
    sameAs: [],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />

      <Breadcrumbs items={[{ label: "Pay Per Click" }]} />
      <main className="min-h-screen bg-[#0a0a0a]">
        {/* Hero */}
        <section className="relative overflow-hidden py-12 md:py-20 px-4">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF8900]/10 via-transparent to-[#DC2626]/10" />
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <p className="text-[#FF8900] font-bold tracking-[0.3em] uppercase text-sm mb-4">Profit at Scale</p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
              Professional <span className="text-[#FF8900]">Pay-Per-Click</span> Management
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto mb-8 leading-relaxed">
              Stop wasting 30-60% of your ad budget. We leverage AI, automation, and cross-platform expertise to reduce your cost per acquisition and scale what works — profitably.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="bg-[#FF8900] hover:bg-[#e67a00] text-black font-bold px-8 py-4 rounded-lg transition-colors text-lg">
                Get a Free PPC Audit
              </Link>
              <a href="#platforms" className="border border-white/20 hover:border-[#FF8900] text-white font-bold px-8 py-4 rounded-lg transition-colors text-lg">
                View 14 Platforms →
              </a>
            </div>
          </div>
        </section>

        {/* Why Use a Professional */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
                Why Use a <span className="text-[#FF8900]">PPC Professional?</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                The gap between amateur and professional PPC management is the difference between burning money and printing it.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {whyProfessional.map((item) => (
                <div key={item.title} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-[#FF8900]/50 transition-colors group">
                  <div className="text-3xl mb-4">{item.icon}</div>
                  <h3 className="text-white font-bold text-lg mb-2 group-hover:text-[#FF8900] transition-colors">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Platforms Directory */}
        <section id="platforms" className="py-20 px-4 bg-white/[0.02]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
                <span className="text-[#FF8900]">14</span> Advertising Platforms We Manage
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                We manage campaigns across every major paid advertising platform, optimizing each for its unique strengths.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {platforms.map((p) => (
                <div key={p.name} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-[#FF8900]/50 transition-all hover:bg-white/[0.07] group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`${p.color} w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                      {p.initials}
                    </div>
                    <h3 className="text-white font-bold group-hover:text-[#FF8900] transition-colors">{p.name}</h3>
                  </div>
                  <p className="text-gray-400 text-sm mb-3 leading-relaxed">{p.description}</p>
                  <p className="text-[#FF8900] text-xs font-semibold mb-3">{p.why}</p>
                  <div className="flex gap-3 text-xs">
                    <a href={p.loginUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
                      Login →
                    </a>
                    <a href={p.createUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#FF8900] transition-colors">
                      Create Account →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
                PPC <span className="text-[#FF8900]">FAQs</span>
              </h2>
              <p className="text-gray-400 text-lg">Everything you need to know about pay-per-click advertising.</p>
            </div>
            <PPCClientContent faqs={faqs} />
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-[#FF8900]/10 to-[#DC2626]/10 border border-white/10 rounded-2xl p-12 md:p-16">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Ready to Stop <span className="text-[#FF8900]">Wasting Ad Spend?</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Get a free PPC audit and discover how much of your budget is being wasted. We&apos;ll show you exactly where the money is going and how to fix it.
            </p>
            <Link href="/contact" className="inline-block bg-[#FF8900] hover:bg-[#e67a00] text-black font-bold px-10 py-4 rounded-lg transition-colors text-lg">
              Get Your Free PPC Audit →
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
