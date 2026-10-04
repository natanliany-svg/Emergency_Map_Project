import {MongoClient} from 'mongodb'
import 'dotenv/config'

const uri = process.env.MONGO_URI 
const client = new MongoClient(uri);

let dbConnection;

export const connectDB  = async () => {
    try{
        await client.connect();
        console.log("Conected  to MongoDB!")
        dbConnection = client.db("incident_map");
    } catch (error) {
        console.error("Failed connect the MongoDB", error)
        process.exit(1)
    }
}

export const getDB = () => {
    if (!dbConnection) {
        throw new Error("Call the connectDB !!!")
    }
    return dbConnection
}
