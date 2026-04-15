import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/todo-auth";
import { getTodoDb } from "@/lib/todo-db";
import { fullSync, watchChanges, isWatcherRunning } from "@/lib/crm-sync";

function auth(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

let initialSyncDone = false;

export async function GET(req: NextRequest) {
  const session = auth(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = await getTodoDb();
  const col = db.collection("crm_leads");

  // First call: backfill if empty
  if (!initialSyncDone) {
    initialSyncDone = true;
    const count = await col.countDocuments();
    if (count === 0) {
      try { await fullSync(); } catch (e) { console.error("[leads] Initial sync error:", e); }
    }
  }

  // Start change stream watcher if not running
  if (!isWatcherRunning()) {
    try { await watchChanges(); } catch (e) { console.error("[leads] Change stream start error:", e); }
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 20;
  const search = searchParams.get("search") || "";
  const sourceFilter = searchParams.get("source") || "";

  // Leads must have a real name or a phone number (form submissions, not anonymous visitors)
  const baseFilter: Record<string, unknown> = {
    $or: [
      { name: { $exists: true, $nin: [null, "", "(no name)"] } },
      { phone: { $exists: true, $nin: [null, ""] } },
    ],
  };

  // Role-based filtering: managers and members only see their own leads
  if (session.role !== "admin") {
    baseFilter.$and = [
      ...(baseFilter.$and as Array<Record<string, unknown>> || []),
      {
        $or: [
          { assignedTo: session.name },
          { createdBy: session.name },
          { createdBy: session.email },
        ],
      },
    ];
  }

  const query: Record<string, unknown> = { ...baseFilter };
  if (search) {
    query.$and = [
      { $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ] },
    ];
  }
  if (sourceFilter) query.source = sourceFilter;

  const total = await col.countDocuments(query);
  const leads = await col
    .find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  return NextResponse.json({
    leads: leads.map((l) => ({ ...l, _id: l._id.toString() })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
