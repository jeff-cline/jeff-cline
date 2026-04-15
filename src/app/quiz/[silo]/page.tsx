"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { SILO_LABELS } from "@/lib/types";

type QuizStep = { question: string; options: string[] };

const SILO_QUIZZES: Record<string, QuizStep[]> = {
  business: [
    { question: "What best describes you?", options: ["Business Owner", "Entrepreneur", "Start-Up Founder", "Investor", "Family Office"] },
    { question: "What's your annual revenue?", options: ["Under $500K", "$500K - $2M", "$2M - $10M", "$10M - $50M", "$50M+"] },
    { question: "How large is your team?", options: ["Solo", "2-10", "11-50", "51-200", "200+"] },
    { question: "How would you rate your tech stack?", options: ["Non-existent", "Basic tools", "Decent but fragmented", "Solid but aging", "Modern & integrated"] },
    { question: "What's your top growth goal this year?", options: ["Increase revenue 2x", "Automate operations", "Enter new markets", "Reduce costs", "Build a sellable asset"] },
  ],
  entrepreneur: [
    { question: "What best describes you?", options: ["Business Owner", "Entrepreneur", "Start-Up Founder", "Investor", "Family Office"] },
    { question: "What stage are you at?", options: ["Idea stage", "Side hustle", "Full-time, pre-revenue", "Revenue generating", "Scaling"] },
    { question: "What's your revenue model?", options: ["SaaS / Subscription", "Services / Consulting", "E-commerce / Products", "Marketplace / Platform", "Not sure yet"] },
    { question: "What's your biggest bottleneck?", options: ["Finding customers", "Building the product", "Funding / Cash flow", "Hiring the right people", "Time management"] },
    { question: "What's your timeline for hitting $1M ARR?", options: ["Already there", "6 months", "12 months", "2+ years", "Just getting started"] },
  ],
  "start-ups": [
    { question: "What best describes you?", options: ["Business Owner", "Entrepreneur", "Start-Up Founder", "Investor", "Family Office"] },
    { question: "What's your funding stage?", options: ["Bootstrapped", "Pre-seed", "Seed", "Series A", "Series B+"] },
    { question: "Do you have an MVP?", options: ["No, still ideating", "Building it now", "MVP launched", "Product-market fit achieved", "Scaling product"] },
    { question: "What's your monthly burn rate?", options: ["Under $10K", "$10K - $50K", "$50K - $150K", "$150K - $500K", "$500K+"] },
    { question: "What's your biggest challenge?", options: ["Raising capital", "Customer acquisition", "Product development", "Team building", "Pivoting strategy"] },
  ],
  investors: [
    { question: "What best describes you?", options: ["Business Owner", "Entrepreneur", "Start-Up Founder", "Investor", "Family Office"] },
    { question: "What's your portfolio size?", options: ["1-5 companies", "6-15 companies", "16-30 companies", "31-50 companies", "50+"] },
    { question: "What's your investment thesis?", options: ["Early-stage tech", "Growth equity", "Real estate", "Diversified", "Impact / ESG"] },
    { question: "How do you source deal flow?", options: ["Personal network", "Accelerators / VCs", "Online platforms", "Conferences", "Inbound from founders"] },
    { question: "What's your biggest pain point?", options: ["Finding quality deals", "Due diligence efficiency", "Portfolio monitoring", "Exit timing", "Co-investor alignment"] },
  ],
  "family-offices": [
    { question: "What best describes you?", options: ["Business Owner", "Entrepreneur", "Start-Up Founder", "Investor", "Family Office"] },
    { question: "What's your AUM range?", options: ["Under $50M", "$50M - $250M", "$250M - $1B", "$1B - $5B", "$5B+"] },
    { question: "Which generation leads the office?", options: ["Founder (G1)", "Second generation (G2)", "Third generation (G3)", "Professional management", "Hybrid"] },
    { question: "How adopted is technology in your operations?", options: ["Minimal - mostly manual", "Basic tools (spreadsheets)", "Some modern software", "Well-digitized", "Cutting-edge / AI-driven"] },
    { question: "What's your top priority?", options: ["Wealth preservation", "Next-gen transition", "Direct investments", "Operational efficiency", "Impact / Legacy"] },
  ],
};

const DEFAULT_QUIZ: QuizStep[] = SILO_QUIZZES.business;

export default function SiloQuizPage() {
  const params = useParams();
  const silo = params.silo as string;
  const steps = SILO_QUIZZES[silo] || DEFAULT_QUIZ;
  const siloLabel = SILO_LABELS[silo] || silo;

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", industry: "", painPoints: "" });
  const [submitted, setSubmitted] = useState(false);

  const selectAnswer = (opt: string) => {
    const newAnswers = [...answers, opt];
    setAnswers(newAnswers);
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setShowForm(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, quizAnswers: answers, silo }),
      });
    } catch {}
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center animate-fade-in-up">
          <div className="text-6xl mb-6">🎯</div>
          <h1 className="text-4xl font-black mb-4"><span className="text-[#FF8900]">Boom.</span> You&apos;re In.</h1>
          <p className="text-gray-400 text-lg max-w-md mx-auto">I&apos;ll review your {siloLabel} assessment and get back to you within 24 hours with a personalized disruption roadmap.</p>
        </div>
      </section>
    );
  }

  if (showForm) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4 pt-24">
        <div className="max-w-lg w-full animate-fade-in-up">
          <h1 className="text-3xl font-black mb-2 text-center">Almost There.</h1>
          <p className="text-gray-400 text-center mb-8">Tell me who you are so I can send your {siloLabel} results.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: "name", label: "Full Name", type: "text" },
              { key: "email", label: "Email", type: "email" },
              { key: "phone", label: "Phone", type: "tel" },
              { key: "industry", label: "Industry", type: "text" },
            ].map((f) => (
              <div key={f.key}>
                <label className="block text-sm font-semibold text-gray-300 mb-1">{f.label}</label>
                <input type={f.type} required={f.key !== "phone"} value={form[f.key as keyof typeof form]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#FF8900] focus:outline-none transition-colors" />
              </div>
            ))}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1">Top Pain Points</label>
              <textarea value={form.painPoints} onChange={(e) => setForm({ ...form, painPoints: e.target.value })} rows={3} className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#FF8900] focus:outline-none transition-colors" />
            </div>
            <button type="submit" className="btn-primary w-full text-center">Get My {siloLabel} Results →</button>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center px-4 pt-24">
      <div className="max-w-2xl w-full animate-fade-in-up">
        <div className="mb-4">
          <span className="text-[#FF8900] text-sm font-bold uppercase tracking-wide">{siloLabel} Assessment</span>
        </div>
        <div className="flex gap-2 mb-8">
          {steps.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? "bg-[#FF8900]" : "bg-white/10"}`} />
          ))}
        </div>
        <p className="text-[#DC2626] text-sm font-bold mb-2">Question {step + 1} of {steps.length}</p>
        <h1 className="text-3xl md:text-4xl font-black mb-8">{steps[step].question}</h1>
        <div className="space-y-3">
          {steps[step].options.map((opt) => (
            <button key={opt} onClick={() => selectAnswer(opt)} className="w-full text-left bg-[#1a1a1a] border border-white/10 rounded-xl px-6 py-4 hover:border-[#FF8900] hover:bg-[#1e1e1e] transition-all text-gray-300 hover:text-white font-medium">
              {opt}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
