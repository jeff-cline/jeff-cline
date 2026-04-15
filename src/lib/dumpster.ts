import type { ObjectId } from "mongodb";

export const SEED_STATUSES = ["raw", "triaging", "assigned", "archived"] as const;
export type SeedStatus = (typeof SEED_STATUSES)[number];

export const PRIORITIES = ["urgent", "high", "normal", "low"] as const;
export type Priority = (typeof PRIORITIES)[number];

export const COLORS = ["red", "yellow", "green", "blue", "purple", "pink", "gray"] as const;
export type SeedColor = (typeof COLORS)[number];

export const FRAME_STYLES = ["solid", "dashed", "dotted", "double"] as const;
export type FrameStyle = (typeof FRAME_STYLES)[number];

export const ROLES = [
  "admin",
  "coordinator",
  "executive_assistant",
  "company_owner",
  "company_management",
  "company_staff",
  "service_provider",
  "user",
] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Admin",
  coordinator: "Coordinator",
  executive_assistant: "Executive Assistant",
  company_owner: "Company Owner",
  company_management: "Company Management",
  company_staff: "Company Staff",
  service_provider: "Service Provider",
  user: "Contributor",
};

export const TRIAGE_ROLES: Role[] = ["admin", "coordinator", "executive_assistant"];

export function canTriage(role?: string | null): boolean {
  return TRIAGE_ROLES.includes((role || "user") as Role);
}

export function canManageCompanies(role?: string | null): boolean {
  return role === "admin" || role === "coordinator";
}

export interface DumpsterSeed {
  _id?: ObjectId;
  createdBy: string;
  createdByName?: string;
  kind: "note" | "photo" | "file" | "voice";
  title: string;
  note: string;
  attachment?: {
    mime: string;
    name: string;
    dataUrl: string;
    size: number;
  };
  status: SeedStatus;
  companyId?: string | null;
  projectId?: string | null;
  priority: Priority;
  color: SeedColor;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DumpsterCompany {
  _id?: ObjectId;
  name: string;
  color: SeedColor;
  frameStyle: FrameStyle;
  createdAt: Date;
}

export interface DumpsterProject {
  _id?: ObjectId;
  companyId: string;
  name: string;
  createdAt: Date;
}

export interface DumpsterComment {
  _id?: ObjectId;
  seedId: string;
  userId: string;
  userName: string;
  body: string;
  createdAt: Date;
}

export const PRIORITY_DOT: Record<Priority, string> = {
  urgent: "#ef4444",
  high: "#f59e0b",
  normal: "#10b981",
  low: "#3b82f6",
};

export const COLOR_HEX: Record<SeedColor, string> = {
  red: "#ef4444",
  yellow: "#f59e0b",
  green: "#10b981",
  blue: "#3b82f6",
  purple: "#a78bfa",
  pink: "#ec4899",
  gray: "#6b7280",
};
