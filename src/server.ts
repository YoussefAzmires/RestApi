import express from 'express';
import { initialize } from './models/maintenanceModel';
import maintenanceRoutes from './Controller/maintenanceRoutes'; 

const app = express();

app.use(express.json());  

async function startServer() {
    console.log('Starting server...');
    try {
        await initialize(); // Ensure DB connection
        app.use('/maintenance', maintenanceRoutes); // Add the maintenance routes
        app.listen(3000, () => console.log('Server listening on port 3000'));
    } catch (err) {
        console.error('Error during initialization:', err);
    }
}

startServer().catch((err) => console.error(err));
