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
const errorController_js_1 = require("./Controller/errorController.js");
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
test("POST /maintenance success case", () => __awaiter(void 0, void 0, void 0, function* () {
    const testRecord = {
        carPart: "engine",
        lastChanged: new Date('2023-01-01'),
        nextChange: new Date('2024-01-01')
    };
    const result = yield (0, maintenanceModel_js_1.addMaintenanceRecord)(testRecord);
    expect(result).not.toBeNull();
    expect(result === null || result === void 0 ? void 0 : result.carPart).toBe("engine");
    const dbRecord = yield maintenanceModel_js_2.maintenanceCollection.findOne({ carPart: "engine" });
    expect(dbRecord).not.toBeNull();
    expect(dbRecord === null || dbRecord === void 0 ? void 0 : dbRecord.carPart).toBe("engine");
    expect(dbRecord === null || dbRecord === void 0 ? void 0 : dbRecord.lastChanged).toEqual(new Date('2023-01-01'));
    expect(dbRecord === null || dbRecord === void 0 ? void 0 : dbRecord.nextChange).toEqual(new Date('2024-01-01'));
}));
test("POST /maintenance failure case", () => __awaiter(void 0, void 0, void 0, function* () {
    const invalidRecord = {
        carPart: "",
        lastChanged: new Date('2023-01-01'),
        nextChange: new Date('2024-01-01')
    };
    yield expect((0, maintenanceModel_js_1.addMaintenanceRecord)(invalidRecord)).rejects.toThrow(errorController_js_1.DatabaseError);
}));
//# sourceMappingURL=app.test.js.map