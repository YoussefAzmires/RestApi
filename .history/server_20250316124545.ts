import { initialize } from "./src/models/maintenanecModel";
import express from 'express';

const app = express();

initialize().then(() => {
    app.listen(3000, () => {
        console.log("Server listening on port 3000");
    });
});