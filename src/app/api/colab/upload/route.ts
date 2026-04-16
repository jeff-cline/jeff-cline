import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import { requireColabUser } from "@/lib/colab-auth";

const BASE_DIR = process.env.COLAB_UPLOAD_DIR || path.join(process.cwd(), "data", "colab-uploads");

export async function POST(req: NextRequest) {
  try {
    await requireColabUser(req);

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    const mime = file.type || "";
    if (!mime.startsWith("image/")) {
      return NextResponse.json({ error: "Only image uploads are allowed" }, { status: 400 });
    }

    const ext =
      mime === "image/png"
        ? ".png"
        : mime === "image/webp"
        ? ".webp"
        : mime === "image/gif"
        ? ".gif"
        : ".jpg";

    const now = new Date();
    const stamp = now.toISOString().replace(/[:.]/g, "-");
    const random = Math.random().toString(36).slice(2, 10);
    const filename = `colab-${stamp}-${random}${ext}`;

    await fs.mkdir(BASE_DIR, { recursive: true });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(path.join(BASE_DIR, filename), buffer);

    const url = `/api/colab/file/${filename}`;
    return NextResponse.json({ ok: true, url, filename });
  } catch (error) {
    if (String(error).includes("UNAUTHORIZED")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
