import { MongoClient, Db, MongoError, Collection } from "mongodb";
import { DatabaseError } from "../errorController";
import { resourceUsage } from "process";
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
    const MONGODB_URI =
      "mongodb+srv://admin:admin@cluster0.cff59.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

    console.log(MONGODB_URI);
    const url = `${MONGODB_URI}`;
    if (!MONGODB_URI) {
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
  nextChange?: Date; // Date when the part should be changed next
}
/**
 * Inserts a Maintenance Record into the database.
 * @param record The variable of type MaintenanceRecord to be inserted into the database
 * @returns the record that waas inserted into the database.
 */
async function addMaintenanceRecord(record: MaintenanceRecord): Promise<MaintenanceRecord | null> {
  checkIfCollectionInitialized();
  try {
    const result = await maintenanceCollection.insertOne(record);
    console.log("Inserted maintenance record: " + result.insertedId);
    return record;
  } catch (err: unknown) {
    if (err instanceof MongoError) {
      console.log(err.message);
      throw new Error(err.message);
    } else if (err instanceof Error) {
      const msg =
        "Unexpected error occured in addMaintenanceRecord" + err.message;
      throw new DatabaseError(err.message);
    } else {
      const msg =
        "Unknown issue caught in addMaintenanceRecord. Should not happen";
      console.error(msg);
      throw new DatabaseError(msg);
    }
  }
}
async function getOneMaintenanceRecord(carPart: string): Promise<MaintenanceRecord | null> {
  checkIfCollectionInitialized()
  try {
    const record = (await maintenanceCollection.findOne({ carPart: carPart })) || null;
    console.log(`Fetched record:`, record);
    return record;
  } catch (err: unknown) {
    if (err instanceof MongoError) {
      console.log(err.message);
      throw new Error(err.message);
    } else if (err instanceof Error) {
      const msg =
        "Unexpected error occured in getOneMaintenanceRecord" + err.message;
      throw new DatabaseError(err.message);
    } else {
      const msg =
        "Unknown issue caught in getOneMaintenanceRecord. Should not happen";
      console.error(msg);
      throw new DatabaseError(msg);
    }
  }
}
/**
 * Gets all the maintenance records from the database
 * @returns An array of all the maintenance records found.
 */
async function getAllMaintenanceRecord(): Promise<Array<MaintenanceRecord>> {

  checkIfCollectionInitialized()
  try {
    const records = (await maintenanceCollection.find({})).toArray();
    console.log(`Fetches list of records: ${records}`);
    return records;
  } catch (err: unknown) {
    if (err instanceof MongoError) {
      console.log(err.message);
      throw new Error(err.message);
    } else if (err instanceof Error) {
      const msg =
        "Unexpected error occured in addMaintenanceRecord" + err.message;
      throw new DatabaseError(err.message);
    } else {
      const msg =
        "Unknown issue caught in addMaintenanceRecord. Should not happen";
      console.error(msg);
      throw new DatabaseError(msg);
    }
  }
}

/**
 * Takes a name of a car part and deletes it from the database.
 * @param carPart the name of the carPart record to be deleted
 * @returns 
 */
async function deleteOneMaintenanceRecord(carPart: string): Promise<void | null> {
  checkIfCollectionInitialized();

  try {
    const result = await maintenanceCollection.deleteOne({ carPart: carPart });
    
    if (result.deletedCount === 0) {
      console.log(`No record found for car part: ${carPart}`);
      return null;
    }

    console.log(`Deleted record for car part: ${carPart}`);
    return; 

  } catch (err: unknown) {
    if (err instanceof MongoError) {
      console.log(err.message);
      throw new Error(err.message);
    } else if (err instanceof Error) {
      const msg = "Unexpected error occurred in deleteOneMaintenanceRecord: " + err.message;
      throw new DatabaseError(msg);
    } else {
      const msg = "Unknown issue caught in deleteOneMaintenanceRecord. Should not happen";
      console.error(msg);
      throw new DatabaseError(msg);
    }
  }
}

async function updateOneMaintenanceRecord(oldCarPart: string, newRecord:MaintenanceRecord): Promise<MaintenanceRecord | null> {
  checkIfCollectionInitialized(); 
  try{
    const result = await maintenanceCollection.findOneAndUpdate(
      { carPart: oldCarPart }, // Find the car Part and update by a full new record by the current  
      { $set: { carPart: newRecord.carPart, lastChanged: newRecord.lastChanged, nextChange: newRecord.nextChange }}, // Set new values for make and model
      { returnDocument: "after" } 
    );
    if(!result){
      return null;
    }
    console.log(result);
    console.log(`Updated record for car part: ${oldCarPart}`);
    return result
  }
  catch (err: unknown) {
    if (err instanceof MongoError) {
      console.log(err.message);
      throw new Error(err.message);
    } else if (err instanceof Error) {
      const msg =
        "Unexpected error occured in addMaintenanceRecord" + err.message;
      throw new DatabaseError(err.message);
    } else {
      const msg =
        "Unknown issue caught in addMaintenanceRecord. Should not happen";
      console.error(msg);
      throw new DatabaseError(msg);
    }
  }
  
  
}
/**
 * Checks if the collection has been initialized 
 * @throws DatabaseError if the collection is not initialized
 */
function checkIfCollectionInitialized (): void{
  if (!maintenanceCollection) {
    throw new DatabaseError("Collection not initialized");
  }
}
export {
  initialize,
  maintenanceCollection,
  MaintenanceRecord,
  addMaintenanceRecord,
  getAllMaintenanceRecord,
  getOneMaintenanceRecord,
  deleteOneMaintenanceRecord,
  updateOneMaintenanceRecord
};

