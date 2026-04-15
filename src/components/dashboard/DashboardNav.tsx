"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "Overview", href: "/dashboard" },
  { label: "Leads", href: "/dashboard/leads" },
  { label: "Expenses", href: "/dashboard/expenses" },
  { label: "Pixels", href: "/dashboard/pixels" },
  { label: "Reports", href: "/dashboard/reports" },
  { label: "◎ Soft Circle", href: "/dashboard/soft-circle" },
  { label: "🟡 V Card", href: "/dashboard/vcard" },
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-white/10 mb-8">
      <div className="flex gap-0 overflow-x-auto">
        {tabs.map((tab) => {
          const active = tab.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-5 py-3 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 ${
                active
                  ? "border-[#FF8900] text-[#FF8900]"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
