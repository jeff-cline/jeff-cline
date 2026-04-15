import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "THE VAULT | CRM & Todo",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function TodoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1, user-scalable=no" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="THE VAULT" />
      <meta name="theme-color" content="#FF8900" />
      <link rel="manifest" href="/vault-manifest.json" />
      <link rel="apple-touch-icon" href="/vault-icon-192.png" />
      <style>{`
        header, footer, nav { display: none !important; }
        main { padding: 0 !important; margin: 0 !important; max-width: 100vw !important; overflow-x: hidden !important; }
        html, body { background: #111 !important; overflow-x: hidden !important; -webkit-text-size-adjust: 100%; max-width: 100vw !important; margin: 0 !important; padding: 0 !important; }
        * { -webkit-tap-highlight-color: transparent; }
        input, select, textarea, button { font-size: 16px !important; }
      `}</style>
      <div style={{ margin: 0, background: "#111", color: "#f0f0f0", fontFamily: "-apple-system, system-ui, sans-serif", minHeight: "100dvh", overflow: "hidden" }}>
        {children}
        <div style={{ textAlign: "center", padding: "8px" }}>
          <a href="https://jeff-cline.com" style={{ fontSize: "6px", opacity: 0.08, color: "#fff", textDecoration: "none" }}>JC</a>
        </div>
      </div>
    </>
  );
}
