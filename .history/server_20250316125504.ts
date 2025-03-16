import express from 'express';
import { initialize } from './src/models/maintenanceModel';

const app = express();

async function startServer() {
    console.log('Starting server...');
    try {
        await initialize();
        app.listen(3000, () => console.log('Server listening on port 3000'));
    } catch (err) {
        console.error('Error during initialization:', err);
    }
}

startServer().catch((err) => console.error(err));