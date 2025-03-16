import express from 'express';
import { initialize } from './src/models/maintenanecModel';

const app = express();

async function startServer() {
    console.log('Starting server...');
  await initialize();
  app.listen(3000, () => console.log('Server listening on port 3000'));
}

startServer().catch((err) => console.error(err));