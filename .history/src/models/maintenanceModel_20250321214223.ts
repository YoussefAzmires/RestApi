import { MongoClient, Db, MongoError, Collection } from "mongodb";
import { DatabaseError } from "../Controller/errorController";
import { resourceUsage } from "process";
import { InvalidInputError } from "../Controller/errorController";
let client: MongoClient;
let db: Db;
let maintenanceCollection: Collection<MaintenanceRecord>;
const dbname = "car_maintenance";

async function initialize(): Promise<void> {
 
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

    db = client.db(dbname); 

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
 * Adds a new maintenance record to the database.
 * 
 * @param record - The MaintenanceRecord object to be added.
 * @returns The inserted MaintenanceRecord object on success, or null if validation fails.
 * @throws Error if a MongoDB error occurs, or a DatabaseError if an unexpected error occurs.
 */

async function addMaintenanceRecord(record: MaintenanceRecord): Promise<MaintenanceRecord | null> {
  checkIfCollectionInitialized();
  if (!record.carPart || record.carPart.trim() === "" || !record.lastChanged || !record.nextChange) {
    console.log("Invalid record: missing required fields");
    return null;
  }
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
      console.log(msg);
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
 * Retrieves a single maintenance record from the database based on the car part name.
 * @param carPart - The name of the car part to be retrieved.
 * @returns A MaintenanceRecord object if found, or null if no record exists for the given car part.
 * @throws Error if a MongoDB error occurs, or a DatabaseError if an unexpected error occurs.
 */

/******  1a3262a9-5975-4926-881d-67c42d93fbcf  *******/
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
      console.log(msg);
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
 * Retrieves all maintenance records in the database.
 * @Returns an array of MaintenanceRecord objects on success.
 * @Returns an empty array if there are no records.
 * @Returns a JSON error object on failure.
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
      console.log(msg);
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
 * Deletes a single maintenance record from the database based on the car part name.
 * 
 * @param carPart - The name of the car part for which the record should be deleted.
 * @returns void if the deletion is successful, or null if no record is found for the given car part.
 * @throws Error if a MongoDB error occurs, or a DatabaseError if an unexpected error occurs.
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

async function updateOneMaintenanceRecord(oldRecord:MaintenanceRecord, newRecord:MaintenanceRecord): Promise<MaintenanceRecord | null> {
  checkIfCollectionInitialized(); 
  try{
    const result = await maintenanceCollection.findOneAndUpdate(
      { carPart: oldRecord.carPart, lastChanged: oldRecord.lastChanged, nextChange: oldRecord.nextChange }, // Find by old record
      { $set: { carPart: newRecord.carPart, lastChanged: newRecord.lastChanged, nextChange: newRecord.nextChange }}, // Set new values record
      { returnDocument: "after" } 
    );
    if(!result){
      return null;
    }
    console.log(result);
    console.log(`Updated record for car part: ${oldRecord.carPart}`);
    return result
  }
  catch (err: unknown) {
    if (err instanceof MongoError) {
      console.log(err.message);
      throw new Error(err.message);
    } else if (err instanceof Error) {
      const msg =
        "Unexpected error occured in addMaintenanceRecord" + err.message;
      console.log(msg);
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
function validateMaintenanceRecord(record: MaintenanceRecord): void {
  console.log('Validating maintenance record...');
  if (!record.carPart || record.carPart.trim() === "") {
    throw new InvalidInputError("carPart is required and cannot be empty");
  }
  if (!record.lastChanged) {
    throw new InvalidInputError("lastChanged is required");
  }
  if (!record.nextChange) {
    throw new InvalidInputError("nextChange is required");
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

