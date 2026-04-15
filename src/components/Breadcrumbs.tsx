"use client";
import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string; // If undefined, renders as current page (no link)
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  // Always prepend Home
  const allItems: BreadcrumbItem[] = [{ label: "Home", href: "/" }, ...items];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `https://jeff-cline.com${item.href}` } : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <nav aria-label="Breadcrumb" className="pt-24 pb-4 px-4">
        <div className="max-w-4xl mx-auto">
          <ol className="text-sm text-gray-500 flex items-center gap-2 flex-wrap">
            {allItems.map((item, i) => (
              <li key={i} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden="true">/</span>}
                {item.href ? (
                  <Link href={item.href} className="hover:text-[#FF8900] transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-gray-300 truncate max-w-[300px]">{item.label}</span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </nav>
    </>
  );
}
