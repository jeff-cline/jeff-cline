import { NextRequest, NextResponse } from "next/server";
import { ingestLead } from "@/lib/crm-sync";

const CRM_WEBHOOK_KEY = process.env.CRM_WEBHOOK_KEY || "jc-crm-2024";

export async function POST(req: NextRequest) {
  // Auth check
  const key = req.headers.get("x-crm-key");
  if (key !== CRM_WEBHOOK_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    if (!body.source) {
      return NextResponse.json({ error: "source is required" }, { status: 400 });
    }

    const result = await ingestLead({
      source: body.source,
      name: body.name,
      email: body.email,
      phone: body.phone,
      page: body.page,
      data: body.data,
      priority: body.priority,
      message: body.message,
      type: body.type,
      company: body.company,
    });

    return NextResponse.json(result, { status: result.duplicate ? 200 : 201 });
  } catch (e) {
    console.error("[webhook/lead-ingest] Error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
