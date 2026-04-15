import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SEO Tools & Services Pricing | Jeff Cline Agency Dashboard",
  description:
    "Enterprise-grade SEO and AEO tools at transparent per-use pricing. Keyword research, backlink analysis, site audits, SERP tracking, competitor analysis, and done-for-you website builds. No subscriptions — pay only for what you use.",
  keywords:
    "SEO tools pricing, keyword research tool, backlink analyzer, site audit, AEO optimization, SERP tracker, competitor analysis, Jeff Cline, agency dashboard",
  openGraph: {
    title: "SEO Tools & Services Pricing | Jeff Cline",
    description:
      "Enterprise-grade SEO tools at transparent per-use pricing. No subscriptions, no contracts. Pay only for what you use.",
    url: "https://jeff-cline.com/tools-pricing",
  },
};

export default function ToolsPricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
