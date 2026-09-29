import express from 'express'
import "dotenv/config";
import cors from "cors";

import { connectDB } from './DAL/db.js'
import router  from './routes/incidentRoutes.js';



const app = express();
const port = process.env.PORT || 3200;

app.use(cors({}));
app.use(express.json());


app.use('/api/incidents', router)


connectDB()

app.listen(port, () => {
    console.log(`server runing on port ${port}`);
});
