"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.maintenanceCollection = void 0;
exports.initialize = initialize;
exports.addMaintenanceRecord = addMaintenanceRecord;
exports.getAllMaintenanceRecord = getAllMaintenanceRecord;
exports.getOneMaintenanceRecord = getOneMaintenanceRecord;
exports.deleteOneMaintenanceRecord = deleteOneMaintenanceRecord;
exports.updateOneMaintenanceRecord = updateOneMaintenanceRecord;
const mongodb_1 = require("mongodb");
const errorController_1 = require("../Controller/errorController");
let client;
let db;
let maintenanceCollection;
const dbname = "car_maintenance";
function initialize() {
    return __awaiter(this, void 0, void 0, function* () {
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
            const MONGODB_URI = "mongodb+srv://admin:admin@cluster0.cff59.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
            console.log(MONGODB_URI);
            const url = `${MONGODB_URI}`;
            if (!MONGODB_URI) {
                throw new Error("Missing required environment variables to connect to MongoDB");
            }
            client = new mongodb_1.MongoClient(url);
            yield client.connect();
            console.log("Connected to MongoDB!");
            db = client.db(dbname);
            // Check if the "maintenance" collection exists, create it if it doesn't
            let collectionCursor = db.listCollections({ name: "maintenance" });
            let collectionArray = yield collectionCursor.toArray();
            if (collectionArray.length == 0) {
                const collation = { locale: "en", strength: 1 };
                yield db.createCollection("maintenance", { collation: collation });
            }
            exports.maintenanceCollection = maintenanceCollection = db.collection("maintenance"); // Use your collection name
        }
        catch (err) {
            if (err instanceof mongodb_1.MongoError) {
                console.error("MongoDB connection failed:", err.message);
            }
            else {
                console.error("Unexpected error", err);
            }
        }
    });
}
/**
 * Inserts a Maintenance Record into the database.
 * @param record The variable of type MaintenanceRecord to be inserted into the database
 * @returns the record that waas inserted into the database.
 */
function addMaintenanceRecord(record) {
    return __awaiter(this, void 0, void 0, function* () {
        checkIfCollectionInitialized();
        try {
            const result = yield maintenanceCollection.insertOne(record);
            console.log("Inserted maintenance record: " + result.insertedId);
            return record;
        }
        catch (err) {
            if (err instanceof mongodb_1.MongoError) {
                console.log(err.message);
                throw new Error(err.message);
            }
            else if (err instanceof Error) {
                const msg = "Unexpected error occured in addMaintenanceRecord" + err.message;
                throw new errorController_1.DatabaseError(err.message);
            }
            else {
                const msg = "Unknown issue caught in addMaintenanceRecord. Should not happen";
                console.error(msg);
                throw new errorController_1.DatabaseError(msg);
            }
        }
    });
}
function getOneMaintenanceRecord(carPart) {
    return __awaiter(this, void 0, void 0, function* () {
        checkIfCollectionInitialized();
        try {
            const record = (yield maintenanceCollection.findOne({ carPart: carPart })) || null;
            console.log(`Fetched record:`, record);
            return record;
        }
        catch (err) {
            if (err instanceof mongodb_1.MongoError) {
                console.log(err.message);
                throw new Error(err.message);
            }
            else if (err instanceof Error) {
                const msg = "Unexpected error occured in getOneMaintenanceRecord" + err.message;
                throw new errorController_1.DatabaseError(err.message);
            }
            else {
                const msg = "Unknown issue caught in getOneMaintenanceRecord. Should not happen";
                console.error(msg);
                throw new errorController_1.DatabaseError(msg);
            }
        }
    });
}
/**
 * Gets all the maintenance records from the database
 * @returns An array of all the maintenance records found.
 */
function getAllMaintenanceRecord() {
    return __awaiter(this, void 0, void 0, function* () {
        checkIfCollectionInitialized();
        try {
            const records = (yield maintenanceCollection.find({})).toArray();
            console.log(`Fetches list of records: ${records}`);
            return records;
        }
        catch (err) {
            if (err instanceof mongodb_1.MongoError) {
                console.log(err.message);
                throw new Error(err.message);
            }
            else if (err instanceof Error) {
                const msg = "Unexpected error occured in addMaintenanceRecord" + err.message;
                throw new errorController_1.DatabaseError(err.message);
            }
            else {
                const msg = "Unknown issue caught in addMaintenanceRecord. Should not happen";
                console.error(msg);
                throw new errorController_1.DatabaseError(msg);
            }
        }
    });
}
/**
 * Takes a name of a car part and deletes it from the database.
 * @param carPart the name of the carPart record to be deleted
 * @returns
 */
function deleteOneMaintenanceRecord(carPart) {
    return __awaiter(this, void 0, void 0, function* () {
        checkIfCollectionInitialized();
        try {
            const result = yield maintenanceCollection.deleteOne({ carPart: carPart });
            if (result.deletedCount === 0) {
                console.log(`No record found for car part: ${carPart}`);
                return null;
            }
            console.log(`Deleted record for car part: ${carPart}`);
            return;
        }
        catch (err) {
            if (err instanceof mongodb_1.MongoError) {
                console.log(err.message);
                throw new Error(err.message);
            }
            else if (err instanceof Error) {
                const msg = "Unexpected error occurred in deleteOneMaintenanceRecord: " + err.message;
                throw new errorController_1.DatabaseError(msg);
            }
            else {
                const msg = "Unknown issue caught in deleteOneMaintenanceRecord. Should not happen";
                console.error(msg);
                throw new errorController_1.DatabaseError(msg);
            }
        }
    });
}
function updateOneMaintenanceRecord(oldRecord, newRecord) {
    return __awaiter(this, void 0, void 0, function* () {
        checkIfCollectionInitialized();
        try {
            const result = yield maintenanceCollection.findOneAndUpdate({ carPart: oldRecord.carPart, lastChanged: oldRecord.lastChanged, nextChange: oldRecord.nextChange }, // Find by old record
            { $set: { carPart: newRecord.carPart, lastChanged: newRecord.lastChanged, nextChange: newRecord.nextChange } }, // Set new values record
            { returnDocument: "after" });
            if (!result) {
                return null;
            }
            console.log(result);
            console.log(`Updated record for car part: ${oldRecord.carPart}`);
            return result;
        }
        catch (err) {
            if (err instanceof mongodb_1.MongoError) {
                console.log(err.message);
                throw new Error(err.message);
            }
            else if (err instanceof Error) {
                const msg = "Unexpected error occured in addMaintenanceRecord" + err.message;
                throw new errorController_1.DatabaseError(err.message);
            }
            else {
                const msg = "Unknown issue caught in addMaintenanceRecord. Should not happen";
                console.error(msg);
                throw new errorController_1.DatabaseError(msg);
            }
        }
    });
}
/**
 * Checks if the collection has been initialized
 * @throws DatabaseError if the collection is not initialized
 */
function checkIfCollectionInitialized() {
    if (!maintenanceCollection) {
        throw new errorController_1.DatabaseError("Collection not initialized");
    }
}
//# sourceMappingURL=maintenanceModel.js.map