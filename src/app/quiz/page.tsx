"use client";
import { useState, useRef } from "react";

const steps: { question: string; options?: string[]; type?: "text"; placeholder?: string }[] = [
  {
    question: "What best describes you?",
    options: ["Business Owner", "Entrepreneur", "Start-Up Founder", "Investor", "Family Office"],
  },
  {
    question: "What's your biggest pain point right now?",
    options: [
      "Revenue has plateaued",
      "Operations are too manual",
      "Can't scale without more people",
      "Technology is confusing",
      "Competitors are pulling ahead",
    ],
  },
  {
    question: "How much revenue does your organization generate annually?",
    options: ["Under $500K", "$500K - $2M", "$2M - $10M", "$10M - $50M", "$50M+"],
  },
  {
    question: "How would you rate your current technology stack?",
    options: ["What technology stack?", "Basic tools, nothing integrated", "Decent but not optimized", "Pretty good but could be better", "World-class"],
  },
  {
    question: "What technology stack do you currently use?",
    type: "text",
    placeholder: "e.g. WordPress, Shopify, Salesforce, custom software...",
  },
  {
    question: "What AI tools are you currently using?",
    type: "text",
    placeholder: "e.g. ChatGPT, Copilot, none yet...",
  },
  {
    question: "Do you have an in-house development team?",
    type: "text",
    placeholder: "e.g. Yes — 3 developers, No, We outsource everything...",
  },
  {
    question: "What's the number one problem you think you can solve in the industry better than anybody else?",
    type: "text",
    placeholder: "Tell us what makes you dangerous...",
  },
  {
    question: "What's your timeline for making changes?",
    options: ["Yesterday", "This quarter", "This year", "Exploring options", "Just curious"],
  },
];

function scoreAnswers(answers: string[]): { score: number; level: string; summary: string; recommendations: string[] } {
  // Scored questions are at indices 0,1,2,3,8 (the multiple-choice ones)
  const scoreMap: Record<number, Record<string, number>> = {
    0: { "Business Owner": 3, "Entrepreneur": 4, "Start-Up Founder": 5, "Investor": 2, "Family Office": 2 },
    1: { "Revenue has plateaued": 3, "Operations are too manual": 2, "Can't scale without more people": 3, "Technology is confusing": 1, "Competitors are pulling ahead": 4 },
    2: { "Under $500K": 1, "$500K - $2M": 2, "$2M - $10M": 3, "$10M - $50M": 4, "$50M+": 5 },
    3: { "What technology stack?": 1, "Basic tools, nothing integrated": 2, "Decent but not optimized": 3, "Pretty good but could be better": 4, "World-class": 5 },
    8: { "Yesterday": 5, "This quarter": 4, "This year": 3, "Exploring options": 2, "Just curious": 1 },
  };

  let raw = 0;
  [0, 1, 2, 3, 8].forEach((i) => { raw += scoreMap[i]?.[answers[i]] || 3; });
  const score = Math.round((raw / 25) * 100);

  let level: string, summary: string;
  if (score >= 80) { level = "Disruption Ready"; summary = "You're primed for transformation. Your organization has the foundation, urgency, and resources to make a massive leap forward."; }
  else if (score >= 60) { level = "Growth Mode"; summary = "Strong foundation with room for optimization. You're positioned well but need strategic technology integration to reach the next level."; }
  else if (score >= 40) { level = "Building Phase"; summary = "Solid start with key gaps to address. The right technology strategy could dramatically accelerate your growth trajectory."; }
  else if (score >= 20) { level = "Wake-Up Call"; summary = "Significant opportunities are being missed. Your competitors are likely outpacing you with technology you haven't adopted yet."; }
  else { level = "Critical"; summary = "Urgent need for technology transformation. Every day without action is costing you revenue, efficiency, and market position."; }

  const recs: string[] = [];
  if (answers[1]?.includes("manual")) recs.push("Implement workflow automation to eliminate repetitive tasks and reduce operational costs by 30-50%.");
  if (answers[1]?.includes("scale")) recs.push("Deploy AI-powered systems that scale without adding headcount — technology should be your multiplier.");
  if (answers[1]?.includes("plateaued")) recs.push("Leverage data-driven marketing and sales automation to unlock new revenue channels.");
  if (answers[1]?.includes("confusing")) recs.push("Start with a technology audit to identify quick wins that deliver immediate ROI.");
  if (answers[1]?.includes("Competitors")) recs.push("Conduct a competitive technology analysis to identify gaps and leapfrog opportunities.");
  if (answers[3]?.includes("What technology") || answers[3]?.includes("Basic")) recs.push("Build an integrated technology foundation — CRM, automation, and analytics working together.");
  if (answers[8] === "Yesterday" || answers[8] === "This quarter") recs.push("Schedule a disruption strategy session to create a 90-day transformation roadmap.");
  else recs.push("Begin with a no-obligation technology assessment to understand your current position and opportunities.");
  if (recs.length < 3) recs.push("Explore AI and automation tools that can deliver measurable results within 30 days.");

  return { score, level, summary, recommendations: recs.slice(0, 4) };
}

function generateReportText(result: ReturnType<typeof scoreAnswers>, answers: string[]): string {
  let text = `DISRUPTION READINESS REPORT\n\nScore: ${result.score}/100 — ${result.level}\n\n${result.summary}\n\nRecommendations:\n`;
  result.recommendations.forEach((r, i) => { text += `${i + 1}. ${r}\n`; });
  text += `\nQuiz Answers:\n`;
  answers.forEach((a, i) => { text += `Q${i + 1}: ${steps[i].question}\nA: ${a}\n\n`; });
  return text;
}

export default function QuizPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showGate, setShowGate] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", businessName: "", website: "", geekProblem: "" });
  const [submitting, setSubmitting] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const result = answers.length === steps.length ? scoreAnswers(answers) : null;

  const advanceStep = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    setTextInput("");
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setShowGate(true);
    }
  };

  const selectAnswer = (opt: string) => advanceStep(opt);

  const submitTextAnswer = () => {
    if (textInput.trim()) advanceStep(textInput.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!result) return;
    setSubmitting(true);
    try {
      const report = generateReportText(result, answers);
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          businessName: form.businessName,
          website: form.website,
          geekProblem: form.geekProblem,
          quizTitle: "Disruption Quiz",
          answers: answers.map((a, i) => ({ question: steps[i].question, answer: a })),
          score: result.score,
          report,
          createdAt: new Date().toISOString(),
        }),
      });
      const data = await res.json();
      if (data.id) setLeadId(data.id);
      // Also submit to existing quiz API for backward compat
      try {
        await fetch("/api/quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, quizAnswers: answers }),
        });
      } catch {}
    } catch {}
    setSubmitting(false);
    setUnlocked(true);
  };

  const handlePrint = () => {
    window.print();
  };

  // Gated/Unlocked results view
  if (showGate && result) {
    return (
      <section className="min-h-screen pt-24 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Results content */}
          <div className="relative">
            {/* Gate overlay */}
            {!unlocked && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-start pt-8">
                <div className="bg-[#0a0a0a]/95 backdrop-blur-sm border border-white/10 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
                  <div className="text-4xl text-center mb-4">🔓</div>
                  <h2 className="text-2xl font-black text-center mb-2">Your Disruption Report is Ready</h2>
                  <p className="text-gray-400 text-center text-sm mb-6">Enter your details to unlock your personalized results.</p>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-1">Full Name *</label>
                      <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#FF8900] focus:outline-none transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-1">Email *</label>
                      <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#FF8900] focus:outline-none transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-1">Phone *</label>
                      <input type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#FF8900] focus:outline-none transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-1">Business Name *</label>
                      <input type="text" required value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#FF8900] focus:outline-none transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-1">Website</label>
                      <input type="url" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://"
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#FF8900] focus:outline-none transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-1 uppercase">What problem can a geek solve for you today? *</label>
                      <textarea required value={form.geekProblem} onChange={(e) => setForm({ ...form, geekProblem: e.target.value })} rows={3}
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#FF8900] focus:outline-none transition-colors resize-none" />
                    </div>
                    <button type="submit" disabled={submitting}
                      className="w-full bg-[#FF8900] hover:bg-[#FF8900]/90 text-black font-black py-4 rounded-xl text-lg transition-colors disabled:opacity-50">
                      {submitting ? "UNLOCKING..." : "🔓 UNLOCK RESULTS"}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Results (blurred when locked) */}
            <div ref={resultsRef} className={!unlocked ? "blur-md select-none pointer-events-none" : ""}>
              {unlocked && (
                <div className="flex justify-end mb-4 print:hidden">
                  <button onClick={handlePrint}
                    className="bg-[#FF8900] hover:bg-[#FF8900]/90 text-black font-bold px-6 py-2 rounded-lg text-sm transition-colors">
                    📄 DOWNLOAD PDF
                  </button>
                </div>
              )}

              <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-8 mb-6">
                <h1 className="text-3xl font-black mb-2">Disruption Readiness Report</h1>
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-5xl font-black text-[#FF8900]">{result.score}</div>
                  <div>
                    <div className="text-xl font-bold text-white">{result.level}</div>
                    <div className="text-gray-500 text-sm">out of 100</div>
                  </div>
                </div>
                {/* Score bar */}
                <div className="w-full bg-white/5 rounded-full h-3 mb-6">
                  <div className="bg-[#FF8900] h-3 rounded-full transition-all duration-1000" style={{ width: `${result.score}%` }} />
                </div>
                <p className="text-gray-300 leading-relaxed">{result.summary}</p>
              </div>

              <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-8 mb-6">
                <h2 className="text-xl font-black mb-4">🎯 Recommendations</h2>
                <ul className="space-y-3">
                  {result.recommendations.map((r, i) => (
                    <li key={i} className="flex gap-3 text-gray-300">
                      <span className="text-[#FF8900] font-bold mt-0.5">→</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-8 mb-6">
                <h2 className="text-xl font-black mb-4">📊 Your Answers</h2>
                <div className="space-y-4">
                  {answers.map((a, i) => (
                    <div key={i}>
                      <div className="text-gray-500 text-sm">{steps[i].question}</div>
                      <div className="text-white font-medium">{a}</div>
                    </div>
                  ))}
                </div>
              </div>

              {unlocked && (
                <div className="print:hidden space-y-6">
                  <div className="bg-[#1a1a1a] border border-[#FF8900]/20 rounded-2xl p-8">
                    <h2 className="text-2xl font-black mb-2">GET TO KNOW <span className="text-[#FF8900]">JEFF CLINE</span></h2>
                    <p className="text-gray-400 text-sm mb-6">WHILE YOU WAIT — explore what we can do for your business:</p>
                    <div className="grid md:grid-cols-3 gap-4">
                      <a href="https://jeff-cline.com/agency/index.html" className="group bg-[#0a0a0a] border border-white/5 rounded-xl p-6 hover:border-[#FF8900]/40 transition-all">
                        <div className="text-2xl mb-3">🏢</div>
                        <h3 className="font-bold text-white group-hover:text-[#FF8900] transition-colors">Agency Services</h3>
                        <p className="text-gray-500 text-sm mt-1">Full-service digital transformation</p>
                      </a>
                      <a href="https://jeff-cline.com/tools-pricing" className="group bg-[#0a0a0a] border border-white/5 rounded-xl p-6 hover:border-[#FF8900]/40 transition-all">
                        <div className="text-2xl mb-3">🛠️</div>
                        <h3 className="font-bold text-white group-hover:text-[#FF8900] transition-colors">A La Carte Tools</h3>
                        <p className="text-gray-500 text-sm mt-1">Pick exactly what you need</p>
                      </a>
                      <a href="/dashboard" className="group bg-[#0a0a0a] border border-white/5 rounded-xl p-6 hover:border-[#FF8900]/40 transition-all">
                        <div className="text-2xl mb-3">📊</div>
                        <h3 className="font-bold text-white group-hover:text-[#FF8900] transition-colors">Business Dashboard</h3>
                        <p className="text-gray-500 text-sm mt-1">Your personalized command center</p>
                      </a>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 text-center">Questions? Email me directly at <a href="mailto:jeff.cline@me.com" className="text-[#FF8900] hover:underline">jeff.cline@me.com</a></p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Quiz questions
  return (
    <section className="min-h-screen flex items-center justify-center px-4 pt-24">
      <div className="max-w-2xl w-full animate-fade-in-up">
        <div className="flex gap-2 mb-8">
          {steps.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? "bg-[#FF8900]" : "bg-white/10"}`} />
          ))}
        </div>
        <p className="text-[#DC2626] text-sm font-bold mb-2">Question {step + 1} of {steps.length}</p>
        <h1 className="text-3xl md:text-4xl font-black mb-8">{steps[step].question}</h1>
        <div className="space-y-3">
          {steps[step].type === "text" ? (
            <div className="space-y-4">
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && textInput.trim()) { e.preventDefault(); submitTextAnswer(); } }}
                placeholder={steps[step].placeholder || "Type your answer..."}
                rows={3}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-6 py-4 text-white focus:border-[#FF8900] focus:outline-none transition-colors resize-none placeholder-gray-600"
              />
              <button
                onClick={submitTextAnswer}
                disabled={!textInput.trim()}
                className="bg-[#FF8900] hover:bg-[#FF8900]/90 text-black font-black px-8 py-3 rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                NEXT →
              </button>
            </div>
          ) : (
            steps[step].options?.map((opt) => (
              <button key={opt} onClick={() => selectAnswer(opt)}
                className="w-full text-left bg-[#1a1a1a] border border-white/10 rounded-xl px-6 py-4 hover:border-[#FF8900] hover:bg-[#1e1e1e] transition-all text-gray-300 hover:text-white font-medium">
                {opt}
              </button>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
