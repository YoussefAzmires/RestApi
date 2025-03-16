import express from 'express';
import { maintenanceCollection} from '../src/models/maintenanceModel';

const router = express.Router();

router.post('/maintenance', async (req, res) => {
