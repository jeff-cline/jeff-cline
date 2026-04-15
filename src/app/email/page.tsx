"use client";

import { useState, FormEvent } from "react";

/* ------------------------------------------------------------------ */
/*  FAQ Data                                                          */
/* ------------------------------------------------------------------ */
const faqs = [
  {
    q: "How does AI email management work?",
    a: "Our AI analyzes your incoming emails in real-time, classifying them into actionable categories like Urgent, Follow-up, FYI, and Spam. It learns your communication patterns, writing style, and priorities to auto-organize your inbox and generate draft replies that sound like you wrote them.",
  },
  {
    q: "Is my email data secure?",
    a: "Absolutely. All email data is encrypted in transit and at rest using AES-256 encryption. We never share your data with third parties. Our infrastructure is SOC 2 Type II certified, and we comply with GDPR and CCPA requirements. Your emails are processed in isolated environments and never used to train models for other users.",
  },
  {
    q: "Which email providers are supported?",
    a: "We support all major email providers including Gmail, Google Workspace, Microsoft Outlook, Office 365, Yahoo Mail, and any IMAP-compatible email server. Setup takes less than 60 seconds with OAuth authentication -- no passwords stored on our servers.",
  },
  {
    q: "How accurate are the AI draft replies?",
    a: "After analyzing approximately 500 of your sent emails, our AI achieves 90%+ accuracy in matching your writing style, tone, and typical response patterns. Most users find they can send AI-drafted replies with minimal or no edits within the first week of use.",
  },
  {
    q: "Can I customize the email labels and categories?",
    a: "Yes. While we provide default categories (Urgent, Follow-up, FYI, Spam), you can create custom labels, define rules for automatic categorization, and set priority thresholds. The AI adapts to your custom categories within 24-48 hours of use.",
  },
  {
    q: "How does the meeting notes feature work?",
    a: "When you have calendar events with associated email threads, our AI automatically generates meeting summaries after the scheduled time. It pulls context from related emails, creates structured notes with action items, and drafts follow-up emails to attendees -- all delivered to your inbox.",
  },
  {
    q: "What happens if I disagree with an AI classification?",
    a: "Simply reclassify the email manually, and the AI learns from your correction immediately. Our reinforcement learning system means the more you use it, the smarter it gets. Most users see classification accuracy improve from 85% to 97% within the first month.",
  },
  {
    q: "Can I use this for team email management?",
    a: "Yes. Our Professional and Enterprise plans support shared inboxes, team routing rules, and collaborative draft reviews. Team members can see AI-suggested responses, assign emails to colleagues, and maintain consistent communication standards across the organization.",
  },
  {
    q: "Is there a limit on the number of emails processed?",
    a: "The Starter plan processes up to 5,000 emails per month. Professional handles up to 25,000 emails per month. Enterprise plans offer unlimited processing with dedicated infrastructure. Overage emails are queued and processed within 4 hours on standard plans.",
  },
  {
    q: "Can I cancel my subscription at any time?",
    a: "Yes, you can cancel anytime with no cancellation fees. Your data is retained for 30 days after cancellation, during which you can export everything. After 30 days, all data is permanently deleted from our systems. We also offer a 14-day free trial with no credit card required.",
  },
];

/* ------------------------------------------------------------------ */
/*  Schema.org JSON-LD                                                */
/* ------------------------------------------------------------------ */
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "AI Email Management Tool",
  url: "https://jeff-cline.com/email",
  description: "AI-powered email management platform. Auto-organize your inbox, generate draft replies in your voice, and get meeting notes delivered automatically.",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: [
    { "@type": "Offer", price: "22", priceCurrency: "USD", description: "Starter plan" },
    { "@type": "Offer", price: "37", priceCurrency: "USD", description: "Professional plan" },
  ],
};

/* ------------------------------------------------------------------ */
/*  Main Page Component                                               */
/* ------------------------------------------------------------------ */
export default function EmailToolPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", phone: "", company: "", message: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormStatus("sending");
    try {
      const res = await fetch("/api/email/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormStatus("sent");
        setFormData({ firstName: "", lastName: "", email: "", phone: "", company: "", message: "" });
      } else {
        setFormStatus("error");
      }
    } catch {
      setFormStatus("error");
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />

      <div style={{ minHeight: "100vh", background: "#0A1628", fontFamily: "system-ui, sans-serif", color: "#E2E8F0" }}>
        {/* ==================== NAV BAR ==================== */}
        <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 32px", maxWidth: 1200, margin: "0 auto", borderBottom: "1px solid #1E293B" }}>
          <a href="/email" style={{ color: "#F97316", fontWeight: 800, fontSize: 20, textDecoration: "none", letterSpacing: "-0.02em" }}>
            Email Tool
          </a>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <a href="#features" style={{ color: "#94A3B8", fontSize: 14, textDecoration: "none", fontWeight: 500 }}>Features</a>
            <a href="#pricing" style={{ color: "#94A3B8", fontSize: 14, textDecoration: "none", fontWeight: 500 }}>Pricing</a>
            <a href="#faq" style={{ color: "#94A3B8", fontSize: 14, textDecoration: "none", fontWeight: 500 }}>FAQ</a>
            <a href="/email/login" style={{ display: "inline-block", padding: "10px 24px", background: "#F97316", color: "#fff", fontWeight: 700, fontSize: 14, borderRadius: 6, textDecoration: "none" }}>
              Log In
            </a>
          </div>
        </nav>

        {/* ==================== HERO ==================== */}
        <section style={{ textAlign: "center", padding: "100px 24px 80px", maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.3)", borderRadius: 20, padding: "6px 18px", marginBottom: 24 }}>
            <span style={{ color: "#F97316", fontSize: 14, fontWeight: 600 }}>AI-Powered Email Management</span>
          </div>
          <h1 style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.1, marginBottom: 20, background: "linear-gradient(135deg, #E2E8F0 0%, #F97316 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            AI Email Management.<br />Your inbox, automated.
          </h1>
          <p style={{ color: "#94A3B8", fontSize: 20, lineHeight: 1.6, maxWidth: 650, margin: "0 auto 40px" }}>
            Stop drowning in email. AI organizes your inbox, drafts replies in your voice, and delivers meeting notes -- all on autopilot.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/email/login" style={{ display: "inline-block", padding: "16px 36px", background: "#F97316", color: "#fff", fontWeight: 700, fontSize: 17, borderRadius: 8, textDecoration: "none" }}>
              Get Started Free
            </a>
            <a href="#features" style={{ display: "inline-block", padding: "16px 36px", background: "transparent", color: "#F97316", fontWeight: 700, fontSize: 17, borderRadius: 8, textDecoration: "none", border: "1px solid #F97316" }}>
              See Features
            </a>
          </div>
        </section>

        {/* ==================== FEATURES ==================== */}
        <section id="features" style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px 80px" }}>
          <h2 style={{ textAlign: "center", fontSize: 36, fontWeight: 700, marginBottom: 16 }}>Everything Your Inbox Needs</h2>
          <p style={{ textAlign: "center", color: "#94A3B8", fontSize: 18, marginBottom: 56, maxWidth: 600, margin: "0 auto 56px" }}>Three powerful features that transform how you handle email.</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {/* Feature 1 */}
            <div style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: 12, padding: 32 }}>
              <div style={{ width: 48, height: 48, borderRadius: 10, background: "rgba(249,115,22,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, fontSize: 24 }}>&#9993;</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Inbox Organization</h3>
              <p style={{ color: "#94A3B8", lineHeight: 1.7, fontSize: 15 }}>
                AI automatically sorts every incoming email into actionable labels -- Urgent, Follow-up, FYI, or Spam. No more manual triaging. Focus on what matters first.
              </p>
            </div>

            {/* Feature 2 */}
            <div style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: 12, padding: 32 }}>
              <div style={{ width: 48, height: 48, borderRadius: 10, background: "rgba(249,115,22,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, fontSize: 24 }}>&#9999;</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>AI Draft Replies</h3>
              <p style={{ color: "#94A3B8", lineHeight: 1.7, fontSize: 15 }}>
                Every email gets a pre-written reply that sounds exactly like you. Trained on your writing style, tone, and typical responses. Review, edit if needed, and send.
              </p>
            </div>

            {/* Feature 3 */}
            <div style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: 12, padding: 32 }}>
              <div style={{ width: 48, height: 48, borderRadius: 10, background: "rgba(249,115,22,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, fontSize: 24 }}>&#128221;</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Meeting Notes Integration</h3>
              <p style={{ color: "#94A3B8", lineHeight: 1.7, fontSize: 15 }}>
                After every meeting, receive structured notes with action items delivered to your inbox. Follow-up emails are drafted automatically so nothing falls through the cracks.
              </p>
            </div>
          </div>
        </section>

        {/* ==================== HOW IT WORKS ==================== */}
        <section style={{ maxWidth: 900, margin: "0 auto", padding: "60px 24px 80px" }}>
          <h2 style={{ textAlign: "center", fontSize: 36, fontWeight: 700, marginBottom: 56 }}>How It Works</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 32 }}>
            {[
              { step: "1", title: "Connect Your Email", desc: "One-click OAuth setup with Gmail, Outlook, or any IMAP provider. No passwords stored. Takes 30 seconds." },
              { step: "2", title: "AI Learns Your Style", desc: "Our AI analyzes your sent emails to understand your voice, tone, and response patterns. Ready within hours." },
              { step: "3", title: "Inbox on Autopilot", desc: "Emails are auto-organized, draft replies appear instantly, and meeting notes land in your inbox without lifting a finger." },
            ].map((item) => (
              <div key={item.step} style={{ textAlign: "center" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(249,115,22,0.15)", border: "2px solid #F97316", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 22, fontWeight: 800, color: "#F97316" }}>
                  {item.step}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{item.title}</h3>
                <p style={{ color: "#94A3B8", lineHeight: 1.6, fontSize: 15 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ==================== PRICING ==================== */}
        <section id="pricing" style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px 80px" }}>
          <h2 style={{ textAlign: "center", fontSize: 36, fontWeight: 700, marginBottom: 16 }}>Simple Pricing</h2>
          <p style={{ textAlign: "center", color: "#94A3B8", fontSize: 18, marginBottom: 56, maxWidth: 500, margin: "0 auto 56px" }}>Start free. Upgrade when you need more.</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {/* Starter */}
            <div style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: 12, padding: 32 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Starter</h3>
              <div style={{ marginBottom: 20 }}>
                <span style={{ fontSize: 42, fontWeight: 800 }}>$22</span>
                <span style={{ color: "#94A3B8", fontSize: 16 }}>/month</span>
              </div>
              <ul style={{ listStyle: "none", padding: 0, marginBottom: 28 }}>
                {["Up to 5,000 emails/month", "Inbox auto-organization", "AI draft replies", "1 email account", "Email support"].map((f) => (
                  <li key={f} style={{ padding: "8px 0", color: "#94A3B8", fontSize: 15, borderBottom: "1px solid #1E293B" }}>{f}</li>
                ))}
              </ul>
              <a href="/email/login" style={{ display: "block", textAlign: "center", padding: "14px 0", background: "transparent", color: "#F97316", fontWeight: 700, fontSize: 15, borderRadius: 8, textDecoration: "none", border: "1px solid #F97316" }}>Get Started</a>
            </div>

            {/* Professional */}
            <div style={{ background: "#0F172A", border: "2px solid #F97316", borderRadius: 12, padding: 32, position: "relative" }}>
              <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: "#F97316", color: "#fff", padding: "4px 16px", borderRadius: 20, fontSize: 13, fontWeight: 700 }}>Most Popular</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Professional</h3>
              <div style={{ marginBottom: 20 }}>
                <span style={{ fontSize: 42, fontWeight: 800 }}>$37</span>
                <span style={{ color: "#94A3B8", fontSize: 16 }}>/month</span>
              </div>
              <ul style={{ listStyle: "none", padding: 0, marginBottom: 28 }}>
                {["Up to 25,000 emails/month", "Everything in Starter", "Meeting notes integration", "5 email accounts", "Shared inbox support", "Priority support"].map((f) => (
                  <li key={f} style={{ padding: "8px 0", color: "#94A3B8", fontSize: 15, borderBottom: "1px solid #1E293B" }}>{f}</li>
                ))}
              </ul>
              <a href="/email/login" style={{ display: "block", textAlign: "center", padding: "14px 0", background: "#F97316", color: "#fff", fontWeight: 700, fontSize: 15, borderRadius: 8, textDecoration: "none" }}>Get Started</a>
            </div>

            {/* Enterprise */}
            <div style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: 12, padding: 32 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Enterprise</h3>
              <div style={{ marginBottom: 20 }}>
                <span style={{ fontSize: 42, fontWeight: 800 }}>Custom</span>
              </div>
              <ul style={{ listStyle: "none", padding: 0, marginBottom: 28 }}>
                {["Unlimited emails", "Everything in Professional", "Custom AI training", "Unlimited email accounts", "SSO / SAML", "Dedicated account manager", "SLA guarantee"].map((f) => (
                  <li key={f} style={{ padding: "8px 0", color: "#94A3B8", fontSize: 15, borderBottom: "1px solid #1E293B" }}>{f}</li>
                ))}
              </ul>
              <a href="#contact" style={{ display: "block", textAlign: "center", padding: "14px 0", background: "transparent", color: "#F97316", fontWeight: 700, fontSize: 15, borderRadius: 8, textDecoration: "none", border: "1px solid #F97316" }}>Contact Sales</a>
            </div>
          </div>
        </section>

        {/* ==================== FAQ ==================== */}
        <section id="faq" style={{ maxWidth: 800, margin: "0 auto", padding: "60px 24px 80px" }}>
          <h2 style={{ textAlign: "center", fontSize: 36, fontWeight: 700, marginBottom: 48 }}>Frequently Asked Questions</h2>

          {faqs.map((faq, i) => (
            <div key={i} style={{ borderBottom: "1px solid #1E293B", marginBottom: 0 }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ width: "100%", background: "transparent", border: "none", padding: "20px 0", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", color: "#E2E8F0", fontSize: 16, fontWeight: 600, textAlign: "left" }}
              >
                {faq.q}
                <span style={{ color: "#F97316", fontSize: 22, marginLeft: 16, transform: openFaq === i ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
              </button>
              {openFaq === i && (
                <div style={{ padding: "0 0 20px", color: "#94A3B8", lineHeight: 1.7, fontSize: 15 }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </section>

        {/* ==================== LEAD CAPTURE ==================== */}
        <section id="contact" style={{ maxWidth: 600, margin: "0 auto", padding: "60px 24px 80px" }}>
          <h2 style={{ textAlign: "center", fontSize: 36, fontWeight: 700, marginBottom: 16 }}>Get in Touch</h2>
          <p style={{ textAlign: "center", color: "#94A3B8", fontSize: 16, marginBottom: 40 }}>Have questions? Want a demo? Drop us a line.</p>

          {formStatus === "sent" ? (
            <div style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 12, padding: 32, textAlign: "center" }}>
              <p style={{ color: "#22C55E", fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Message sent!</p>
              <p style={{ color: "#94A3B8", fontSize: 15 }}>We&apos;ll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ display: "block", color: "#94A3B8", fontSize: 13, marginBottom: 6 }}>First Name *</label>
                  <input required value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} style={{ width: "100%", padding: "12px 16px", background: "#0F172A", border: "1px solid #1E293B", borderRadius: 8, color: "#E2E8F0", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", color: "#94A3B8", fontSize: 13, marginBottom: 6 }}>Last Name *</label>
                  <input required value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} style={{ width: "100%", padding: "12px 16px", background: "#0F172A", border: "1px solid #1E293B", borderRadius: 8, color: "#E2E8F0", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", color: "#94A3B8", fontSize: 13, marginBottom: 6 }}>Email *</label>
                <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={{ width: "100%", padding: "12px 16px", background: "#0F172A", border: "1px solid #1E293B", borderRadius: 8, color: "#E2E8F0", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ display: "block", color: "#94A3B8", fontSize: 13, marginBottom: 6 }}>Phone</label>
                  <input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} style={{ width: "100%", padding: "12px 16px", background: "#0F172A", border: "1px solid #1E293B", borderRadius: 8, color: "#E2E8F0", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", color: "#94A3B8", fontSize: 13, marginBottom: 6 }}>Company</label>
                  <input value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} style={{ width: "100%", padding: "12px 16px", background: "#0F172A", border: "1px solid #1E293B", borderRadius: 8, color: "#E2E8F0", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", color: "#94A3B8", fontSize: 13, marginBottom: 6 }}>Message</label>
                <textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} rows={4} style={{ width: "100%", padding: "12px 16px", background: "#0F172A", border: "1px solid #1E293B", borderRadius: 8, color: "#E2E8F0", fontSize: 15, outline: "none", resize: "vertical", boxSizing: "border-box" }} />
              </div>

              <button
                type="submit"
                disabled={formStatus === "sending"}
                style={{ width: "100%", padding: "16px 0", background: formStatus === "sending" ? "#B45309" : "#F97316", color: "#fff", fontWeight: 700, fontSize: 16, border: "none", borderRadius: 8, cursor: formStatus === "sending" ? "not-allowed" : "pointer" }}
              >
                {formStatus === "sending" ? "Sending..." : "Send Message"}
              </button>

              {formStatus === "error" && (
                <p style={{ color: "#EF4444", fontSize: 14, textAlign: "center", marginTop: 12 }}>Something went wrong. Please try again.</p>
              )}
            </form>
          )}
        </section>

        {/* ==================== FOOTER ==================== */}
        <footer style={{ borderTop: "1px solid #1E293B", padding: "32px 24px", textAlign: "center" }}>
          <p style={{ color: "#64748B", fontSize: 14 }}>
            &copy; {new Date().getFullYear()} Jeff Cline. All rights reserved.
          </p>
          <a href="https://jeff-cline.com" style={{ color: "#64748B", fontSize: 6, opacity: 0.08, textDecoration: "none", marginTop: 8, display: "inline-block" }}>JC</a>
        </footer>
      </div>
    </>
  );
}
