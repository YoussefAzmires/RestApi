import express, { Request, Response } from 'express';
import { maintenanceCollection, MaintenanceRecord} from './models/maintenanceModel';
import {addMaintenanceRecord,getAllMaintenanceRecord,getOneMaintenanceRecord} from './models/maintenanceModel';
import { handleGetAllMaintenanceRecord, handleGetOneMaintenanceRecord, handleAddMaintenanceRecord } from './maintenanceController';
import { error } from 'console';

const router = express.Router();



router.post("/", handleAddMaintenanceRecord); 

router.get("/", handleGetAllMaintenanceRecord); 

router.get("/carPart/:carPart", handleGetOneMaintenanceRecord); 


// router.delete('/carPart/:carPart', async (req: Request, res: Response) => {
//     try{
//         const carPart = req.params.carPart;
//         if(!carPart){
//             //return res.status(400).json({ error: "Missing carPart parameter" });
//         }
//         const 
//     }
// })



export default router;

