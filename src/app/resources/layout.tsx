import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resources | Jeff Cline",
  description: "Free tools, guides, and resources for scaling your business with SEO, marketing, and technology.",
  openGraph: {
    title: "Resources | Jeff Cline",
    description: "Free tools, guides, and resources for scaling your business.",
    url: "https://jeff-cline.com/resources",
    siteName: "Jeff Cline",
    type: "website",
    images: [{ url: "/favicon-192x192.png", width: 192, height: 192, alt: "Jeff Cline" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Resources | Jeff Cline",
    description: "Free tools, guides, and resources for scaling your business.",
  },
};

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
