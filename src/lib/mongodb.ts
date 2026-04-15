import { MongoClient, Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/jeff-cline";

let cached: { client: MongoClient; db: Db } | null = null;

export async function getDb(): Promise<Db> {
  // During build time, MongoDB might not be available - create a mock for TypeScript
  if (process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV === 'build') {
    throw new Error('Database not available during build');
  }
  
  try {
    if (cached) return cached.db;
    const client = await MongoClient.connect(MONGODB_URI, {
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000,
    });
    const db = client.db();
    cached = { client, db };
    return db;
  } catch (error) {
    console.warn('MongoDB connection failed:', error instanceof Error ? error.message : 'Unknown error');
    throw new Error('Database connection failed');
  }
}

// Helper function for routes that need to handle database unavailability gracefully
export async function tryGetDb(): Promise<Db | null> {
  try {
    return await getDb();
  } catch {
    return null;
  }
}

export async function getClient(): Promise<MongoClient> {
  // During build time, MongoDB might not be available
  if (process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV === 'build') {
    throw new Error('Database not available during build');
  }
  
  try {
    if (cached) return cached.client;
    const client = await MongoClient.connect(MONGODB_URI, {
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000,
    });
    const db = client.db();
    cached = { client, db };
    return cached.client;
  } catch (error) {
    console.warn('MongoDB connection failed:', error instanceof Error ? error.message : 'Unknown error');
    throw new Error('Database connection failed');
  }
}
