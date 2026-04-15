"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

/* ------------------------------------------------------------------ */
/*  Sample Emails                                                     */
/* ------------------------------------------------------------------ */
interface SampleEmail {
  id: number;
  sender: string;
  senderEmail: string;
  subject: string;
  preview: string;
  body: string;
  time: string;
  label: "Urgent" | "Follow-up" | "FYI" | "Spam";
  draftReply: string;
}

const sampleEmails: SampleEmail[] = [
  {
    id: 1,
    sender: "Sarah Chen",
    senderEmail: "sarah.chen@partnercorp.com",
    subject: "Partnership Opportunity",
    preview: "Hi Jeff, I wanted to reach out regarding a potential strategic partnership...",
    body: "Hi Jeff,\n\nI wanted to reach out regarding a potential strategic partnership between our organizations. We've been following your work in the AI and compliance automation space, and we believe there's a strong synergy between our enterprise client base and your technology platform.\n\nOur company serves over 200 mid-market firms in the financial services sector, and we've identified a significant gap in their compliance tooling. Your GRC automation capabilities could be the perfect fit. We're proposing a co-marketing arrangement with revenue sharing on referred clients.\n\nWould you be available for a 30-minute call this week to explore this further? I'm flexible on timing and can adjust to your schedule.",
    time: "9:42 AM",
    label: "Urgent",
    draftReply: "Hi Sarah,\n\nThanks for reaching out. The partnership angle sounds interesting -- our GRC platform is gaining traction and the financial services vertical is one we've been targeting.\n\nLet's set up a call. I'm available Thursday afternoon or Friday morning. Send me a calendar invite and we'll dig into the details.\n\nBest,\nJeff",
  },
  {
    id: 2,
    sender: "Michael Roberts",
    senderEmail: "m.roberts@finance-dept.com",
    subject: "Q4 Budget Review",
    preview: "Jeff, attached is the Q4 budget analysis. We need to discuss the variance...",
    body: "Jeff,\n\nAttached is the Q4 budget analysis for the technology division. We're seeing a 12% variance from projected spend, primarily driven by increased cloud infrastructure costs and the new security tooling we onboarded in October.\n\nThe good news is that revenue from the compliance automation product exceeded projections by 18%, which more than offsets the additional spend. However, we need to reconcile the line items and prepare the board presentation for next month.\n\nCan we schedule 45 minutes this week to walk through the numbers? I want to make sure we're aligned on the narrative before the board meeting. I've flagged three areas that need your sign-off before we can close the books.",
    time: "8:15 AM",
    label: "Follow-up",
    draftReply: "Michael,\n\nGood to see revenue beating projections. The infrastructure cost increase makes sense given the scaling we did in Q4.\n\nLet's meet Wednesday morning to go through everything. Send me the three items needing sign-off ahead of time so I can review before we sit down.\n\nThanks,\nJeff",
  },
  {
    id: 3,
    sender: "John Martinez",
    senderEmail: "j.martinez@teamlead.com",
    subject: "Meeting Tomorrow at 2pm",
    preview: "Quick reminder about our product roadmap review tomorrow at 2pm...",
    body: "Hi Jeff,\n\nQuick reminder about our product roadmap review tomorrow at 2pm in Conference Room B. We'll be covering the Q1 development priorities, the new email automation feature rollout, and the enterprise client feedback from last month's beta program.\n\nI've prepared a slide deck with the updated timeline and resource allocation. The engineering team has some concerns about the March deadline for the API v2 launch that I think we should address.\n\nPlease bring your notes from the client advisory board meeting -- a few of those feature requests directly impact our prioritization. Also, Lisa from design will be joining to present the new dashboard mockups.",
    time: "Yesterday",
    label: "Follow-up",
    draftReply: "John,\n\nGot it, I'll be there. I have my notes from the advisory board ready -- there are a couple of feature requests that should move up the priority list.\n\nRe: the March deadline concerns, let's make sure we cover those first so the team has clarity before the weekend.\n\nSee you at 2.\n\nJeff",
  },
  {
    id: 4,
    sender: "Legal Team",
    senderEmail: "legal@company.com",
    subject: "Contract Review Needed",
    preview: "The MSA with Meridian Corp requires your review before Friday...",
    body: "Jeff,\n\nThe Master Service Agreement with Meridian Corporation requires your review and approval before we can proceed. The contract is valued at $340,000 annually with a 3-year commitment and includes provisions for their compliance automation deployment across 12 regional offices.\n\nKey items requiring your attention: (1) The liability cap has been negotiated down to 2x annual contract value, which is below our standard 3x threshold. (2) They've requested a 90-day termination clause instead of our standard 180-day. (3) The data processing addendum includes EU data residency requirements that may require infrastructure changes.\n\nWe need your sign-off by Friday COB to meet their procurement timeline. If we miss this window, the deal gets pushed to their next fiscal quarter.",
    time: "Yesterday",
    label: "Urgent",
    draftReply: "Legal Team,\n\nI'll review the MSA today. Initial thoughts: the liability cap at 2x is too low for a deal this size -- push back to at least 2.5x. The 90-day termination is fine if we get a 12-month minimum commitment before it kicks in.\n\nOn the EU data residency, loop in DevOps to confirm timeline on the infrastructure changes. I don't want to commit to something we can't deliver.\n\nI'll have my full comments back by Thursday morning.\n\nJeff",
  },
  {
    id: 5,
    sender: "Marketing Team",
    senderEmail: "marketing@company.com",
    subject: "Q4 Campaign Results",
    preview: "Here's the performance summary for our Q4 digital campaigns...",
    body: "Hi Jeff,\n\nHere's the performance summary for our Q4 digital marketing campaigns. Overall, we saw a 34% increase in qualified leads compared to Q3, with the LinkedIn thought leadership campaign driving the highest conversion rate at 4.2%.\n\nBreakdown by channel: LinkedIn Ads generated 847 leads at $23 CPL, Google Ads brought in 623 leads at $31 CPL, and the webinar series converted 156 attendees into 89 demo requests. The compliance automation whitepaper was downloaded 2,340 times and contributed to 12 closed deals worth $780,000 in ARR.\n\nFor Q1, we're recommending a 20% budget increase for LinkedIn and a new ABM program targeting Fortune 500 compliance officers. The detailed report with creative performance metrics is attached.",
    time: "2 days ago",
    label: "FYI",
    draftReply: "Marketing Team,\n\nStrong numbers across the board. The LinkedIn CPL and whitepaper conversion pipeline are particularly impressive.\n\nI'm on board with the Q1 budget increase for LinkedIn. For the ABM program, let's start with a pilot targeting 50 accounts before we scale. Set up a brief to walk me through the target account list.\n\nKeep it up.\n\nJeff",
  },
  {
    id: 6,
    sender: "Accounts Payable",
    senderEmail: "ap@vendor-systems.com",
    subject: "Invoice #4521",
    preview: "Please find attached Invoice #4521 for cloud infrastructure services...",
    body: "Dear Jeff,\n\nPlease find attached Invoice #4521 for cloud infrastructure services rendered during the period of October 1 - December 31. The total amount due is $47,832.00, which includes the base hosting fees ($32,000), CDN and bandwidth overages ($8,200), dedicated support tier ($5,000), and the security audit add-on ($2,632).\n\nPayment terms are Net 30 from the invoice date. We've also included a credit of $1,200 for the service disruption on November 15th as previously agreed.\n\nPlease note that our pricing structure will be updated for Q1 contracts. We'd like to schedule a renewal discussion to ensure continuity of your current rate locks. Your account manager, David Park, will be reaching out separately to coordinate.",
    time: "2 days ago",
    label: "FYI",
    draftReply: "Accounts Payable,\n\nReceived. I'll route Invoice #4521 to our finance team for processing within terms.\n\nRegarding the Q1 pricing update -- please have David send over the new rate sheet before the renewal discussion. I want to review the numbers before we meet.\n\nThanks,\nJeff",
  },
  {
    id: 7,
    sender: "HR Department",
    senderEmail: "hr@company.com",
    subject: "Team Offsite Planning",
    preview: "We're finalizing plans for the Q1 team offsite. Please review the proposed...",
    body: "Hi Jeff,\n\nWe're finalizing plans for the Q1 team offsite scheduled for March 15-17. The proposed venue is the Omni Resort in Austin, which offers dedicated meeting space, team building facilities, and is within budget at $185/night per room.\n\nWe need your input on the agenda. Current draft includes: Day 1 - Company vision and Q1 priorities (your keynote), team breakout sessions; Day 2 - Product demos, cross-functional workshops, team building activity; Day 3 - Action planning and commitments, half-day wrap-up.\n\nWe have 42 confirmed attendees. The total estimated budget is $38,500 including venue, meals, activities, and travel for remote team members. Please confirm: (1) your availability for those dates, (2) any specific topics for the keynote, (3) budget approval. We need to lock in the venue deposit by next Friday.",
    time: "3 days ago",
    label: "Follow-up",
    draftReply: "HR,\n\nMarch 15-17 works for me. Austin is a good call.\n\nFor the keynote, I'll cover the AI product roadmap and the enterprise growth strategy. Schedule me for 45 minutes on Day 1 morning.\n\nBudget is approved. Lock in the venue. One addition to the agenda -- I want a 30-minute session on Day 2 for customer success stories from the field team.\n\nJeff",
  },
  {
    id: 8,
    sender: "Product Team",
    senderEmail: "product@company.com",
    subject: "New Feature Request",
    preview: "We've received multiple requests from enterprise clients for a...",
    body: "Hi Jeff,\n\nWe've received multiple requests from enterprise clients for a bulk email processing API endpoint. Specifically, Meridian Corp, Atlas Financial, and TechBridge have all independently asked for the ability to process email batches of 10,000+ messages through our classification engine via API.\n\nThe current architecture handles individual email processing well, but batch processing would require: (1) a new queuing system for large payloads, (2) webhook callbacks for completion notifications, (3) rate limiting and priority tiers based on subscription level.\n\nEngineering estimates 6-8 weeks for a production-ready implementation. This would unlock an estimated $500K in additional ARR from the three requesting clients alone, with potential for a new pricing tier.\n\nShould we add this to the Q1 roadmap? It would mean deprioritizing the mobile app refresh.",
    time: "3 days ago",
    label: "FYI",
    draftReply: "Product Team,\n\nThree enterprise clients asking for the same thing independently -- that's a strong signal. Add it to the Q1 roadmap.\n\nThe mobile app refresh can wait. $500K in ARR from known clients takes priority over a UI refresh.\n\nGet me a one-pager on the architecture approach by end of week. I want to make sure the queuing system scales beyond these three clients.\n\nJeff",
  },
  {
    id: 9,
    sender: "IT Security",
    senderEmail: "security@company.com",
    subject: "Security Alert",
    preview: "We detected unusual login activity on the production environment...",
    body: "ALERT - Jeff,\n\nOur monitoring systems detected unusual login activity on the production environment at 03:47 UTC today. Specifically, we observed 47 failed authentication attempts from three IP addresses originating in Eastern Europe, followed by a successful login using a service account credential.\n\nImmediate actions taken: (1) The compromised service account has been disabled. (2) All active sessions for that account have been terminated. (3) We've enabled enhanced logging on all production endpoints. (4) The source IPs have been blocked at the firewall level.\n\nWe need you to: (1) Authorize a full security audit of all service accounts -- estimated 4 hours of downtime for credential rotation. (2) Approve emergency budget for the advanced threat detection platform we evaluated last month ($12,000/year). (3) Review and sign off on the incident report for compliance documentation.\n\nThis is time-sensitive. Please respond within 2 hours.",
    time: "4:15 AM",
    label: "Urgent",
    draftReply: "IT Security,\n\nGood catch and good response. Authorize the full security audit immediately -- schedule the credential rotation for tonight's maintenance window to minimize impact.\n\nThe threat detection platform is approved. Get procurement started today.\n\nI'll review and sign the incident report this morning. Send it to me as soon as it's ready. Also, I want a root cause analysis on how that service account credential was exposed. Set up a post-incident review for tomorrow.\n\nJeff",
  },
  {
    id: 10,
    sender: "Marketing Platform",
    senderEmail: "noreply@bulkmail-platform.com",
    subject: "Newsletter Subscription",
    preview: "You've been subscribed to our weekly marketing insights newsletter...",
    body: "Hi there,\n\nYou've been subscribed to our weekly marketing insights newsletter! Every Tuesday, you'll receive cutting-edge tips on growth hacking, conversion optimization, and AI-powered marketing strategies.\n\nThis week's top articles: '10 Ways AI Is Revolutionizing Email Marketing', 'The Ultimate Guide to Cold Outreach in 2026', and 'Why Your Landing Pages Are Losing 40% of Leads (And How to Fix It)'.\n\nUpgrade to our Premium tier for just $49.99/month and unlock exclusive webinars, templates, and 1-on-1 coaching sessions with industry experts. Use code EARLYBIRD for 20% off your first three months!",
    time: "3 days ago",
    label: "Spam",
    draftReply: "",
  },
];

const labelColors: Record<string, { bg: string; text: string }> = {
  Urgent: { bg: "rgba(239,68,68,0.15)", text: "#EF4444" },
  "Follow-up": { bg: "rgba(249,115,22,0.15)", text: "#F97316" },
  FYI: { bg: "rgba(59,130,246,0.15)", text: "#3B82F6" },
  Spam: { bg: "rgba(107,114,128,0.15)", text: "#6B7280" },
};

/* ------------------------------------------------------------------ */
/*  Dashboard Page                                                    */
/* ------------------------------------------------------------------ */
export default function EmailDashboardPage() {
  const router = useRouter();
  const [selectedEmail, setSelectedEmail] = useState<SampleEmail | null>(null);
  const [activeTab, setActiveTab] = useState<"inbox" | "settings">("inbox");
  const [saving, setSaving] = useState<Record<number, string>>({});

  useEffect(() => {
    // Check auth
    if (!document.cookie.includes("email_auth=authenticated")) {
      router.push("/email/login");
    }
  }, [router]);

  async function handleSaveLead(email: SampleEmail) {
    setSaving((s) => ({ ...s, [email.id]: "lead" }));
    try {
      const res = await fetch("/api/email/save-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderName: email.sender,
          senderEmail: email.senderEmail,
          subject: email.subject,
          body: email.body,
          labels: [email.label],
        }),
      });
      if (res.ok) {
        setSaving((s) => ({ ...s, [email.id]: "lead-done" }));
        setTimeout(() => setSaving((s) => ({ ...s, [email.id]: "" })), 2000);
      }
    } catch {
      setSaving((s) => ({ ...s, [email.id]: "" }));
    }
  }

  async function handleAddTodo(email: SampleEmail) {
    setSaving((s) => ({ ...s, [email.id]: "todo" }));
    try {
      const res = await fetch("/api/email/add-todo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: email.subject,
          body: email.body,
          senderName: email.sender,
          senderEmail: email.senderEmail,
        }),
      });
      if (res.ok) {
        setSaving((s) => ({ ...s, [email.id]: "todo-done" }));
        setTimeout(() => setSaving((s) => ({ ...s, [email.id]: "" })), 2000);
      }
    } catch {
      setSaving((s) => ({ ...s, [email.id]: "" }));
    }
  }

  /* Mobile: selectedEmail acts as full-screen overlay */
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#0A1628", fontFamily: "system-ui, sans-serif", color: "#E2E8F0" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid #1E293B", padding: "12px 16px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12, position: "relative", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <a href="/email" style={{ color: "#F97316", textDecoration: "none", fontWeight: 700, fontSize: 18 }}>Email Tool</a>
          <span style={{ color: "#64748B", fontSize: 13 }}>Dashboard</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => { setActiveTab("inbox"); setSelectedEmail(null); }}
            style={{ padding: "8px 16px", background: activeTab === "inbox" ? "#F97316" : "transparent", color: activeTab === "inbox" ? "#fff" : "#94A3B8", border: "1px solid #1E293B", borderRadius: 6, cursor: "pointer", fontSize: 14, fontWeight: 600 }}
          >
            Inbox
          </button>
          <button
            onClick={() => { setActiveTab("settings"); setSelectedEmail(null); }}
            style={{ padding: "8px 16px", background: activeTab === "settings" ? "#F97316" : "transparent", color: activeTab === "settings" ? "#fff" : "#94A3B8", border: "1px solid #1E293B", borderRadius: 6, cursor: "pointer", fontSize: 14, fontWeight: 600 }}
          >
            Settings
          </button>
        </div>
      </div>

      {activeTab === "settings" ? (
        /* Settings Panel */
        <div style={{ maxWidth: 700, margin: "40px auto", padding: "0 16px" }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 32 }}>Settings</h2>

          <div style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: 12, padding: 20, marginBottom: 20 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Email Connection</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#22C55E", flexShrink: 0 }} />
              <span style={{ color: "#E2E8F0", fontSize: 14 }}>jeff.cline@me.com</span>
              <span style={{ color: "#22C55E", fontSize: 13 }}>Connected</span>
            </div>
            <p style={{ color: "#64748B", fontSize: 13 }}>Last synced: 2 minutes ago</p>
          </div>

          <div style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: 12, padding: 20, marginBottom: 20 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>AI Voice Training</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#F97316", flexShrink: 0 }} />
              <span style={{ color: "#E2E8F0", fontSize: 14 }}>Voice model training</span>
              <span style={{ color: "#F97316", fontSize: 13 }}>In Progress (78%)</span>
            </div>
            <div style={{ background: "#1E293B", borderRadius: 6, height: 8, marginTop: 12 }}>
              <div style={{ background: "#F97316", borderRadius: 6, height: 8, width: "78%" }} />
            </div>
            <p style={{ color: "#64748B", fontSize: 13, marginTop: 12 }}>Analyzing 2,847 sent emails to learn your writing style</p>
          </div>

          <div style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: 12, padding: 20 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Label Configuration</h3>
            {Object.entries(labelColors).map(([label, colors]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #1E293B" }}>
                <span style={{ background: colors.bg, color: colors.text, padding: "4px 12px", borderRadius: 20, fontSize: 13, fontWeight: 600 }}>{label}</span>
                <span style={{ color: "#22C55E", fontSize: 13 }}>Active</span>
              </div>
            ))}
          </div>
        </div>
      ) : isMobile && selectedEmail ? (
        /* Mobile: Full-screen email detail */
        <div style={{ padding: "16px", overflowY: "auto", minHeight: "calc(100vh - 60px)" }}>
          <button
            onClick={() => setSelectedEmail(null)}
            style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", color: "#F97316", fontSize: 14, fontWeight: 600, cursor: "pointer", padding: "8px 0", marginBottom: 16 }}
          >
            &#8592; Back to Inbox
          </button>

          <div style={{ marginBottom: 16 }}>
            <span style={{ background: labelColors[selectedEmail.label].bg, color: labelColors[selectedEmail.label].text, padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{selectedEmail.label}</span>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{selectedEmail.subject}</h2>
          <p style={{ color: "#94A3B8", fontSize: 13, margin: "0 0 20px" }}>
            From: <span style={{ color: "#E2E8F0" }}>{selectedEmail.sender}</span> &lt;{selectedEmail.senderEmail}&gt;
          </p>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            <button
              onClick={() => handleSaveLead(selectedEmail)}
              disabled={saving[selectedEmail.id] === "lead"}
              style={{ padding: "10px 16px", background: saving[selectedEmail.id] === "lead-done" ? "#22C55E" : "#F97316", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 14, fontWeight: 600, flex: "1 1 auto" }}
            >
              {saving[selectedEmail.id] === "lead" ? "Saving..." : saving[selectedEmail.id] === "lead-done" ? "Saved to Leads" : "Save to Leads"}
            </button>
            <button
              onClick={() => handleAddTodo(selectedEmail)}
              disabled={saving[selectedEmail.id] === "todo"}
              style={{ padding: "10px 16px", background: saving[selectedEmail.id] === "todo-done" ? "#22C55E" : "#3B82F6", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 14, fontWeight: 600, flex: "1 1 auto" }}
            >
              {saving[selectedEmail.id] === "todo" ? "Adding..." : saving[selectedEmail.id] === "todo-done" ? "Added to Todo" : "Add to Todo"}
            </button>
          </div>

          {/* Email Body */}
          <div style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: 12, padding: 16, whiteSpace: "pre-wrap", lineHeight: 1.7, fontSize: 14 }}>
            {selectedEmail.body}
          </div>

          {/* AI Draft Reply */}
          {selectedEmail.draftReply && (
            <div style={{ marginTop: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12, color: "#F97316" }}>AI Draft Reply</h3>
              <div style={{ background: "#0F172A", border: "1px solid rgba(249,115,22,0.3)", borderRadius: 12, padding: 16, whiteSpace: "pre-wrap", lineHeight: 1.7, fontSize: 14 }}>
                {selectedEmail.draftReply}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                <button style={{ padding: "10px 16px", background: "#F97316", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600, flex: "1 1 auto" }}>Send Reply</button>
                <button style={{ padding: "10px 16px", background: "transparent", color: "#94A3B8", border: "1px solid #1E293B", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600, flex: "1 1 auto" }}>Edit Draft</button>
                <button style={{ padding: "10px 16px", background: "transparent", color: "#94A3B8", border: "1px solid #1E293B", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600, flex: "1 1 auto" }}>Regenerate</button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Inbox View -- responsive */
        <div style={{ display: "flex", height: "calc(100vh - 60px)" }}>
          {/* Email List -- full width on mobile, fixed width on desktop */}
          <div style={{ width: isMobile ? "100%" : 420, borderRight: isMobile ? "none" : "1px solid #1E293B", overflowY: "auto" }}>
            {sampleEmails.map((email) => (
              <div
                key={email.id}
                onClick={() => setSelectedEmail(email)}
                style={{
                  padding: "14px 16px",
                  borderBottom: "1px solid #1E293B",
                  cursor: "pointer",
                  background: selectedEmail?.id === email.id ? "#0F172A" : "transparent",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{email.sender}</span>
                  <span style={{ color: "#64748B", fontSize: 12, flexShrink: 0, marginLeft: 8 }}>{email.time}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{email.subject}</span>
                  <span style={{ background: labelColors[email.label].bg, color: labelColors[email.label].text, padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0 }}>{email.label}</span>
                </div>
                <p style={{ color: "#64748B", fontSize: 13, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{email.preview}</p>
              </div>
            ))}
          </div>

          {/* Email Detail -- desktop only (mobile uses full-screen overlay above) */}
          {!isMobile && (
            <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px" }}>
              {selectedEmail ? (
                <>
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                      <div>
                        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{selectedEmail.subject}</h2>
                        <p style={{ color: "#94A3B8", fontSize: 14, margin: 0 }}>
                          From: <span style={{ color: "#E2E8F0" }}>{selectedEmail.sender}</span> &lt;{selectedEmail.senderEmail}&gt;
                        </p>
                      </div>
                      <span style={{ background: labelColors[selectedEmail.label].bg, color: labelColors[selectedEmail.label].text, padding: "4px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600 }}>{selectedEmail.label}</span>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
                      <button
                        onClick={() => handleSaveLead(selectedEmail)}
                        disabled={saving[selectedEmail.id] === "lead"}
                        style={{ padding: "8px 18px", background: saving[selectedEmail.id] === "lead-done" ? "#22C55E" : "#F97316", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600 }}
                      >
                        {saving[selectedEmail.id] === "lead" ? "Saving..." : saving[selectedEmail.id] === "lead-done" ? "Saved to Leads" : "Save to Leads"}
                      </button>
                      <button
                        onClick={() => handleAddTodo(selectedEmail)}
                        disabled={saving[selectedEmail.id] === "todo"}
                        style={{ padding: "8px 18px", background: saving[selectedEmail.id] === "todo-done" ? "#22C55E" : "#3B82F6", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600 }}
                      >
                        {saving[selectedEmail.id] === "todo" ? "Adding..." : saving[selectedEmail.id] === "todo-done" ? "Added to Todo" : "Add to Todo"}
                      </button>
                    </div>

                    {/* Email Body */}
                    <div style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: 12, padding: 24, whiteSpace: "pre-wrap", lineHeight: 1.7, fontSize: 15 }}>
                      {selectedEmail.body}
                    </div>
                  </div>

                  {/* AI Draft Reply */}
                  {selectedEmail.draftReply && (
                    <div style={{ marginTop: 24 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: "#F97316" }}>AI Draft Reply</h3>
                      <div style={{ background: "#0F172A", border: "1px solid rgba(249,115,22,0.3)", borderRadius: 12, padding: 24, whiteSpace: "pre-wrap", lineHeight: 1.7, fontSize: 15 }}>
                        {selectedEmail.draftReply}
                      </div>
                      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                        <button style={{ padding: "8px 18px", background: "#F97316", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Send Reply</button>
                        <button style={{ padding: "8px 18px", background: "transparent", color: "#94A3B8", border: "1px solid #1E293B", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Edit Draft</button>
                        <button style={{ padding: "8px 18px", background: "transparent", color: "#94A3B8", border: "1px solid #1E293B", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Regenerate</button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#64748B" }}>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ fontSize: 48, marginBottom: 16 }}>&#9993;</p>
                    <p style={{ fontSize: 18 }}>Select an email to view</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
