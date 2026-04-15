import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Quiz | Jeff Cline",
  description: "Take the quiz to find out which Jeff Cline service is right for your business growth goals.",
  openGraph: {
    title: "Business Quiz | Jeff Cline",
    description: "Find out which service is right for your business growth goals.",
    url: "https://jeff-cline.com/quiz",
    siteName: "Jeff Cline",
    type: "website",
    images: [{ url: "/favicon-192x192.png", width: 192, height: 192, alt: "Jeff Cline" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Business Quiz | Jeff Cline",
    description: "Find out which service is right for your business growth goals.",
  },
};

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
