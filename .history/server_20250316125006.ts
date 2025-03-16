import { initialize } from "./src/models/maintenanecModel";
import express from 'express';

const app = express();

// const router = express.Router();
// app.use("/",router);

// initialize().then(() => {
//     app.listen(3000, () => {
//         console.log("Server started on port 3000");
//     });
// });
initialize()
  .then(() => {
    console.log('MongoDB initialized');

    app.use(express.json()); 

    
    app.get('/', (req, res) => {
      res.send('Welcome to the Car Maintenance API!');
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })