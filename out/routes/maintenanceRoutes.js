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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const maintenanceModel_1 = require("../src/models/maintenanceModel");
const maintenanceModel_2 = require("../src/models/maintenanceModel");
const router = express_1.default.Router();
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { carPart, lastChanged, nextChange } = req.body;
        if (!carPart || !lastChanged || !nextChange) {
            throw Error('Missing required fields');
        }
        const record = { carPart, lastChanged, nextChange };
        const insertedRecord = yield (0, maintenanceModel_1.addMaintenanceRecord)(record);
        console.log(insertedRecord);
        res.status(201).json(insertedRecord);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
    }
}));
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const records = yield (0, maintenanceModel_2.getAllMaintenanceRecord)();
        console.log(records);
        res.status(201).json(records);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
    }
}));
exports.default = router;
//# sourceMappingURL=maintenanceRoutes.js.map