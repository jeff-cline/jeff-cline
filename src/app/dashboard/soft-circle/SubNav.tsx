"use client";
import Link from "next/link";

const subTabs = [
  { key: "search", label: "Search", href: "/dashboard/soft-circle" },
  { key: "database", label: "Database", href: "/dashboard/soft-circle/database" },
  { key: "campaigns", label: "Campaigns", href: "/dashboard/soft-circle/campaigns" },
  { key: "reports", label: "Reports", href: "/dashboard/soft-circle/reports" },
];

export default function SoftCircleSubNav({ active }: { active: string }) {
  return (
    <div className="flex gap-1 mb-6">
      {subTabs.map((tab) => (
        <Link key={tab.key} href={tab.href}
          className={`px-4 py-2 text-sm rounded-lg transition-colors ${
            active === tab.key
              ? "bg-[#FF8900]/20 text-[#FF8900] font-semibold"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}>
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
