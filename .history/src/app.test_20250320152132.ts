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
        carPart: "engigfne",
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