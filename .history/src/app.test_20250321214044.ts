import supertest from "supertest";
const request = supertest('http://localhost:3000');


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
 * Verifies that the /MaintenanceRecords  endpoint for the POST method correctly inserts and returns a  valid 
 * maintenance record
*/
test("POST /MaintenanceRecords success case", async () => {
  const testRecord: MaintenanceRecord = {
    carPart: "engine",
    lastChanged: new Date("2023-01-01"),
    nextChange: new Date("2024-01-01"),
  };

  const response = await request.post('/MaintenanceRecords').send(testRecord);
  expect(response.body).not.toBeNull();
  expect(response.body.carPart).toBe("engine");

  const dbRecordResponse = await request.get('/MaintenanceRecords/engine');
  const dbRecord = dbRecordResponse.body;

  expect(dbRecord).not.toBeNull();
  expect(dbRecord?.carPart).toBe("engine");
  
});
/**
 * Verifies that the /MaintenanceRecords  endpoint for the POST method returns null if the record inserted is invalid
 */
test("POST /MaintenanceRecords failure case", async () => {
  const invalidRecord: MaintenanceRecord = {
    carPart: "", 
    lastChanged: new Date("2023-01-01"),
    nextChange: new Date("2024-01-01"),
  };

  const response = await request.post('/MaintenanceRecords').send(invalidRecord);
  const result = response.body;
  expect(result).toBeNull();
});

/**
 * Verifies that the /MaintenanceRecords/:carPart  endpoint for the GET method returns a record if the carPart exists in the database
 */
test("GET /MaintenanceRecords/:carPart success case", async () => {
  const testRecord: MaintenanceRecord = {
    carPart: "airbags",
    lastChanged: new Date("2023-01-01"),
    nextChange: new Date("2024-01-01"),
  };

  await request.post('/MaintenanceRecords').send(testRecord);
  const response = await request.get('/MaintenanceRecords/airbags');

  expect(response.body).not.toBeNull();
  expect(response.body?.carPart).toBe("airbags");

  // Change expected date to match the test data
  expect(new Date(response.body?.lastChanged)).toEqual(new Date("2023-01-01T00:00:00.000Z"));
  expect(new Date(response.body?.nextChange)).toEqual(new Date("2024-01-01T00:00:00.000Z"));
});

/**
 * Verifies that the /MaintenanceRecords/:carPart  endpoint for the GET method returns null if the carPart does not exist in the database
 */
test("GET /MaintenanceRecords/:carPart failure case", async () => {
  const testRecord: MaintenanceRecord = {
    carPart: "airbags",
    lastChanged: new Date("2023-01-01"),
    nextChange: new Date("2024-01-01"),
  };

  await request.post('/maintenance').send(testRecord);
  const response = await request.get('/MaintenanceRecords/nonexistentpart');
  expect(response.body).toBeNull();
});

/**
 * Verifies that the /MaintenanceRecords endpoint for the GET method returns all maintenance records
 */
test("GET /MaintenanceRecords success case", async () => {
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

  await request.post('/MaintenanceRecords').send(testRecord1);
  await request.post('/MaintenanceRecords').send(testRecord2);

  const response = await request.get('/MaintenanceRecords');
  const allRecords = response.body;

  expect(allRecords.length).toBe(2); 
  expect(allRecords[0].carPart).toBe("airbags");
  expect(allRecords[1].carPart).toBe("oilchange");
});

  /**
   * Verifies that the /MaintenanceRecords endpoint for the GET method returns an empty array if there are no maintenance records
   */
  test("GET /MaintenanceRecords empty case", async () => {
    const response = await request.get('/MaintenanceRecords');
    const allRecords = response.body;
  
    expect(allRecords.length).toBe(0);
  });

  /**
   * Verifies that the /MaintenanceRecords/:carPart  endpoint for the DELETE method correctly deletes a record through a carPart string
   */
  test("DELETE /MaintenanceRecords/:carPart success case", async () => {
    const testRecord1: MaintenanceRecord = {
      carPart: "airbags",
      lastChanged: new Date('2023-01-01'),
      nextChange: new Date('2024-01-01')
    };
  
    await request.post('/MaintenanceRecords').send(testRecord1);
  
    await request.delete('/MaintenanceRecords/airbags');
  
    const response = await request.get('/MaintenanceRecords/airbags');
    expect(response.body).toBeNull();
  
    const allRecordsResponse = await request.get('/MaintenanceRecords');
    const allRecords = allRecordsResponse.body;
    expect(allRecords.length).toBe(0);
  });
  /**
   * Verifies that the /MaintenanceRecords/:carPart  endpoint for the DELETE method returns null if the carPart does not exist and does not delete any records
   */
  test("DELETE /MaintenanceRecords/:carPart failure case", async () => {
    const testRecord1: MaintenanceRecord = {
      carPart: "airbags",
      lastChanged: new Date('2023-01-01'),
      nextChange: new Date('2024-01-01')
    };
  
    await request.post('/MaintenanceRecords').send(testRecord1);
  
    await request.delete('/MaintenanceRecords/nonexistentpart');
  
    const response = await request.get('/MaintenanceRecords/airbags');
    const result = response.body;
  
    expect(result).not.toBeNull();
    expect(result?.carPart).toBe("airbags");
  });
   
  /**
   * Verifies that the /MaintenanceRecords/:carPart endpoint for the PUT method correctly updates a record
   */
    test("PUT /MaintenanceRecords/:carPart success case", async () => {
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
    
      await request.post('/MaintenanceRecords').send(oldRecord);
    
      const response = await request.put(`/MaintenanceRecords/${oldRecord.carPart}`).send(newRecord);
    
      const result = response.body;
    
      // Check the result
      expect(result).not.toBeNull();
      expect(result?.carPart).toBe("air-filter");
    
      // Compare dates with new Date() constructor
      expect(new Date(result?.lastChanged)).toEqual(new Date("2023-01-05T00:00:00.000Z"));
      expect(new Date(result?.nextChange)).toEqual(new Date("2024-01-05T00:00:00.000Z"));
    });
    
    /**
     * Verifies that the /MaintenanceRecords/:carPart endpoint for the PUT method returns null if the old record does not exist
     */
    test("PUT /MaintenanceRecords/:carPart failure case", async () => {
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
    
      await request.post('/MaintenanceRecords').send(oldRecord);
    
      const response = await request.put(`/MaintenanceRecords/nonexistentpart`).send(newRecord);
    
      expect(response.body).toStrictEqual({"error": "Maintenance record not found"});
    });


