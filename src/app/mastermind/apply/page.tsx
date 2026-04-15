"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const C = {
  deepOcean: "#0A1628", caribbean: "#0891B2", seafoam: "#2DD4BF",
  coral: "#F97316", white: "#FFFFFF", gold: "#D4A843", lightText: "#CBD5E1", pink: "#EC4899",
};

const questions = [
  // Business Readiness (1-5)
  { id: 1, category: "Business Readiness", q: "What is your current annual revenue?", type: "select", options: ["Pre-revenue", "$0 — $100K", "$100K — $500K", "$500K — $1M", "$1M — $5M", "$5M — $10M", "$10M — $50M", "$50M+"] },
  { id: 2, category: "Business Readiness", q: "How long has your business been operating?", type: "select", options: ["Less than 1 year", "1-3 years", "3-5 years", "5-10 years", "10+ years"] },
  { id: 3, category: "Business Readiness", q: "Do you have a documented, repeatable sales process?", type: "select", options: ["No process exists", "Informal / ad hoc", "Documented but inconsistently followed", "Documented and consistently executed", "Automated and optimized"] },
  { id: 4, category: "Business Readiness", q: "How would you describe your current technology infrastructure?", type: "select", options: ["Minimal — mostly manual processes", "Basic tools (email, spreadsheets, simple CRM)", "Moderate — some automation and integrations", "Advanced — significant automation and data infrastructure", "Enterprise-grade — fully integrated tech stack"] },
  { id: 5, category: "Business Readiness", q: "What is your primary growth constraint right now?", type: "text", placeholder: "Describe the single biggest bottleneck preventing your next phase of growth..." },

  // Personal Growth Readiness (6-9)
  { id: 6, category: "Personal Growth", q: "How many hours per week do you dedicate to personal development (reading, coaching, physical health, mindfulness)?", type: "select", options: ["0-2 hours", "3-5 hours", "5-10 hours", "10-15 hours", "15+ hours"] },
  { id: 7, category: "Personal Growth", q: "Are you willing to fundamentally restructure how you spend your time if the data supports it?", type: "select", options: ["No — my schedule is non-negotiable", "Somewhat — I can make minor adjustments", "Yes — I am open to significant changes", "Absolutely — I will do whatever the process requires"] },
  { id: 8, category: "Personal Growth", q: "How would you rate your current work-life integration?", type: "select", options: ["Severely imbalanced — business consumes everything", "Somewhat imbalanced — personal life suffers", "Moderately balanced — room for improvement", "Well balanced — intentional boundaries", "Fully integrated — business and life are synergistic"] },
  { id: 9, category: "Personal Growth", q: "What does personal success look like to you beyond financial metrics?", type: "text", placeholder: "Describe your vision of a fully realized life..." },

  // Professional Growth Readiness (10-13)
  { id: 10, category: "Professional Growth", q: "How many businesses have you started, scaled, or been a key executive in?", type: "select", options: ["This is my first", "2-3", "4-6", "7-10", "10+"] },
  { id: 11, category: "Professional Growth", q: "Have you ever exited a business (sale, merger, IPO)?", type: "select", options: ["No — never exited", "Attempted but did not close", "Yes — one exit", "Yes — multiple exits", "Yes — and I actively plan exits from day one"] },
  { id: 12, category: "Professional Growth", q: "How do you currently make your most important business decisions?", type: "select", options: ["Intuition and gut feeling", "Advice from peers and mentors", "Basic data and financial analysis", "Comprehensive data-driven frameworks", "Predictive analytics and modeling"] },
  { id: 13, category: "Professional Growth", q: "What is your experience with AI and automation in business operations?", type: "select", options: ["None — I do not use AI", "Basic — ChatGPT or similar tools occasionally", "Moderate — some automated workflows", "Advanced — AI integrated into multiple processes", "Expert — AI agents running core operations"] },

  // Mental State Assessment (14-17)
  { id: 14, category: "Mental Readiness", q: "How would you describe your current mental state regarding your business?", type: "select", options: ["Overwhelmed and burning out", "Stressed but managing", "Focused and energized", "Clear-headed and strategic", "In flow — operating at peak capacity"] },
  { id: 15, category: "Mental Readiness", q: "When faced with a strategy that contradicts your current approach, how do you typically respond?", type: "select", options: ["Defensive — I trust my experience", "Skeptical — I need significant proof", "Open — I will evaluate objectively", "Eager — I actively seek disconfirming evidence", "Adaptive — I change direction within hours when data supports it"] },
  { id: 16, category: "Mental Readiness", q: "How comfortable are you with radical transparency about your business metrics and challenges in a small group setting?", type: "select", options: ["Very uncomfortable", "Somewhat uncomfortable", "Neutral", "Comfortable", "Completely comfortable — transparency accelerates growth"] },
  { id: 17, category: "Mental Readiness", q: "What is your relationship with failure?", type: "text", placeholder: "How do you process setbacks, and what has failure taught you..." },

  // Income & Revenue (18-20)
  { id: 18, category: "Income & Revenue", q: "What is your personal annual income from all sources?", type: "select", options: ["Under $100K", "$100K — $250K", "$250K — $500K", "$500K — $1M", "$1M — $5M", "$5M+"] },
  { id: 19, category: "Income & Revenue", q: "What percentage of your revenue is recurring or contractually committed?", type: "select", options: ["0% — all project/transaction based", "1-25%", "25-50%", "50-75%", "75-100%"] },
  { id: 20, category: "Income & Revenue", q: "What is your current customer acquisition cost (CAC) and do you know your customer lifetime value (LTV)?", type: "select", options: ["I do not know either number", "I have rough estimates", "I know CAC but not LTV", "I know both but they are not optimized", "I know both and actively optimize the ratio"] },

  // Business Deep Dive (21-23)
  { id: 21, category: "Business Strategy", q: "If you could solve one problem in your business in the next 90 days, what would it be and what would solving it be worth?", type: "text", placeholder: "Be specific about the problem and quantify the impact..." },
  { id: 22, category: "Business Strategy", q: "Describe your ideal exit scenario — timeline, valuation, and what comes after.", type: "text", placeholder: "Paint the picture of your endgame..." },
  { id: 23, category: "Business Strategy", q: "Why this mastermind, and why now? What has changed in your business or your life that makes this the right moment?", type: "text", placeholder: "Be honest about what is driving this decision..." },
];

function ApplyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [applicant, setApplicant] = useState({ name: "", email: "", phone: "", company: "" });
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [current, setCurrent] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setApplicant({
      name: searchParams.get("name") || "",
      email: searchParams.get("email") || "",
      phone: searchParams.get("phone") || "",
      company: searchParams.get("company") || "",
    });
  }, [searchParams]);

  const q = questions[current];
  const progress = ((current + 1) / questions.length) * 100;
  const canAdvance = answers[q.id] && answers[q.id].trim().length > 0;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/mastermind/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...applicant, answers: questions.map(qq => ({ id: qq.id, category: qq.category, question: qq.q, answer: answers[qq.id] || "" })) }),
      });
      const data = await res.json();
      if (data.applicationId) {
        router.push(`/mastermind/report?id=${data.applicationId}`);
      }
    } catch {
      alert("Something went wrong. Please try again.");
    }
    setSubmitting(false);
  };

  const categories = [...new Set(questions.map(q => q.category))];
  const currentCategory = q.category;

  return (
    <div style={{ background: C.deepOcean, color: C.white, fontFamily: "'Georgia', serif", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ padding: "24px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
        <p style={{ fontSize: "12px", letterSpacing: "6px", color: C.seafoam, fontFamily: "sans-serif", textTransform: "uppercase" }}>Mastermind Application</p>
        <p style={{ fontSize: "14px", color: C.lightText, marginTop: "8px" }}>
          {applicant.name ? `Welcome, ${applicant.name.split(" ")[0]}` : "Readiness Assessment"} — {applicant.company || "Your Business"}
        </p>
      </div>

      {/* Progress */}
      <div style={{ padding: "20px 20px 0", maxWidth: "700px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
          <span style={{ fontSize: "12px", color: C.lightText, fontFamily: "sans-serif" }}>Question {current + 1} of {questions.length}</span>
          <span style={{ fontSize: "12px", color: C.seafoam, fontFamily: "sans-serif" }}>{currentCategory}</span>
        </div>
        <div style={{ height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${C.caribbean}, ${C.seafoam})`, transition: "width 0.5s ease", borderRadius: "2px" }} />
        </div>
        {/* Category pills */}
        <div style={{ display: "flex", gap: "8px", marginTop: "16px", flexWrap: "wrap", justifyContent: "center" }}>
          {categories.map(cat => (
            <span key={cat} style={{
              fontSize: "10px", letterSpacing: "2px", padding: "4px 12px", borderRadius: "12px",
              fontFamily: "sans-serif", textTransform: "uppercase",
              background: cat === currentCategory ? "rgba(8,145,178,0.2)" : "rgba(255,255,255,0.03)",
              color: cat === currentCategory ? C.caribbean : "rgba(255,255,255,0.3)",
              border: `1px solid ${cat === currentCategory ? C.caribbean : "rgba(255,255,255,0.05)"}`,
            }}>{cat}</span>
          ))}
        </div>
      </div>

      {/* Question */}
      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "60px 20px" }}>
        <h2 style={{ fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 300, lineHeight: 1.5, marginBottom: "40px" }}>{q.q}</h2>

        {q.type === "select" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {q.options!.map(opt => (
              <button key={opt} onClick={() => setAnswers({ ...answers, [q.id]: opt })} style={{
                padding: "16px 20px", textAlign: "left", border: `1px solid ${answers[q.id] === opt ? C.caribbean : "rgba(255,255,255,0.1)"}`,
                background: answers[q.id] === opt ? "rgba(8,145,178,0.15)" : "rgba(255,255,255,0.02)",
                borderRadius: "10px", color: C.white, fontSize: "16px", fontFamily: "Georgia, serif",
                cursor: "pointer", transition: "all 0.2s",
              }}>
                {opt}
              </button>
            ))}
          </div>
        ) : (
          <textarea
            value={answers[q.id] || ""}
            onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
            placeholder={q.placeholder}
            rows={5}
            style={{
              width: "100%", padding: "16px", background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px",
              color: C.white, fontSize: "16px", fontFamily: "Georgia, serif",
              outline: "none", resize: "vertical", boxSizing: "border-box" as const,
            }}
          />
        )}

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "48px", gap: "16px" }}>
          <button onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0} style={{
            padding: "14px 32px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px", color: current === 0 ? "rgba(255,255,255,0.2)" : C.white,
            cursor: current === 0 ? "not-allowed" : "pointer", fontFamily: "sans-serif", fontSize: "14px",
          }}>← Back</button>

          {current < questions.length - 1 ? (
            <button onClick={() => canAdvance && setCurrent(current + 1)} style={{
              padding: "14px 32px", background: canAdvance ? `linear-gradient(135deg, ${C.caribbean}, ${C.seafoam})` : "rgba(255,255,255,0.05)",
              border: "none", borderRadius: "8px", color: canAdvance ? C.deepOcean : "rgba(255,255,255,0.3)",
              cursor: canAdvance ? "pointer" : "not-allowed", fontFamily: "sans-serif", fontSize: "14px", fontWeight: 700,
            }}>Next →</button>
          ) : (
            <button onClick={handleSubmit} disabled={!canAdvance || submitting} style={{
              padding: "14px 40px", background: canAdvance ? `linear-gradient(135deg, ${C.pink}, #D946EF)` : "rgba(255,255,255,0.05)",
              border: "none", borderRadius: "8px", color: canAdvance ? C.white : "rgba(255,255,255,0.3)",
              cursor: canAdvance && !submitting ? "pointer" : "not-allowed", fontFamily: "sans-serif",
              fontSize: "14px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase",
            }}>{submitting ? "Generating Report..." : "Generate Readiness Report"}</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ApplyPage() {
  return (
    <Suspense fallback={<div style={{ background: "#0A1628", color: "#CBD5E1", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading application...</div>}>
      <ApplyContent />
    </Suspense>
  );
}
