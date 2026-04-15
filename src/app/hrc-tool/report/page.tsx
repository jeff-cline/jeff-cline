"use client";

import { useEffect, useState } from "react";

interface FamilyScore {
  family: string;
  score: number;
  maxScore: number;
  pct: number;
  status: string;
  color: string;
  gaps: string[];
}

interface Remediation {
  priority: number;
  family: string;
  pct: number;
  recommendation: string;
}

interface CrossFrameworkScore {
  standard: string;
  estimatedPct: number;
  status: string;
}

interface AssessmentData {
  standard: string;
  standardLabel: string;
  name: string;
  email: string;
  company: string;
  overallPct: number;
  families: FamilyScore[];
  remediation: Remediation[];
  crossFramework?: CrossFrameworkScore[];
  date: string;
}

function statusColor(pct: number) {
  if (pct >= 80) return "#22C55E";
  if (pct >= 60) return "#3B82F6";
  if (pct >= 35) return "#F97316";
  return "#EF4444";
}

function getExecutiveSummary(data: AssessmentData): string {
  const { company, standardLabel, overallPct, families } = data;
  const compliant = families.filter((f) => f.pct >= 80).length;
  const partial = families.filter((f) => f.pct >= 35 && f.pct < 80).length;
  const nonCompliant = families.filter((f) => f.pct < 35).length;
  const total = families.length;

  if (overallPct >= 80) {
    return `${company} demonstrates a strong compliance posture against the ${standardLabel} framework, achieving an overall score of ${overallPct}%. Of the ${total} control families assessed, ${compliant} are fully compliant${partial > 0 ? ` and ${partial} show partial implementation` : ""}. Minor gaps exist and should be addressed to achieve full compliance. A targeted remediation plan is provided below to close remaining gaps.`;
  }
  if (overallPct >= 60) {
    return `${company} shows moderate compliance against the ${standardLabel} framework with an overall score of ${overallPct}%. While ${compliant} of ${total} control families meet compliance thresholds, ${partial} families require additional implementation effort${nonCompliant > 0 ? ` and ${nonCompliant} ${nonCompliant === 1 ? "family has" : "families have"} critical deficiencies` : ""}. A structured remediation roadmap is recommended to address identified gaps within 90-180 days.`;
  }
  if (overallPct >= 35) {
    return `${company} has significant compliance gaps against the ${standardLabel} framework, with an overall score of ${overallPct}%. Only ${compliant} of ${total} control families meet compliance thresholds, with ${partial + nonCompliant} families requiring substantial remediation. Immediate action is recommended to address critical deficiencies, particularly in ${families.sort((a, b) => a.pct - b.pct).slice(0, 2).map((f) => f.family).join(" and ")}. A phased 6-12 month remediation program is strongly advised.`;
  }
  return `${company} faces critical compliance deficiencies against the ${standardLabel} framework, achieving only ${overallPct}% overall compliance. ${nonCompliant} of ${total} control families are non-compliant, indicating foundational security controls are missing or inadequate. Immediate executive attention and a comprehensive 12-18 month remediation program are required. Engagement with qualified GRC consultants is strongly recommended to establish baseline controls and develop a realistic compliance roadmap.`;
}

function getTimeline(overallPct: number): string {
  if (overallPct >= 80) return "30-60 days for minor gap closure";
  if (overallPct >= 60) return "90-180 days for structured remediation";
  if (overallPct >= 35) return "6-12 months for phased remediation program";
  return "12-18 months for comprehensive compliance program";
}

function getRemediationDetail(family: string, gaps: string[]): string {
  if (gaps.length === 0) return `Strengthen existing controls in ${family} to meet full compliance thresholds.`;
  return gaps.map((g) => {
    const short = g.length > 120 ? g.substring(0, 120) + "..." : g;
    return `- ${short}`;
  }).join("\n");
}

// Generate a narrative sentence for each cross-framework estimated score
function getCrossFrameworkNarrative(standard: string, estimatedPct: number, assessedStandard: string): string {
  if (estimatedPct >= 80) {
    return `${standard}: Estimated ${estimatedPct}% compliant. Your ${assessedStandard} controls transfer strongly to this framework. Minor gap closure may be needed to achieve full certification readiness.`;
  }
  if (estimatedPct >= 60) {
    return `${standard}: Estimated ${estimatedPct}% compliant. Significant control overlap exists from your ${assessedStandard} implementation. Targeted remediation in framework-specific areas would close remaining gaps within a structured timeline.`;
  }
  if (estimatedPct >= 35) {
    return `${standard}: Estimated ${estimatedPct}% compliant. While foundational controls carry over from ${assessedStandard}, substantial additional implementation is required in areas unique to this framework.`;
  }
  return `${standard}: Estimated ${estimatedPct}% compliant. Limited control overlap with ${assessedStandard} means a dedicated compliance program would be needed to achieve this certification.`;
}

export default function ReportPage() {
  const [data, setData] = useState<AssessmentData | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("hrc_assessment");
    if (stored) {
      setData(JSON.parse(stored));
    }
  }, []);

  if (!data) {
    return (
      <div style={{ padding: 80, textAlign: "center", fontFamily: "system-ui" }}>
        <p>No assessment data found. Please complete an assessment first.</p>
        <a href="/hrc-tool/assess" style={{ color: "#F97316" }}>Start Assessment</a>
      </div>
    );
  }

  const reportDate = new Date(data.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; }
          @page { margin: 0.75in; size: letter; }
        }
        .report-body { font-family: 'Georgia', 'Times New Roman', serif; color: #1a1a1a; max-width: 800px; margin: 0 auto; padding: 40px 32px; background: #fff; line-height: 1.6; }
        .report-body h1 { font-family: system-ui, sans-serif; }
        .report-body h2 { font-family: system-ui, sans-serif; font-size: 20px; font-weight: 700; border-bottom: 2px solid #F97316; padding-bottom: 6px; margin-top: 40px; margin-bottom: 16px; color: #0A1628; }
        .report-body h3 { font-family: system-ui, sans-serif; font-size: 16px; font-weight: 600; margin-top: 20px; margin-bottom: 8px; color: #334155; }
        .report-body p { margin: 0 0 12px 0; font-size: 14px; }
        .report-body table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; }
        .report-body th { text-align: left; padding: 10px 12px; background: #F1F5F9; border-bottom: 2px solid #CBD5E1; font-family: system-ui, sans-serif; font-weight: 600; color: #334155; }
        .report-body td { padding: 10px 12px; border-bottom: 1px solid #E2E8F0; }
      `}</style>

      {/* Print button */}
      <div className="no-print" style={{ background: "#0A1628", padding: "16px 24px", textAlign: "center" }}>
        <button
          onClick={() => window.print()}
          style={{
            background: "#F97316", border: "none", borderRadius: 8,
            padding: "12px 32px", color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer", marginRight: 12,
          }}
        >
          Print / Save as PDF
        </button>
        <button
          onClick={() => window.close()}
          style={{
            background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 8,
            padding: "12px 24px", color: "#E2E8F0", fontSize: 15, cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>

      <div className="report-body">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40, paddingBottom: 24, borderBottom: "3px solid #F97316" }}>
          <div style={{ fontFamily: "system-ui, sans-serif", fontSize: 32, fontWeight: 800, color: "#F97316", letterSpacing: 2 }}>
            JEFF CLINE
          </div>
          <div style={{ fontSize: 14, color: "#64748B", marginTop: 4, fontFamily: "system-ui, sans-serif" }}>
            Governance, Risk & Compliance Advisory
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#0A1628", marginTop: 24, marginBottom: 4 }}>
            GRC Compliance Gap Assessment Report
          </h1>
          <div style={{ fontSize: 14, color: "#64748B" }}>
            {data.standardLabel}
          </div>
        </div>

        {/* Meta info */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 32, fontSize: 14 }}>
          <div><strong>Prepared for:</strong> {data.company}</div>
          <div><strong>Date:</strong> {reportDate}</div>
          <div><strong>Contact:</strong> {data.name}</div>
          <div><strong>Framework:</strong> {data.standardLabel}</div>
        </div>

        {/* Executive Summary */}
        <h2>Executive Summary</h2>
        <p>{getExecutiveSummary(data)}</p>

        {/* Overall Score */}
        <h2>Overall Compliance Score</h2>
        <div style={{ textAlign: "center", margin: "24px 0" }}>
          <svg viewBox="0 0 200 120" style={{ width: 240, height: 144 }}>
            {/* Background arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="#E2E8F0"
              strokeWidth={12}
              strokeLinecap="round"
            />
            {/* Score arc */}
            <path
              d={`M 20 100 A 80 80 0 ${data.overallPct > 50 ? 1 : 0} 1 ${20 + 160 * Math.sin((data.overallPct / 100) * Math.PI) * (data.overallPct <= 50 ? 1 : 1)} ${100 - 80 * Math.sin((data.overallPct / 100) * Math.PI) + (80 - 80 * Math.cos((data.overallPct / 100) * Math.PI)) * 0}`}
              fill="none"
              stroke={statusColor(data.overallPct)}
              strokeWidth={12}
              strokeLinecap="round"
              strokeDasharray={`${(data.overallPct / 100) * 251.3} 251.3`}
            />
            <text x={100} y={85} textAnchor="middle" fontSize={36} fontWeight={700} fill={statusColor(data.overallPct)} fontFamily="system-ui">
              {data.overallPct}%
            </text>
            <text x={100} y={105} textAnchor="middle" fontSize={11} fill="#64748B" fontFamily="system-ui">
              Overall Compliance
            </text>
          </svg>
        </div>

        {/* Score by Control Family */}
        <h2>Compliance Score by Control Family</h2>
        <table>
          <thead>
            <tr>
              <th>Control Family</th>
              <th style={{ width: "35%" }}>Score</th>
              <th style={{ width: 60, textAlign: "right" }}>%</th>
              <th style={{ width: 100, textAlign: "center" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.families.map((f) => (
              <tr key={f.family}>
                <td style={{ fontWeight: 500 }}>{f.family}</td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ flex: 1, height: 14, background: "#F1F5F9", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${f.pct}%`, background: f.color, borderRadius: 3 }} />
                    </div>
                  </div>
                </td>
                <td style={{ textAlign: "right", fontWeight: 600, color: f.color }}>{f.pct}%</td>
                <td style={{ textAlign: "center" }}>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 10,
                    background: `${f.color}18`, color: f.color,
                  }}>
                    {f.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Gap Analysis */}
        <h2>Gap Analysis</h2>
        {data.families.filter((f) => f.pct < 80).length === 0 ? (
          <p>All control families meet compliance thresholds. Continue to monitor and maintain existing controls.</p>
        ) : (
          data.families.filter((f) => f.pct < 80).sort((a, b) => a.pct - b.pct).map((f) => (
            <div key={f.family} style={{ marginBottom: 20 }}>
              <h3>
                {f.family} -- {f.pct}%
                <span style={{ marginLeft: 8, fontSize: 12, fontWeight: 600, color: f.color }}>({f.status})</span>
              </h3>
              {f.gaps.length > 0 ? (
                <div style={{ fontSize: 13, marginLeft: 16 }}>
                  <p style={{ fontWeight: 600, marginBottom: 4 }}>Identified Gaps:</p>
                  <ul style={{ margin: "0 0 8px 0", paddingLeft: 20 }}>
                    {f.gaps.map((g, i) => (
                      <li key={i} style={{ marginBottom: 4 }}>{g}</li>
                    ))}
                  </ul>
                  <p style={{ fontWeight: 600, marginBottom: 4 }}>Remediation Recommendation:</p>
                  <p>Implement controls to address the above gaps. Establish documented policies, assign ownership, and schedule regular reviews to ensure ongoing compliance with {f.family} requirements.</p>
                </div>
              ) : (
                <p style={{ fontSize: 13, marginLeft: 16 }}>Controls are partially implemented. Strengthen existing measures to achieve full compliance threshold.</p>
              )}
            </div>
          ))
        )}

        {/* Prioritized Remediation Roadmap */}
        <h2>Prioritized Remediation Roadmap</h2>
        <p>The following remediation items are prioritized by severity, addressing the most critical gaps first:</p>
        {data.remediation.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th style={{ width: 60 }}>Priority</th>
                <th>Control Family</th>
                <th style={{ width: 80, textAlign: "right" }}>Current</th>
                <th>Action Required</th>
              </tr>
            </thead>
            <tbody>
              {data.remediation.map((r) => (
                <tr key={r.priority}>
                  <td style={{ fontWeight: 700, color: "#F97316" }}>#{r.priority}</td>
                  <td style={{ fontWeight: 500 }}>{r.family}</td>
                  <td style={{ textAlign: "right", fontWeight: 600, color: statusColor(r.pct) }}>{r.pct}%</td>
                  <td style={{ fontSize: 12 }}>{r.recommendation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No critical remediation items identified. Maintain current controls and continue monitoring.</p>
        )}

        {/* Timeline */}
        <h2>Estimated Remediation Timeline</h2>
        <p>Based on the current compliance posture, the estimated timeline for achieving full compliance is: <strong>{getTimeline(data.overallPct)}</strong>.</p>
        <p>This estimate assumes dedicated resources, executive sponsorship, and engagement with qualified GRC professionals. Actual timelines may vary based on organizational complexity, resource availability, and the scope of infrastructure changes required.</p>

        {/* Cross-Framework Compliance Analysis */}
        {data.crossFramework && data.crossFramework.length > 0 && (
          <>
            <h2>Cross-Framework Compliance Analysis</h2>
            <p>
              Based on your {data.standardLabel} assessment, your organization&apos;s controls provide estimated coverage across the following additional frameworks. This analysis identifies the most efficient path to multi-framework compliance.
            </p>

            <table>
              <thead>
                <tr>
                  <th>Standard</th>
                  <th style={{ width: "35%" }}>Estimated Compliance</th>
                  <th style={{ width: 80, textAlign: "right" }}>%</th>
                  <th style={{ width: 100, textAlign: "center" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {/* Assessed standard first */}
                <tr style={{ background: "#FFF7ED" }}>
                  <td style={{ fontWeight: 600 }}>{data.standardLabel} (Assessed)</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ flex: 1, height: 14, background: "#F1F5F9", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${data.overallPct}%`, background: statusColor(data.overallPct), borderRadius: 3 }} />
                      </div>
                    </div>
                  </td>
                  <td style={{ textAlign: "right", fontWeight: 600, color: statusColor(data.overallPct) }}>{data.overallPct}%</td>
                  <td style={{ textAlign: "center" }}>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 10, background: `${statusColor(data.overallPct)}18`, color: statusColor(data.overallPct) }}>
                      Actual
                    </span>
                  </td>
                </tr>
                {data.crossFramework.map((cf) => (
                  <tr key={cf.standard}>
                    <td style={{ fontWeight: 500 }}>{cf.standard}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ flex: 1, height: 14, background: "#F1F5F9", borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${cf.estimatedPct}%`, background: statusColor(cf.estimatedPct), borderRadius: 3 }} />
                        </div>
                      </div>
                    </td>
                    <td style={{ textAlign: "right", fontWeight: 600, color: statusColor(cf.estimatedPct) }}>{cf.estimatedPct}%</td>
                    <td style={{ textAlign: "center" }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 10, background: `${statusColor(cf.estimatedPct)}18`, color: statusColor(cf.estimatedPct) }}>
                        {cf.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3>Framework-Specific Analysis</h3>
            {data.crossFramework.map((cf) => (
              <p key={cf.standard} style={{ fontSize: 13, marginBottom: 8 }}>
                {getCrossFrameworkNarrative(cf.standard, cf.estimatedPct, data.standardLabel)}
              </p>
            ))}

            <p style={{ fontSize: 12, color: "#64748B", marginTop: 16 }}>
              Estimates are derived from control family overlap analysis between compliance frameworks and represent approximate coverage based on the assessed controls. Actual compliance determination requires framework-specific assessment.
            </p>
          </>
        )}

        {/* Next Steps */}
        <h2>Recommended Next Steps</h2>
        <ol style={{ fontSize: 14, paddingLeft: 20, lineHeight: 2 }}>
          <li>Review this report with your executive leadership and security team</li>
          <li>Prioritize remediation based on the roadmap above</li>
          <li>Assign ownership for each control family gap</li>
          <li>Establish a timeline with milestones and accountability</li>
          <li>Schedule a remediation consultation to develop a detailed implementation plan</li>
        </ol>

        <div style={{ marginTop: 24, padding: 20, background: "#FFF7ED", border: "1px solid #FDBA74", borderRadius: 8, fontSize: 14 }}>
          <strong style={{ color: "#F97316" }}>Ready to close your compliance gaps?</strong>
          <p style={{ marginTop: 8 }}>
            Contact Jeff Cline for a personalized remediation consultation and implementation roadmap.
          </p>
          <p style={{ marginBottom: 0 }}>
            Email: jeff@jeff-cline.com | Phone: (223) 400-8146 | Web: jeff-cline.com
          </p>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 48, paddingTop: 16, borderTop: "1px solid #CBD5E1", textAlign: "center", fontSize: 11, color: "#94A3B8" }}>
          Confidential - Prepared by Jeff Cline | jeff-cline.com | (223) 400-8146
        </div>
      </div>
    </>
  );
}
