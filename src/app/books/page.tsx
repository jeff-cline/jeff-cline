import type { Metadata } from "next";
import BooksClient from "./BooksClient";

export const metadata: Metadata = {
  title: "SUCCESS: From a Geek Lens — Free Book by Jeff Cline",
  description:
    "Download the free 53-page book by Jeff Cline. Data-driven strategies for 10 industries, the Profit at Scale framework, and the technology playbook for your next level of success.",
  openGraph: {
    title: "SUCCESS: From a Geek Lens — Free Book Download",
    description:
      "53 pages of data-driven strategy across 10 industries. By Jeff Cline.",
    url: "https://jeff-cline.com/books",
  },
};

export default function BooksPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Book",
            name: "SUCCESS: From a Geek Lens",
            author: {
              "@type": "Person",
              name: "Jeff Cline",
              url: "https://jeff-cline.com",
            },
            description:
              "Your Next Level of Success — A data-driven technology strategy book covering 10 industries with the Profit at Scale framework.",
            publisher: {
              "@type": "Organization",
              name: "VRTCLS Media",
            },
            datePublished: "2026-03-25",
            numberOfPages: 53,
            genre: "Business & Technology",
            inLanguage: "en",
            url: "https://jeff-cline.com/books",
          }),
        }}
      />
      <BooksClient />
    </>
  );
}
