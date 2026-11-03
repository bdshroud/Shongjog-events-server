import { MongoClient, Db, Collection } from "mongodb";
import dotenv from "dotenv";
import { IEvent, IJoinedEvent } from "../types/index.js";
import { checkAndSeedEvents } from "./seed.js";

dotenv.config();

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/shongjogbd";
const dbName = process.env.DB_NAME || "shongjogbd";

export const client = new MongoClient(uri, {
  connectTimeoutMS: 10000,
  serverSelectionTimeoutMS: 10000,
});

export let db: Db;
export let eventsCollection: Collection<IEvent>;
export let joinedEventsCollection: Collection<IJoinedEvent>;

let isConnected = false;

export async function connectDB(): Promise<Db> {
  if (isConnected && db) {
    return db;
  }

  try {
    await client.connect();
    db = client.db(dbName);
    eventsCollection = db.collection<IEvent>("events");
    joinedEventsCollection = db.collection<IJoinedEvent>("joined_events");

    // Ensure unique compound index on joinedEventsCollection to prevent duplicate joins
    await joinedEventsCollection.createIndex(
      { eventId: 1, userEmail: 1 },
      { unique: true }
    );

    // Index for fast query of upcoming events
    await eventsCollection.createIndex({ eventDate: 1 });
    await eventsCollection.createIndex({ creatorEmail: 1 });

    isConnected = true;
    console.log(`[Database] Connected successfully to MongoDB: "${dbName}"`);

    // Automatic seed check & startup cleanup: deduplicate events & fix broken URLs
    await checkAndSeedEvents(eventsCollection, joinedEventsCollection);

    return db;
  } catch (error) {
    console.error("[Database] Connection failed:", error);
    throw error;
  }
}
