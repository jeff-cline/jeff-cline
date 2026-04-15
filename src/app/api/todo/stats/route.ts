import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/todo-auth";
import { getTodoDb, getMultiDb, DB_SOURCES } from "@/lib/todo-db";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token || !verifyToken(token)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = await getTodoDb();

  let totalVisits = 0;
  let totalRevenue = 0;
  let totalCredits = 0;

  // Count crm_hitts as primary visit source
  try {
    totalVisits += await db.collection("crm_hitts").countDocuments();
  } catch { /* skip */ }

  for (const source of DB_SOURCES) {
    try {
      const sdb = await getMultiDb(source.db);
      for (const col of ["visitors", "visits", "analytics"]) {
        try {
          totalVisits += await sdb.collection(col).countDocuments();
        } catch { /* skip */ }
      }
      try {
        const payments = await sdb.collection("payments").find({}).toArray();
        totalRevenue += payments.reduce((sum: number, p: Record<string, unknown>) => sum + (Number(p.amount) || 0), 0);
      } catch { /* skip */ }
      try {
        const credits = await sdb.collection("credits").find({}).toArray();
        totalCredits += credits.reduce((sum: number, c: Record<string, unknown>) => sum + (Number(c.amount) || Number(c.credits) || 0), 0);
      } catch { /* skip */ }
    } catch { /* skip db */ }
  }

  const totalLeads = await db.collection("crm_leads").countDocuments({
    $or: [
      { name: { $exists: true, $nin: [null, "", "(no name)"] } },
      { phone: { $exists: true, $nin: [null, ""] } },
    ],
  });
  const totalTodos = await db.collection("todo_items").countDocuments();
  const openTodos = await db.collection("todo_items").countDocuments({ status: "open" });

  // Charts data: leads over time, leads by source, hitts over time, visits by source
  const leadsOverTime = await db.collection("crm_leads").aggregate([
    { $match: { $or: [{ name: { $exists: true, $nin: [null, "", "(no name)"] } }, { phone: { $exists: true, $nin: [null, ""] } }] } },
    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: { $toDate: "$createdAt" } } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
    { $limit: 90 },
  ]).toArray();

  const leadsBySource = await db.collection("crm_leads").aggregate([
    { $match: { $or: [{ name: { $exists: true, $nin: [null, "", "(no name)"] } }, { phone: { $exists: true, $nin: [null, ""] } }] } },
    { $group: { _id: "$source", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]).toArray();

  const hittsOverTime = await db.collection("crm_hitts").aggregate([
    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: { $toDate: "$createdAt" } } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
    { $limit: 90 },
  ]).toArray();

  const hittsBySource = await db.collection("crm_hitts").aggregate([
    { $group: { _id: "$source", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]).toArray();

  return NextResponse.json({
    totalVisits, totalRevenue, totalCredits, totalLeads, totalTodos, openTodos,
    leadsOverTime: leadsOverTime.map(d => ({ date: d._id, count: d.count })),
    leadsBySource: leadsBySource.map(d => ({ source: d._id || "Unknown", count: d.count })),
    hittsOverTime: hittsOverTime.map(d => ({ date: d._id, count: d.count })),
    hittsBySource: hittsBySource.map(d => ({ source: d._id || "Direct", count: d.count })),
  });
}
