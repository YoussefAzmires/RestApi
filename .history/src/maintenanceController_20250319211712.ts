import { Request, Response } from "express";
import { getOneMaintenanceRecord, getAllMaintenanceRecord, addMaintenanceRecord, deleteOneMaintenanceRecord} from "./models/maintenanceModel";

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
 * 
 * @param req 
 * @param res 
 */
async function handleDeleteOneMaintenanceRecord(req: Request, res: Response): Promise<void> {
    try {
        const carPart = req.params.carPart;
        if (!carPart) {
             res.status(400).json({ error: "Missing carPart parameter" });
        }
        const record = await deleteOneMaintenanceRecord(carPart);
        console.log(record);
        res.status(200).json(record);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred" });
    }
}


export { handleGetOneMaintenanceRecord , handleGetAllMaintenanceRecord, handleAddMaintenanceRecord, handleDeleteOneMaintenanceRecord};
