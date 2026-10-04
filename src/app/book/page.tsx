import Script from "next/script";

// Calendly, not Cal.com. On 4 Oct 2026 the Cal.com booker showed "No
// availability in October, November" to every visitor while Cal.com's own
// slots API returned 200 open slots for the same event (cal.com/jeffcline/30min)
// — a fault inside Cal.com that this page cannot see or fix, because the
// booker runs in Cal.com's iframe. Calendly showed real availability, so the
// page books there. To go back, restore the Cal("inline", …) embed from git
// history; /api/book/webhook (Cal.com → CRM) is still in place for that.
const CALENDLY = "https://calendly.com/jdcline";
const EMBED = `${CALENDLY}?hide_gdpr_banner=1&background_color=0a0a0a&text_color=ffffff&primary_color=ff8900`;

export default function BookPage() {
  return (
    <>
      <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="afterInteractive" />
      {/* Campaign emails link here with ?c=<token>. Report the visit once, so
          the outreach console can show who clicked through. The email itself
          carries no tracking redirect, for deliverability. */}
      <Script id="click-beacon" strategy="afterInteractive">{`(function(){try{var c=new URLSearchParams(location.search).get("c");if(c&&/^[a-f0-9]{24}$/.test(c)){new Image().src="https://predictivedata.org/api/track/click?c="+c+"&u="+encodeURIComponent(location.hostname+location.pathname);}}catch(e){}})();`}</Script>

      <section className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center mb-10">
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

        <div className="max-w-5xl mx-auto text-center mb-6">
          <a
            href={CALENDLY}
            target="_blank"
            rel="noopener"
            className="inline-block bg-[#FF8900] text-black font-bold px-6 py-3 rounded-lg hover:opacity-90"
          >
            Direct access to Jeff Cline&rsquo;s Calendly &rarr;
          </a>
        </div>

        <div className="max-w-5xl mx-auto">
          <div
            className="calendly-inline-widget"
            data-url={EMBED}
            style={{ minWidth: "320px", height: "760px", borderRadius: "12px", overflow: "hidden" }}
          />
        </div>

        <div className="max-w-4xl mx-auto mt-6 text-center">
          <p className="text-gray-400 text-sm">
            In the event the calendar is not working, please click the link above.
          </p>
          <p className="text-gray-600 text-sm mt-10">
            All meetings include a calendar invite with video call link.
            Timezone is automatically detected.
          </p>
        </div>
      </section>
    </>
  );
}
