"use client";

import { useState, FormEvent } from "react";
import Head from "next/head";

/* ------------------------------------------------------------------ */
/*  FAQ Data                                                          */
/* ------------------------------------------------------------------ */
const faqs = [
  {
    q: "What is a GRC gap assessment?",
    a: "A GRC gap assessment is a systematic evaluation of your organization's current security controls, policies, and procedures against a target compliance standard. It identifies specific areas where your organization falls short of requirements and produces a prioritized remediation roadmap to close those gaps before an audit.",
  },
  {
    q: "How long does a CMMC assessment take?",
    a: "A CMMC gap assessment typically takes 2 to 4 weeks depending on organization size and complexity. Full remediation and certification readiness can take 3 to 6 months. With AI-powered automation, that timeline can be compressed significantly compared to traditional manual assessments.",
  },
  {
    q: "What is the difference between CMMC Level 1 and Level 2?",
    a: "CMMC Level 1 covers basic cyber hygiene practices for protecting Federal Contract Information (FCI) and allows self-assessment. Level 2 requires 110 security controls aligned with NIST 800-171 for organizations handling Controlled Unclassified Information (CUI) and requires third-party C3PAO certification. Phase 1 began November 2025 with self-assessments; Phase 2 starts November 2026 with mandatory third-party certification for applicable contracts.",
  },
  {
    q: "How much does compliance remediation cost?",
    a: "Compliance remediation costs vary based on your current security posture, target standard, and organization size. Typical engagements range from $25,000 for small organizations targeting a single standard to $250,000+ for enterprise-level multi-framework compliance. Remediation after a failed audit typically costs 3x more than proactive preparation.",
  },
  {
    q: "What is a System Security Plan (SSP)?",
    a: "A System Security Plan is a formal document that describes the security controls implemented within an information system. It details the system boundary, environment, security requirements, and how each control is implemented. An SSP is a mandatory deliverable for CMMC, NIST 800-171, and FedRAMP compliance.",
  },
  {
    q: "What is a Plan of Action and Milestones (POA&M)?",
    a: "A POA&M is a document that identifies tasks needing completion to resolve security weaknesses, the resources required, milestones for meeting those tasks, and scheduled completion dates. It serves as a corrective action plan that auditors review to verify your organization is actively addressing known gaps.",
  },
  {
    q: "Do I need SOC 2 or ISO 27001?",
    a: "SOC 2 is primarily used by US-based SaaS and technology companies to demonstrate security controls to customers and prospects. ISO 27001 is an international standard recognized globally. If your customers are primarily US-based, SOC 2 is typically sufficient. If you operate internationally, ISO 27001 may be required. Many organizations pursue both.",
  },
  {
    q: "What happens if I fail a compliance audit?",
    a: "Failing a compliance audit results in a findings report detailing the deficiencies that must be remediated. Depending on the standard, you may face contract loss, financial penalties, or loss of certification. Remediation after failure is significantly more expensive and time-consuming than proactive preparation, and you will need to schedule and pay for a re-assessment.",
  },
  {
    q: "How do I prepare for a CMMC audit?",
    a: "Preparation for a CMMC audit involves completing a gap assessment against NIST 800-171 controls, developing a System Security Plan, creating a POA&M for any open items, implementing all required technical and administrative controls, and conducting internal assessments. Working with a qualified consultant who uses automated compliance tools can reduce preparation time by 60%.",
  },
  {
    q: "What policies and procedures are required for NIST 800-171?",
    a: "NIST 800-171 Rev 2 organized 110 controls across 14 families. The updated Rev 3 expands to 17 control families including Access Control, Awareness and Training, Audit and Accountability, Configuration Management, Identification and Authentication, Incident Response, Maintenance, Media Protection, Personnel Security, Physical Protection, Planning, Risk Assessment, Security Assessment, System and Communications Protection, System and Information Integrity, Supply Chain Risk Management, and Program Management. Each family requires documented policies and implementation procedures.",
  },
  {
    q: "Can AI automate compliance documentation?",
    a: "Yes. AI can analyze your existing security controls, policies, and system configurations to generate compliance documentation including SSPs, POA&Ms, and policy documents tailored to your specific environment. AI-generated documentation is based on your actual data rather than generic templates, resulting in more accurate and audit-ready deliverables.",
  },
  {
    q: "What is continuous monitoring in cybersecurity compliance?",
    a: "Continuous monitoring is the ongoing observation of an organization's security controls to ensure they remain effective over time. It includes automated scanning, log analysis, policy review cycles, and alerting when controls drift from compliance requirements. Continuous monitoring is required by most compliance frameworks and prevents the common problem of passing an audit only to fall out of compliance months later.",
  },
  {
    q: "How often do compliance standards change?",
    a: "Major compliance standards are updated every 2 to 5 years, but interim guidance and clarifications are issued more frequently. NIST publishes revisions and special publications regularly. CMMC transitioned from version 1.0 to 2.0 with significant changes. Organizations with continuous monitoring programs adapt to these changes proactively rather than scrambling when a new version is released.",
  },
  {
    q: "What is the cost of non-compliance?",
    a: "Non-compliance costs organizations 2.71 times more than maintaining compliance programs, with total costs exceeding $14 million when factoring in fines, business disruption, revenue loss, and reputational damage. In 2025, the DOJ collected over $26 million in penalties for DFARS cybersecurity non-compliance alone. HIPAA violations can reach $1.5 million per category per year, and losing a DoD contract due to CMMC non-compliance can represent millions in recurring revenue.",
  },
  {
    q: "How do I choose a GRC consultant?",
    a: "Look for a GRC consultant who offers a full-cycle engagement from gap assessment through audit support and continuous monitoring. Avoid firms that only produce reports without implementation support. Key differentiators include AI-powered documentation generation, real-time compliance dashboards, experience with your target standard, and a track record of first-pass audit success.",
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
  name: "GRC Compliance Tool",
  url: "https://jeff-cline.com/hrc-tool",
  description:
    "AI-powered GRC compliance platform for CMMC, NIST 800-171, SOC 2, ISO 27001, HIPAA, and PCI-DSS. Gap assessment to audit-ready.",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free gap assessment",
  },
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Jeff Cline",
  url: "https://jeff-cline.com",
  description:
    "GRC compliance consulting and AI-powered compliance automation.",
  sameAs: ["https://jeff-cline.com"],
};

/* ------------------------------------------------------------------ */
/*  Standards                                                         */
/* ------------------------------------------------------------------ */
const standards = [
  { name: "CMMC", full: "Cybersecurity Maturity Model Certification" },
  { name: "NIST 800-171", full: "NIST Special Publication 800-171" },
  { name: "SOC 2", full: "SOC 2 Type I & II" },
  { name: "ISO 27001", full: "ISO/IEC 27001" },
  { name: "HIPAA", full: "Health Insurance Portability and Accountability Act" },
  { name: "PCI-DSS", full: "Payment Card Industry Data Security Standard" },
  { name: "FedRAMP", full: "Federal Risk and Authorization Management Program" },
  { name: "StateRAMP", full: "State Risk and Authorization Management Program" },
];

/* ------------------------------------------------------------------ */
/*  Phases                                                            */
/* ------------------------------------------------------------------ */
const phases = [
  {
    num: 1,
    title: "Gap Assessment",
    items: [
      "Compliance quiz mapped to your target standard",
      "Upload existing policies, procedures, screenshots",
      "Automated interview questions based on standard requirements",
      "AI analyzes everything and identifies every gap",
    ],
  },
  {
    num: 2,
    title: "Remediation Roadmap",
    items: [
      "AI-generated report: current status vs. target standard",
      "Executive summary for C-suite stakeholders",
      "Specific remediation steps for each identified gap",
      "Priority-ranked by risk and effort",
      "Deliverable: Remediation Roadmap + Executive Summary",
    ],
  },
  {
    num: 3,
    title: "Remediation & Implementation",
    items: [
      "Our team implements the controls you need",
      "Policies & procedures development (CMMC, NIST, etc.)",
      "System Security Plan (SSP) creation",
      "Plan of Action & Milestones (POA&M)",
      "All documentation generated from your data -- not templates",
    ],
  },
  {
    num: 4,
    title: "Audit Preparation & Support",
    items: [
      "Real-time compliance dashboard showing % complete",
      "Goal: 100% compliant before the auditor walks in",
      "All evidence and documentation organized and accessible",
      "Liaison between your team and audit partners",
      "We handle the auditor relationship so you don't have to",
    ],
  },
  {
    num: 5,
    title: "Continuous Monitoring",
    items: [
      "Post-audit compliance management",
      "Policy and procedure updates as standards evolve",
      "Control drift detection and alerts",
      "Ongoing support to maintain certification",
      "Never scramble for an audit again",
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Differentiators                                                   */
/* ------------------------------------------------------------------ */
const differentiators = [
  {
    title: "Not a Binder. A System.",
    text: "Most GRC consultants hand you a report and disappear. We build the system, implement the controls, and stay through the audit.",
  },
  {
    title: "AI-Generated Documentation",
    text: "Policies, SSPs, and POA&Ms generated from YOUR data, not generic templates copy-pasted from the internet.",
  },
  {
    title: "Executive Visibility",
    text: "C-suite gets a dashboard, not a 200-page PDF. Real-time compliance status they can actually understand.",
  },
  {
    title: "We Don't Leave After the Audit",
    text: "Continuous monitoring means you never fall out of compliance. One tool. One team. Forever compliant.",
  },
];

/* ------------------------------------------------------------------ */
/*  Compliance Readiness Quiz                                         */
/* ------------------------------------------------------------------ */
const quizQuestions = [
  {
    q: "Does your organization have documented information security policies and procedures?",
    options: [
      { text: "Yes, fully documented and regularly reviewed", score: 3 },
      { text: "Partially documented, not regularly reviewed", score: 2 },
      { text: "Informal / undocumented", score: 1 },
      { text: "No policies in place", score: 0 },
    ],
  },
  {
    q: "Do you have a System Security Plan (SSP) for systems handling sensitive data?",
    options: [
      { text: "Yes, complete and current", score: 3 },
      { text: "In progress or outdated", score: 2 },
      { text: "We know we need one but haven't started", score: 1 },
      { text: "What is an SSP?", score: 0 },
    ],
  },
  {
    q: "How does your organization manage access controls?",
    options: [
      { text: "Role-based access with MFA, regular access reviews", score: 3 },
      { text: "Basic access controls, some MFA", score: 2 },
      { text: "Password-only, no formal access management", score: 1 },
      { text: "Everyone has admin access", score: 0 },
    ],
  },
  {
    q: "Do you conduct regular security awareness training for employees?",
    options: [
      { text: "Yes, at least annually with phishing tests", score: 3 },
      { text: "Occasional training, no testing", score: 2 },
      { text: "Only during onboarding", score: 1 },
      { text: "No training program", score: 0 },
    ],
  },
  {
    q: "How do you handle incident response?",
    options: [
      { text: "Documented IR plan, tested regularly, designated team", score: 3 },
      { text: "We have a plan but haven't tested it", score: 2 },
      { text: "Ad-hoc response, no formal plan", score: 1 },
      { text: "We would figure it out if something happened", score: 0 },
    ],
  },
  {
    q: "Do you maintain audit logs and monitor system activity?",
    options: [
      { text: "Centralized logging, SIEM, regular review", score: 3 },
      { text: "Some logging in place, reviewed occasionally", score: 2 },
      { text: "Default system logs only, rarely checked", score: 1 },
      { text: "No logging or monitoring", score: 0 },
    ],
  },
  {
    q: "How do you manage configuration and change management?",
    options: [
      { text: "Formal change management process with approval workflows", score: 3 },
      { text: "Some change tracking, informal process", score: 2 },
      { text: "Changes made as needed, no tracking", score: 1 },
      { text: "No configuration management", score: 0 },
    ],
  },
  {
    q: "Do you have a Plan of Action & Milestones (POA&M) for known gaps?",
    options: [
      { text: "Yes, actively tracked and updated", score: 3 },
      { text: "We have one but it is outdated", score: 2 },
      { text: "We track gaps informally", score: 1 },
      { text: "No gap tracking process", score: 0 },
    ],
  },
  {
    q: "How do you protect data at rest and in transit?",
    options: [
      { text: "Full encryption at rest and in transit, key management policy", score: 3 },
      { text: "Some encryption (TLS for web, some at rest)", score: 2 },
      { text: "Encryption only where required by tools", score: 1 },
      { text: "No encryption strategy", score: 0 },
    ],
  },
  {
    q: "When was your last risk assessment?",
    options: [
      { text: "Within the last 12 months", score: 3 },
      { text: "1-2 years ago", score: 2 },
      { text: "More than 2 years ago", score: 1 },
      { text: "Never conducted one", score: 0 },
    ],
  },
];

function getQuizResult(score: number): { label: string; color: string; desc: string } {
  const pct = Math.round((score / 30) * 100);
  if (pct >= 80) return { label: "Audit-Ready", color: "#22C55E", desc: "Your organization shows strong compliance maturity. A gap assessment would identify the final items needed for a clean audit. You are close to certification." };
  if (pct >= 60) return { label: "On Track", color: "#3B82F6", desc: "You have a solid foundation but gaps remain. A structured remediation roadmap would get you audit-ready in weeks. Most organizations at this stage need help with documentation and POA&M tracking." };
  if (pct >= 35) return { label: "Significant Gaps", color: "#F97316", desc: "Critical compliance gaps exist across multiple control families. Without intervention, you would likely fail an audit. The good news: a phased remediation approach can get you compliant systematically." };
  return { label: "High Risk", color: "#EF4444", desc: "Your organization is at serious compliance risk. Most foundational controls are missing. You need a comprehensive gap assessment and full remediation program immediately -- especially with CMMC Phase 2 deadlines approaching November 2026." };
}

/* ------------------------------------------------------------------ */
/*  Chart Data                                                        */
/* ------------------------------------------------------------------ */
const breachCostByIndustry = [
  { industry: "Healthcare", cost: 10.93 },
  { industry: "Financial", cost: 6.08 },
  { industry: "Technology", cost: 5.45 },
  { industry: "Energy", cost: 5.29 },
  { industry: "Industrial", cost: 5.14 },
  { industry: "Pharma", cost: 4.97 },
  { industry: "Professional Svcs", cost: 4.73 },
  { industry: "Global Average", cost: 4.44 },
];

const complianceReadiness = [
  { label: "Self-Assessment Only", pct: 69, color: "#EF4444" },
  { label: "Medium/High Assessment", pct: 30, color: "#F97316" },
  { label: "Fully CMMC-Ready", pct: 1, color: "#22C55E" },
];

const attackVectors = [
  { label: "Stolen Credentials", pct: 30, color: "#F97316" },
  { label: "Phishing", pct: 16, color: "#3B82F6" },
  { label: "Third-Party/Supply Chain", pct: 15, color: "#A855F7" },
  { label: "Vulnerability Exploit", pct: 14, color: "#EF4444" },
  { label: "Misconfiguration", pct: 12, color: "#06B6D4" },
  { label: "Other", pct: 13, color: "#64748B" },
];

const breachCostTrend = [
  { year: "2020", cost: 3.86 },
  { year: "2021", cost: 4.24 },
  { year: "2022", cost: 4.35 },
  { year: "2023", cost: 4.45 },
  { year: "2024", cost: 4.88 },
  { year: "2025", cost: 4.44 },
];

const statCards = [
  { value: "$10.22M", label: "US Average Breach Cost", sub: "Record high -- IBM 2025" },
  { value: "241", label: "Days to Identify + Contain a Breach", sub: "Average breach lifecycle -- IBM 2025" },
  { value: "2.71x", label: "Cost Multiplier for Non-Compliance", sub: "vs. maintaining compliance -- Ponemon/Secureframe" },
  { value: "71%", label: "Fail Their First Compliance Audit", sub: "Across all frameworks -- Tekpon 2026" },
  { value: "$14M+", label: "Total Cost of Non-Compliance", sub: "Fines, disruption, revenue loss -- Ponemon" },
  { value: "1%", label: "Defense Contractors Fully CMMC-Ready", sub: "State of the DIB -- CyberSheath 2025" },
];

/* ------------------------------------------------------------------ */
/*  SVG Chart Components                                              */
/* ------------------------------------------------------------------ */

function BreachCostBarChart() {
  const maxCost = 10.93;
  const barHeight = 36;
  const gap = 10;
  const labelWidth = 130;
  const chartWidth = 600;
  const totalHeight = breachCostByIndustry.length * (barHeight + gap) + 10;

  return (
    <svg
      viewBox={`0 0 ${labelWidth + chartWidth + 80} ${totalHeight}`}
      style={{ width: "100%", maxWidth: 780, display: "block", margin: "0 auto" }}
      role="img"
      aria-label="Breach cost by industry horizontal bar chart"
    >
      {breachCostByIndustry.map((d, i) => {
        const y = i * (barHeight + gap);
        const barW = (d.cost / maxCost) * chartWidth;
        const isAverage = d.industry === "Global Average";
        return (
          <g key={d.industry}>
            <text
              x={labelWidth - 8}
              y={y + barHeight / 2 + 5}
              textAnchor="end"
              fill={isAverage ? "#94A3B8" : "#E2E8F0"}
              fontSize="13"
              fontWeight={isAverage ? 400 : 600}
              fontFamily="system-ui, sans-serif"
            >
              {d.industry}
            </text>
            <rect
              x={labelWidth}
              y={y}
              width={barW}
              height={barHeight}
              rx={4}
              fill={isAverage ? "#334155" : "#F97316"}
              opacity={isAverage ? 0.6 : 1 - i * 0.06}
            />
            <text
              x={labelWidth + barW + 8}
              y={y + barHeight / 2 + 5}
              fill={isAverage ? "#94A3B8" : "#F97316"}
              fontSize="14"
              fontWeight="700"
              fontFamily="system-ui, sans-serif"
            >
              ${d.cost.toFixed(2)}M
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function DonutChart({
  data,
  size = 220,
  strokeWidth = 36,
  centerText,
  centerSub,
}: {
  data: { label: string; pct: number; color: string }[];
  size?: number;
  strokeWidth?: number;
  centerText?: string;
  centerSub?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  let accumulated = 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ maxWidth: "100%" }}>
        {/* Background ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#1E293B"
          strokeWidth={strokeWidth}
        />
        {data.map((segment) => {
          const offset = accumulated;
          accumulated += segment.pct;
          const dashLength = (segment.pct / 100) * circumference;
          const dashOffset = -((offset / 100) * circumference) + circumference * 0.25;
          return (
            <circle
              key={segment.label}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dashLength} ${circumference - dashLength}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="butt"
              style={{ transition: "stroke-dasharray 0.6s ease" }}
            />
          );
        })}
        {centerText && (
          <>
            <text
              x={center}
              y={center - 6}
              textAnchor="middle"
              fill="#F97316"
              fontSize="28"
              fontWeight="800"
              fontFamily="system-ui, sans-serif"
            >
              {centerText}
            </text>
            {centerSub && (
              <text
                x={center}
                y={center + 16}
                textAnchor="middle"
                fill="#94A3B8"
                fontSize="11"
                fontFamily="system-ui, sans-serif"
              >
                {centerSub}
              </text>
            )}
          </>
        )}
      </svg>
      {/* Legend */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 16 }}>
        {data.map((segment) => (
          <div key={segment.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 2,
                background: segment.color,
                flexShrink: 0,
              }}
            />
            <span style={{ color: "#CBD5E1", fontSize: "0.85rem" }}>
              {segment.label}{" "}
              <span style={{ color: segment.color, fontWeight: 700 }}>{segment.pct}%</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BreachCostTrendChart() {
  const maxCost = 5.0;
  const minCost = 3.5;
  const chartW = 560;
  const chartH = 220;
  const barWidth = 60;
  const gap = 28;
  const totalBarsWidth = breachCostTrend.length * barWidth + (breachCostTrend.length - 1) * gap;
  const offsetX = (chartW - totalBarsWidth) / 2;

  return (
    <svg
      viewBox={`0 0 ${chartW} ${chartH + 50}`}
      style={{ width: "100%", maxWidth: 620, display: "block", margin: "0 auto" }}
      role="img"
      aria-label="Global average breach cost trend 2020-2025"
    >
      {/* Grid lines */}
      {[3.5, 4.0, 4.5, 5.0].map((v) => {
        const y = chartH - ((v - minCost) / (maxCost - minCost)) * chartH;
        return (
          <g key={v}>
            <line x1={0} y1={y} x2={chartW} y2={y} stroke="#1E293B" strokeWidth={1} />
            <text x={0} y={y - 4} fill="#64748B" fontSize="11" fontFamily="system-ui, sans-serif">
              ${v.toFixed(1)}M
            </text>
          </g>
        );
      })}
      {breachCostTrend.map((d, i) => {
        const barH = ((d.cost - minCost) / (maxCost - minCost)) * chartH;
        const x = offsetX + i * (barWidth + gap);
        const y = chartH - barH;
        const isPeak = d.year === "2024";
        const isDrop = d.year === "2025";
        let fill = "#F97316";
        if (isPeak) fill = "#EF4444";
        if (isDrop) fill = "#22C55E";
        return (
          <g key={d.year}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barH}
              rx={4}
              fill={fill}
              opacity={isPeak || isDrop ? 1 : 0.75}
            />
            <text
              x={x + barWidth / 2}
              y={y - 8}
              textAnchor="middle"
              fill={fill}
              fontSize="13"
              fontWeight="700"
              fontFamily="system-ui, sans-serif"
            >
              ${d.cost.toFixed(2)}M
            </text>
            <text
              x={x + barWidth / 2}
              y={chartH + 20}
              textAnchor="middle"
              fill="#94A3B8"
              fontSize="12"
              fontWeight="600"
              fontFamily="system-ui, sans-serif"
            >
              {d.year}
            </text>
            {isPeak && (
              <text
                x={x + barWidth / 2}
                y={chartH + 38}
                textAnchor="middle"
                fill="#EF4444"
                fontSize="10"
                fontWeight="600"
                fontFamily="system-ui, sans-serif"
              >
                PEAK
              </text>
            )}
            {isDrop && (
              <text
                x={x + barWidth / 2}
                y={chartH + 38}
                textAnchor="middle"
                fill="#22C55E"
                fontSize="10"
                fontWeight="600"
                fontFamily="system-ui, sans-serif"
              >
                -9% DROP
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */
export default function HrcToolPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    companySize: "",
    targetStandard: [] as string[],
    currentStatus: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  /* quiz state */
  const [quizStep, setQuizStep] = useState(-1);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const quizScore = quizAnswers.reduce((a, b) => a + b, 0);
  const quizDone = quizAnswers.length === quizQuestions.length;

  const handleStandardToggle = (std: string) => {
    setForm((prev) => ({
      ...prev,
      targetStandard: prev.targetStandard.includes(std)
        ? prev.targetStandard.filter((s) => s !== std)
        : [...prev.targetStandard, std],
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/hrc-tool/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again or contact us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  /* Shared styles */
  const sectionPad: React.CSSProperties = { padding: "100px 20px" };
  const sectionAlt: React.CSSProperties = { ...sectionPad, background: "#0F172A" };
  const sectionInner: React.CSSProperties = { maxWidth: 1100, margin: "0 auto" };
  const sectionH2: React.CSSProperties = {
    fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
    fontWeight: 800,
    textAlign: "center" as const,
    marginBottom: 16,
    letterSpacing: "-0.02em",
  };
  const sectionSub: React.CSSProperties = {
    textAlign: "center" as const,
    color: "#94A3B8",
    marginBottom: 56,
    fontSize: "1.1rem",
    maxWidth: 700,
    margin: "0 auto 56px",
    lineHeight: 1.6,
  };
  const citation: React.CSSProperties = {
    color: "#64748B",
    fontSize: "0.75rem",
    textAlign: "center" as const,
    marginTop: 20,
    fontStyle: "italic" as const,
  };

  return (
    <>
      <Head>
        <title>
          GRC Compliance Tool - Gap Assessment to Audit Ready | Jeff Cline
        </title>
        <meta
          name="description"
          content="AI-powered GRC compliance tool. From CMMC gap assessment to NIST 800-171 remediation to SOC 2 preparation. Automated compliance documentation, audit support, and continuous monitoring."
        />
        <meta
          name="keywords"
          content="GRC tool, compliance automation, CMMC gap assessment, NIST 800-171 remediation, SOC 2 preparation, ISO 27001, HIPAA compliance, PCI-DSS, compliance dashboard"
        />
        <link rel="canonical" href="https://jeff-cline.com/hrc-tool" />
      </Head>

      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />

      <div style={{ background: "#0A1628", color: "#fff", minHeight: "100vh" }}>

        {/* ============================================================ */}
        {/*  1. HERO                                                     */}
        {/* ============================================================ */}
        <section
          style={{
            padding: "120px 20px 100px",
            textAlign: "center",
            maxWidth: 1000,
            margin: "0 auto",
            position: "relative",
          }}
        >
          {/* Subtle radial glow */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 600,
              height: 600,
              background: "radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              display: "inline-block",
              background: "rgba(249,115,22,0.1)",
              border: "1px solid rgba(249,115,22,0.25)",
              borderRadius: 100,
              padding: "8px 24px",
              marginBottom: 32,
              fontSize: "0.85rem",
              color: "#F97316",
              fontWeight: 600,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            AI-Powered Compliance Platform
          </div>
          <h1
            style={{
              fontSize: "clamp(2.2rem, 5.5vw, 4rem)",
              fontWeight: 900,
              lineHeight: 1.05,
              marginBottom: 28,
              letterSpacing: "-0.03em",
            }}
          >
            GRC Compliance.{" "}
            <span style={{ color: "#F97316" }}>Automated.</span>
            <br />
            Audited. Done.
          </h1>
          <p
            style={{
              fontSize: "clamp(1.05rem, 2.5vw, 1.3rem)",
              color: "#94A3B8",
              maxWidth: 720,
              margin: "0 auto 48px",
              lineHeight: 1.65,
            }}
          >
            From gap assessment to audit-ready in weeks, not months. AI-powered
            compliance for CMMC, NIST, SOC 2, ISO 27001, HIPAA, and PCI-DSS.
          </p>
          <div
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <a
              href="#lead-form"
              style={{
                background: "#F97316",
                color: "#fff",
                padding: "18px 40px",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: "1.1rem",
                textDecoration: "none",
                boxShadow: "0 4px 24px rgba(249,115,22,0.3)",
              }}
            >
              Start Your Gap Assessment
            </a>
            <a
              href="#process"
              style={{
                border: "2px solid rgba(249,115,22,0.5)",
                color: "#F97316",
                padding: "18px 40px",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: "1.1rem",
                textDecoration: "none",
              }}
            >
              See How It Works
            </a>
          </div>
          {/* Inline trust bar */}
          <div
            style={{
              marginTop: 56,
              display: "flex",
              gap: 32,
              justifyContent: "center",
              flexWrap: "wrap",
              opacity: 0.6,
            }}
          >
            {["CMMC", "NIST 800-171", "SOC 2", "ISO 27001", "HIPAA", "PCI-DSS"].map((s) => (
              <span
                key={s}
                style={{
                  color: "#64748B",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/*  2. THE NUMBERS DON'T LIE - Stat Callout Cards              */}
        {/* ============================================================ */}
        <section style={sectionAlt}>
          <div style={sectionInner}>
            <h2 style={sectionH2}>
              The Numbers Don&apos;t{" "}
              <span style={{ color: "#F97316" }}>Lie</span>
            </h2>
            <p style={sectionSub}>
              Real data from IBM, Verizon, CyberSheath, and Ponemon. This is the
              current state of cybersecurity compliance -- and why doing nothing
              is the most expensive option.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: 24,
              }}
            >
              {statCards.map((card) => (
                <div
                  key={card.label}
                  style={{
                    background: "#0A1628",
                    borderRadius: 16,
                    padding: "40px 32px",
                    border: "1px solid #1E293B",
                    textAlign: "center",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Top accent line */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 3,
                      background: "linear-gradient(90deg, #F97316, rgba(249,115,22,0.2))",
                    }}
                  />
                  <div
                    style={{
                      fontSize: "clamp(2.2rem, 4vw, 3rem)",
                      fontWeight: 900,
                      color: "#F97316",
                      marginBottom: 8,
                      letterSpacing: "-0.02em",
                      lineHeight: 1,
                    }}
                  >
                    {card.value}
                  </div>
                  <div
                    style={{
                      color: "#E2E8F0",
                      fontSize: "1rem",
                      fontWeight: 600,
                      marginBottom: 8,
                      lineHeight: 1.4,
                    }}
                  >
                    {card.label}
                  </div>
                  <div
                    style={{
                      color: "#64748B",
                      fontSize: "0.75rem",
                      lineHeight: 1.4,
                    }}
                  >
                    {card.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/*  3. BREACH COST BY INDUSTRY - Bar Chart                     */}
        {/* ============================================================ */}
        <section style={sectionPad}>
          <div style={sectionInner}>
            <h2 style={sectionH2}>
              Breach Cost by{" "}
              <span style={{ color: "#F97316" }}>Industry</span>
            </h2>
            <p style={sectionSub}>
              Healthcare leads at $10.93M per breach -- nearly 2.5x the global
              average. Every industry exceeds $4M. These are not theoretical
              risks. These are measured costs from real incidents in 2025.
            </p>
            <div
              style={{
                background: "#0F172A",
                borderRadius: 16,
                padding: "40px 32px",
                border: "1px solid #1E293B",
              }}
            >
              <BreachCostBarChart />
              <p style={citation}>
                Source: IBM Cost of a Data Breach Report 2025
              </p>
            </div>
            {/* Supporting stats row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 20,
                marginTop: 32,
              }}
            >
              {[
                { stat: "$10.22M", label: "US Average (Record High)" },
                { stat: "292 Days", label: "Stolen Credential Resolution" },
                { stat: "44%", label: "Breaches Involving Ransomware" },
              ].map((s) => (
                <div
                  key={s.label}
                  style={{
                    background: "#0F172A",
                    borderRadius: 12,
                    padding: "24px 20px",
                    border: "1px solid #1E293B",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{ fontSize: "1.5rem", fontWeight: 800, color: "#F97316", marginBottom: 4 }}
                  >
                    {s.stat}
                  </div>
                  <div style={{ color: "#94A3B8", fontSize: "0.85rem" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/*  4. THE COMPLIANCE GAP - Donut Charts Side by Side          */}
        {/* ============================================================ */}
        <section style={sectionAlt}>
          <div style={sectionInner}>
            <h2 style={sectionH2}>
              The Compliance{" "}
              <span style={{ color: "#F97316" }}>Gap</span>
            </h2>
            <p style={sectionSub}>
              Only 1% of defense contractors are fully CMMC-ready. Meanwhile,
              stolen credentials account for 30% of all initial access in
              breaches. The gap between where organizations are and where they
              need to be is staggering.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: 32,
              }}
            >
              {/* CMMC Readiness Donut */}
              <div
                style={{
                  background: "#0A1628",
                  borderRadius: 16,
                  padding: "40px 32px",
                  border: "1px solid #1E293B",
                  textAlign: "center",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.15rem",
                    fontWeight: 700,
                    marginBottom: 24,
                    color: "#E2E8F0",
                  }}
                >
                  CMMC Readiness Across the DIB
                </h3>
                <DonutChart
                  data={complianceReadiness}
                  centerText="1%"
                  centerSub="Fully Ready"
                />
                <p style={citation}>
                  Source: CyberSheath State of the DIB 2025
                </p>
              </div>
              {/* Attack Vectors Donut */}
              <div
                style={{
                  background: "#0A1628",
                  borderRadius: 16,
                  padding: "40px 32px",
                  border: "1px solid #1E293B",
                  textAlign: "center",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.15rem",
                    fontWeight: 700,
                    marginBottom: 24,
                    color: "#E2E8F0",
                  }}
                >
                  Initial Attack Vectors in Breaches
                </h3>
                <DonutChart
                  data={attackVectors}
                  centerText="30%"
                  centerSub="Stolen Creds"
                />
                <p style={citation}>
                  Source: IBM / Verizon DBIR 2025
                </p>
              </div>
            </div>
            {/* Extra stats row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 20,
                marginTop: 32,
              }}
            >
              {[
                { stat: "68%", label: "Breaches involve the human element", src: "Verizon DBIR" },
                { stat: "32.4%", label: "Organizations fully PCI-DSS compliant", src: "Verizon" },
                { stat: "69%", label: "Say regulations are too complex", src: "Thomson Reuters" },
                { stat: "52%", label: "Boards with compliance oversight", src: "Deloitte" },
              ].map((s) => (
                <div
                  key={s.label}
                  style={{
                    background: "#0F172A",
                    borderRadius: 12,
                    padding: "20px 16px",
                    border: "1px solid #1E293B",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#F97316" }}>
                    {s.stat}
                  </div>
                  <div style={{ color: "#CBD5E1", fontSize: "0.8rem", marginBottom: 4, lineHeight: 1.4 }}>
                    {s.label}
                  </div>
                  <div style={{ color: "#475569", fontSize: "0.7rem" }}>{s.src}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/*  5. BREACH COST TREND                                       */}
        {/* ============================================================ */}
        <section style={sectionPad}>
          <div style={sectionInner}>
            <h2 style={sectionH2}>
              Breach Cost{" "}
              <span style={{ color: "#F97316" }}>Trend</span>
            </h2>
            <p style={sectionSub}>
              Global average breach costs climbed steadily from $3.86M in 2020 to
              a peak of $4.88M in 2024. The 2025 drop to $4.44M is the first
              decline in five years -- attributed to AI-driven detection and
              faster incident response. Costs remain historically elevated.
            </p>
            <div
              style={{
                background: "#0F172A",
                borderRadius: 16,
                padding: "40px 32px",
                border: "1px solid #1E293B",
              }}
            >
              <BreachCostTrendChart />
              <p style={citation}>
                Source: IBM Cost of a Data Breach Reports 2020-2025
              </p>
            </div>
            {/* Timeline context */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: 20,
                marginTop: 32,
              }}
            >
              {[
                { stat: "$10.5T", label: "Projected annual cybercrime cost", src: "Cybersecurity Ventures" },
                { stat: "$26M+", label: "DOJ penalties for DFARS non-compliance in 2025", src: "DOJ" },
                { stat: "443/day", label: "GDPR breach reports across EU", src: "DLA Piper 2025" },
              ].map((s) => (
                <div
                  key={s.label}
                  style={{
                    background: "#0F172A",
                    borderRadius: 12,
                    padding: "24px 20px",
                    border: "1px solid #1E293B",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#F97316" }}>
                    {s.stat}
                  </div>
                  <div style={{ color: "#CBD5E1", fontSize: "0.82rem", marginBottom: 4, lineHeight: 1.4 }}>
                    {s.label}
                  </div>
                  <div style={{ color: "#475569", fontSize: "0.7rem" }}>{s.src}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/*  6. THE PROBLEM                                              */}
        {/* ============================================================ */}
        <section style={sectionAlt}>
          <div style={{ ...sectionInner, textAlign: "center" as const }}>
            <h2 style={sectionH2}>
              Most Companies <span style={{ color: "#F97316" }}>Fail</span>{" "}
              Their First Audit
            </h2>
            <p style={sectionSub}>
              71% of organizations fail their first compliance audit. Not because
              compliance is impossible -- but because it is treated as a one-time
              event instead of a system.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 24,
                marginBottom: 48,
              }}
            >
              {[
                {
                  stat: "71%",
                  label: "Fail their first compliance audit",
                  detail: "Across CMMC, SOC 2, ISO 27001, and HIPAA",
                },
                {
                  stat: "2.71x",
                  label: "Cost multiplier for non-compliance",
                  detail: "Reactive remediation vs. proactive programs",
                },
                {
                  stat: "241 Days",
                  label: "Average breach lifecycle",
                  detail: "Time to identify and contain -- IBM 2025",
                },
              ].map((s) => (
                <div
                  key={s.stat}
                  style={{
                    background: "#0A1628",
                    borderRadius: 16,
                    padding: 36,
                    border: "1px solid #1E293B",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 3,
                      background: "#F97316",
                    }}
                  />
                  <div
                    style={{
                      fontSize: "2.8rem",
                      fontWeight: 900,
                      color: "#F97316",
                      marginBottom: 8,
                      lineHeight: 1,
                    }}
                  >
                    {s.stat}
                  </div>
                  <div style={{ color: "#E2E8F0", fontSize: "1rem", fontWeight: 600, marginBottom: 8 }}>
                    {s.label}
                  </div>
                  <div style={{ color: "#64748B", fontSize: "0.8rem" }}>
                    {s.detail}
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                background: "#0A1628",
                borderRadius: 16,
                padding: "36px 32px",
                border: "1px solid #1E293B",
                maxWidth: 780,
                margin: "0 auto",
                textAlign: "left" as const,
              }}
            >
              <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: 16, color: "#E2E8F0" }}>
                Why Companies Fail
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: 12,
                }}
              >
                {[
                  "Compliance treated as a one-time project instead of an ongoing system",
                  "Consultants who deliver binders and disappear with no implementation support",
                  "Generic template-based documentation that doesn't reflect actual controls",
                  "No executive visibility into real-time compliance posture",
                  "Manual processes that can't scale across multiple frameworks",
                  "No continuous monitoring -- passing an audit then immediately drifting",
                ].map((item) => (
                  <div
                    key={item}
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "flex-start",
                      color: "#94A3B8",
                      fontSize: "0.9rem",
                      lineHeight: 1.5,
                    }}
                  >
                    <span style={{ color: "#EF4444", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>x</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/*  7. COMPLIANCE READINESS QUIZ                                */}
        {/* ============================================================ */}
        <section style={{ ...sectionPad, background: "#0A1628" }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <h2
              style={{
                fontSize: "2rem",
                fontWeight: 800,
                textAlign: "center",
                color: "#fff",
                marginBottom: 8,
              }}
            >
              Compliance Readiness{" "}
              <span style={{ color: "#F97316" }}>Assessment</span>
            </h2>
            <p
              style={{
                textAlign: "center",
                color: "rgba(255,255,255,0.6)",
                marginBottom: 40,
                fontSize: "1.05rem",
              }}
            >
              10 questions. 2 minutes. Find out where you stand before the
              auditor does.
            </p>

            {quizStep === -1 ? (
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    background: "#0F172A",
                    borderRadius: 16,
                    padding: "48px 32px",
                    border: "1px solid rgba(249,115,22,0.2)",
                    maxWidth: 500,
                    margin: "0 auto",
                  }}
                >
                  <div
                    style={{
                      fontSize: "3rem",
                      fontWeight: 900,
                      color: "#F97316",
                      marginBottom: 8,
                      lineHeight: 1,
                    }}
                  >
                    10
                  </div>
                  <div style={{ color: "#CBD5E1", fontSize: "1rem", marginBottom: 4 }}>
                    Questions across key control families
                  </div>
                  <div style={{ color: "#64748B", fontSize: "0.85rem", marginBottom: 32 }}>
                    Access Control, Incident Response, Encryption, Risk Assessment, and more
                  </div>
                  <button
                    onClick={() => setQuizStep(0)}
                    style={{
                      background: "#F97316",
                      color: "#fff",
                      border: "none",
                      padding: "16px 48px",
                      borderRadius: 10,
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      boxShadow: "0 4px 24px rgba(249,115,22,0.3)",
                    }}
                  >
                    Start Assessment
                  </button>
                </div>
              </div>
            ) : !quizDone ? (
              <div
                style={{
                  background: "#0F172A",
                  borderRadius: 16,
                  padding: 32,
                  border: "1px solid rgba(249,115,22,0.2)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      color: "#F97316",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                    }}
                  >
                    Question {quizStep + 1} of {quizQuestions.length}
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem" }}>
                    {Math.round(((quizStep) / quizQuestions.length) * 100)}% complete
                  </span>
                </div>
                {/* Progress bar */}
                <div
                  style={{
                    width: "100%",
                    height: 4,
                    background: "#1E293B",
                    borderRadius: 2,
                    marginBottom: 24,
                  }}
                >
                  <div
                    style={{
                      width: `${(quizStep / quizQuestions.length) * 100}%`,
                      height: 4,
                      background: "#F97316",
                      borderRadius: 2,
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
                <h3
                  style={{
                    color: "#fff",
                    fontSize: "1.2rem",
                    fontWeight: 600,
                    marginBottom: 20,
                    lineHeight: 1.5,
                  }}
                >
                  {quizQuestions[quizStep].q}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {quizQuestions[quizStep].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setQuizAnswers([...quizAnswers, opt.score]);
                        setQuizStep(quizStep + 1);
                      }}
                      style={{
                        background: "#1E293B",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 10,
                        padding: "14px 20px",
                        color: "rgba(255,255,255,0.85)",
                        fontSize: "0.95rem",
                        textAlign: "left",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#F97316";
                        e.currentTarget.style.background = "rgba(249,115,22,0.08)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                        e.currentTarget.style.background = "#1E293B";
                      }}
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              (() => {
                const result = getQuizResult(quizScore);
                const pct = Math.round((quizScore / 30) * 100);
                return (
                  <div
                    style={{
                      background: "#0F172A",
                      borderRadius: 16,
                      padding: 40,
                      border: `1px solid ${result.color}33`,
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "3.5rem",
                        fontWeight: 900,
                        color: result.color,
                        marginBottom: 4,
                      }}
                    >
                      {pct}%
                    </div>
                    <div
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: 700,
                        color: result.color,
                        marginBottom: 16,
                      }}
                    >
                      {result.label}
                    </div>
                    <p
                      style={{
                        color: "rgba(255,255,255,0.7)",
                        lineHeight: 1.7,
                        maxWidth: 600,
                        margin: "0 auto 24px",
                        fontSize: "1.05rem",
                      }}
                    >
                      {result.desc}
                    </p>
                    <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                      <a
                        href="#lead-form"
                        style={{
                          background: "#F97316",
                          color: "#fff",
                          padding: "14px 32px",
                          borderRadius: 10,
                          fontWeight: 700,
                          textDecoration: "none",
                          fontSize: "1rem",
                          boxShadow: "0 4px 24px rgba(249,115,22,0.3)",
                        }}
                      >
                        Get Your Full Gap Assessment
                      </a>
                      <button
                        onClick={() => {
                          setQuizStep(-1);
                          setQuizAnswers([]);
                        }}
                        style={{
                          background: "transparent",
                          color: "rgba(255,255,255,0.5)",
                          padding: "14px 24px",
                          borderRadius: 10,
                          border: "1px solid rgba(255,255,255,0.15)",
                          fontWeight: 600,
                          cursor: "pointer",
                          fontSize: "1rem",
                        }}
                      >
                        Retake Quiz
                      </button>
                    </div>
                    <div
                      style={{
                        marginTop: 32,
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: 12,
                        maxWidth: 500,
                        margin: "32px auto 0",
                      }}
                    >
                      {[
                        { label: "High Risk", range: "0-34%", color: "#EF4444" },
                        { label: "Significant Gaps", range: "35-59%", color: "#F97316" },
                        { label: "On Track", range: "60-79%", color: "#3B82F6" },
                        { label: "Audit-Ready", range: "80-100%", color: "#22C55E" },
                      ].map((tier) => (
                        <div
                          key={tier.label}
                          style={{
                            padding: "8px 4px",
                            borderRadius: 8,
                            background:
                              result.label === tier.label
                                ? `${tier.color}15`
                                : "transparent",
                            border:
                              result.label === tier.label
                                ? `1px solid ${tier.color}40`
                                : "1px solid transparent",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "0.7rem",
                              fontWeight: 700,
                              color:
                                result.label === tier.label
                                  ? tier.color
                                  : "rgba(255,255,255,0.3)",
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                            }}
                          >
                            {tier.label}
                          </div>
                          <div
                            style={{
                              fontSize: "0.65rem",
                              color: "rgba(255,255,255,0.3)",
                              marginTop: 2,
                            }}
                          >
                            {tier.range}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()
            )}
          </div>
        </section>

        {/* ============================================================ */}
        {/*  8. 5-PHASE PROCESS                                         */}
        {/* ============================================================ */}
        <section id="process" style={sectionAlt}>
          <div style={sectionInner}>
            <h2 style={sectionH2}>
              The 5-Phase <span style={{ color: "#F97316" }}>Process</span>
            </h2>
            <p style={sectionSub}>
              From first assessment to continuous compliance. Every phase is
              tracked, measured, and documented.
            </p>
            <div style={{ display: "grid", gap: 20 }}>
              {phases.map((phase) => (
                <div
                  key={phase.num}
                  style={{
                    background: "#0A1628",
                    borderRadius: 16,
                    padding: 32,
                    border: "1px solid #1E293B",
                    display: "grid",
                    gridTemplateColumns: "64px 1fr",
                    gap: 24,
                    alignItems: "start",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Left accent */}
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 3,
                      background: "#F97316",
                    }}
                  />
                  <div
                    style={{
                      background: "#F97316",
                      color: "#fff",
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: "1.25rem",
                      flexShrink: 0,
                    }}
                  >
                    {phase.num}
                  </div>
                  <div>
                    <h3
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: 700,
                        marginBottom: 12,
                      }}
                    >
                      {phase.title}
                    </h3>
                    <ul
                      style={{
                        listStyle: "none",
                        padding: 0,
                        margin: 0,
                        display: "grid",
                        gap: 8,
                      }}
                    >
                      {phase.items.map((item) => (
                        <li
                          key={item}
                          style={{
                            color: "#94A3B8",
                            paddingLeft: 20,
                            position: "relative",
                            lineHeight: 1.5,
                          }}
                        >
                          <span
                            style={{
                              position: "absolute",
                              left: 0,
                              color: "#F97316",
                            }}
                          >
                            --
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/*  9. STANDARDS                                                */}
        {/* ============================================================ */}
        <section style={sectionPad}>
          <div style={{ ...sectionInner, textAlign: "center" as const }}>
            <h2 style={sectionH2}>
              Standards We <span style={{ color: "#F97316" }}>Support</span>
            </h2>
            <p style={sectionSub}>
              Full-cycle compliance support across all major frameworks. One team,
              multiple certifications.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 20,
              }}
            >
              {standards.map((s) => (
                <div
                  key={s.name}
                  style={{
                    background: "#0F172A",
                    borderRadius: 12,
                    padding: 24,
                    border: "1px solid #1E293B",
                    textAlign: "center",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 2,
                      background: "#F97316",
                      opacity: 0.4,
                    }}
                  />
                  <div
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 800,
                      color: "#F97316",
                      marginBottom: 8,
                    }}
                  >
                    {s.name}
                  </div>
                  <div style={{ color: "#94A3B8", fontSize: "0.85rem" }}>
                    {s.full}
                  </div>
                </div>
              ))}
            </div>
            {/* CMMC Timeline callout */}
            <div
              style={{
                marginTop: 40,
                background: "#0F172A",
                borderRadius: 16,
                padding: "32px 28px",
                border: "1px solid rgba(249,115,22,0.2)",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: 24,
                textAlign: "left" as const,
              }}
            >
              <div>
                <div style={{ color: "#F97316", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: 8 }}>
                  CMMC Timeline
                </div>
                <div style={{ color: "#CBD5E1", fontSize: "0.9rem", lineHeight: 1.6 }}>
                  Phase 1 began November 2025 with self-assessments. Phase 2 starts
                  November 2026 with mandatory third-party C3PAO certification for
                  applicable DoD contracts.
                </div>
              </div>
              <div>
                <div style={{ color: "#F97316", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: 8 }}>
                  NIST 800-171 Rev 3
                </div>
                <div style={{ color: "#CBD5E1", fontSize: "0.9rem", lineHeight: 1.6 }}>
                  Expanded from 14 to 17 control families. New families include
                  Supply Chain Risk Management, Planning, and Program Management.
                  Organizations need to map existing controls to the new structure.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/*  10. EXECUTIVE DASHBOARD PREVIEW                            */}
        {/* ============================================================ */}
        <section style={sectionAlt}>
          <div style={sectionInner}>
            <h2 style={sectionH2}>
              Executive{" "}
              <span style={{ color: "#F97316" }}>Dashboard</span> Preview
            </h2>
            <p style={sectionSub}>
              Real-time compliance visibility for leadership. No more 200-page
              PDFs that nobody reads.
            </p>
            <div
              style={{
                background: "#0A1628",
                borderRadius: 16,
                border: "1px solid #1E293B",
                padding: 40,
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: 20,
                  marginBottom: 32,
                }}
              >
                {[
                  { label: "Overall Compliance", value: "78%", color: "#F97316" },
                  { label: "Critical Gaps", value: "3", color: "#EF4444" },
                  { label: "High Gaps", value: "7", color: "#F59E0B" },
                  { label: "Medium Gaps", value: "12", color: "#3B82F6" },
                  { label: "Low Gaps", value: "5", color: "#22C55E" },
                ].map((m) => (
                  <div
                    key={m.label}
                    style={{
                      background: "#0F172A",
                      borderRadius: 10,
                      padding: 20,
                      textAlign: "center",
                      border: "1px solid #1E293B",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "2rem",
                        fontWeight: 800,
                        color: m.color,
                      }}
                    >
                      {m.value}
                    </div>
                    <div style={{ color: "#94A3B8", fontSize: "0.85rem", marginTop: 4 }}>
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
              <h3
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  marginBottom: 16,
                  color: "#CBD5E1",
                }}
              >
                Client Pipeline
              </h3>
              <div style={{ display: "grid", gap: 12 }}>
                {[
                  { client: "Acme Corp", phase: "Phase 3: Remediation", pct: 62 },
                  { client: "GlobalTech Inc", phase: "Phase 4: Audit Prep", pct: 89 },
                  { client: "SecureData LLC", phase: "Phase 2: Roadmap", pct: 34 },
                  { client: "DefensePro", phase: "Phase 5: Monitoring", pct: 100 },
                ].map((c) => (
                  <div
                    key={c.client}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "140px 1fr 60px",
                      gap: 16,
                      alignItems: "center",
                    }}
                  >
                    <span style={{ color: "#E2E8F0", fontSize: "0.9rem" }}>
                      {c.client}
                    </span>
                    <div
                      style={{
                        background: "#1E293B",
                        borderRadius: 6,
                        height: 8,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${c.pct}%`,
                          height: "100%",
                          background:
                            c.pct === 100
                              ? "#22C55E"
                              : c.pct > 75
                              ? "#F97316"
                              : "#3B82F6",
                          borderRadius: 6,
                          transition: "width 0.5s",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        color: "#94A3B8",
                        fontSize: "0.85rem",
                        textAlign: "right",
                      }}
                    >
                      {c.pct}%
                    </span>
                  </div>
                ))}
              </div>
              <p
                style={{
                  color: "#64748B",
                  fontSize: "0.8rem",
                  marginTop: 24,
                  textAlign: "center",
                  fontStyle: "italic",
                }}
              >
                Real-time compliance percentage per standard. Client pipeline
                view. Gap severity tracking. Document status. Audit milestones.
              </p>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/*  11. WHY DIFFERENT                                          */}
        {/* ============================================================ */}
        <section style={sectionPad}>
          <div style={sectionInner}>
            <h2 style={sectionH2}>
              Why This Is{" "}
              <span style={{ color: "#F97316" }}>Different</span>
            </h2>
            <p style={sectionSub}>
              We are not a report factory. We build compliance systems that
              survive beyond the audit.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 24,
              }}
            >
              {differentiators.map((d) => (
                <div
                  key={d.title}
                  style={{
                    background: "#0F172A",
                    borderRadius: 16,
                    padding: 32,
                    border: "1px solid #1E293B",
                    borderTop: "3px solid #F97316",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1.15rem",
                      fontWeight: 700,
                      marginBottom: 12,
                    }}
                  >
                    {d.title}
                  </h3>
                  <p style={{ color: "#94A3B8", lineHeight: 1.6 }}>{d.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/*  12. SOCIAL PROOF / STATS                                   */}
        {/* ============================================================ */}
        <section style={sectionAlt}>
          <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
            <h2 style={sectionH2}>
              By the <span style={{ color: "#F97316" }}>Numbers</span>
            </h2>
            <p style={sectionSub}>
              Track record that speaks for itself.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 32,
              }}
            >
              {[
                { stat: "50+", label: "Audits Supported" },
                { stat: "6 Weeks", label: "Avg. Gap Assessment to Audit-Ready" },
                { stat: "94%", label: "First-Pass Audit Success Rate" },
                { stat: "8", label: "Compliance Standards Covered" },
              ].map((s) => (
                <div key={s.label}>
                  <div
                    style={{
                      fontSize: "2.8rem",
                      fontWeight: 900,
                      color: "#F97316",
                      lineHeight: 1,
                    }}
                  >
                    {s.stat}
                  </div>
                  <div style={{ color: "#94A3B8", marginTop: 8, fontSize: "0.95rem" }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/*  13. FAQ                                                     */}
        {/* ============================================================ */}
        <section style={sectionPad}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <h2 style={sectionH2}>
              Frequently Asked{" "}
              <span style={{ color: "#F97316" }}>Questions</span>
            </h2>
            <p style={sectionSub}>
              15 questions covering everything from CMMC timelines to AI-powered
              documentation.
            </p>
            <div style={{ display: "grid", gap: 8 }}>
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  style={{
                    background: "#0F172A",
                    borderRadius: 10,
                    border: "1px solid #1E293B",
                    overflow: "hidden",
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{
                      width: "100%",
                      padding: "20px 24px",
                      background: "none",
                      border: "none",
                      color: "#E2E8F0",
                      fontSize: "1rem",
                      fontWeight: 600,
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>{faq.q}</span>
                    <span
                      style={{
                        color: "#F97316",
                        fontSize: "1.25rem",
                        flexShrink: 0,
                        marginLeft: 16,
                        transform:
                          openFaq === i ? "rotate(45deg)" : "rotate(0deg)",
                        transition: "transform 0.2s",
                      }}
                    >
                      +
                    </span>
                  </button>
                  {openFaq === i && (
                    <div
                      style={{
                        padding: "0 24px 20px",
                        color: "#94A3B8",
                        lineHeight: 1.7,
                      }}
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/*  14. LEAD FORM                                               */}
        {/* ============================================================ */}
        <section id="lead-form" style={{ ...sectionAlt }}>
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <h2
              style={{
                ...sectionH2,
                marginBottom: 8,
              }}
            >
              Start Your Free{" "}
              <span style={{ color: "#F97316" }}>Gap Assessment</span>
            </h2>
            <p
              style={{
                textAlign: "center",
                color: "#94A3B8",
                marginBottom: 40,
              }}
            >
              Fill out the form below and we will schedule your complimentary
              compliance gap assessment.
            </p>

            {submitted ? (
              <div
                style={{
                  background: "#0A1628",
                  borderRadius: 16,
                  padding: 48,
                  textAlign: "center",
                  border: "1px solid #22C55E",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    marginBottom: 12,
                    color: "#22C55E",
                  }}
                >
                  Request Received
                </h3>
                <p style={{ color: "#94A3B8" }}>
                  We will be in touch within 24 hours to schedule your gap
                  assessment.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                style={{
                  background: "#0A1628",
                  borderRadius: 16,
                  padding: 40,
                  border: "1px solid #1E293B",
                  display: "grid",
                  gap: 20,
                }}
              >
                {/* Name row */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: 6,
                        fontSize: "0.85rem",
                        color: "#CBD5E1",
                        fontWeight: 600,
                      }}
                    >
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.firstName}
                      onChange={(e) =>
                        setForm({ ...form, firstName: e.target.value })
                      }
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: 6,
                        fontSize: "0.85rem",
                        color: "#CBD5E1",
                        fontWeight: 600,
                      }}
                    >
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.lastName}
                      onChange={(e) =>
                        setForm({ ...form, lastName: e.target.value })
                      }
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 6,
                      fontSize: "0.85rem",
                      color: "#CBD5E1",
                      fontWeight: 600,
                    }}
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 6,
                      fontSize: "0.85rem",
                      color: "#CBD5E1",
                      fontWeight: 600,
                    }}
                  >
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 6,
                      fontSize: "0.85rem",
                      color: "#CBD5E1",
                      fontWeight: 600,
                    }}
                  >
                    Company
                  </label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) =>
                      setForm({ ...form, company: e.target.value })
                    }
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 6,
                      fontSize: "0.85rem",
                      color: "#CBD5E1",
                      fontWeight: 600,
                    }}
                  >
                    Company Size
                  </label>
                  <select
                    value={form.companySize}
                    onChange={(e) =>
                      setForm({ ...form, companySize: e.target.value })
                    }
                    style={inputStyle}
                  >
                    <option value="">Select...</option>
                    <option value="1-50">1-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="500+">500+ employees</option>
                  </select>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 10,
                      fontSize: "0.85rem",
                      color: "#CBD5E1",
                      fontWeight: 600,
                    }}
                  >
                    Target Standard(s)
                  </label>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 10,
                    }}
                  >
                    {[
                      "CMMC",
                      "NIST 800-171",
                      "SOC 2",
                      "ISO 27001",
                      "HIPAA",
                      "PCI-DSS",
                      "Other",
                    ].map((std) => (
                      <button
                        type="button"
                        key={std}
                        onClick={() => handleStandardToggle(std)}
                        style={{
                          padding: "8px 16px",
                          borderRadius: 6,
                          border: form.targetStandard.includes(std)
                            ? "2px solid #F97316"
                            : "1px solid #334155",
                          background: form.targetStandard.includes(std)
                            ? "rgba(249,115,22,0.15)"
                            : "#0F172A",
                          color: form.targetStandard.includes(std)
                            ? "#F97316"
                            : "#94A3B8",
                          cursor: "pointer",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          transition: "all 0.15s",
                        }}
                      >
                        {std}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 6,
                      fontSize: "0.85rem",
                      color: "#CBD5E1",
                      fontWeight: 600,
                    }}
                  >
                    Current Compliance Status
                  </label>
                  <select
                    value={form.currentStatus}
                    onChange={(e) =>
                      setForm({ ...form, currentStatus: e.target.value })
                    }
                    style={inputStyle}
                  >
                    <option value="">Select...</option>
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Failed Audit">Failed Audit</option>
                    <option value="Renewal">Renewal</option>
                  </select>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 6,
                      fontSize: "0.85rem",
                      color: "#CBD5E1",
                      fontWeight: 600,
                    }}
                  >
                    Message (optional)
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    rows={4}
                    style={{ ...inputStyle, resize: "vertical" as const }}
                  />
                </div>

                {error && (
                  <p style={{ color: "#EF4444", fontSize: "0.9rem" }}>
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    background: submitting ? "#92400E" : "#F97316",
                    color: "#fff",
                    padding: "16px 32px",
                    borderRadius: 10,
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    border: "none",
                    cursor: submitting ? "not-allowed" : "pointer",
                    boxShadow: submitting ? "none" : "0 4px 24px rgba(249,115,22,0.3)",
                    transition: "all 0.2s",
                  }}
                >
                  {submitting ? "Submitting..." : "Request Gap Assessment"}
                </button>
              </form>
            )}
          </div>
        </section>

        {/* ============================================================ */}
        {/*  FOOTER                                                      */}
        {/* ============================================================ */}
        <footer
          style={{
            borderTop: "1px solid #1E293B",
            padding: "40px 20px",
            textAlign: "center",
          }}
        >
          <p style={{ color: "#64748B", fontSize: "0.85rem" }}>
            &copy; {new Date().getFullYear()} Jeff Cline. All rights reserved.
          </p>
          <a
            href="https://jeff-cline.com"
            style={{
              color: "#64748B",
              fontSize: "6px",
              opacity: 0.08,
              textDecoration: "none",
            }}
          >
            JC
          </a>
        </footer>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Shared input styles                                               */
/* ------------------------------------------------------------------ */
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: 8,
  border: "1px solid #334155",
  background: "#0A1628",
  color: "#E2E8F0",
  fontSize: "1rem",
  outline: "none",
  boxSizing: "border-box",
};
