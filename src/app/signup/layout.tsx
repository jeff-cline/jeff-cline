import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Jeff Cline",
  description: "Create your jeff-cline.com account to access exclusive tools and resources.",
  openGraph: {
    title: "Sign Up | Jeff Cline",
    description: "Create your jeff-cline.com account.",
    url: "https://jeff-cline.com/signup",
    siteName: "Jeff Cline",
    type: "website",
    images: [{ url: "/favicon-192x192.png", width: 192, height: 192, alt: "Jeff Cline" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign Up | Jeff Cline",
    description: "Create your jeff-cline.com account.",
  },
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
