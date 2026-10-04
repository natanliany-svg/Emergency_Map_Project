import { ObjectId } from "mongodb";
import { getDB } from "../db/db.js";

export async function insertIncident(incidentData) {
    const result = await getDB().collection("incidents").insertOne(incidentData)
    return result
}

export async function fetchIncidents() {
    const result = await getDB().collection("incidents").find({}).toArray()
    return result
}

export async function getIncidentById(id) {
    const result = await getDB().collection("incidents").findOne({ _id: new ObjectId(id) })
    return result
}

export async function updateIncident(id, updateData) {
    const result = await getDB().collection("incidents").updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
    )
    return result
}

export async function deleteIncident(id) {
    const result = await getDB().collection("incidents").deleteOne({ _id: new ObjectId(id) })
    return result
}