"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { silos } from "@/lib/silo-data";

const HIDDEN_PATHS = ["/mastermind", "/roatan", "/colab"];

export default function Footer() {
  const pathname = usePathname();
  if (HIDDEN_PATHS.some(p => pathname === p || pathname.startsWith(p + "/"))) return null;
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/5 pt-16 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Silo links */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-16">
          {silos.map((silo) => (
            <div key={silo.slug}>
              <Link
                href={`/${silo.slug}`}
                className="text-[#FF8900] font-bold text-sm uppercase tracking-wider hover:text-[#ffa033] transition-colors"
              >
                {silo.name}
              </Link>
              <ul className="mt-3 space-y-2">
                {silo.subPages.map((sub) => (
                  <li key={sub.slug}>
                    <Link
                      href={`/${silo.slug}/${sub.slug}`}
                      className="text-gray-500 text-sm hover:text-[#DC2626] transition-colors"
                    >
                      {sub.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Company links */}
        <div className="border-t border-white/5 pt-8 mb-8">
          <div className="flex flex-wrap gap-6 justify-center">
            <Link href="/about" className="text-gray-500 text-sm hover:text-[#FF8900] transition-colors">
              About
            </Link>
            <Link href="/portfolio" className="text-gray-500 text-sm hover:text-[#FF8900] transition-colors">
              Portfolio
            </Link>
            <Link href="/blog" className="text-gray-500 text-sm hover:text-[#FF8900] transition-colors">
              Blog
            </Link>
            <Link href="/resources" className="text-gray-500 text-sm hover:text-[#FF8900] transition-colors">
              Resources
            </Link>
            <Link href="/tools" className="text-gray-500 text-sm hover:text-[#FF8900] transition-colors">
              Tools
            </Link>
            <Link href="/calculators" className="text-gray-500 text-sm hover:text-[#FF8900] transition-colors">
              Calculators
            </Link>
            <Link href="/contact" className="text-gray-500 text-sm hover:text-[#FF8900] transition-colors">
              Contact
            </Link>
            <Link href="/quiz" className="text-gray-500 text-sm hover:text-[#FF8900] transition-colors">
              Quiz
            </Link>
            <Link href="/privacy" className="text-gray-500 text-sm hover:text-[#FF8900] transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-gray-500 text-sm hover:text-[#FF8900] transition-colors">
              Terms
            </Link>
            <Link href="/investment-disclosures" className="text-gray-500 text-sm hover:text-[#FF8900] transition-colors">
              Investment Disclosures
            </Link>
            <Link href="/one-click-demo" className="text-gray-500 text-sm hover:text-[#FF8900] transition-colors">
              One-Click Demo
            </Link>
            <Link href="/portfolio-companies" className="text-gray-500 text-sm hover:text-[#FF8900] transition-colors">
              Portfolio Companies
            </Link>
            <Link href="/investment-calculator" className="text-gray-500 text-sm hover:text-[#FF8900] transition-colors">
              Best Investment Calculator
            </Link>
            <a href="https://jeff-cline.com/agency/index.html" className="text-gray-500 text-sm hover:text-[#FF8900] transition-colors">
              Agency Services
            </a>
            <Link href="/pay-per-click" className="text-gray-500 text-sm hover:text-[#FF8900] transition-colors">
              PPC Management
            </Link>
            <Link href="/billionaires-club" className="text-gray-500 text-sm hover:text-[#FF8900] transition-colors">
              Billionaires Club
            </Link>
            <Link href="/fast-start" className="text-gray-500 text-sm hover:text-[#FF8900] transition-colors">
              Fast Start Program
            </Link>
            <Link href="/fast-start-agreement" className="text-gray-500 text-sm hover:text-[#FF8900] transition-colors">
              Engagement Agreement
            </Link>
            <Link href="/tools-a-la-carte" className="text-gray-500 text-sm hover:text-[#FF8900] transition-colors">
              Tools and Services Pricing
            </Link>
            <Link href="/testimonials" className="text-gray-500 text-sm hover:text-[#FF8900] transition-colors">
              Referrals &amp; Testimonials
            </Link>
            <Link href="/mastermind" className="text-gray-500 text-sm hover:text-[#FF8900] transition-colors font-semibold">
              Immersive Mastermind
            </Link>
            <Link href="/deck" className="text-gray-500 text-sm hover:text-[#FF8900] transition-colors font-semibold">
              Request Deck
            </Link>
            <Link href="/pitch-decks" className="text-gray-500 text-sm hover:text-[#FF8900] transition-colors font-semibold">
              Pitch Decks
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-lg font-black">
              <span className="text-[#FF8900]">JEFF</span>{" "}
              <span className="text-[#DC2626]">CLINE</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-gray-600 text-xs">
              © {new Date().getFullYear()} Jeff Cline. PROFIT AT SCALE.
            </p>
            {/* Easter egg */}
            <a
              href="https://jeff-cline.com"
              className="text-gray-600"
              style={{ fontSize: "6px", opacity: 0.08 }}
            >
              JC
            </a>
            <a
              href="/llms.txt"
              className="text-gray-600"
              style={{ fontSize: "6px", opacity: 0.08 }}
            >
              llms.txt
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
