// import app from "./app.js";
import supertest from "supertest";
// const testRequest = supertest(app);

import { MongoMemoryServer } from "mongodb-memory-server";
import { Db, MongoClient } from "mongodb";
import {
  addMaintenanceRecord,
  getAllMaintenanceRecord,
  getOneMaintenanceRecord,
  deleteOneMaintenanceRecord,
  updateOneMaintenanceRecord,
  initialize,
  MaintenanceRecord,
} from "./models/maintenanceModel.js";
import { DatabaseError } from "./Controller/errorController.js";
import { maintenanceCollection } from "./models/maintenanceModel.js";
import { A } from "vitest/dist/chunks/environment.d.C8UItCbf.js";

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
  const testRecord: MaintenanceRecord = {
    carPart: "engine",
    lastChanged: new Date("2023-01-01"),
    nextChange: new Date("2024-01-01"),
  };

  const result = await addMaintenanceRecord(testRecord);
  expect(result).not.toBeNull();
  expect(result?.carPart).toBe("engine");

  const dbRecord = await getOneMaintenanceRecord("engine"); // Using the appropriate function here
  expect(dbRecord).not.toBeNull();
  expect(dbRecord?.carPart).toBe("engine");
  expect(dbRecord?.lastChanged).toEqual(new Date("2023-01-01"));
  expect(dbRecord?.nextChange).toEqual(new Date("2024-01-01"));
});

test("POST /maintenance failure case", async () => {
  const invalidRecord: MaintenanceRecord = {
    carPart: "", // Invalid record cant be empty
    lastChanged: new Date("2023-01-01"),
    nextChange: new Date("2024-01-01"),
  };

  try {
    const result = await addMaintenanceRecord(invalidRecord);
    expect(result).toBeNull();
  } catch (error) {
    expect(error).toBeInstanceOf(Error);
  }
});

test("GET /maintenance/carPart/:carPart success case", async () => {
  const testRecord: MaintenanceRecord = {
    carPart: "airbags",
    lastChanged: new Date("2023-01-01"),
    nextChange: new Date("2024-01-01"),
  };

  await addMaintenanceRecord(testRecord);
  const result = await getOneMaintenanceRecord("airbags");

  expect(result).not.toBeNull();
  expect(result?.carPart).toBe("airbags");
  expect(result?.lastChanged).toEqual(new Date("2023-01-01"));
  expect(result?.nextChange).toEqual(new Date("2024-01-01"));
});

test("GET /maintenance/carPart/:carPart failure case", async () => {
  const testRecord: MaintenanceRecord = {
    carPart: "airbags",
    lastChanged: new Date("2023-01-01"),
    nextChange: new Date("2024-01-01"),
  };

  await addMaintenanceRecord(testRecord);
  const result = await getOneMaintenanceRecord("nonexistentpart"); // Non-existing part

  expect(result).toBeNull(); // Should return null since no record with that carPart exists
});

test("GET /maintenance success case", async () => {
    const testRecord1: MaintenanceRecord = {
      carPart: "airbags",
      lastChanged: new Date('2023-01-01'),
      nextChange: new Date('2024-01-01')
    };
  
    const testRecord2: MaintenanceRecord = {
      carPart: "oilchange",
      lastChanged: new Date('2023-01-05'),
      nextChange: new Date('2024-01-05')
    };
  
    await addMaintenanceRecord(testRecord1);
    await addMaintenanceRecord(testRecord2);
  
    const allRecords = await getAllMaintenanceRecord();
    expect(allRecords.length).toBe(2); 
    expect(allRecords[0].carPart).toBe("airbags");
    expect(allRecords[1].carPart).toBe("oilchange");
  });

  test("GET /maintenance empty case", async () => {
    const allRecords = await getAllMaintenanceRecord();
    expect(allRecords.length).toBe(0);
  });

