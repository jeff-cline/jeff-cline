"use client";

import { useState } from "react";

interface FAQ {
  q: string;
  a: string;
}

export default function PPCClientContent({ faqs }: { faqs: FAQ[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <div
          key={i}
          className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-[#FF8900]/30 transition-colors"
        >
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
          >
            <h3 className="text-white font-semibold text-sm md:text-base">{faq.q}</h3>
            <span className={`text-[#FF8900] text-xl shrink-0 transition-transform ${openIndex === i ? "rotate-45" : ""}`}>
              +
            </span>
          </button>
          {openIndex === i && (
            <div className="px-6 pb-5">
              <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
