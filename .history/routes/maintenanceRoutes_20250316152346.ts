import express, { Request, Response } from 'express';
import { maintenanceCollection, MaintenanceRecord} from '../src/models/maintenanceModel';
import {addMaintenanceRecord} from '../src/models/maintenanceModel';
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
export default router;

