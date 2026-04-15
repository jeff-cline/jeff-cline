import type { Metadata } from "next";
import LaunchClient from "./LaunchClient";

export const metadata: Metadata = {
  title: "LAUNCH | 7 Tools. One Platform. Zero Excuses. | Jeff Cline",
  description:
    "LAUNCH is the all-in-one business platform with AI workforce, e-commerce, CRM, ads, data enrichment, webinars, and academy — all powered by credits.",
  openGraph: {
    title: "LAUNCH | 7 Tools. One Platform. Zero Excuses.",
    description:
      "AI workforce, e-commerce, CRM, ads, data, webinars, academy — everything you need to scale, powered by credits.",
    url: "https://jeff-cline.com/launch",
  },
};

export default function LaunchPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What is LAUNCH?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "LAUNCH is an all-in-one business platform with 7 integrated tools: LaunchAI, LaunchCART, LaunchCRM, LaunchADS, LaunchDATA, LaunchWEBINARS, and LaunchACADEMY. Everything runs on credits instead of separate subscriptions.",
                },
              },
              {
                "@type": "Question",
                name: "How do credits work?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Credits are the universal currency across all LAUNCH tools. Instead of paying separate subscriptions for each tool, you buy credits and spend them wherever you need — AI agents, ad spend, data lookups, webinar hosting, and more.",
                },
              },
              {
                "@type": "Question",
                name: "What is an unlock code?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Unlock codes are special invite codes that grant bonus credits when you sign up. If you have one, enter it during registration to receive 50 free credits. You can still sign up without one.",
                },
              },
              {
                "@type": "Question",
                name: "Is LAUNCH free to try?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. Sign up for free and explore the platform. With a valid unlock code you get 50 free credits to start using the tools immediately.",
                },
              },
              {
                "@type": "Question",
                name: "What tools are included?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "LAUNCH includes LaunchAI (AI workforce & lead qualification), LaunchCART (e-commerce & payments), LaunchCRM (reputation & lead nurturing), LaunchADS (multi-platform advertising), LaunchDATA (visitor ID & data enrichment), LaunchWEBINARS (live streaming & funnels), and LaunchACADEMY (courses & coaching).",
                },
              },
            ],
          }),
        }}
      />
      <LaunchClient />
    </>
  );
}
