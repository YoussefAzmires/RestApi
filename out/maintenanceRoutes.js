"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const maintenanceController_1 = require("./maintenanceController");
const router = express_1.default.Router();
router.post("/", maintenanceController_1.handleAddMaintenanceRecord);
router.get("/", maintenanceController_1.handleGetAllMaintenanceRecord);
router.get("/carPart/:carPart", maintenanceController_1.handleGetOneMaintenanceRecord);
router.delete('/carPart/:carPart', maintenanceController_1.handleDeleteOneMaintenanceRecord);
exports.default = router;
//# sourceMappingURL=maintenanceRoutes.js.map