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
exports.handleGetOneMaintenanceRecord = handleGetOneMaintenanceRecord;
exports.handleGetAllMaintenanceRecord = handleGetAllMaintenanceRecord;
exports.handleAddMaintenanceRecord = handleAddMaintenanceRecord;
exports.handleDeleteOneMaintenanceRecord = handleDeleteOneMaintenanceRecord;
exports.handleUpdateMaintenanceRecord = handleUpdateMaintenanceRecord;
const maintenanceModel_1 = require("./models/maintenanceModel");
function handleGetOneMaintenanceRecord(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const carPart = req.params.carPart;
            if (!carPart) {
                res.status(400).json({ error: "Missing carPart parameter" });
            }
            const record = yield (0, maintenanceModel_1.getOneMaintenanceRecord)(carPart);
            console.log(record);
            res.status(200).json(record);
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ error: "An error occurred" });
        }
    });
}
function handleGetAllMaintenanceRecord(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const records = yield (0, maintenanceModel_1.getAllMaintenanceRecord)();
            console.log(records);
            res.status(201).json(records);
        }
        catch (err) {
            console.error(err);
            res.status(500).send('An error occurred');
        }
    });
}
/**
 *
 * @param req
 * @param res
 */
function handleAddMaintenanceRecord(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const record = req.body;
            if (!record) {
                res.status(400).json({ error: "Missing maintenance record data" });
            }
            const insertedRecord = yield (0, maintenanceModel_1.addMaintenanceRecord)(record);
            console.log(insertedRecord);
            res.status(201).json(insertedRecord);
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ error: "An error occurred" });
        }
    });
}
function handleUpdateMaintenanceRecord(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const carPart = req.params.carPart;
            const updatedData = req.body;
            const existingRecord = yield (0, maintenanceModel_1.getOneMaintenanceRecord)(carPart);
            if (!existingRecord) {
                res.status(404).json({ error: "Maintenance record not found" });
                return;
            }
            // Update the record
            const updatedRecord = yield (0, maintenanceModel_1.updateOneMaintenanceRecord)(existingRecord, updatedData);
            if (!updatedRecord) {
                res.status(404).json({ error: "Update failed" });
                return;
            }
            res.status(200).json(updatedRecord);
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ error: "An error occurred" });
        }
    });
}
/**
 *
 * @param req
 * @param res
 */
function handleDeleteOneMaintenanceRecord(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const carPart = req.params.carPart;
            if (!carPart) {
                res.status(400).json({ error: "Missing carPart parameter" });
                return;
            }
            const result = yield (0, maintenanceModel_1.deleteOneMaintenanceRecord)(carPart);
            if (result === null) {
                res.status(404).json({ error: "Maintenance record not found" });
                return;
            }
            res.status(200).json({ message: `Deleted record for car part: ${carPart}` });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ error: "An error occurred" });
        }
    });
}
//# sourceMappingURL=maintenanceController.js.map