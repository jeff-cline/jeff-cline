import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/todo-auth";
import { getTodoDb } from "@/lib/todo-db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const session = token ? verifyToken(token) : null;
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const image = formData.get("image") as File | null;
  const name = (formData.get("name") as string) || "";
  const business = (formData.get("business") as string) || "";
  const email = (formData.get("email") as string) || "";
  const phone = (formData.get("phone") as string) || "";
  const address = (formData.get("address") as string) || "";
  const website = (formData.get("website") as string) || "";
  const notes = (formData.get("notes") as string) || "";
  const assignTo = (formData.get("assignTo") as string) || "";

  let imagePath = "";
  if (image && image.size > 0) {
    const uploadDir = path.join(process.cwd(), "public", "uploads", "leads");
    await mkdir(uploadDir, { recursive: true });
    const ext = image.name.split(".").pop() || "jpg";
    const filename = `lead-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const bytes = new Uint8Array(await image.arrayBuffer());
    await writeFile(path.join(uploadDir, filename), bytes);
    imagePath = `/uploads/leads/${filename}`;
  }

  const db = await getTodoDb();
  const lead = {
    name, business, email, phone, address, website, notes, assignTo,
    imagePath,
    createdBy: session.name,
    source: "quick-add",
    sourceKey: `quick-add-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    sourcePage: "/todo",
    createdAt: new Date(),
    rawData: { business, address, website, notes, assignTo, imagePath },
  };

  const result = await db.collection("crm_leads").insertOne(lead);

  return NextResponse.json({ success: true, lead: { ...lead, _id: result.insertedId } });
}
