import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://jeff-cline.com"),
  title: "Jeff Cline | PROFIT AT SCALE — Every Industry is a Geek Away from Being Uberized",
  description: "Jeff Cline helps businesses, entrepreneurs, start-ups, investors, and family offices profit at scale through technology disruption and strategic innovation.",
  keywords: "Jeff Cline, profit at scale, business disruption, technology consulting, entrepreneur, startup advisor, investor strategy, family office technology",
  openGraph: {
    title: "Jeff Cline | PROFIT AT SCALE",
    description: "Every Industry is ONE GEEK away from being UBERIZED. Strategic technology disruption for businesses, entrepreneurs, and investors.",
    url: "https://jeff-cline.com",
    siteName: "Jeff Cline",
    type: "website",
    images: [{ url: "/favicon-192x192.png", width: 192, height: 192, alt: "Jeff Cline" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jeff Cline | PROFIT AT SCALE",
    description: "Every Industry is ONE GEEK away from being UBERIZED.",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM Content" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Jeff Cline",
              url: "https://jeff-cline.com",
              jobTitle: "Technology Strategist & Business Disruptor",
              description: "30+ years of enterprise technology leadership. Helping businesses, entrepreneurs, start-ups, investors, and family offices achieve PROFIT AT SCALE through technology disruption.",
              knowsAbout: ["Business Strategy", "Technology Disruption", "Startups", "Investment Strategy", "Family Offices", "AI Integration", "Digital Transformation", "Scalable Equity Technology"],
              worksFor: {
                "@type": "Organization",
                name: "VRTCLS",
                url: "https://vrtcls.com",
              },
              sameAs: ["https://jeff-cline.com"],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "VRTCLS",
              url: "https://vrtcls.com",
              founder: { "@type": "Person", name: "Jeff Cline" },
              description: "Multi Family Office powered by Geeks. Scalable Equity Technology for businesses, entrepreneurs, start-ups, investors, and family offices.",
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Jeff Cline — PROFIT AT SCALE",
              url: "https://jeff-cline.com",
              description: "Every Industry is ONE GEEK away from being UBERIZED. Jeff Cline helps businesses, entrepreneurs, start-ups, investors, and family offices profit at scale.",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://jeff-cline.com/?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: "Services",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Business Technology Disruption", url: "https://jeff-cline.com/business" },
                { "@type": "ListItem", position: 2, name: "Entrepreneur Growth Strategy", url: "https://jeff-cline.com/entrepreneur" },
                { "@type": "ListItem", position: 3, name: "Start-Up Strategy & Technology", url: "https://jeff-cline.com/start-ups" },
                { "@type": "ListItem", position: 4, name: "Investor Technology Strategy", url: "https://jeff-cline.com/investors" },
                { "@type": "ListItem", position: 5, name: "Family Office Technology", url: "https://jeff-cline.com/family-offices" },
              ],
            }),
          }}
        />
      <script src="https://kreeper.ai/k.js?id=69d552dcdb8e73e6018563b1" async></script>
  </head>
      <body className="min-h-screen flex flex-col">
        <Script
          id="retargetiq-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(s, p, i, c, e) {
                s[e] = s[e] || function() { (s[e].a = s[e].a || []).push(arguments); };
                s[e].l = 1 * new Date();
                var t = new Date().getTime();
                var k = c.createElement("script"), a = c.getElementsByTagName("script")[0];
                k.async = 1, k.src = p + "?request_id=" + i + "&t=" + t, a.parentNode.insertBefore(k, a);
                s.pixelClientId = i;
              })(window, "https://app.retargetiq.com/script", "jeff-cline", document, "script");
            `,
          }}
        />
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
