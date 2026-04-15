/**
 * CRM Lead Webhook Snippet
 * ========================
 * Add this to any site's lead capture API route to push leads to the master CRM in real-time.
 *
 * USAGE (in your API route after successfully saving a lead):
 *
 *   import { pushLeadToCRM } from '@/lib/crm-webhook';
 *
 *   // After saving lead to your local DB:
 *   await pushLeadToCRM({
 *     source: "agents.biz",          // Your site name
 *     name: lead.name,
 *     email: lead.email,
 *     phone: lead.phone,
 *     page: "/contact",              // Page the lead came from
 *     data: { ...anyExtraFields },   // Full raw data (optional)
 *   });
 *
 * CONFIGURATION:
 *   Set env vars:
 *     CRM_WEBHOOK_URL=https://jeff-cline.com/api/todo/webhook/lead-ingest
 *     CRM_WEBHOOK_KEY=jc-crm-2024
 */

const CRM_URL = process.env.CRM_WEBHOOK_URL || "https://jeff-cline.com/api/todo/webhook/lead-ingest";
const CRM_KEY = process.env.CRM_WEBHOOK_KEY || "jc-crm-2024";

export async function pushLeadToCRM(lead: {
  source: string;
  name?: string;
  email?: string;
  phone?: string;
  page?: string;
  data?: Record<string, unknown>;
}): Promise<{ ok: boolean; id?: string; error?: string }> {
  try {
    const res = await fetch(CRM_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CRM-Key": CRM_KEY,
      },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(5000), // 5s timeout — don't block lead capture
    });
    return await res.json();
  } catch (e) {
    // Fire-and-forget: don't let CRM errors break lead capture
    console.warn("[CRM webhook] Failed to push lead:", e instanceof Error ? e.message : e);
    return { ok: false, error: "CRM push failed" };
  }
}
