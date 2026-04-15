const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";

async function seedSJSCDirectory() {
  console.log("🌱 Seeding SJSC Directory...");
  
  const client = await MongoClient.connect(MONGODB_URI, {
    connectTimeoutMS: 5000,
    serverSelectionTimeoutMS: 5000,
  });

  const db = client.db("jeff-cline");
  
  // Read the profiles JSON file
  const profilesPath = path.join(__dirname, "..", "sjsc_profiles.json");
  const profilesData = JSON.parse(fs.readFileSync(profilesPath, "utf8"));
  
  console.log(`📊 Found ${profilesData.length} profiles to seed`);
  
  // Transform profiles for MongoDB
  const profiles = profilesData.map(profile => ({
    name: profile.name,
    page: profile.page,
    title: profile.title,
    bio: profile.bio,
    email: profile.email,
    website: profile.website,
    expertise: profile.expertise,
    lookingFor: profile.lookingFor,
    instagram: profile.instagram,
    linkedin: profile.linkedin,
    facebook: profile.facebook,
    photo: profile.photo || null,
    notes: [], // Array of note objects: { author: string, text: string, rating: number (1-5), createdAt: Date }
    rating: null, // Calculated average of note ratings
    createdAt: new Date(),
  }));
  
  // Drop existing collection and insert fresh data
  await db.collection("sjsc_directory").drop().catch(() => {});
  const result = await db.collection("sjsc_directory").insertMany(profiles);
  
  console.log(`✅ Successfully seeded ${result.insertedCount} SJSC profiles`);
  
  // Create indexes for performance
  await db.collection("sjsc_directory").createIndex({ name: 1 });
  await db.collection("sjsc_directory").createIndex({ rating: 1 });
  await db.collection("sjsc_directory").createIndex({ email: 1 });
  
  console.log("📋 Created database indexes");
  
  await client.close();
  console.log("🎉 SJSC Directory seeding complete!");
}

if (require.main === module) {
  seedSJSCDirectory().catch(console.error);
}

module.exports = { seedSJSCDirectory };