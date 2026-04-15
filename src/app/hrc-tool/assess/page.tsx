"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { STANDARDS, Question, StandardConfig } from "./standards-data";

const SCORE_OPTIONS = [
  { label: "Fully Implemented", value: 3, color: "#22C55E" },
  { label: "Partially Implemented", value: 2, color: "#3B82F6" },
  { label: "Planned / In Progress", value: 1, color: "#F97316" },
  { label: "Not Implemented", value: 0, color: "#EF4444" },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

interface Answer {
  family: string;
  question: string;
  score: number;
  controlId?: string;
}

interface FamilyScore {
  family: string;
  score: number;
  maxScore: number;
  pct: number;
  status: string;
  color: string;
  gaps: string[];
}

function computeResults(standard: string, answers: Answer[]) {
  const familyMap: Record<string, { total: number; max: number; gaps: string[] }> = {};
  for (const a of answers) {
    if (!familyMap[a.family]) familyMap[a.family] = { total: 0, max: 0, gaps: [] };
    familyMap[a.family].total += a.score;
    familyMap[a.family].max += 3;
    if (a.score < 2) familyMap[a.family].gaps.push(a.question);
  }

  const families: FamilyScore[] = Object.entries(familyMap).map(([family, d]) => {
    const pct = Math.round((d.total / d.max) * 100);
    let status = "Compliant";
    let color = "#22C55E";
    if (pct < 80) { status = "Partial"; color = "#3B82F6"; }
    if (pct < 60) { status = "Partial"; color = "#F97316"; }
    if (pct < 35) { status = "Non-Compliant"; color = "#EF4444"; }
    return { family, score: d.total, maxScore: d.max, pct, status, color, gaps: d.gaps };
  });

  const totalScore = answers.reduce((s, a) => s + a.score, 0);
  const totalMax = answers.length * 3;
  const overallPct = Math.round((totalScore / totalMax) * 100);

  const remediation = families
    .filter((f) => f.pct < 80)
    .sort((a, b) => a.pct - b.pct)
    .slice(0, 5)
    .map((f, i) => ({
      priority: i + 1,
      family: f.family,
      pct: f.pct,
      recommendation: f.gaps.length > 0
        ? `Address gaps in: ${f.gaps[0].substring(0, 80)}...`
        : `Strengthen controls in ${f.family}`,
    }));

  return { overallPct, families, remediation, standardLabel: STANDARDS[standard]?.label || standard };
}

function statusColor(pct: number) {
  if (pct >= 80) return "#22C55E";
  if (pct >= 60) return "#3B82F6";
  if (pct >= 35) return "#F97316";
  return "#EF4444";
}

/* ------------------------------------------------------------------ */
/*  Cross-framework mapping (control family overlap percentages)       */
/* ------------------------------------------------------------------ */

const STANDARD_KEY_TO_CROSS: Record<string, string> = {
  cmmc: "CMMC / NIST 800-171",
  soc2: "SOC 2 Type II",
  hipaa: "HIPAA Security Rule",
  iso27001: "ISO 27001",
  pcidss: "PCI-DSS",
  "nist-800-53-low": "NIST 800-53 R5 / FedRAMP",
  "nist-800-53-mod": "NIST 800-53 R5 / FedRAMP",
  "nist-800-53-high": "NIST 800-53 R5 / FedRAMP",
};

const CROSS_MAP: Record<string, Record<string, Record<string, number>>> = {
  "CMMC / NIST 800-171": {
    "Access Control": { "SOC 2": 0.85, "HIPAA": 0.75, "ISO 27001": 0.90, "PCI-DSS": 0.80, "NIST 800-53 R5 / FedRAMP": 0.90 },
    "Awareness & Training": { "SOC 2": 0.70, "HIPAA": 0.90, "ISO 27001": 0.85, "PCI-DSS": 0.75, "NIST 800-53 R5 / FedRAMP": 0.90 },
    "Audit & Accountability": { "SOC 2": 0.90, "HIPAA": 0.80, "ISO 27001": 0.85, "PCI-DSS": 0.85, "NIST 800-53 R5 / FedRAMP": 0.95 },
    "Configuration Management": { "SOC 2": 0.80, "HIPAA": 0.60, "ISO 27001": 0.85, "PCI-DSS": 0.75, "NIST 800-53 R5 / FedRAMP": 0.90 },
    "Identification & Authentication": { "SOC 2": 0.85, "HIPAA": 0.80, "ISO 27001": 0.90, "PCI-DSS": 0.90, "NIST 800-53 R5 / FedRAMP": 0.95 },
    "Incident Response": { "SOC 2": 0.85, "HIPAA": 0.85, "ISO 27001": 0.90, "PCI-DSS": 0.70, "NIST 800-53 R5 / FedRAMP": 0.90 },
    "Maintenance": { "SOC 2": 0.50, "HIPAA": 0.55, "ISO 27001": 0.65, "PCI-DSS": 0.50, "NIST 800-53 R5 / FedRAMP": 0.85 },
    "Media Protection": { "SOC 2": 0.60, "HIPAA": 0.85, "ISO 27001": 0.80, "PCI-DSS": 0.70, "NIST 800-53 R5 / FedRAMP": 0.85 },
    "Personnel Security": { "SOC 2": 0.65, "HIPAA": 0.80, "ISO 27001": 0.85, "PCI-DSS": 0.60, "NIST 800-53 R5 / FedRAMP": 0.85 },
    "Physical Protection": { "SOC 2": 0.55, "HIPAA": 0.80, "ISO 27001": 0.75, "PCI-DSS": 0.75, "NIST 800-53 R5 / FedRAMP": 0.85 },
    "Risk Assessment": { "SOC 2": 0.85, "HIPAA": 0.90, "ISO 27001": 0.95, "PCI-DSS": 0.80, "NIST 800-53 R5 / FedRAMP": 0.90 },
    "Security Assessment": { "SOC 2": 0.80, "HIPAA": 0.70, "ISO 27001": 0.90, "PCI-DSS": 0.75, "NIST 800-53 R5 / FedRAMP": 0.90 },
    "System & Communications Protection": { "SOC 2": 0.80, "HIPAA": 0.75, "ISO 27001": 0.85, "PCI-DSS": 0.90, "NIST 800-53 R5 / FedRAMP": 0.90 },
    "System & Information Integrity": { "SOC 2": 0.85, "HIPAA": 0.80, "ISO 27001": 0.85, "PCI-DSS": 0.80, "NIST 800-53 R5 / FedRAMP": 0.90 },
  },
  "SOC 2 Type II": {
    "CC1: Control Environment": { "CMMC / NIST 800-171": 0.60, "HIPAA": 0.65, "ISO 27001": 0.80, "PCI-DSS": 0.65, "NIST 800-53 R5 / FedRAMP": 0.70 },
    "CC2: Communication & Information": { "CMMC / NIST 800-171": 0.55, "HIPAA": 0.60, "ISO 27001": 0.75, "PCI-DSS": 0.55, "NIST 800-53 R5 / FedRAMP": 0.65 },
    "CC3: Risk Assessment": { "CMMC / NIST 800-171": 0.80, "HIPAA": 0.75, "ISO 27001": 0.90, "PCI-DSS": 0.75, "NIST 800-53 R5 / FedRAMP": 0.85 },
    "CC4: Monitoring Activities": { "CMMC / NIST 800-171": 0.75, "HIPAA": 0.65, "ISO 27001": 0.80, "PCI-DSS": 0.70, "NIST 800-53 R5 / FedRAMP": 0.80 },
    "CC5: Control Activities": { "CMMC / NIST 800-171": 0.70, "HIPAA": 0.65, "ISO 27001": 0.80, "PCI-DSS": 0.70, "NIST 800-53 R5 / FedRAMP": 0.75 },
    "CC6: Logical & Physical Access": { "CMMC / NIST 800-171": 0.85, "HIPAA": 0.80, "ISO 27001": 0.90, "PCI-DSS": 0.85, "NIST 800-53 R5 / FedRAMP": 0.85 },
    "CC7: System Operations": { "CMMC / NIST 800-171": 0.80, "HIPAA": 0.75, "ISO 27001": 0.85, "PCI-DSS": 0.80, "NIST 800-53 R5 / FedRAMP": 0.80 },
    "CC8: Change Management": { "CMMC / NIST 800-171": 0.75, "HIPAA": 0.55, "ISO 27001": 0.80, "PCI-DSS": 0.75, "NIST 800-53 R5 / FedRAMP": 0.80 },
    "CC9: Risk Mitigation": { "CMMC / NIST 800-171": 0.65, "HIPAA": 0.60, "ISO 27001": 0.75, "PCI-DSS": 0.60, "NIST 800-53 R5 / FedRAMP": 0.70 },
    "Availability": { "CMMC / NIST 800-171": 0.40, "HIPAA": 0.50, "ISO 27001": 0.70, "PCI-DSS": 0.45, "NIST 800-53 R5 / FedRAMP": 0.65 },
    "Processing Integrity": { "CMMC / NIST 800-171": 0.35, "HIPAA": 0.45, "ISO 27001": 0.60, "PCI-DSS": 0.50, "NIST 800-53 R5 / FedRAMP": 0.65 },
    "Confidentiality": { "CMMC / NIST 800-171": 0.80, "HIPAA": 0.85, "ISO 27001": 0.85, "PCI-DSS": 0.75, "NIST 800-53 R5 / FedRAMP": 0.80 },
    "Privacy": { "CMMC / NIST 800-171": 0.30, "HIPAA": 0.80, "ISO 27001": 0.65, "PCI-DSS": 0.40, "NIST 800-53 R5 / FedRAMP": 0.70 },
  },
  "HIPAA Security Rule": {
    "Administrative Safeguards": { "CMMC / NIST 800-171": 0.75, "SOC 2": 0.70, "ISO 27001": 0.80, "PCI-DSS": 0.65, "NIST 800-53 R5 / FedRAMP": 0.80 },
    "Physical Safeguards": { "CMMC / NIST 800-171": 0.70, "SOC 2": 0.55, "ISO 27001": 0.75, "PCI-DSS": 0.70, "NIST 800-53 R5 / FedRAMP": 0.75 },
    "Technical Safeguards": { "CMMC / NIST 800-171": 0.85, "SOC 2": 0.80, "ISO 27001": 0.85, "PCI-DSS": 0.85, "NIST 800-53 R5 / FedRAMP": 0.85 },
  },
  "ISO 27001": {
    "Organizational Controls": { "CMMC / NIST 800-171": 0.80, "SOC 2": 0.80, "HIPAA": 0.75, "PCI-DSS": 0.75, "NIST 800-53 R5 / FedRAMP": 0.85 },
    "People Controls": { "CMMC / NIST 800-171": 0.70, "SOC 2": 0.65, "HIPAA": 0.80, "PCI-DSS": 0.65, "NIST 800-53 R5 / FedRAMP": 0.80 },
    "Physical Controls": { "CMMC / NIST 800-171": 0.70, "SOC 2": 0.55, "HIPAA": 0.75, "PCI-DSS": 0.70, "NIST 800-53 R5 / FedRAMP": 0.80 },
    "Technological Controls": { "CMMC / NIST 800-171": 0.85, "SOC 2": 0.80, "HIPAA": 0.80, "PCI-DSS": 0.85, "NIST 800-53 R5 / FedRAMP": 0.90 },
  },
  "PCI-DSS": {
    "Network Security Controls": { "CMMC / NIST 800-171": 0.80, "SOC 2": 0.70, "HIPAA": 0.60, "ISO 27001": 0.80, "NIST 800-53 R5 / FedRAMP": 0.80 },
    "Secure Configurations": { "CMMC / NIST 800-171": 0.80, "SOC 2": 0.75, "HIPAA": 0.55, "ISO 27001": 0.80, "NIST 800-53 R5 / FedRAMP": 0.80 },
    "Protect Stored Data": { "CMMC / NIST 800-171": 0.75, "SOC 2": 0.70, "HIPAA": 0.80, "ISO 27001": 0.85, "NIST 800-53 R5 / FedRAMP": 0.75 },
    "Cryptography in Transit": { "CMMC / NIST 800-171": 0.80, "SOC 2": 0.70, "HIPAA": 0.85, "ISO 27001": 0.85, "NIST 800-53 R5 / FedRAMP": 0.80 },
    "Malicious Software Protection": { "CMMC / NIST 800-171": 0.80, "SOC 2": 0.75, "HIPAA": 0.60, "ISO 27001": 0.80, "NIST 800-53 R5 / FedRAMP": 0.80 },
    "Secure Systems & Software": { "CMMC / NIST 800-171": 0.75, "SOC 2": 0.80, "HIPAA": 0.55, "ISO 27001": 0.85, "NIST 800-53 R5 / FedRAMP": 0.80 },
    "Access Restriction": { "CMMC / NIST 800-171": 0.85, "SOC 2": 0.80, "HIPAA": 0.75, "ISO 27001": 0.90, "NIST 800-53 R5 / FedRAMP": 0.85 },
    "User Identification & Authentication": { "CMMC / NIST 800-171": 0.90, "SOC 2": 0.85, "HIPAA": 0.80, "ISO 27001": 0.90, "NIST 800-53 R5 / FedRAMP": 0.90 },
    "Physical Access": { "CMMC / NIST 800-171": 0.70, "SOC 2": 0.55, "HIPAA": 0.75, "ISO 27001": 0.75, "NIST 800-53 R5 / FedRAMP": 0.75 },
    "Logging & Monitoring": { "CMMC / NIST 800-171": 0.85, "SOC 2": 0.85, "HIPAA": 0.75, "ISO 27001": 0.85, "NIST 800-53 R5 / FedRAMP": 0.85 },
    "Security Testing": { "CMMC / NIST 800-171": 0.80, "SOC 2": 0.80, "HIPAA": 0.60, "ISO 27001": 0.80, "NIST 800-53 R5 / FedRAMP": 0.80 },
    "Security Policies & Programs": { "CMMC / NIST 800-171": 0.75, "SOC 2": 0.70, "HIPAA": 0.70, "ISO 27001": 0.85, "NIST 800-53 R5 / FedRAMP": 0.75 },
  },
  "NIST 800-53 R5 / FedRAMP": {
    "Access Control": { "CMMC / NIST 800-171": 0.90, "SOC 2": 0.85, "HIPAA": 0.75, "ISO 27001": 0.90, "PCI-DSS": 0.85 },
    "Awareness & Training": { "CMMC / NIST 800-171": 0.90, "SOC 2": 0.70, "HIPAA": 0.85, "ISO 27001": 0.85, "PCI-DSS": 0.75 },
    "Audit & Accountability": { "CMMC / NIST 800-171": 0.95, "SOC 2": 0.90, "HIPAA": 0.80, "ISO 27001": 0.85, "PCI-DSS": 0.85 },
    "Assessment Authorization & Monitoring": { "CMMC / NIST 800-171": 0.80, "SOC 2": 0.80, "HIPAA": 0.70, "ISO 27001": 0.90, "PCI-DSS": 0.70 },
    "Configuration Management": { "CMMC / NIST 800-171": 0.90, "SOC 2": 0.80, "HIPAA": 0.60, "ISO 27001": 0.85, "PCI-DSS": 0.80 },
    "Contingency Planning": { "CMMC / NIST 800-171": 0.50, "SOC 2": 0.85, "HIPAA": 0.75, "ISO 27001": 0.80, "PCI-DSS": 0.55 },
    "Identification & Authentication": { "CMMC / NIST 800-171": 0.95, "SOC 2": 0.85, "HIPAA": 0.80, "ISO 27001": 0.90, "PCI-DSS": 0.90 },
    "Incident Response": { "CMMC / NIST 800-171": 0.90, "SOC 2": 0.85, "HIPAA": 0.85, "ISO 27001": 0.90, "PCI-DSS": 0.70 },
    "Maintenance": { "CMMC / NIST 800-171": 0.85, "SOC 2": 0.50, "HIPAA": 0.55, "ISO 27001": 0.65, "PCI-DSS": 0.50 },
    "Media Protection": { "CMMC / NIST 800-171": 0.85, "SOC 2": 0.60, "HIPAA": 0.85, "ISO 27001": 0.80, "PCI-DSS": 0.70 },
    "Physical & Environmental Protection": { "CMMC / NIST 800-171": 0.75, "SOC 2": 0.55, "HIPAA": 0.80, "ISO 27001": 0.80, "PCI-DSS": 0.75 },
    "Planning": { "CMMC / NIST 800-171": 0.60, "SOC 2": 0.65, "HIPAA": 0.55, "ISO 27001": 0.75, "PCI-DSS": 0.50 },
    "Program Management": { "CMMC / NIST 800-171": 0.55, "SOC 2": 0.70, "HIPAA": 0.65, "ISO 27001": 0.80, "PCI-DSS": 0.55 },
    "Personnel Security": { "CMMC / NIST 800-171": 0.85, "SOC 2": 0.65, "HIPAA": 0.80, "ISO 27001": 0.85, "PCI-DSS": 0.60 },
    "PII Processing & Transparency": { "CMMC / NIST 800-171": 0.30, "SOC 2": 0.60, "HIPAA": 0.85, "ISO 27001": 0.70, "PCI-DSS": 0.40 },
    "Risk Assessment": { "CMMC / NIST 800-171": 0.90, "SOC 2": 0.85, "HIPAA": 0.90, "ISO 27001": 0.95, "PCI-DSS": 0.80 },
    "System & Services Acquisition": { "CMMC / NIST 800-171": 0.60, "SOC 2": 0.70, "HIPAA": 0.50, "ISO 27001": 0.80, "PCI-DSS": 0.55 },
    "System & Communications Protection": { "CMMC / NIST 800-171": 0.90, "SOC 2": 0.80, "HIPAA": 0.75, "ISO 27001": 0.85, "PCI-DSS": 0.90 },
    "System & Information Integrity": { "CMMC / NIST 800-171": 0.90, "SOC 2": 0.85, "HIPAA": 0.80, "ISO 27001": 0.85, "PCI-DSS": 0.80 },
    "Supply Chain Risk Management": { "CMMC / NIST 800-171": 0.50, "SOC 2": 0.60, "HIPAA": 0.40, "ISO 27001": 0.75, "PCI-DSS": 0.45 },
  },
};

// Display names for cross-framework targets
const CROSS_DISPLAY: Record<string, string> = {
  "CMMC / NIST 800-171": "CMMC / NIST 800-171",
  "SOC 2": "SOC 2 Type II",
  "HIPAA": "HIPAA Security Rule",
  "ISO 27001": "ISO 27001:2022",
  "PCI-DSS": "PCI-DSS 4.0",
  "NIST 800-53 R5 / FedRAMP": "NIST 800-53 R5 / FedRAMP",
};

interface CrossFrameworkScore {
  standard: string;
  estimatedPct: number;
  status: string;
}

// Normalize family name by stripping parenthetical abbreviation, e.g. "Access Control (AC)" -> "Access Control"
// Also handles "Security (Common Criteria)" -> "Security"
function normalizeFamilyName(name: string): string {
  return name.replace(/\s*\([^)]*\)\s*$/, "").trim();
}

function computeCrossFramework(standardKey: string, families: FamilyScore[]): CrossFrameworkScore[] {
  const crossKey = STANDARD_KEY_TO_CROSS[standardKey];
  if (!crossKey || !CROSS_MAP[crossKey]) return [];

  const mapping = CROSS_MAP[crossKey];

  // Collect all target standards from the mapping
  const targetStandards = new Set<string>();
  for (const familyMapping of Object.values(mapping)) {
    for (const target of Object.keys(familyMapping)) {
      targetStandards.add(target);
    }
  }

  const results: CrossFrameworkScore[] = [];

  for (const target of targetStandards) {
    let weightedSum = 0;
    let totalQuestions = 0;

    for (const fam of families) {
      const normalizedName = normalizeFamilyName(fam.family);
      const familyMapping = mapping[normalizedName];
      if (familyMapping && familyMapping[target] !== undefined) {
        const weight = familyMapping[target];
        const questionCount = fam.maxScore / 3; // each question has max 3
        weightedSum += (fam.pct / 100) * weight * questionCount;
        totalQuestions += questionCount;
      }
    }

    const estimatedPct = totalQuestions > 0 ? Math.round((weightedSum / totalQuestions) * 100) : 0;
    let status = "Compliant";
    if (estimatedPct < 80) status = "Partial";
    if (estimatedPct < 60) status = "Needs Work";
    if (estimatedPct < 35) status = "Non-Compliant";

    results.push({
      standard: CROSS_DISPLAY[target] || target,
      estimatedPct,
      status,
    });
  }

  // Sort descending by estimated pct
  results.sort((a, b) => b.estimatedPct - a.estimatedPct);
  return results;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function AssessPage() {
  const [step, setStep] = useState<"select" | "questions" | "info" | "results">("select");
  const [standard, setStandard] = useState("");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState<ReturnType<typeof computeResults> | null>(null);

  const questions = standard ? STANDARDS[standard].questions : [];
  const currentQuestion = questions[currentQ];
  const progress = questions.length > 0 ? Math.round(((currentQ) / questions.length) * 100) : 0;

  const handleSelectStandard = useCallback((key: string) => {
    setStandard(key);
    setAnswers([]);
    setCurrentQ(0);
    setSelectedScore(null);
    setStep("questions");
  }, []);

  const handleNext = useCallback(() => {
    if (selectedScore === null) return;
    const newAnswers = [...answers, { family: currentQuestion.family, question: currentQuestion.text, score: selectedScore, controlId: currentQuestion.controlId }];
    setAnswers(newAnswers);
    setSelectedScore(null);
    if (currentQ + 1 >= questions.length) {
      setStep("info");
    } else {
      setCurrentQ(currentQ + 1);
    }
  }, [selectedScore, answers, currentQuestion, currentQ, questions.length]);

  const handleBack = useCallback(() => {
    if (currentQ > 0) {
      const prev = answers.slice(0, -1);
      setAnswers(prev);
      setSelectedScore(null);
      setCurrentQ(currentQ - 1);
    } else {
      setStep("select");
    }
  }, [currentQ, answers]);

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    const res = computeResults(standard, answers);
    try {
      await fetch("/api/hrc-tool/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ standard, answers, name, email, company }),
      });
    } catch {
      // continue even if save fails
    }
    // Compute cross-framework estimates
    const crossFramework = computeCrossFramework(standard, res.families);

    // Store in localStorage for report page
    localStorage.setItem("hrc_assessment", JSON.stringify({
      standard,
      standardLabel: res.standardLabel,
      answers,
      name,
      email,
      company,
      overallPct: res.overallPct,
      families: res.families,
      remediation: res.remediation,
      crossFramework,
      date: new Date().toISOString(),
    }));
    setResults(res);
    setSubmitting(false);
    setStep("results");
  }, [standard, answers, name, email, company]);

  return (
    <div style={{ minHeight: "100vh", background: "#0A1628", color: "#E2E8F0", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(249,115,22,0.3)", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/hrc-tool" style={{ color: "#F97316", textDecoration: "none", fontWeight: 700, fontSize: 20 }}>
          JEFF CLINE <span style={{ color: "#94A3B8", fontWeight: 400, fontSize: 14 }}>| GRC Gap Assessment</span>
        </Link>
        <Link href="/hrc-tool" style={{ color: "#94A3B8", textDecoration: "none", fontSize: 14 }}>
          Back to HRC Tool
        </Link>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
        {/* ---- Step 1: Select Standard ---- */}
        {step === "select" && (
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Compliance Gap Assessment</h1>
            <p style={{ color: "#94A3B8", marginBottom: 40, fontSize: 16, lineHeight: 1.6 }}>
              Select the compliance standard you want to assess against. You will answer questions mapped to the real control families for that standard. At the end, you will receive a detailed gap analysis with a prioritized remediation roadmap.
            </p>
            <div style={{ display: "grid", gap: 16 }}>
              {Object.entries(STANDARDS).map(([key, s]) => (
                <button
                  key={key}
                  onClick={() => handleSelectStandard(key)}
                  style={{
                    background: "rgba(249,115,22,0.08)",
                    border: "1px solid rgba(249,115,22,0.3)",
                    borderRadius: 8,
                    padding: "20px 24px",
                    color: "#E2E8F0",
                    fontSize: 18,
                    fontWeight: 600,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(249,115,22,0.15)";
                    e.currentTarget.style.borderColor = "#F97316";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(249,115,22,0.08)";
                    e.currentTarget.style.borderColor = "rgba(249,115,22,0.3)";
                  }}
                >
                  {s.label}
                  <span style={{ display: "block", fontSize: 13, color: "#94A3B8", fontWeight: 400, marginTop: 4 }}>
                    {s.questions.length} questions across {[...new Set(s.questions.map((q) => q.family))].length} control families
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ---- Step 2: Questions ---- */}
        {step === "questions" && currentQuestion && (
          <div>
            {/* Progress bar */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13, color: "#94A3B8" }}>
                <span>{STANDARDS[standard].label}</span>
                <span>Question {currentQ + 1} of {questions.length}</span>
              </div>
              <div style={{ height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 3 }}>
                <div style={{ height: "100%", width: `${progress}%`, background: "#F97316", borderRadius: 3, transition: "width 0.3s" }} />
              </div>
            </div>

            {/* Family header */}
            <div style={{ fontSize: 13, color: "#F97316", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
              {currentQuestion.family}
            </div>

            {/* Control ID + Question */}
            <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 32, lineHeight: 1.4 }}>
              {currentQuestion.controlId && (
                <span style={{ color: "#F97316", marginRight: 10, fontFamily: "monospace", fontSize: 18, background: "rgba(249,115,22,0.12)", padding: "2px 8px", borderRadius: 4 }}>
                  {currentQuestion.controlId}
                </span>
              )}
              {currentQuestion.text}
            </h2>

            {/* Options */}
            <div style={{ display: "grid", gap: 12, marginBottom: 32 }}>
              {SCORE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setSelectedScore(opt.value);
                    // Auto-advance after brief visual feedback
                    setTimeout(() => {
                      const newAnswers = [...answers];
                      newAnswers[currentQ] = { family: questions[currentQ].family, question: questions[currentQ].text, score: opt.value, controlId: questions[currentQ].controlId };
                      setAnswers(newAnswers);
                      if (currentQ + 1 >= questions.length) {
                        setStep("info");
                      } else {
                        setCurrentQ(currentQ + 1);
                      }
                      setSelectedScore(null);
                    }, 250);
                  }}
                  style={{
                    background: selectedScore === opt.value ? `${opt.color}20` : "rgba(255,255,255,0.04)",
                    border: `2px solid ${selectedScore === opt.value ? opt.color : "rgba(255,255,255,0.1)"}`,
                    borderRadius: 8,
                    padding: "16px 20px",
                    color: "#E2E8F0",
                    fontSize: 16,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <div style={{
                    width: 20, height: 20, borderRadius: "50%",
                    border: `2px solid ${selectedScore === opt.value ? opt.color : "rgba(255,255,255,0.3)"}`,
                    background: selectedScore === opt.value ? opt.color : "transparent",
                    flexShrink: 0,
                  }} />
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={handleBack}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 8,
                  padding: "12px 24px",
                  color: "#94A3B8",
                  fontSize: 15,
                  cursor: "pointer",
                }}
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={selectedScore === null}
                style={{
                  background: selectedScore !== null ? "#F97316" : "rgba(249,115,22,0.3)",
                  border: "none",
                  borderRadius: 8,
                  padding: "12px 32px",
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: selectedScore !== null ? "pointer" : "not-allowed",
                  opacity: selectedScore !== null ? 1 : 0.5,
                }}
              >
                {currentQ + 1 >= questions.length ? "Complete Assessment" : "Next"}
              </button>
            </div>
          </div>
        )}

        {/* ---- Step 2.5: Contact Info ---- */}
        {step === "info" && (
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Almost Done</h1>
            <p style={{ color: "#94A3B8", marginBottom: 32 }}>
              Enter your information to generate your personalized compliance gap report.
            </p>
            <div style={{ display: "grid", gap: 16, maxWidth: 480 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, color: "#94A3B8", marginBottom: 6 }}>Full Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, color: "#E2E8F0",
                    fontSize: 15, outline: "none", boxSizing: "border-box",
                  }}
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, color: "#94A3B8", marginBottom: 6 }}>Email Address</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  style={{
                    width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, color: "#E2E8F0",
                    fontSize: 15, outline: "none", boxSizing: "border-box",
                  }}
                  placeholder="john@company.com"
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, color: "#94A3B8", marginBottom: 6 }}>Company Name</label>
                <input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  style={{
                    width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, color: "#E2E8F0",
                    fontSize: 15, outline: "none", boxSizing: "border-box",
                  }}
                  placeholder="Acme Corp"
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={!name || !email || !company || submitting}
                style={{
                  background: (name && email && company && !submitting) ? "#F97316" : "rgba(249,115,22,0.3)",
                  border: "none",
                  borderRadius: 8,
                  padding: "14px 32px",
                  color: "#fff",
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: (name && email && company && !submitting) ? "pointer" : "not-allowed",
                  marginTop: 8,
                }}
              >
                {submitting ? "Generating Report..." : "Generate Gap Assessment Report"}
              </button>
            </div>
          </div>
        )}

        {/* ---- Step 3: Results ---- */}
        {step === "results" && results && (
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Gap Assessment Results</h1>
            <p style={{ color: "#94A3B8", marginBottom: 32 }}>{results.standardLabel} -- {company}</p>

            {/* Overall Score */}
            <div style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12,
              padding: 32,
              textAlign: "center",
              marginBottom: 32,
            }}>
              <div style={{ fontSize: 14, color: "#94A3B8", marginBottom: 8 }}>Overall Compliance Score</div>
              <div style={{ fontSize: 64, fontWeight: 700, color: statusColor(results.overallPct) }}>
                {results.overallPct}%
              </div>
              <div style={{ fontSize: 14, color: "#94A3B8", marginTop: 4 }}>
                {results.overallPct >= 80 ? "Strong compliance posture" :
                 results.overallPct >= 60 ? "Moderate gaps identified -- remediation recommended" :
                 results.overallPct >= 35 ? "Significant gaps -- immediate action required" :
                 "Critical deficiencies -- comprehensive remediation needed"}
              </div>
            </div>

            {/* Score by Family - SVG Bar Chart */}
            <div style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12,
              padding: 24,
              marginBottom: 32,
            }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Score by Control Family</h3>
              <svg viewBox={`0 0 600 ${results.families.length * 40 + 10}`} style={{ width: "100%", height: "auto" }}>
                {results.families.map((f, i) => {
                  const barWidth = (f.pct / 100) * 350;
                  const y = i * 40 + 5;
                  return (
                    <g key={f.family}>
                      <text x={0} y={y + 16} fill="#94A3B8" fontSize={11} fontFamily="system-ui">{f.family}</text>
                      <rect x={230} y={y + 2} width={350} height={20} rx={4} fill="rgba(255,255,255,0.06)" />
                      <rect x={230} y={y + 2} width={barWidth} height={20} rx={4} fill={f.color} />
                      <text x={590} y={y + 16} fill="#E2E8F0" fontSize={12} fontFamily="system-ui" textAnchor="end" fontWeight={600}>{f.pct}%</text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Gap Summary */}
            <div style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12,
              padding: 24,
              marginBottom: 32,
            }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Gap Summary</h3>
              <div style={{ display: "grid", gap: 8 }}>
                {results.families.map((f) => (
                  <div key={f.family} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <span style={{ fontSize: 14 }}>{f.family}</span>
                    <span style={{
                      fontSize: 12,
                      fontWeight: 600,
                      padding: "4px 12px",
                      borderRadius: 12,
                      background: `${f.color}20`,
                      color: f.color,
                    }}>
                      {f.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Priority Remediation */}
            {results.remediation.length > 0 && (
              <div style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                padding: 24,
                marginBottom: 32,
              }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Priority Remediation Items</h3>
                <div style={{ display: "grid", gap: 12 }}>
                  {results.remediation.map((r) => (
                    <div key={r.priority} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: "50%",
                        background: "rgba(249,115,22,0.2)", color: "#F97316",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 13, fontWeight: 700, flexShrink: 0,
                      }}>
                        {r.priority}
                      </div>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 600 }}>{r.family} ({r.pct}%)</div>
                        <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 2 }}>{r.recommendation}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cross-Framework Compliance Estimate */}
            {(() => {
              const crossFramework = computeCrossFramework(standard, results.families);
              if (crossFramework.length === 0) return null;

              // Build data for the multi-framework readiness table (assessed + estimated)
              const allStandards = [
                { standard: results.standardLabel, estimatedPct: results.overallPct, status: "Assessed", isAssessed: true },
                ...crossFramework.map(c => ({ ...c, isAssessed: false })),
              ];

              return (
                <>
                  <div style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    padding: 24,
                    marginBottom: 32,
                  }}>
                    <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>
                      Cross-Framework Compliance Estimate
                    </h3>
                    <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 20 }}>
                      How your {results.standardLabel} compliance maps to other frameworks
                    </p>

                    <svg viewBox={`0 0 600 ${crossFramework.length * 44 + 10}`} style={{ width: "100%", height: "auto" }}>
                      {crossFramework.map((cf, i) => {
                        const barWidth = (cf.estimatedPct / 100) * 340;
                        const barColor = statusColor(cf.estimatedPct);
                        const y = i * 44 + 5;
                        return (
                          <g key={cf.standard}>
                            <text x={0} y={y + 17} fill="#94A3B8" fontSize={12} fontFamily="system-ui">{cf.standard}</text>
                            <rect x={240} y={y + 2} width={340} height={22} rx={4} fill="rgba(255,255,255,0.06)" />
                            <rect x={240} y={y + 2} width={barWidth} height={22} rx={4} fill={barColor} />
                            <text x={588} y={y + 17} fill="#E2E8F0" fontSize={13} fontFamily="system-ui" textAnchor="end" fontWeight={600}>{cf.estimatedPct}%</text>
                          </g>
                        );
                      })}
                    </svg>

                    <p style={{ fontSize: 11, color: "#64748B", marginTop: 12, marginBottom: 0 }}>
                      Based on control family overlap analysis
                    </p>
                  </div>

                  {/* Explanation */}
                  <div style={{
                    background: "rgba(249,115,22,0.06)",
                    border: "1px solid rgba(249,115,22,0.2)",
                    borderRadius: 12,
                    padding: 20,
                    marginBottom: 32,
                  }}>
                    <p style={{ fontSize: 14, color: "#CBD5E1", lineHeight: 1.7, margin: 0 }}>
                      These estimates are calculated from real-world control family overlap between compliance frameworks. A high score indicates significant control reuse -- meaning if you are compliant with {results.standardLabel}, you have already done most of the work for those other standards. A remediation roadmap can target the remaining gaps across all frameworks simultaneously.
                    </p>
                  </div>

                  {/* Multi-Framework Readiness Table */}
                  <div style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    padding: 24,
                    marginBottom: 32,
                  }}>
                    <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Multi-Framework Readiness</h3>
                    <div style={{ display: "grid", gap: 0 }}>
                      {/* Header row */}
                      <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 100px 100px",
                        padding: "10px 12px",
                        borderBottom: "2px solid rgba(255,255,255,0.15)",
                        fontSize: 12,
                        color: "#94A3B8",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}>
                        <span>Standard</span>
                        <span style={{ textAlign: "right" }}>Score</span>
                        <span style={{ textAlign: "center" }}>Status</span>
                      </div>
                      {allStandards.map((s) => (
                        <div key={s.standard} style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 100px 100px",
                          padding: "12px 12px",
                          borderBottom: "1px solid rgba(255,255,255,0.06)",
                          alignItems: "center",
                        }}>
                          <span style={{ fontSize: 14, fontWeight: s.isAssessed ? 600 : 400 }}>
                            {s.standard}
                            {s.isAssessed && (
                              <span style={{ fontSize: 11, color: "#F97316", marginLeft: 8, fontWeight: 600 }}>ASSESSED</span>
                            )}
                          </span>
                          <span style={{ textAlign: "right", fontSize: 15, fontWeight: 700, color: statusColor(s.estimatedPct) }}>
                            {s.estimatedPct}%
                          </span>
                          <span style={{ textAlign: "center" }}>
                            <span style={{
                              fontSize: 11,
                              fontWeight: 600,
                              padding: "3px 10px",
                              borderRadius: 10,
                              background: `${statusColor(s.estimatedPct)}20`,
                              color: statusColor(s.estimatedPct),
                            }}>
                              {s.isAssessed ? "Actual" : s.status}
                            </span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              );
            })()}

            {/* CTAs */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                onClick={() => window.open("/hrc-tool/report", "_blank")}
                style={{
                  background: "#F97316",
                  border: "none",
                  borderRadius: 8,
                  padding: "14px 28px",
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Download Full Report (PDF)
              </button>
              <a
                href="https://jeff-cline.com/contact"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 8,
                  padding: "14px 28px",
                  color: "#E2E8F0",
                  fontSize: 15,
                  fontWeight: 600,
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Schedule Remediation Consultation
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
