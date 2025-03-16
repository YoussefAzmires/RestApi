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
const mongodb_1 = require("mongodb");
let client;
let db;
let maintenanceCollection;
const dbname = "car_maintenance";
function initialize() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const url = `${process.env.URL_PRE}${process.env.MONGODB_PWD}${process.env.URL_POST}`;
            if (!url ||
                !process.env.URL_PRE ||
                !process.env.MONGODB_PWD ||
                !process.env.URL_POST) {
                throw new Error("Missing required environment variables to connect to MongoDB");
            }
            client = new mongodb_1.MongoClient(url);
            yield client.connect();
            console.log("Connected to MongoDB!");
            db = client.db(dbname); // Use your database name
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
//# sourceMappingURL=maintenanceModel.js.map