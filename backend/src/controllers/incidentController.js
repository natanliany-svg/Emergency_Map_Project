
import { getDB } from "../DAL/db.js";
import { incidentSchema } from "../validations/incidentValidation.js";


export async function createIncident(req,res) {
    try {
        const validData = incidentSchema.parse(req.body)
        const db = getDB()
        const result = await db.collection("incidents").insertOne(validData)
        res.status(201).json(result)
    } catch (error) {
        res.status(400).json({error:error.message})
    }   
}

export async function getIncidents(req,res) {
    try {
        const db = getDB()
        const result = await db.collection("incidents").find({}).toArray()
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}