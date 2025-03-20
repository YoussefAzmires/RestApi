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
import { a } from "vitest/dist/chunks/suite.d.FvehnV49.js";

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
/*
 * Verifies that the /maintenance endpoint for the POST method correctly inserts and returns a  valid 
 * maintenance record
*/
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
/**
 * Verifies that the /maintenance endpoint for the POST method returns null if the record inserted is invalid
 */
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

/**
 * Verifies that the /maintenance/carPart/:carPart endpoint for the GET method returns a record if the carPart exists in the database
 */
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
/**
 * Verifies that the /maintenance/carPart/:carPart endpoint for the GET method returns null if the carPart does not exist in the database
 */
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

/**
 * Verifies that the /maintenance endpoint for the GET method returns all maintenance records
 */
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

  /**
   * Verifies that the /maintenance endpoint for the GET method returns an empty array if there are no maintenance records
   */
  test("GET /maintenance empty case", async () => {
    const allRecords = await getAllMaintenanceRecord();
    expect(allRecords.length).toBe(0);
  });

  /**
   * Verifies that the /maintenance/carPart/:carPart endpoint for the DELETE method correctly deletes a record through a carPart string
   */
  test("DELETE /maintenance/carPart/:carPart success case", async () => {
    const testRecord1: MaintenanceRecord = {
        carPart: "airbags",
        lastChanged: new Date('2023-01-01'),
        nextChange: new Date('2024-01-01')
      };
    
      await addMaintenanceRecord(testRecord1);

      await deleteOneMaintenanceRecord("airbags");

      const result = await getOneMaintenanceRecord("airbags");
      expect(result).toBeNull();
      const allRecords = await getAllMaintenanceRecord();
      expect(allRecords.length).toBe(0);
  })
  /**
   * Verifies that the /maintenance/carPart/:carPart endpoint for the DELETE method returns null if the carPart does not exist and does not delete any records
   */
  test("DELETE /maintenance/carPart/:carPart failure case", async () => {
    const testRecord1: MaintenanceRecord = {
        carPart: "airbags",
        lastChanged: new Date('2023-01-01'),
        nextChange: new Date('2024-01-01')
      };
      
      await addMaintenanceRecord(testRecord1);
      await deleteOneMaintenanceRecord("nonexistentpart");
      const result = await getOneMaintenanceRecord("airbags");
      expect(result).not.toBeNull();
      expect(result?.carPart).toBe("airbags");
    })

    test("PUT /maintenance/carPart/:carPart success case", async () => {
        const oldRecord: MaintenanceRecord = {
          carPart: "airbags",
          lastChanged: new Date('2023-01-01'),
          nextChange: new Date('2024-01-01')
        };

        const newRecord: MaintenanceRecord = {
          carPart: "air-filter",
          lastChanged: new Date('2023-01-05'),
          nextChange: new Date('2024-01-05')
        };
        
        await addMaintenanceRecord(oldRecord);

        const result = await updateOneMaintenanceRecord(oldRecord, newRecord);

        expect(result).not.toBeNull();
        expect(result?.carPart).toBe("air-filter");
        expect(result?.lastChanged).toEqual(new Date('2023-01-05'));
        expect(result?.nextChange).toEqual(new Date('2024-01-05'));

        
    })

    test("PUT /maintenance/carPart/:carPart failure case", async () => {
        const oldRecord: MaintenanceRecord = {
          carPart: "airbags",
          lastChanged: new Date('2023-01-01'),
          nextChange: new Date('2024-01-01')
        };

        const newRecord: MaintenanceRecord = {
          carPart: "",
          lastChanged: new Date('2023-01-05'),
          nextChange: new Date('2024-01-05')
        };
        
        await addMaintenanceRecord(oldRecord);

        const result = await updateOneMaintenanceRecord(oldRecord, newRecord);

        expect(result).toBeNull();
    })


