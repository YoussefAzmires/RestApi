import express, { Request, Response } from 'express';
import { maintenanceCollection, MaintenanceRecord} from '../src/models/maintenanceModel';
import {addMaintenanceRecord} from '../src/models/maintenanceModel';
import { getAllMaintenanceRecord } from '../src/models/maintenanceModel';
import { getOneMaintenanceRecord } from '../src/models/maintenanceModel';
import { error } from 'console';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
    try{
        const { carPart, lastChanged, nextChange } = req.body;
        if (!carPart || !lastChanged || !nextChange) {
           throw Error('Missing required fields');
        }
        const record : MaintenanceRecord= { carPart, lastChanged, nextChange };
        const insertedRecord = await addMaintenanceRecord(record);  
        console.log(insertedRecord);
        res.status(201).json(insertedRecord);
    }
    catch(err){
        console.error(err);
        res.status(500).send('An error occurred');
    }
      
    
});

router.get('/', async (req:Request, res: Response)=>{
    try{
        const records = await getAllMaintenanceRecord();
        console.log(records)
        res.status(201).json(records);
    }
    catch(err){
        console.error(err);
        res.status(500).send('An error occurred');
    }
})
// router.get('/carPart/:carPart', async (req: Request, res: Response) => {
//     try {
//         const carPart = req.params.carPart; // Extract URL parameter
//         if (!carPart) {
//             return res.status(400).json({ error: "Missing carPart parameter" });
//         }

//         const record = await getOneMaintenanceRecord(carPart);
//         console.log(record);
//         res.status(200).json(record);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'An error occurred' });
//     }
// });



export default router;

