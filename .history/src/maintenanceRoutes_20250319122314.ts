import express, { Request, Response } from 'express';
import { maintenanceCollection, MaintenanceRecord} from '../src/models/maintenanceModel';
import {addMaintenanceRecord,getAllMaintenanceRecord,getOneMaintenanceRecord,handleGetOneMaintenanceRecord} from '../src/models/maintenanceModel';
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




router.get('/carPart/:carPart', async (req: Request, res: Response) => {
    
})

router.delete('/carPart/:carPart', async (req: Request, res: Response) => {
    try{
        const carPart = req.params.carPart;
        if(!carPart){
            //return res.status(400).json({ error: "Missing carPart parameter" });
        }
        const 
    }
})

// router.get('/carPart/:carPart', handleGetOneMaintenanceRecord()) => {
//     try{
//         const carPart = req.params.carPart;
//         if(!carPart){
//             //return res.status(400).json({ error: "Missing carPart parameter" });
//         }
//         const 
//     }
// })


export default router;

