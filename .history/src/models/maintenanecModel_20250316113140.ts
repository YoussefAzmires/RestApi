import { MongoClient, Db, MongoError } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

let client: MongoClient;
let db: Db;
let maintenanceCollection: any; // Replace `any` with your schema type

async function initialize(): Promise<void> {
  try {
    const url = `${process.env.URL_PRE}${process.env.MONGODB_PWD}${process.env.URL_POST}`;
    if (
      !url ||
      !process.env.URL_PRE ||
      !process.env.MONGODB_PWD ||
      !process.env.URL_POST
    ) {
      throw new Error(
        "Missing required environment variables to connect to MongoDB"
      );
    }
    client = new MongoClient(url);
    await client.connect();
    console.log("Connected to MongoDB!");

    db = client.db("car-maintenance"); // Use your database name

    // Check if the "maintenance" collection exists, create it if it doesn't
    let collectionCursor = db.listCollections({ name: "maintenance" });
    let collectionArray = await collectionCursor.toArray();
    if (collectionArray.length == 0) {
      const collation = { locale: "en", strength: 1 };
      await db.createCollection("maintenance", { collation: collation });
    }
    maintenanceCollection = db.collection("maintenance"); // Use your collection name
  } catch (err) {
    if (err instanceof MongoError) {
      console.error("MongoDB connection failed:", err.message);
    } else {
      console.error("Unexpected error", err);
    }
  }
}

export { initialize, maintenanceCollection };