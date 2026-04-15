/**
 * Idempotent seeder: ensures the bootstrap admin user exists and has role=admin.
 *
 * Usage:
 *   BOOTSTRAP_ADMIN_EMAIL=jeff.cline@me.com \
 *   BOOTSTRAP_ADMIN_PASSWORD='your-strong-password' \
 *   MONGODB_URI=mongodb+srv://... \
 *   npx tsx scripts/seed-dumpster-admin.ts
 *
 * If the user does not exist, it is created. If it exists, role is upgraded
 * to "admin" and (when --reset-password is passed) the password is rotated.
 */
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

async function main() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/jeff-cline";
  const email = (process.env.BOOTSTRAP_ADMIN_EMAIL || "jeff.cline@me.com").toLowerCase();
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;
  const reset = process.argv.includes("--reset-password");

  if (!password && !reset) {
    console.warn("[seed-admin] BOOTSTRAP_ADMIN_PASSWORD not set; will only ensure role=admin if user exists.");
  }

  const client = await MongoClient.connect(uri);
  try {
    const db = client.db();
    const users = db.collection("users");
    const existing = await users.findOne({ email });

    if (!existing) {
      if (!password) {
        console.error("[seed-admin] User not found and no BOOTSTRAP_ADMIN_PASSWORD provided.");
        process.exit(1);
      }
      const hashed = await bcrypt.hash(password, 12);
      await users.insertOne({
        email,
        password: hashed,
        name: "Jeff Cline",
        role: "admin",
        createdAt: new Date(),
      });
      console.log(`[seed-admin] Created admin user ${email}`);
      return;
    }

    const update: any = { role: "admin" };
    if (reset && password) {
      update.password = await bcrypt.hash(password, 12);
    }
    await users.updateOne({ email }, { $set: update });
    console.log(`[seed-admin] Ensured ${email} has role=admin${reset ? " (password reset)" : ""}`);
  } finally {
    await client.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
