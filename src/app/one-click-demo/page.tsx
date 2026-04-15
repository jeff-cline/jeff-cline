import Breadcrumbs from "@/components/Breadcrumbs";
import type { Metadata } from "next";
import OneClickDemoForm from "./OneClickDemoForm";

export const metadata: Metadata = {
  title: "One-Click Demo | Jeff Cline",
  description: "See what a fully SEO-optimized, keyword-rich website looks like for your business — built in seconds with real search data.",
  openGraph: {
    title: "One-Click Demo | Jeff Cline",
    description: "See what a fully SEO-optimized website looks like for your business — built in seconds.",
    url: "https://jeff-cline.com/one-click-demo",
    siteName: "Jeff Cline",
    type: "website",
  },
};

export default function OneClickDemoPage() {
  return (
    <><Breadcrumbs items={[{ label: "One-Click Demo" }]} /><section className="pt-8 pb-24 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-black mb-4">One-Click Demo</h1>
        <p className="text-gray-400 mb-2 text-lg">
          Enter your business details and top money keywords. We&rsquo;ll hit live search data, find your highest-value keyword, and build a fully SEO-optimized demo site — complete with silo architecture, supporting pages, FAQs, schema markup, and AEO optimization.
        </p>
        <p className="text-gray-500 text-sm mb-10">
          Powered by real search volume and CPC data. Your demo goes live at jeff-cline.com instantly.
        </p>

        <OneClickDemoForm />
      </div>
    </section>
    </>
  );
}
