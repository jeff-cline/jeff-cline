export type ExpenseCategory = "ads" | "tools" | "services" | "other";
export type ExpensePlatform = "Google" | "Meta" | "LinkedIn" | "Other";

export interface Expense {
  _id?: string;
  name: string;
  amount: number;
  category: ExpenseCategory;
  platform: ExpensePlatform;
  date: string;
  recurring: boolean;
  notes?: string;
  createdAt?: Date;
}

export type PixelType = "Meta Pixel" | "Google Analytics" | "Google Ads" | "LinkedIn Insight" | "TikTok" | "Custom";
export type PixelStatus = "active" | "paused";

export interface TrackingPixel {
  _id?: string;
  name: string;
  type: PixelType;
  pixelId: string;
  status: PixelStatus;
  createdAt?: Date;
}

export type LeadStatus = "new" | "contacted" | "qualified" | "converted";

export interface Lead {
  _id?: string;
  email: string;
  name: string;
  phone?: string;
  silo: string;
  status: LeadStatus;
  source?: string;
  answers: string[];
  createdAt: Date;
}
