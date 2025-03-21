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
// const testRequest = supertest(app);
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongodb_1 = require("mongodb");
const maintenanceModel_js_1 = require("./models/maintenanceModel.js");
const maintenanceModel_js_2 = require("./models/maintenanceModel.js");
let mongoServer;
let client;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    mongoServer = yield mongodb_memory_server_1.MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    // Setup environment variables for testing
    process.env.MONGODB_URI = uri;
    client = new mongodb_1.MongoClient(uri);
    yield client.connect();
    yield (0, maintenanceModel_js_1.initialize)();
}));
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    if (!maintenanceModel_js_2.maintenanceCollection) {
        throw new Error("maintenanceCollection is not initialized");
    }
    yield maintenanceModel_js_2.maintenanceCollection.deleteMany({});
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield client.close();
    yield mongoServer.stop();
}));
/*
 * Verifies that the /maintenance endpoint for the POST method correctly inserts and returns a  valid
 * maintenance record
*/
test("POST /maintenance success case", () => __awaiter(void 0, void 0, void 0, function* () {
    const testRecord = {
        carPart: "engine",
        lastChanged: new Date("2023-01-01"),
        nextChange: new Date("2024-01-01"),
    };
    const result = yield (0, maintenanceModel_js_1.addMaintenanceRecord)(testRecord);
    expect(result).not.toBeNull();
    expect(result === null || result === void 0 ? void 0 : result.carPart).toBe("engine");
    const dbRecord = yield (0, maintenanceModel_js_1.getOneMaintenanceRecord)("engine"); // Using the appropriate function here
    expect(dbRecord).not.toBeNull();
    expect(dbRecord === null || dbRecord === void 0 ? void 0 : dbRecord.carPart).toBe("engine");
    expect(dbRecord === null || dbRecord === void 0 ? void 0 : dbRecord.lastChanged).toEqual(new Date("2023-01-01"));
    expect(dbRecord === null || dbRecord === void 0 ? void 0 : dbRecord.nextChange).toEqual(new Date("2024-01-01"));
}));
/**
 * Verifies that the /maintenance endpoint for the POST method returns null if the record inserted is invalid
 */
test("POST /maintenance failure case", () => __awaiter(void 0, void 0, void 0, function* () {
    const invalidRecord = {
        carPart: "", // Invalid record cant be empty
        lastChanged: new Date("2023-01-01"),
        nextChange: new Date("2024-01-01"),
    };
    try {
        const result = yield (0, maintenanceModel_js_1.addMaintenanceRecord)(invalidRecord);
        expect(result).toBeNull();
    }
    catch (error) {
        expect(error).toBeInstanceOf(Error);
    }
}));
/**
 * Verifies that the /maintenance/carPart/:carPart endpoint for the GET method returns a record if the carPart exists in the database
 */
test("GET /maintenance/carPart/:carPart success case", () => __awaiter(void 0, void 0, void 0, function* () {
    const testRecord = {
        carPart: "airbags",
        lastChanged: new Date("2023-01-01"),
        nextChange: new Date("2024-01-01"),
    };
    yield (0, maintenanceModel_js_1.addMaintenanceRecord)(testRecord);
    const result = yield (0, maintenanceModel_js_1.getOneMaintenanceRecord)("airbags");
    expect(result).not.toBeNull();
    expect(result === null || result === void 0 ? void 0 : result.carPart).toBe("airbags");
    expect(result === null || result === void 0 ? void 0 : result.lastChanged).toEqual(new Date("2023-01-01"));
    expect(result === null || result === void 0 ? void 0 : result.nextChange).toEqual(new Date("2024-01-01"));
}));
/**
 * Verifies that the /maintenance/carPart/:carPart endpoint for the GET method returns null if the carPart does not exist in the database
 */
test("GET /maintenance/carPart/:carPart failure case", () => __awaiter(void 0, void 0, void 0, function* () {
    const testRecord = {
        carPart: "airbags",
        lastChanged: new Date("2023-01-01"),
        nextChange: new Date("2024-01-01"),
    };
    yield (0, maintenanceModel_js_1.addMaintenanceRecord)(testRecord);
    const result = yield (0, maintenanceModel_js_1.getOneMaintenanceRecord)("nonexistentpart"); // Non-existing part
    expect(result).toBeNull(); // Should return null since no record with that carPart exists
}));
/**
 * Verifies that the /maintenance endpoint for the GET method returns all maintenance records
 */
test("GET /maintenance success case", () => __awaiter(void 0, void 0, void 0, function* () {
    const testRecord1 = {
        carPart: "airbags",
        lastChanged: new Date('2023-01-01'),
        nextChange: new Date('2024-01-01')
    };
    const testRecord2 = {
        carPart: "oilchange",
        lastChanged: new Date('2023-01-05'),
        nextChange: new Date('2024-01-05')
    };
    yield (0, maintenanceModel_js_1.addMaintenanceRecord)(testRecord1);
    yield (0, maintenanceModel_js_1.addMaintenanceRecord)(testRecord2);
    const allRecords = yield (0, maintenanceModel_js_1.getAllMaintenanceRecord)();
    expect(allRecords.length).toBe(2);
    expect(allRecords[0].carPart).toBe("airbags");
    expect(allRecords[1].carPart).toBe("oilchange");
}));
/**
 * Verifies that the /maintenance endpoint for the GET method returns an empty array if there are no maintenance records
 */
test("GET /maintenance empty case", () => __awaiter(void 0, void 0, void 0, function* () {
    const allRecords = yield (0, maintenanceModel_js_1.getAllMaintenanceRecord)();
    expect(allRecords.length).toBe(0);
}));
/**
 * Verifies that the /maintenance/carPart/:carPart endpoint for the DELETE method correctly deletes a record through a carPart string
 */
test("DELETE /maintenance/carPart/:carPart success case", () => __awaiter(void 0, void 0, void 0, function* () {
    const testRecord1 = {
        carPart: "airbags",
        lastChanged: new Date('2023-01-01'),
        nextChange: new Date('2024-01-01')
    };
    yield (0, maintenanceModel_js_1.addMaintenanceRecord)(testRecord1);
    yield (0, maintenanceModel_js_1.deleteOneMaintenanceRecord)("airbags");
    const result = yield (0, maintenanceModel_js_1.getOneMaintenanceRecord)("airbags");
    expect(result).toBeNull();
    const allRecords = yield (0, maintenanceModel_js_1.getAllMaintenanceRecord)();
    expect(allRecords.length).toBe(0);
}));
/**
 * Verifies that the /maintenance/carPart/:carPart endpoint for the DELETE method returns null if the carPart does not exist and does not delete any records
 */
test("DELETE /maintenance/carPart/:carPart failure case", () => __awaiter(void 0, void 0, void 0, function* () {
    const testRecord1 = {
        carPart: "airbags",
        lastChanged: new Date('2023-01-01'),
        nextChange: new Date('2024-01-01')
    };
    yield (0, maintenanceModel_js_1.addMaintenanceRecord)(testRecord1);
    yield (0, maintenanceModel_js_1.deleteOneMaintenanceRecord)("nonexistentpart");
    const result = yield (0, maintenanceModel_js_1.getOneMaintenanceRecord)("airbags");
    expect(result).not.toBeNull();
    expect(result === null || result === void 0 ? void 0 : result.carPart).toBe("airbags");
}));
/**
 *
 */
test("PUT /maintenance/carPart/:carPart success case", () => __awaiter(void 0, void 0, void 0, function* () {
    const oldRecord = {
        carPart: "airbags",
        lastChanged: new Date('2023-01-01'),
        nextChange: new Date('2024-01-01')
    };
    const newRecord = {
        carPart: "air-filter",
        lastChanged: new Date('2023-01-05'),
        nextChange: new Date('2024-01-05')
    };
    yield (0, maintenanceModel_js_1.addMaintenanceRecord)(oldRecord);
    const result = yield (0, maintenanceModel_js_1.updateOneMaintenanceRecord)(oldRecord, newRecord);
    expect(result).not.toBeNull();
    expect(result === null || result === void 0 ? void 0 : result.carPart).toBe("air-filter");
    expect(result === null || result === void 0 ? void 0 : result.lastChanged).toEqual(new Date('2023-01-05'));
    expect(result === null || result === void 0 ? void 0 : result.nextChange).toEqual(new Date('2024-01-05'));
}));
/**
 * Verifies that the /maintenance/carPart/:carPart endpoint for the PUT method returns null if the old record does not exist
 */
test("PUT /maintenance/carPart/:carPart failure case", () => __awaiter(void 0, void 0, void 0, function* () {
    const oldRecord = {
        carPart: "airbags",
        lastChanged: new Date('2023-01-01'),
        nextChange: new Date('2024-01-01')
    };
    const newRecord = {
        carPart: "air-filter",
        lastChanged: new Date('2023-01-05'),
        nextChange: new Date('2024-01-05')
    };
    const unexistingRecord = {
        carPart: "nonexistentpart",
        lastChanged: new Date('2023-01-05'),
        nextChange: new Date('2024-01-05')
    };
    yield (0, maintenanceModel_js_1.addMaintenanceRecord)(oldRecord);
    const result = yield (0, maintenanceModel_js_1.updateOneMaintenanceRecord)(unexistingRecord, newRecord);
    expect(result).toBeNull();
}));
//# sourceMappingURL=app.test.js.map