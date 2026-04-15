import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Investment Calculator | Jeff Cline",
  description: "Calculate your potential ROI and investment returns. Free financial planning tool by Jeff Cline.",
  openGraph: {
    title: "Investment Calculator | Jeff Cline",
    description: "Calculate your potential ROI and investment returns.",
    url: "https://jeff-cline.com/investment-calculator",
    siteName: "Jeff Cline",
    type: "website",
    images: [{ url: "/favicon-192x192.png", width: 192, height: 192, alt: "Jeff Cline" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Investment Calculator | Jeff Cline",
    description: "Calculate your potential ROI and investment returns.",
  },
};

export default function InvestmentCalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
