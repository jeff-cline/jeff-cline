import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { getDb } from "@/lib/mongodb";

type BootstrapConfig = {
  email: string;
  password: string;
  name: string;
  secret: string;
};

function readBootstrapConfig(): BootstrapConfig {
  return {
    email:
      process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase() ||
      process.env.SUPERADMIN_EMAIL?.trim().toLowerCase() ||
      "",
    password:
      process.env.BOOTSTRAP_ADMIN_PASSWORD?.trim() || process.env.SUPERADMIN_PASSWORD?.trim() || "",
    name:
      process.env.BOOTSTRAP_ADMIN_NAME?.trim() || process.env.SUPERADMIN_NAME?.trim() || "Super Admin",
    secret: process.env.BOOTSTRAP_SECRET?.trim() || "",
  };
}

function secureEquals(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

function getSecretFromRequest(req: NextRequest, bodySecret?: string): string {
  return (
    req.nextUrl.searchParams.get("secret") ||
    req.headers.get("x-bootstrap-secret") ||
    bodySecret ||
    ""
  ).trim();
}

function json(status: number, payload: Record<string, unknown>) {
  return NextResponse.json(payload, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

async function runBootstrap(req: NextRequest, bodySecret?: string) {
  const config = readBootstrapConfig();

  if (!config.secret) {
    return json(500, {
      ok: false,
      error: "BOOTSTRAP_SECRET is not configured",
    });
  }

  const providedSecret = getSecretFromRequest(req, bodySecret);
  if (!providedSecret || !secureEquals(providedSecret, config.secret)) {
    return json(401, {
      ok: false,
      error: "Unauthorized",
    });
  }

  if (!config.email || !config.password) {
    return json(500, {
      ok: false,
      error:
        "Missing bootstrap credentials. Set BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD (or SUPERADMIN_EMAIL/SUPERADMIN_PASSWORD).",
    });
  }

  const db = await getDb();
  const users = db.collection("users");

  const existing = await users.findOne({ email: config.email });

  if (!existing) {
    const passwordHash = await bcrypt.hash(config.password, 12);
    const now = new Date();

    await users.insertOne({
      email: config.email,
      password: passwordHash,
      name: config.name,
      role: "superadmin",
      createdAt: now,
      updatedAt: now,
    });

    return json(200, {
      ok: true,
      action: "created",
      email: config.email,
      role: "superadmin",
    });
  }

  const passwordMatches =
    typeof existing.password === "string" ? await bcrypt.compare(config.password, existing.password) : false;

  const needsNameUpdate = (existing.name || "") !== config.name;
  const needsRoleUpdate = (existing.role || "") !== "superadmin";
  const needsPasswordUpdate = !passwordMatches;

  if (!needsNameUpdate && !needsRoleUpdate && !needsPasswordUpdate) {
    return json(200, {
      ok: true,
      action: "unchanged",
      email: config.email,
      role: "superadmin",
    });
  }

  const update: Record<string, unknown> = {
    name: config.name,
    role: "superadmin",
    updatedAt: new Date(),
  };

  if (needsPasswordUpdate) {
    update.password = await bcrypt.hash(config.password, 12);
  }

  await users.updateOne({ _id: existing._id }, { $set: update });

  return json(200, {
    ok: true,
    action: "updated",
    email: config.email,
    role: "superadmin",
    passwordUpdated: needsPasswordUpdate,
  });
}

export async function GET(req: NextRequest) {
  try {
    return await runBootstrap(req);
  } catch (error) {
    console.error("bootstrap-admin GET error", error);
    return json(500, { ok: false, error: "Internal server error" });
  }
}

export async function POST(req: NextRequest) {
  try {
    let bodySecret = "";
    try {
      const body = await req.json();
      if (body && typeof body.secret === "string") {
        bodySecret = body.secret;
      }
    } catch {
      // Optional body.
    }

    return await runBootstrap(req, bodySecret);
  } catch (error) {
    console.error("bootstrap-admin POST error", error);
    return json(500, { ok: false, error: "Internal server error" });
  }
}
