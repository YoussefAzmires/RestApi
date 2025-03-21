import { Request, Response } from "express";
import { getOneMaintenanceRecord, getAllMaintenanceRecord, addMaintenanceRecord, deleteOneMaintenanceRecord, updateOneMaintenanceRecord } from "../models/maintenanceModel";
/**
 * Handles GET /MaintenanceRecords/carPart
 * Retrieves all maintenance records in the database.
 * Returns 201 with an array of MaintenanceRecord objects on success.
 * Returns 500 with a JSON error object on failure.
 */
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

/**
 * Handles GET /MaintenanceRecords
 * Retrieves all maintenance records in the database.
 * Returns 201 with an array of MaintenanceRecord objects on success.
 * Returns 500 with a JSON error object on failure.
 */
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
 * Handles POST /MaintenanceRecords
 * Adds a maintenance record to the database.
 * Returns 201 with the inserted MaintenanceRecord object on success.
 * Returns 400 with a JSON error object if the request body is empty.
 * Returns 500 with a JSON error object on failure.
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


/**
 * Handles PUT /MaintenanceRecords/carPart
 * Updates a maintenance record in the database.
 * Returns 200 with the updated MaintenanceRecord object on success.
 * Returns 404 with a JSON error object if the record does not exist.
 * Returns 500 with a JSON error object on failure.
 */

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
 * Handles DELETE /MaintenanceRecords/carPart
 * Deletes a maintenance record from the database based on the given car part.
 * Returns 200 with a success message on successful deletion.
 * Returns 400 if the carPart parameter is missing.
 * Returns 404 if the maintenance record is not found.
 * Returns 500 with a JSON error object on failure.
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
