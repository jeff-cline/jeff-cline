import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dumpster — Jeff Cline",
  description: "Drop ideas, photos, and opportunities. The team sorts them.",
  robots: { index: false, follow: false },
};

export default function DumpsterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
