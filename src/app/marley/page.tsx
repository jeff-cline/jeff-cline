import type { Metadata } from "next";
import MarleyClient from "./MarleyClient";

export const metadata: Metadata = {
  title: "Sanditas Ranch | Private Investment Opportunity — Santa Barbara County, California",
  description:
    "The first all-shipping-container estate approved by Santa Barbara County. 20 acres, architectural glass + container design. Private investment opportunity for qualified investors.",
  openGraph: {
    title: "Sanditas Ranch | Private Investment Opportunity",
    description:
      "20 acres. First approved container estate in SB County. Qualified investors only.",
    url: "https://jeff-cline.com/marley",
  },
};

export default function MarleyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateListing",
            name: "Sanditas Ranch — Architectural Estate",
            description:
              "The first all-shipping-container estate approved by Santa Barbara County. 20 acres of architectural glass and container design in Santa Ynez wine country.",
            url: "https://jeff-cline.com/marley",
          }),
        }}
      />
      <MarleyClient />
    </>
  );
}
