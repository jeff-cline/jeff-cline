import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Jeff Cline",
  description: "Insights on SEO, digital marketing, and scaling businesses. Strategies that drive real revenue.",
  openGraph: {
    title: "Blog | Jeff Cline",
    description: "Insights on SEO, digital marketing, and scaling businesses.",
    url: "https://jeff-cline.com/blog",
    siteName: "Jeff Cline",
    type: "website",
    images: [{ url: "/favicon-192x192.png", width: 192, height: 192, alt: "Jeff Cline" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Jeff Cline",
    description: "Insights on SEO, digital marketing, and scaling businesses.",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
