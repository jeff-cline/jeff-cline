import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

const BASE_DIR = process.env.COLAB_UPLOAD_DIR || path.join(process.cwd(), "data", "colab-uploads");
const LEGACY_DIR = path.join(process.cwd(), "public", "colab-uploads");

type Params = { params: Promise<{ name: string }> };

function safeName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "");
}

function contentTypeFromExt(name: string) {
  const ext = path.extname(name).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  if (ext === ".svg") return "image/svg+xml";
  return "image/jpeg";
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { name } = await params;
    const clean = safeName(name);
    if (!clean) {
      return NextResponse.json({ error: "Invalid file name" }, { status: 400 });
    }

    const primaryPath = path.join(BASE_DIR, clean);
    const legacyPath = path.join(LEGACY_DIR, clean);

    let file: Buffer;
    try {
      file = await fs.readFile(primaryPath);
    } catch {
      file = await fs.readFile(legacyPath);
    }

    return new NextResponse(new Uint8Array(file), {
      status: 200,
      headers: {
        "Content-Type": contentTypeFromExt(clean),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
