import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Contact | Jeff Cline",
  description: "Get in touch with Jeff Cline. Let's talk about weaponizing technology to dominate your market.",
  openGraph: {
    title: "Contact | Jeff Cline",
    description: "Get in touch with Jeff Cline. Let's talk about weaponizing technology to dominate your market.",
    url: "https://jeff-cline.com/contact",
    siteName: "Jeff Cline",
    type: "website",
    images: [{ url: "/favicon-192x192.png", width: 192, height: 192, alt: "Jeff Cline" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact | Jeff Cline",
    description: "Get in touch with Jeff Cline.",
  },
};

export default function ContactPage() {
  return (
    <>
    <Breadcrumbs items={[{ label: "Contact" }]} />
    <section className="min-h-screen pt-8 pb-20 px-4">
      <div className="max-w-2xl mx-auto text-center animate-fade-in-up">
        <h1 className="text-4xl md:text-5xl font-black mb-6">
          Let&apos;s <span className="text-[#FF8900]">Talk</span> Profit.
        </h1>
        <p className="text-gray-400 text-lg mb-12">
          Whether you&apos;re a Fortune 500 or a one-person start-up, if you&apos;re serious about using technology to dominate your market, I want to hear from you.
        </p>

        <div className="space-y-8">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 hover:border-[#FF8900]/30 transition-colors">
            <div className="text-4xl mb-4">📞</div>
            <h2 className="text-xl font-bold text-white mb-2">Call or Text</h2>
            <a
              href="tel:2234008146"
              className="text-2xl font-black text-[#FF8900] hover:text-[#DC2626] transition-colors"
            >
              223-400-8146
            </a>
          </div>

          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 hover:border-[#FF8900]/30 transition-colors">
            <div className="text-4xl mb-4">📧</div>
            <h2 className="text-xl font-bold text-white mb-2">Email</h2>
            <a
              href="mailto:jeff.cline@me.com"
              className="text-2xl font-black text-[#FF8900] hover:text-[#DC2626] transition-colors"
            >
              jeff.cline@me.com
            </a>
          </div>

          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 hover:border-[#FF8900]/30 transition-colors">
            <div className="text-4xl mb-4">📍</div>
            <h2 className="text-xl font-bold text-white mb-2">Location</h2>
            <p className="text-xl text-gray-300">Dallas, TX — Working Globally</p>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10">
          <p className="text-gray-500 text-sm">
            Every Industry is a <span className="text-[#FF8900] font-bold">GEEK</span> away from being <span className="text-[#DC2626] font-bold">UBERIZED</span>
          </p>
        </div>
      </div>
    </section>
    </>
  );
}
