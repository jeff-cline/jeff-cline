import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roatan Investment Portfolio | Investor Discovery Tour",
  description: "Exclusive Roatan, Honduras real estate investment portfolio. 16 development projects across residential, commercial, hospitality, and entertainment sectors.",
  openGraph: {
    title: "Roatan Investment Portfolio | Investor Discovery Tour",
    description: "Exclusive Roatan, Honduras real estate investment portfolio.",
    url: "https://jeff-cline.com/roatan",
  },
};

export default function RoatanLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="roatan-layout">
      <style>{`
        .roatan-layout header, .roatan-layout > nav, .roatan-layout .site-header, .roatan-layout .site-footer { display: none !important; }
      `}</style>
      {children}
    </div>
  );
}
