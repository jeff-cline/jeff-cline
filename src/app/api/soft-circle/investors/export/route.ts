import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDb();
    const investors = await db.collection("soft_circle_investors").find({}).sort({ createdAt: -1 }).toArray();

    const headers = ["Name","Website","Sector","Stage","Check Size","Thesis","Score","Source","Tags","Contact Name","Contact Email","Contact Phone","Created"];
    const rows = investors.map((inv: any) => {
      const c = inv.contacts?.[0] || {};
      return [
        inv.name, inv.website, inv.sector, inv.stage, inv.checkSize, inv.thesis,
        inv.score, inv.source, (inv.tags || []).join("; "),
        c.name || "", c.email || "", c.phone || "",
        inv.createdAt ? new Date(inv.createdAt).toISOString() : ""
      ].map((v: string) => `"${String(v).replace(/"/g, '""')}"`).join(",");
    });

    const csv = [headers.join(","), ...rows].join("\n");
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=soft-circle-investors.csv",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
