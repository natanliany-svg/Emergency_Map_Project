import { incidentSchema } from "../validations/services/incident.validation.js";
import { insertIncident, fetchIncidents } from "../DAL/incident.dal.js";

export async function createIncident(req,res) {
    try {
        const validData = incidentSchema.parse(req.body)
        const result = await insertIncident(validData)
        res.status(201).json(result)
    } catch (error) {
        res.status(400).json({error:error.message})
    }   
}

export async function getIncidents(req,res) {
    try {
        const result = await fetchIncidents()
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}