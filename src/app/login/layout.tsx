import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Jeff Cline",
  description: "Sign in to your jeff-cline.com account.",
  openGraph: {
    title: "Login | Jeff Cline",
    description: "Sign in to your jeff-cline.com account.",
    url: "https://jeff-cline.com/login",
    siteName: "Jeff Cline",
    type: "website",
    images: [{ url: "/favicon-192x192.png", width: 192, height: 192, alt: "Jeff Cline" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Login | Jeff Cline",
    description: "Sign in to your jeff-cline.com account.",
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
