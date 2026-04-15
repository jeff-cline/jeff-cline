import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Jeff Cline",
  description: "Your personal dashboard for tracking leads, expenses, pixels, and reports.",
  openGraph: {
    title: "Dashboard | Jeff Cline",
    description: "Your personal dashboard for tracking leads, expenses, pixels, and reports.",
    url: "https://jeff-cline.com/dashboard",
    siteName: "Jeff Cline",
    type: "website",
    images: [{ url: "/favicon-192x192.png", width: 192, height: 192, alt: "Jeff Cline" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dashboard | Jeff Cline",
    description: "Your personal dashboard for tracking leads, expenses, pixels, and reports.",
  },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
