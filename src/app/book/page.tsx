import Script from "next/script";

export default function BookPage() {
  return (
    <>
      <Script
        id="cal-embed-init"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
            Cal("init", {origin:"https://cal.com"});
            Cal("inline", {elementOrSelector:"#cal-embed", calLink: "jeffcline", layout: "month_view", config: {theme: "dark"}});
            Cal("ui", {theme: "dark", styles: {branding: {brandColor: "#FF8900"}}, hideEventTypeDetails: false, layout: "month_view"});
          `,
        }}
      />
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <p className="text-[#DC2626] font-bold text-sm tracking-[0.3em] uppercase mb-4">
            Limited Availability
          </p>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            Book Time with{" "}
            <span className="text-[#FF8900]">Jeff Cline</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Whether you need a quick strategy call or a deep-dive session,
            pick a time that works for you. No gatekeepers. No forms. Just
            pick a slot.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div
            id="cal-embed"
            style={{
              width: "100%",
              minHeight: "700px",
              overflow: "auto",
              borderRadius: "12px",
            }}
          />
        </div>

        <div className="max-w-4xl mx-auto mt-16 text-center">
          <p className="text-gray-600 text-sm">
            All meetings include a calendar invite with video call link.
            Timezone is automatically detected.
          </p>
        </div>
      </section>
    </>
  );
}
