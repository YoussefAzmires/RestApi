// import app from "./app.js";
import supertest from "supertest";
// const testRequest = supertest(app);

import { MongoMemoryServer } from "mongodb-memory-server";
import { Db, MongoClient } from "mongodb";
import { addMaintenanceRecord, initialize, MaintenanceRecord } from "./models/maintenanceModel.js";
import { DatabaseError } from "./Controller/errorController.js";
import { maintenanceCollection } from "./models/maintenanceModel.js";

let mongoServer: MongoMemoryServer;
let client: MongoClient;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Setup environment variables for testing
  process.env.MONGODB_URI = uri;

  client = new MongoClient(uri);
  await client.connect();
  await initialize();
});

beforeEach(async () => {
  if (!maintenanceCollection) {
    throw new Error("maintenanceCollection is not initialized");
  }
  await maintenanceCollection.deleteMany({});
});

afterAll(async () => {
  await client.close();
  await mongoServer.stop();
});

test("POST /maintenance success case", async () => {
    const testRecord : MaintenanceRecord = {
        carPart: "engine",
        lastChanged: new Date('2023-01-01'),
        nextChange: new Date('2024-01-01')
    }
    const result = await addMaintenanceRecord(testRecord);
    expect(result).not.toBeNull();
    expect(result?.carPart).toBe("engine");

    const dbRecord = await maintenanceCollection.findOne({carPart: "engine"});
    expect(dbRecord).not.toBeNull();
    expect(dbRecord?.carPart).toBe("engine");
    expect(dbRecord?.lastChanged).toEqual(new Date('2023-01-01'));
    expect(dbRecord?.nextChange).toEqual(new Date('2024-01-01'));
})

test("POST /maintenance failure case", async () => {
    const invalidRecord : MaintenanceRecord = {
        carPart: "",
        lastChanged: new Date('2023-01-01'),
        nextChange: new Date('2024-01-01')
    }
    try {
        const result = await addMaintenanceRecord(invalidRecord);
        expect(result).toBeNull();  // This line should cause failure because the record is invalid.
      } catch (error) {
        expect(error).toBeInstanceOf(Error); // Expecting an error to be thrown
      }
})

test("GET /maintenance success case", async () => {
    const testRedcord: MaintenanceRecord={
        carPart: "airbags",
        lastChanged: new Date('2023-01-01'),
        nextChange: new Date('2024-01-01')
    }
    await addMaintenanceRecord(testRedcord);
    const result = await maintenanceCollection.findOne({carPart: "airbags"});
    expect(result).not.toBeNull();
    expect(result?.carPart).toBe("airbags");
    expect(result?.lastChanged).toEqual(new Date('2023-01-01'));
    expect(result?.nextChange).toEqual(new Date('2024-01-01'));
 
})