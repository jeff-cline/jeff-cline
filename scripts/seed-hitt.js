#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = "jeff-cline";

async function seedHittData() {
  console.log('🚀 Starting HITT data seeding...');
  
  // Read the ranked HITT data
  const hittDataPath = '/tmp/sjsc_hitt_ranked.json';
  
  if (!fs.existsSync(hittDataPath)) {
    console.error('❌ HITT data file not found at:', hittDataPath);
    process.exit(1);
  }

  console.log('📖 Reading HITT data...');
  const rawData = fs.readFileSync(hittDataPath, 'utf8');
  const hittData = JSON.parse(rawData);
  console.log(`📊 Found ${hittData.length} HITT leads`);

  // Connect to MongoDB
  console.log('🔌 Connecting to MongoDB...');
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DB_NAME);
  
  const sjscCollection = db.collection('sjsc_directory');
  const hittCollection = db.collection('sjsc_hitt');

  console.log('🔍 Fetching SJSC directory profiles for cross-reference...');
  const sjscProfiles = await sjscCollection.find({}).toArray();
  console.log(`📋 Found ${sjscProfiles.length} SJSC directory profiles`);

  // Create lookup map for SJSC profiles by email and name
  const sjscLookup = new Map();
  sjscProfiles.forEach(profile => {
    if (profile.email) {
      sjscLookup.set(profile.email.toLowerCase(), profile);
    }
    if (profile.name) {
      sjscLookup.set(profile.name.toLowerCase(), profile);
    }
  });

  console.log('🔄 Processing and merging HITT data with SJSC profiles...');
  const mergedData = [];
  let matchedProfiles = 0;

  for (const hittLead of hittData) {
    // Look up matching SJSC profile by email first, then by name
    let matchedProfile = null;
    
    if (hittLead.email) {
      matchedProfile = sjscLookup.get(hittLead.email.toLowerCase());
    }
    
    if (!matchedProfile && hittLead.name) {
      matchedProfile = sjscLookup.get(hittLead.name.toLowerCase());
    }

    // Create merged record
    const mergedRecord = {
      // HITT ranking data
      rank: hittLead.rank,
      name: hittLead.name,
      email: hittLead.email,
      company: hittLead.company,
      title: hittLead.title,
      estimatedNetWorth: hittLead.estimatedNetWorth,
      tier: hittLead.tier,
      confidence: hittLead.confidence,
      keyFacts: hittLead.keyFacts,
      
      // SJSC profile data (if matched)
      photo: matchedProfile?.photo || null,
      bio: matchedProfile?.bio || null,
      expertise: matchedProfile?.expertise || null,
      lookingFor: matchedProfile?.lookingFor || null,
      linkedin: matchedProfile?.linkedin || null,
      instagram: matchedProfile?.instagram || null,
      facebook: matchedProfile?.facebook || null,
      website: matchedProfile?.website || null,
      phone: matchedProfile?.phone || null,
      notes: matchedProfile?.notes || [],
      rating: matchedProfile?.rating || null,
      deckMessage: matchedProfile?.deckMessage || null,
      
      // Metadata
      hasProfileMatch: !!matchedProfile,
      sjscProfileId: matchedProfile?._id || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mergedData.push(mergedRecord);
    
    if (matchedProfile) {
      matchedProfiles++;
      console.log(`✅ Matched: ${hittLead.name} (${hittLead.email})`);
    } else {
      console.log(`⚠️  No match: ${hittLead.name} (${hittLead.email})`);
    }
  }

  console.log(`\n📈 Matching Summary:`);
  console.log(`   Total HITT leads: ${hittData.length}`);
  console.log(`   Matched profiles: ${matchedProfiles}`);
  console.log(`   Unmatched leads: ${hittData.length - matchedProfiles}`);

  // Clear existing HITT collection and insert new data
  console.log('\n🗑️  Clearing existing HITT collection...');
  await hittCollection.deleteMany({});

  console.log('💾 Inserting merged HITT data...');
  const result = await hittCollection.insertMany(mergedData);
  
  console.log(`\n✅ Successfully seeded ${result.insertedCount} HITT records`);
  
  // Create indexes for better performance
  console.log('🏗️  Creating indexes...');
  await hittCollection.createIndex({ rank: 1 });
  await hittCollection.createIndex({ tier: 1 });
  await hittCollection.createIndex({ email: 1 });
  await hittCollection.createIndex({ name: 1 });
  
  // Display tier breakdown
  console.log('\n📊 Tier Breakdown:');
  const tierCounts = await hittCollection.aggregate([
    { $group: { _id: "$tier", count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]).toArray();
  
  tierCounts.forEach(tier => {
    console.log(`   ${tier._id}: ${tier.count} leads`);
  });

  await client.close();
  console.log('\n🎉 HITT data seeding completed successfully!');
}

// Run the seeding
if (require.main === module) {
  seedHittData()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedHittData };