import { Request, Response } from "express";
import { getOneMaintenanceRecord, getAllMaintenanceRecord, addMaintenanceRecord, deleteOneMaintenanceRecord, updateOneMaintenanceRecord } from "./models/maintenanceModel";

async function handleGetOneMaintenanceRecord(req: Request, res: Response): Promise<void> {
    try {
        const carPart = req.params.carPart;
        if (!carPart) {
             res.status(400).json({ error: "Missing carPart parameter" });
        }
        const record = await getOneMaintenanceRecord(carPart);
        console.log(record);
        res.status(200).json(record);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred" });
    }
}

async function handleGetAllMaintenanceRecord(req: Request, res: Response): Promise<void> {
    try{
        const records = await getAllMaintenanceRecord();
        console.log(records)
        res.status(201).json(records);
    }
    catch(err){
        console.error(err);
        res.status(500).send('An error occurred');
    }
}
/**
 * 
 * @param req 
 * @param res 
 */
async function handleAddMaintenanceRecord(req: Request, res: Response): Promise<void> {
    try {
        const record = req.body;
        if (!record) {
            res.status(400).json({ error: "Missing maintenance record data" });
        }
        const insertedRecord = await addMaintenanceRecord(record);
        console.log(insertedRecord);
        res.status(201).json(insertedRecord);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred" });
    }
}


async function handleUpdateMaintenanceRecord(req: Request, res: Response): Promise<void> {
    try {
        const carPart = req.params.carPart; 
        const updatedData = req.body;  
        
        const existingRecord = await getOneMaintenanceRecord(carPart);
        if (!existingRecord) {
            res.status(404).json({ error: "Maintenance record not found" });
            return;
        }
        
        // Update the record
        const updatedRecord = await updateOneMaintenanceRecord(existingRecord, updatedData);
        
        if (!updatedRecord) {
            res.status(404).json({ error: "Update failed" });
            return;
        }
        
        res.status(200).json(updatedRecord);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred" });
    }
}
/**
 * 
 * @param req 
 * @param res 
 */
async function handleDeleteOneMaintenanceRecord(req: Request, res: Response): Promise<void> {
    try {
        const carPart = req.params.carPart;
        if (!carPart) {
            res.status(400).json({ error: "Missing carPart parameter" });
            return;
        }
        
        const result = await deleteOneMaintenanceRecord(carPart);
        
        if (result === null) {
            res.status(404).json({ error: "Maintenance record not found" });
            return;
        }
        
        res.status(200).json({ message: `Deleted record for car part: ${carPart}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred" });
    }
}



export { handleGetOneMaintenanceRecord , handleGetAllMaintenanceRecord, handleAddMaintenanceRecord, handleDeleteOneMaintenanceRecord, handleUpdateMaintenanceRecord};
