export interface User {
  _id?: string;
  email: string;
  password?: string;
  name: string;
  phone?: string;
  company?: string;
  siloInterest?: string;
  role: "user" | "admin";
  createdAt: Date;
}

export interface QuizResult {
  _id?: string;
  userId?: string;
  email: string;
  name: string;
  phone?: string;
  industry?: string;
  painPoints?: string;
  silo: string;
  answers: string[];
  score?: number;
  createdAt: Date;
}

export interface Resource {
  _id?: string;
  title: string;
  silo: string;
  type: "guide" | "framework" | "template" | "video" | "tool" | "article";
  url?: string;
  description: string;
  downloadUrl?: string;
  featured?: boolean;
  createdAt: Date;
}

export interface ApiKey {
  _id?: string;
  service: string;
  key: string;
  createdBy: string;
  createdAt: Date;
}

export const SILOS = ["business", "entrepreneur", "start-ups", "investors", "family-offices"] as const;
export type SiloType = typeof SILOS[number];

export const SILO_LABELS: Record<string, string> = {
  business: "Business",
  entrepreneur: "Entrepreneur",
  "start-ups": "Start-Ups",
  investors: "Investors",
  "family-offices": "Family Offices",
};

export const SILO_ICONS: Record<string, string> = {
  business: "🏢",
  entrepreneur: "🚀",
  "start-ups": "⚡",
  investors: "📈",
  "family-offices": "🏛️",
};
