import express, { Request, Response } from 'express';
import { maintenanceCollection} from '../src/models/maintenanceModel';
import {addMaintenanceRecord} from '../src/models/maintenanceModel';

const router = express.Router();

router.post('/maintenance', async (req: Request, res: Response) => {
    try{
        const record = req.body;
        const insertedRecord = await addMaintenanceRecord(record);
        res.json(insertedRecord);
    }
    catch(err){
        console.error(err);
        res.status(500).send('An error occurred');
    }
      
    
});

