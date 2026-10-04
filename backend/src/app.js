import express from 'express'
import "dotenv/config";
import cors from "cors";

import { connectDB } from './db/db.js'
import incidentRoutes from './routes/incidents.routes.js';
import userRoutes from './routes/auth.routes.js';

const app = express();
const port = process.env.PORT || 3200;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173'}));
app.use(express.json());

app.use('/api/incidents', incidentRoutes);
app.use('/api/users', userRoutes)

connectDB()

app.listen(port, () => {
    console.log(`server runing on port ${port}`);
});
