import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | Jeff Cline",
  description: "Admin panel for managing jeff-cline.com content and settings.",
  openGraph: {
    title: "Admin Dashboard | Jeff Cline",
    description: "Admin panel for managing jeff-cline.com.",
    url: "https://jeff-cline.com/admin",
    siteName: "Jeff Cline",
    type: "website",
    images: [{ url: "/favicon-192x192.png", width: 192, height: 192, alt: "Jeff Cline" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Admin Dashboard | Jeff Cline",
    description: "Admin panel for managing jeff-cline.com.",
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
