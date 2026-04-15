import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MASTERMIND | Jeff Cline — Caribbean Island Immersion",
  description: "An exclusive mastermind experience on a Caribbean island. Build, scale, and exit with proprietary technology, capital strategies, and AI-powered operations. Limited to 5 participants.",
  openGraph: {
    title: "MASTERMIND | Jeff Cline",
    description: "Caribbean island business immersion. 1-week or 90-day cohort. Build, scale, exit.",
    url: "https://jeff-cline.com/mastermind",
  },
};

export default function MastermindLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
