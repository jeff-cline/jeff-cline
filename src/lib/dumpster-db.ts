import "server-only";
import { getDb } from "./mongodb";
import type { DumpsterSeed, DumpsterCompany, DumpsterProject, DumpsterComment } from "./dumpster";

export async function getCollections() {
  const db = await getDb();
  return {
    seeds: db.collection<DumpsterSeed>("dumpster_seeds"),
    companies: db.collection<DumpsterCompany>("dumpster_companies"),
    projects: db.collection<DumpsterProject>("dumpster_projects"),
    comments: db.collection<DumpsterComment>("dumpster_comments"),
  };
}
