import { getDB } from "../db/db.js";

export async function insertIncident(incidentData) {
    const db = getDB()
    const result = await db.collection("incidents").insertOne(incidentData)
    return result
}

export async function fetchIncidents() {
    const db = getDB()
    const result = await db.collection("incidents").find({}).toArray()
    return result
}