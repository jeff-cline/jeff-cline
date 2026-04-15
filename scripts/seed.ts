/**
 * Seed script: creates admin user and initial resources
 * Run: npx tsx scripts/seed.ts
 */
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/jeff-cline";

async function seed() {
  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db();

  console.log("🔥 Seeding database...");

  // Create admin user
  const adminEmail = "jeff.cline@me.com";
  const existing = await db.collection("users").findOne({ email: adminEmail });
  if (!existing) {
    const hashed = await bcrypt.hash("profit-at-scale-2024", 12);
    await db.collection("users").insertOne({
      email: adminEmail,
      password: hashed,
      name: "Jeff Cline",
      phone: "223-400-8146",
      company: "FIREHORSE",
      siloInterest: "business",
      role: "admin",
      createdAt: new Date(),
    });
    console.log("✅ Admin user created: jeff.cline@me.com / profit-at-scale-2024");
  } else {
    // Ensure admin role
    await db.collection("users").updateOne({ email: adminEmail }, { $set: { role: "admin" } });
    console.log("✅ Admin user already exists, ensured admin role");
  }

  // Create indexes
  await db.collection("users").createIndex({ email: 1 }, { unique: true });
  await db.collection("quizResults").createIndex({ email: 1 });
  await db.collection("quizResults").createIndex({ createdAt: -1 });
  await db.collection("resources").createIndex({ silo: 1 });
  await db.collection("apiKeys").createIndex({ service: 1 }, { unique: true });
  await db.collection("passwordResets").createIndex({ token: 1 });
  await db.collection("passwordResets").createIndex({ expires: 1 }, { expireAfterSeconds: 0 });
  console.log("✅ Indexes created");

  await client.close();
  console.log("🎯 Done!");
}

seed().catch(console.error);
