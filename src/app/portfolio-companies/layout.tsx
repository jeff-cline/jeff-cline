import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio Companies | Jeff Cline",
  description: "Companies and ventures in Jeff Cline's portfolio. Strategic investments in technology, marketing, and growth.",
  openGraph: {
    title: "Portfolio Companies | Jeff Cline",
    description: "Companies and ventures in Jeff Cline's portfolio.",
    url: "https://jeff-cline.com/portfolio-companies",
    siteName: "Jeff Cline",
    type: "website",
    images: [{ url: "/favicon-192x192.png", width: 192, height: 192, alt: "Jeff Cline" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio Companies | Jeff Cline",
    description: "Companies and ventures in Jeff Cline's portfolio.",
  },
};

export default function PortfolioCompaniesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
