import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

interface SubProject {
  type: string;
  description: string;
  notes: string;
  acres: string;
  units: string;
  returnType: string;
  costToBuild: string;
  totalRevenue: string;
  totalProfit: string;
  timeToBuild: string;
  irr: string;
  devStage: string;
  capitalStatus: string;
  capitalTarget: string;
  capitalRaised: string;
  fundingProgress: string;
}

interface RawProject {
  name: string;
  subprojects: SubProject[];
  presentation_link: string;
  maps_link: string;
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function parseCurrency(s: string): number {
  if (!s) return 0;
  return parseFloat(s.replace(/[^0-9.]/g, "")) || 0;
}

function formatCurrency(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  if (n === 0) return "TBD";
  return `$${n.toLocaleString()}`;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let projectsData: RawProject[];
  try {
    const filePath = join(process.cwd(), "public", "roatan", "projects.json");
    projectsData = JSON.parse(readFileSync(filePath, "utf-8"));
  } catch {
    return new NextResponse("Projects data not found", { status: 500 });
  }

  let project: { name: string; subprojects: SubProject[]; presentation_link: string; maps_link: string } | null = null;

  if (slug === "sea-breeze") {
    const parts = projectsData.filter(p =>
      p.name === "Sea Breeze" || p.name === "Seabreeze" || p.name === "Seabreeze waterfront condos"
    );
    if (parts.length) {
      project = {
        name: "Sea Breeze",
        subprojects: parts.flatMap(p => p.subprojects),
        presentation_link: parts.find(p => p.presentation_link)?.presentation_link || "",
        maps_link: parts.find(p => p.maps_link)?.maps_link || "",
      };
    }
  } else {
    const found = projectsData.find(p => slugify(p.name) === slug);
    if (found) project = found;
  }

  if (!project) {
    return new NextResponse("Project not found", { status: 404 });
  }

  const totalInvestment = project.subprojects.reduce((s, sp) => s + parseCurrency(sp.costToBuild), 0);
  const totalRevenue = project.subprojects.reduce((s, sp) => s + parseCurrency(sp.totalRevenue), 0);
  const totalProfit = project.subprojects.reduce((s, sp) => s + parseCurrency(sp.totalProfit), 0);
  const irrs = project.subprojects.map(sp => parseFloat(sp.irr)).filter(n => !isNaN(n) && n > 0);
  const irrDisplay = irrs.length > 1 ? `${Math.min(...irrs).toFixed(1)}% - ${Math.max(...irrs).toFixed(1)}%` : irrs.length === 1 ? `${irrs[0].toFixed(1)}%` : "TBD";

  const subProjectRows = project.subprojects.map(sp => `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #eee;">${sp.description}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #eee;">${sp.type}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:right">${sp.costToBuild || "TBD"}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:right">${sp.totalRevenue || "TBD"}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:right;color:#B8860B;font-weight:600">${sp.totalProfit || "TBD"}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:right;color:#B8860B">${sp.irr || "TBD"}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #eee;">${sp.returnType || "TBD"}</td>
    </tr>
  `).join("");

  const detailBlocks = project.subprojects.map((sp, i) => `
    <div style="background:#f9f8f5;border:1px solid #e8e2d8;border-radius:8px;padding:20px;margin-bottom:16px;">
      <h3 style="margin:0 0 8px;color:#1a1a1a;font-size:16px;">${sp.description} <span style="color:#B8860B;font-size:13px;font-weight:normal;">${sp.type}</span></h3>
      ${sp.notes ? `<p style="color:#666;font-size:13px;margin:0 0 12px;line-height:1.5;">${sp.notes}</p>` : ""}
      <div style="display:flex;flex-wrap:wrap;gap:16px;font-size:13px;">
        ${sp.units ? `<div><strong>Units:</strong> ${sp.units}</div>` : ""}
        ${sp.acres ? `<div><strong>Land:</strong> ${sp.acres}</div>` : ""}
        ${sp.devStage ? `<div><strong>Stage:</strong> ${sp.devStage}</div>` : ""}
        ${sp.capitalStatus ? `<div><strong>Capital:</strong> ${sp.capitalStatus}</div>` : ""}
        ${sp.timeToBuild ? `<div><strong>Build Time:</strong> ${sp.timeToBuild} years</div>` : ""}
      </div>
    </div>
  `).join("");

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${project.name} - Investment Summary | InvestorDiscoveryTour.com</title>
  <style>
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a1a1a; background: #fff; }
    @page { size: A4; margin: 20mm; }
  </style>
</head>
<body style="max-width:800px;margin:0 auto;padding:40px 24px;">
  <!-- Header -->
  <div style="border-bottom:3px solid #C9A96E;padding-bottom:20px;margin-bottom:30px;display:flex;justify-content:space-between;align-items:flex-end;">
    <div>
      <h1 style="font-size:32px;color:#1a1a1a;margin-bottom:4px;">${project.name}</h1>
      <p style="color:#B8860B;font-size:14px;letter-spacing:2px;">ROATAN, BAY ISLANDS, HONDURAS</p>
    </div>
    <div style="text-align:right;font-size:13px;color:#666;">
      <div style="color:#B8860B;font-weight:600;font-size:15px;">InvestorDiscoveryTour.com</div>
      <div>Jeff Cline | 972-800-6670</div>
      <div>jeff@jeff-cline.com</div>
    </div>
  </div>

  <!-- Key Metrics -->
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:30px;">
    <div style="background:#f9f8f5;border:1px solid #e8e2d8;border-radius:8px;padding:16px;text-align:center;">
      <div style="font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;">Total Investment</div>
      <div style="font-size:24px;font-weight:700;color:#1a1a1a;margin-top:4px;">${formatCurrency(totalInvestment)}</div>
    </div>
    <div style="background:#f9f8f5;border:1px solid #e8e2d8;border-radius:8px;padding:16px;text-align:center;">
      <div style="font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;">Total Profit</div>
      <div style="font-size:24px;font-weight:700;color:#B8860B;margin-top:4px;">${formatCurrency(totalProfit)}</div>
    </div>
    <div style="background:#f9f8f5;border:1px solid #e8e2d8;border-radius:8px;padding:16px;text-align:center;">
      <div style="font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;">IRR</div>
      <div style="font-size:24px;font-weight:700;color:#B8860B;margin-top:4px;">${irrDisplay}</div>
    </div>
  </div>

  <!-- Financial Table -->
  <h2 style="font-size:20px;margin-bottom:16px;color:#1a1a1a;border-left:4px solid #C9A96E;padding-left:12px;">Financial Summary</h2>
  <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:30px;">
    <thead>
      <tr style="background:#f0ece4;">
        <th style="padding:10px 12px;text-align:left;font-weight:600;border-bottom:2px solid #C9A96E;">Sub-Project</th>
        <th style="padding:10px 12px;text-align:left;font-weight:600;border-bottom:2px solid #C9A96E;">Type</th>
        <th style="padding:10px 12px;text-align:right;font-weight:600;border-bottom:2px solid #C9A96E;">Cost</th>
        <th style="padding:10px 12px;text-align:right;font-weight:600;border-bottom:2px solid #C9A96E;">Revenue</th>
        <th style="padding:10px 12px;text-align:right;font-weight:600;border-bottom:2px solid #C9A96E;">Profit</th>
        <th style="padding:10px 12px;text-align:right;font-weight:600;border-bottom:2px solid #C9A96E;">IRR</th>
        <th style="padding:10px 12px;text-align:left;font-weight:600;border-bottom:2px solid #C9A96E;">Return</th>
      </tr>
    </thead>
    <tbody>
      ${subProjectRows}
      <tr style="background:#f0ece4;font-weight:700;">
        <td style="padding:10px 12px;" colspan="2">Total</td>
        <td style="padding:10px 12px;text-align:right">${formatCurrency(totalInvestment)}</td>
        <td style="padding:10px 12px;text-align:right">${formatCurrency(totalRevenue)}</td>
        <td style="padding:10px 12px;text-align:right;color:#B8860B">${formatCurrency(totalProfit)}</td>
        <td style="padding:10px 12px;text-align:right;color:#B8860B">${irrDisplay}</td>
        <td style="padding:10px 12px;"></td>
      </tr>
    </tbody>
  </table>

  <!-- Detail Blocks -->
  <h2 style="font-size:20px;margin-bottom:16px;color:#1a1a1a;border-left:4px solid #C9A96E;padding-left:12px;">Project Details</h2>
  ${detailBlocks}

  <!-- Footer -->
  <div style="border-top:2px solid #C9A96E;margin-top:40px;padding-top:20px;text-align:center;font-size:13px;color:#888;">
    <p style="color:#B8860B;font-weight:600;font-size:15px;margin-bottom:4px;">Investor Discovery Tour</p>
    <p>Jeff Cline | 972-800-6670 | jeff@jeff-cline.com</p>
    <p style="margin-top:4px;">InvestorDiscoveryTour.com</p>
    <p style="margin-top:12px;font-size:11px;color:#bbb;">This document is for informational purposes only and does not constitute an offer to sell or a solicitation of an offer to buy any securities. Generated ${new Date().toLocaleDateString()}.</p>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
