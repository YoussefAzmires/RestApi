import { initialize } from "./src/models/maintenanecModel";
import express from 'express';

const app = express();

const router = express.Router();
app.use("/",router);

initialize().then(() => {
    app.listen(3000, () => {
        console.log("Server started on port 3000");
    });
});