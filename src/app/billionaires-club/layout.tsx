import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Billionaires Club | Jeff Cline — Does Your Plan Have What It Takes?",
  description:
    "Evaluate your billionaire trajectory across visionary capacity, capital architecture, executive intelligence, operational leverage, network capital, and resilience. Fractional CRO, CDO, and CPO leadership included.",
  openGraph: {
    title: "The Billionaires Club | Jeff Cline",
    description:
      "Does your plan have what it takes? Take the 19-question assessment and discover your billionaire trajectory score.",
    url: "https://jeff-cline.com/billionaires-club",
    siteName: "Jeff Cline",
    type: "website",
    images: [{ url: "/favicon-192x192.png", width: 192, height: 192, alt: "Jeff Cline" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Billionaires Club | Jeff Cline",
    description:
      "Does your plan have what it takes? 19-question billionaire trajectory assessment.",
  },
};

export default function BillionairesClubLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
