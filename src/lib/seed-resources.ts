import type { Resource } from "./types";

export const seedResources: Omit<Resource, "_id" | "createdAt">[] = [
  // Business
  { title: "Digital Transformation Playbook", silo: "business", type: "guide", description: "Step-by-step guide to transforming your business operations with technology. Includes ROI calculators and implementation checklists.", featured: true },
  { title: "Automation ROI Calculator", silo: "business", type: "tool", description: "Calculate the exact ROI of automating your business processes. Input your current costs and see projected savings.", featured: true },
  { title: "AI Integration Framework", silo: "business", type: "framework", description: "A proven framework for identifying, prioritizing, and implementing AI in your business operations." },
  { title: "Competitive Analysis Template", silo: "business", type: "template", description: "The same competitive analysis template used by Fortune 500 strategists. Adapted for technology disruption." },
  { title: "Scaling Operations Checklist", silo: "business", type: "guide", description: "50-point checklist for scaling business operations without proportionally scaling costs." },

  // Entrepreneur
  { title: "Solopreneur to CEO Roadmap", silo: "entrepreneur", type: "guide", description: "The complete roadmap for transitioning from doing everything yourself to building a self-running business.", featured: true },
  { title: "Essential Tech Stack Guide", silo: "entrepreneur", type: "guide", description: "The only tools you actually need as an entrepreneur. Consolidated, integrated, and cost-effective.", featured: true },
  { title: "Personal Brand Blueprint", silo: "entrepreneur", type: "framework", description: "Build a personal brand that attracts opportunities. Content strategy, platform selection, and growth tactics." },
  { title: "Revenue Automation Playbook", silo: "entrepreneur", type: "guide", description: "Build automated revenue systems from lead capture to fulfillment. Step-by-step implementation guide." },
  { title: "Exit Valuation Calculator", silo: "entrepreneur", type: "tool", description: "Estimate your business valuation and identify the levers that increase your exit multiple." },

  // Start-Ups
  { title: "MVP Planning Canvas", silo: "start-ups", type: "template", description: "Plan your MVP with surgical precision. Identify core features, validation metrics, and build timeline.", featured: true },
  { title: "Startup Tech Architecture Guide", silo: "start-ups", type: "guide", description: "Choose the right technology stack for your startup. Covers scalability, cost, and hiring considerations.", featured: true },
  { title: "Pitch Deck Tech Section Template", silo: "start-ups", type: "template", description: "Make your technology section the most compelling part of your pitch deck. Used by YC-funded startups." },
  { title: "Product-Market Fit Tracker", silo: "start-ups", type: "tool", description: "Track the metrics that actually indicate product-market fit. Beyond vanity metrics to real signals." },
  { title: "Growth Experiment Framework", silo: "start-ups", type: "framework", description: "Systematic framework for running growth experiments. Hypothesis, test, measure, iterate." },

  // Investors
  { title: "Technical Due Diligence Checklist", silo: "investors", type: "template", description: "200-point technical due diligence checklist covering code quality, architecture, team, and scalability.", featured: true },
  { title: "Deal Flow Scoring Model", silo: "investors", type: "tool", description: "Score and rank investment opportunities systematically. Customizable criteria and weighting.", featured: true },
  { title: "Portfolio Monitoring Dashboard Template", silo: "investors", type: "template", description: "Template for building real-time portfolio monitoring. KPIs, alerts, and trend analysis." },
  { title: "Investment Thesis Builder", silo: "investors", type: "framework", description: "Structured framework for building data-driven investment theses with clear criteria and governance." },
  { title: "Emerging Tech Landscape Map", silo: "investors", type: "guide", description: "Current landscape map of emerging technologies with maturity assessments and investment timing analysis." },

  // Family Offices
  { title: "Family Office Digital Infrastructure Guide", silo: "family-offices", type: "guide", description: "Complete guide to modernizing family office operations. From spreadsheets to real-time dashboards.", featured: true },
  { title: "Cybersecurity Assessment Template", silo: "family-offices", type: "template", description: "Assess your family office's cybersecurity posture. Identifies vulnerabilities specific to high-net-worth families.", featured: true },
  { title: "Next-Gen Engagement Playbook", silo: "family-offices", type: "guide", description: "Engage the next generation with modern technology and innovative investment approaches." },
  { title: "Direct Investment Framework", silo: "family-offices", type: "framework", description: "Framework for family offices making direct investments. Due diligence, deal flow, and portfolio management." },
  { title: "Family Office AI Readiness Assessment", silo: "family-offices", type: "tool", description: "Assess your family office's readiness for AI adoption. Identifies highest-impact AI applications." },
];
