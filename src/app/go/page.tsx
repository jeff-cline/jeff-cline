import type { Metadata } from "next";
import GoClient from "./GoClient";

export const metadata: Metadata = {
  title: "GO — Quick Access Directory | Jeff Cline",
  description: "Quick access to every page, tool, and platform in the Jeff Cline ecosystem. One link to rule them all.",
  openGraph: {
    title: "GO — Quick Access Directory | Jeff Cline",
    description: "Every page, tool, and platform. One click away.",
    url: "https://jeff-cline.com/go",
  },
};

export default function GoPage() {
  return <GoClient />;
}
