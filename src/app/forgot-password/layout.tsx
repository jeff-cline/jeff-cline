import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | Jeff Cline",
  description: "Reset your password for jeff-cline.com.",
  openGraph: {
    title: "Forgot Password | Jeff Cline",
    description: "Reset your password for jeff-cline.com.",
    url: "https://jeff-cline.com/forgot-password",
    siteName: "Jeff Cline",
    type: "website",
    images: [{ url: "/favicon-192x192.png", width: 192, height: 192, alt: "Jeff Cline" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Forgot Password | Jeff Cline",
    description: "Reset your password for jeff-cline.com.",
  },
};

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
