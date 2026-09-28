import express from 'express'
import "dotenv/config";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3200;

app.use(cors({}));
app.use(express.json());




app.listen(port, () => {
    console.log(`server runing on port ${port}`);
});