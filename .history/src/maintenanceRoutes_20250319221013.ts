import express, { Request, Response } from 'express';
import { maintenanceCollection, MaintenanceRecord} from './models/maintenanceModel';
import {addMaintenanceRecord,getAllMaintenanceRecord,getOneMaintenanceRecord} from './models/maintenanceModel';
import { handleGetAllMaintenanceRecord, handleGetOneMaintenanceRecord, handleAddMaintenanceRecord, handleDeleteOneMaintenanceRecord, handleUpdateneMaintenanceRecord } from './maintenanceController';
import { error } from 'console';

const router = express.Router();



router.post("/", handleAddMaintenanceRecord); 

router.get("/", handleGetAllMaintenanceRecord); 

router.get("/carPart/:carPart", handleGetOneMaintenanceRecord); 


router.delete('/carPart/:carPart', handleDeleteOneMaintenanceRecord);

router.put('/carPart/:carPart', handleUpdateneMaintenanceRecord);



export default router;

