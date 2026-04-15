"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const C = {
  deepOcean: "#0A1628", caribbean: "#0891B2", seafoam: "#2DD4BF",
  coral: "#F97316", white: "#FFFFFF", gold: "#D4A843", lightText: "#CBD5E1", pink: "#EC4899",
};

interface AppData {
  name: string; email: string; phone: string; company: string;
  answers: { id: number; category: string; question: string; answer: string }[];
  scores: Record<string, number>;
  overall: number;
  recommendation: string;
  keywords: string[];
}

function ScoreBar({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{ fontSize: "13px", fontFamily: "sans-serif", color: C.lightText, letterSpacing: "1px" }}>{label}</span>
        <span style={{ fontSize: "13px", fontFamily: "sans-serif", color, fontWeight: 700 }}>{score}%</span>
      </div>
      <div style={{ height: "8px", background: "rgba(255,255,255,0.08)", borderRadius: "4px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${score}%`, background: color, borderRadius: "4px", transition: "width 1.5s ease" }} />
      </div>
    </div>
  );
}

function RadarChart({ scores }: { scores: Record<string, number> }) {
  const categories = Object.keys(scores);
  const n = categories.length;
  const cx = 150, cy = 150, r = 120;

  const points = categories.map((_, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const val = scores[categories[i]] / 100;
    return { x: cx + r * val * Math.cos(angle), y: cy + r * val * Math.sin(angle) };
  });

  const gridLevels = [0.25, 0.5, 0.75, 1];

  return (
    <svg viewBox="0 0 300 300" style={{ width: "100%", maxWidth: "320px", margin: "0 auto", display: "block" }}>
      {/* Grid */}
      {gridLevels.map(level => (
        <polygon key={level}
          points={categories.map((_, i) => {
            const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
            return `${cx + r * level * Math.cos(angle)},${cy + r * level * Math.sin(angle)}`;
          }).join(" ")}
          fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1"
        />
      ))}
      {/* Axes */}
      {categories.map((cat, i) => {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
        const ex = cx + r * Math.cos(angle);
        const ey = cy + r * Math.sin(angle);
        const lx = cx + (r + 20) * Math.cos(angle);
        const ly = cy + (r + 20) * Math.sin(angle);
        return (
          <g key={cat}>
            <line x1={cx} y1={cy} x2={ex} y2={ey} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fill={C.lightText} fontSize="8" fontFamily="sans-serif">
              {cat.split(" ")[0]}
            </text>
          </g>
        );
      })}
      {/* Data polygon */}
      <polygon
        points={points.map(p => `${p.x},${p.y}`).join(" ")}
        fill="rgba(8,145,178,0.2)" stroke={C.caribbean} strokeWidth="2"
      />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill={C.seafoam} />
      ))}
    </svg>
  );
}

function ReportContent() {
  const searchParams = useSearchParams();
  const appId = searchParams.get("id");
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [readySubmitted, setReadySubmitted] = useState(false);
  const [creditsRequested, setCreditsRequested] = useState(false);

  useEffect(() => {
    if (!appId) return;
    fetch(`/api/mastermind/apply?id=${appId}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [appId]);

  const [showReadyModal, setShowReadyModal] = useState(false);

  const handleReady = async (program: string) => {
    setSelectedProgram(program);
    try {
      await fetch("/api/mastermind/ready", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: appId, program, email: data?.email, name: data?.name, phone: data?.phone, company: data?.company }),
      });
      // Also update CRM lead status to READY
      try {
        await fetch("/api/mastermind", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: data?.name, email: data?.email, phone: data?.phone, company: data?.company, interest: `I AM READY - ${program}`, status: "READY" }),
        });
      } catch { /* ignore */ }
      setReadySubmitted(true);
      setShowReadyModal(true);
    } catch { /* ignore */ }
  };

  const handleRequestCredits = async () => {
    try {
      await fetch("/api/mastermind/credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: appId, email: data?.email, name: data?.name, phone: data?.phone }),
      });
      setCreditsRequested(true);
    } catch { /* ignore */ }
  };

  if (loading) {
    return (
      <div style={{ background: C.deepOcean, color: C.lightText, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "24px", marginBottom: "16px" }}>Generating Your Readiness Report...</div>
          <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>Analyzing responses across 6 dimensions</div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ background: C.deepOcean, color: C.lightText, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        Application not found.
      </div>
    );
  }

  const scoreColors: Record<string, string> = {
    "Business Readiness": C.caribbean,
    "Personal Growth": C.seafoam,
    "Professional Growth": C.gold,
    "Mental Readiness": "#A78BFA",
    "Income & Revenue": C.coral,
    "Business Strategy": C.pink,
  };

  return (
    <div style={{ background: C.deepOcean, color: C.white, fontFamily: "'Georgia', serif", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ padding: "40px 20px", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <p style={{ fontSize: "12px", letterSpacing: "6px", color: C.seafoam, fontFamily: "sans-serif", textTransform: "uppercase", marginBottom: "8px" }}>Mastermind Readiness Report</p>
        <h1 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 300 }}>{data.name}</h1>
        <p style={{ fontSize: "16px", color: C.lightText, marginTop: "8px" }}>{data.company}</p>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "60px 20px" }}>
        {/* Overall Score */}
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <div style={{
            width: "180px", height: "180px", borderRadius: "50%", margin: "0 auto 24px",
            background: `conic-gradient(${C.caribbean} ${data.overall * 3.6}deg, rgba(255,255,255,0.05) 0deg)`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{
              width: "150px", height: "150px", borderRadius: "50%", background: C.deepOcean,
              display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column",
            }}>
              <span style={{ fontSize: "48px", fontWeight: 300, color: C.caribbean }}>{data.overall}</span>
              <span style={{ fontSize: "12px", letterSpacing: "3px", color: C.lightText, fontFamily: "sans-serif", textTransform: "uppercase" }}>Overall</span>
            </div>
          </div>
          <p style={{ fontSize: "22px", fontWeight: 300, color: C.gold, marginBottom: "8px" }}>
            {data.overall >= 80 ? "Exceptional Candidate" : data.overall >= 60 ? "Strong Candidate" : "Promising Candidate"}
          </p>
          <p style={{ fontSize: "16px", color: C.lightText, maxWidth: "500px", margin: "0 auto" }}>
            Your assessment indicates strong alignment with the Mastermind program. Your combination of {data.keywords.slice(0, 3).join(", ")} positions you for accelerated outcomes.
          </p>
        </div>

        {/* Radar Chart */}
        <div style={{ marginBottom: "60px" }}>
          <RadarChart scores={data.scores} />
        </div>

        {/* Score Bars */}
        <div style={{ marginBottom: "60px" }}>
          <h2 style={{ fontSize: "14px", letterSpacing: "6px", color: C.seafoam, marginBottom: "30px", fontFamily: "sans-serif", textTransform: "uppercase" }}>Dimensional Analysis</h2>
          {Object.entries(data.scores).map(([cat, score]) => (
            <ScoreBar key={cat} label={cat} score={score} color={scoreColors[cat] || C.caribbean} />
          ))}
        </div>

        {/* Keywords */}
        <div style={{ marginBottom: "60px", textAlign: "center" }}>
          <h2 style={{ fontSize: "14px", letterSpacing: "6px", color: C.seafoam, marginBottom: "20px", fontFamily: "sans-serif", textTransform: "uppercase" }}>Readiness Keywords</h2>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px" }}>
            {data.keywords.map((kw, i) => (
              <span key={i} style={{
                padding: "6px 16px", borderRadius: "20px", fontSize: "13px", fontFamily: "sans-serif",
                background: "rgba(8,145,178,0.12)", border: `1px solid ${C.caribbean}`, color: C.caribbean,
              }}>{kw}</span>
            ))}
          </div>
        </div>

        {/* Recommendation */}
        <div style={{
          marginBottom: "60px", padding: "40px", borderRadius: "16px", textAlign: "center",
          background: `linear-gradient(135deg, rgba(8,145,178,0.1), rgba(45,212,191,0.1))`,
          border: `1px solid ${C.caribbean}`,
        }}>
          <p style={{ fontSize: "14px", letterSpacing: "4px", color: C.gold, fontFamily: "sans-serif", textTransform: "uppercase", marginBottom: "16px" }}>Our Recommendation</p>
          <p style={{ fontSize: "22px", fontWeight: 300, lineHeight: 1.6 }}>{data.recommendation}</p>
        </div>

        {/* Program Selection */}
        {!readySubmitted ? (
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 style={{ fontSize: "14px", letterSpacing: "6px", color: C.seafoam, marginBottom: "30px", fontFamily: "sans-serif", textTransform: "uppercase" }}>Select Your Program</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", marginBottom: "32px" }}>
              <div style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "16px", padding: "40px 24px",
              }}>
                <p style={{ fontSize: "13px", letterSpacing: "4px", color: C.seafoam, fontFamily: "sans-serif", textTransform: "uppercase", marginBottom: "12px" }}>1-Week Immersion</p>
                <p style={{ fontSize: "42px", fontWeight: 300, marginBottom: "16px" }}>$35,000</p>
                <button onClick={() => handleReady("1-week")} style={{
                  width: "100%", padding: "16px", background: `linear-gradient(135deg, ${C.caribbean}, ${C.seafoam})`,
                  border: "none", borderRadius: "8px", color: C.deepOcean, fontFamily: "sans-serif",
                  fontWeight: 700, fontSize: "14px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer",
                }}>I AM READY</button>
              </div>
              <div style={{
                background: "rgba(212,168,67,0.05)", border: `1px solid ${C.gold}`,
                borderRadius: "16px", padding: "40px 24px",
              }}>
                <p style={{ fontSize: "13px", letterSpacing: "4px", color: C.gold, fontFamily: "sans-serif", textTransform: "uppercase", marginBottom: "12px" }}>90-Day Cohort</p>
                <p style={{ fontSize: "42px", fontWeight: 300, marginBottom: "16px" }}>$100,000</p>
                <button onClick={() => handleReady("90-day")} style={{
                  width: "100%", padding: "16px", background: `linear-gradient(135deg, ${C.gold}, ${C.coral})`,
                  border: "none", borderRadius: "8px", color: C.deepOcean, fontFamily: "sans-serif",
                  fontWeight: 700, fontSize: "14px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer",
                }}>I AM READY</button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", marginBottom: "60px", padding: "40px", background: "rgba(34,197,94,0.1)", border: "1px solid #22C55E", borderRadius: "16px" }}>
            <p style={{ fontSize: "28px", fontWeight: 300, color: "#22C55E", marginBottom: "12px" }}>✓ You Are Ready</p>
            <p style={{ fontSize: "16px", color: C.lightText }}>
              Your application for the {selectedProgram === "1-week" ? "1-Week Immersion" : "90-Day Cohort"} has been submitted. A member of the team will contact you within 24 hours.
            </p>

            {/* Credit-Gated Tools */}
            <div style={{ marginTop: "40px", textAlign: "left" }}>
              <h3 style={{ fontSize: "14px", letterSpacing: "4px", color: C.gold, fontFamily: "sans-serif", textTransform: "uppercase", marginBottom: "24px", textAlign: "center" }}>
                Your Technology Toolbox
              </h3>
              {[
                { name: "MoneyWords.org", desc: "Opportunity Qualification" },
                { name: "el.ag", desc: "Predictive Analytics" },
                { name: "VoiceDrips.com", desc: "Outreach Automation" },
                { name: "agents.biz", desc: "AI Team Members" },
                { name: "multifamilyoffice.ai", desc: "Capital Network" },
                { name: "softcircle.ai", desc: "Family Office Services" },
              ].map(tool => (
                <div key={tool.name} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "16px 20px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "10px", marginBottom: "8px",
                }}>
                  <div>
                    <span style={{ color: C.caribbean, fontWeight: 700, fontFamily: "sans-serif" }}>{tool.name}</span>
                    <span style={{ color: C.lightText, marginLeft: "12px", fontSize: "14px" }}>{tool.desc}</span>
                  </div>
                  {!creditsRequested ? (
                    <button onClick={handleRequestCredits} style={{
                      padding: "8px 20px", background: "rgba(249,115,22,0.15)", border: `1px solid ${C.coral}`,
                      borderRadius: "6px", color: C.coral, fontFamily: "sans-serif", fontSize: "12px",
                      fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer",
                    }}>🔒 Request Credits</button>
                  ) : (
                    <span style={{ fontSize: "12px", color: C.gold, fontFamily: "sans-serif", letterSpacing: "1px" }}>CREDITS REQUESTED</span>
                  )}
                </div>
              ))}
              {creditsRequested && (
                <div style={{ marginTop: "20px", textAlign: "center", padding: "16px", background: "rgba(249,115,22,0.08)", borderRadius: "10px" }}>
                  <p style={{ fontSize: "16px", color: C.coral }}>📞 Call or text to activate your credits:</p>
                  <p style={{ fontSize: "24px", fontWeight: 700, color: C.white, marginTop: "8px", fontFamily: "sans-serif" }}>
                    <a href="tel:+12234008146" style={{ color: C.white, textDecoration: "none" }}>223-400-8146</a>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* I AM READY Modal */}
      {showReadyModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
        }} onClick={() => setShowReadyModal(false)}>
          <div style={{
            background: `linear-gradient(135deg, ${C.deepOcean}, #0C2D48)`, border: `2px solid ${C.caribbean}`,
            borderRadius: "20px", padding: "48px 40px", maxWidth: "480px", width: "100%", textAlign: "center",
          }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔥</div>
            <h2 style={{ fontSize: "32px", fontWeight: 700, marginBottom: "16px", color: "#22C55E" }}>GREAT</h2>
            <p style={{ fontSize: "20px", color: C.lightText, lineHeight: 1.6, marginBottom: "24px" }}>
              Text <span style={{ color: C.gold, fontWeight: 700 }}>Jeff Cline</span> at
            </p>
            <a href="sms:+19728006670?body=I%20AM%20READY" style={{
              display: "inline-block", fontSize: "36px", fontWeight: 700, color: C.caribbean,
              textDecoration: "none", letterSpacing: "2px", marginBottom: "24px",
            }}>
              972-800-6670
            </a>
            <p style={{ fontSize: "18px", color: C.gold, fontWeight: 600, marginBottom: "32px" }}>
              &ldquo;I AM READY&rdquo; for next steps
            </p>
            <button onClick={() => setShowReadyModal(false)} style={{
              padding: "14px 40px", background: `linear-gradient(135deg, ${C.caribbean}, ${C.seafoam})`,
              border: "none", borderRadius: "8px", color: C.deepOcean, fontFamily: "sans-serif",
              fontWeight: 700, fontSize: "14px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer",
            }}>
              GOT IT
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ padding: "40px 20px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", fontFamily: "sans-serif" }}>
          &copy; {new Date().getFullYear()} Jeff Cline. All rights reserved.
        </p>
        <a href="https://jeff-cline.com" style={{ fontSize: "6px", opacity: 0.08, color: C.lightText, textDecoration: "none" }}>JC</a>
      </footer>
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={<div style={{ background: "#0A1628", color: "#CBD5E1", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading report...</div>}>
      <ReportContent />
    </Suspense>
  );
}
