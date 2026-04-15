"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const silos = [
  { name: "Business", href: "/business" },
  { name: "Entrepreneur", href: "/entrepreneur" },
  { name: "Start-Ups", href: "/start-ups" },
  { name: "Investors", href: "/investors" },
  { name: "Family Offices", href: "/family-offices" },
];

const HIDDEN_PATHS = ["/mastermind", "/roatan"];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const signInRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const user = session?.user as any;

  if (HIDDEN_PATHS.some(p => pathname === p || pathname.startsWith(p + "/"))) return null;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (signInRef.current && !signInRef.current.contains(e.target as Node)) {
        setSignInOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#111]/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-black tracking-tight">
              <span className="text-[#FF8900]">JEFF</span>{" "}
              <span className="text-[#DC2626]">CLINE</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {silos.map((s) => (
              <Link key={s.href} href={s.href}
                className="text-sm font-semibold text-gray-300 hover:text-[#FF8900] transition-colors">
                {s.name}
              </Link>
            ))}
            <Link href="/tools" className="text-sm font-semibold text-gray-300 hover:text-[#FF8900] transition-colors">
              Tools
            </Link>
            {session ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard" className="text-sm font-semibold text-gray-300 hover:text-[#FF8900] transition-colors">
                  Dashboard
                </Link>
                {user?.role === "admin" && (
                  <Link href="/admin" className="text-sm font-semibold text-[#DC2626] hover:text-red-400 transition-colors">
                    Admin
                  </Link>
                )}
                <button onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-sm font-semibold text-gray-500 hover:text-white transition-colors">
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="relative" ref={signInRef}>
                  <button
                    onClick={() => setSignInOpen(!signInOpen)}
                    className="text-sm font-semibold text-gray-300 hover:text-[#FF8900] transition-colors flex items-center gap-1"
                  >
                    Sign In
                    <svg className={`w-3.5 h-3.5 transition-transform ${signInOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {signInOpen && (
                    <div className="absolute right-0 mt-2 w-44 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl overflow-hidden z-50 animate-fade-in">
                      <a
                        href="https://jeff-cline.com/agency/dashboard.html"
                        onClick={() => setSignInOpen(false)}
                        className="block px-4 py-3 text-sm font-semibold text-gray-300 hover:bg-[#FF8900]/10 hover:text-[#FF8900] transition-colors"
                      >
                        Agency
                      </a>
                      <a
                        href="https://jeff-cline.com/dashboard"
                        onClick={() => setSignInOpen(false)}
                        className="block px-4 py-3 text-sm font-semibold text-gray-300 hover:bg-[#FF8900]/10 hover:text-[#FF8900] transition-colors border-t border-white/5"
                      >
                        Business
                      </a>
                    </div>
                  )}
                </div>
                <Link href="/quiz" className="btn-primary text-sm !py-2 !px-5">
                  Take the Quiz
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)} className="md:hidden text-white p-2" aria-label="Toggle menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className="md:hidden bg-[#1a1a1a] border-t border-white/5 animate-fade-in">
          <div className="px-4 py-4 space-y-3">
            {silos.map((s) => (
              <Link key={s.href} href={s.href} onClick={() => setOpen(false)}
                className="block text-sm font-semibold text-gray-300 hover:text-[#FF8900] transition-colors">
                {s.name}
              </Link>
            ))}
            <Link href="/tools" onClick={() => setOpen(false)}
              className="block text-sm font-semibold text-gray-300 hover:text-[#FF8900] transition-colors">
              Tools
            </Link>
            <Link href="/resources" onClick={() => setOpen(false)}
              className="block text-sm font-semibold text-gray-300 hover:text-[#FF8900] transition-colors">
              Resources
            </Link>
            {session ? (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)}
                  className="block text-sm font-semibold text-[#FF8900]">Dashboard</Link>
                {user?.role === "admin" && (
                  <Link href="/admin" onClick={() => setOpen(false)}
                    className="block text-sm font-semibold text-[#DC2626]">Admin</Link>
                )}
                <button onClick={() => { signOut({ callbackUrl: "/" }); setOpen(false); }}
                  className="block text-sm font-semibold text-gray-500">Sign Out</button>
              </>
            ) : (
              <>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-2">Sign In</p>
                <a href="https://jeff-cline.com/agency/dashboard.html" onClick={() => setOpen(false)}
                  className="block text-sm font-semibold text-gray-300 hover:text-[#FF8900] transition-colors pl-2">Agency</a>
                <a href="https://jeff-cline.com/dashboard" onClick={() => setOpen(false)}
                  className="block text-sm font-semibold text-gray-300 hover:text-[#FF8900] transition-colors pl-2">Business</a>
                <Link href="/quiz" onClick={() => setOpen(false)}
                  className="btn-primary text-sm !py-2 !px-5 block text-center mt-4">Take the Quiz</Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
