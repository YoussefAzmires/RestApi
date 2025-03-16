import { MongoClient, Db, MongoError, Collection } from 'mongodb';
import { DatabaseError } from '../errorController';
let client: MongoClient;
let db: Db;
let maintenanceCollection: Collection<MaintenanceRecord>; 
const dbname = "car_maintenance";

async function initialize(): Promise<void> {


  //TODO I CANT RUN FROM IDE SO I NEED TO HARDCODE THE URI HERE AND RUN FROM TERMINAL FIX LATER.

  // try {
  //   console.log(`${process.env.URL_PRE}${process.env.MONGODB_PWD}${process.env.URL_POST}`);
  //   const url = `${process.env.URL_PRE}${process.env.MONGODB_PWD}${process.env.URL_POST}`;
  //   if (
  //     !url ||
  //     !process.env.URL_PRE ||
  //     !process.env.MONGODB_PWD ||
  //     !process.env.URL_POST
  //   ) {
  //     throw new Error(
  //       "Missing required environment variables to connect to MongoDB"
  //     );
  //   }
  try {
    const MONGODB_URI="mongodb+srv://admin:admin@cluster0.cff59.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

    console.log(MONGODB_URI)
    const url = `${MONGODB_URI}`;
    if (
      !MONGODB_URI
    ) {
      throw new Error(
        "Missing required environment variables to connect to MongoDB"
      );
    }
    client = new MongoClient(url);
    await client.connect();
    console.log("Connected to MongoDB!");

    db = client.db(dbname); // Use your database name

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

/**
 * Interface for a maintenance record
 */
interface MaintenanceRecord {
    carPart: string; // The name of the car part to be changed, Ex: brake pads
    lastChanged: Date; // Date when the part was last changed
    nextChange: Date; // Date when the part should be changed next
}

async function addMaintenanceRecord(record: MaintenanceRecord): Promise<MaintenanceRecord> {
  if (!maintenanceCollection) {
    throw new DatabaseError ("Collection not initialized");
  }
  try{
    const result = await maintenanceCollection.insertOne(record);
    console.log("ID of the inserted maintenance record: " + result?.insertedId); 

  }
}

export { initialize, maintenanceCollection, MaintenanceRecord };