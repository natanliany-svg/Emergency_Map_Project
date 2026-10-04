import { incidentSchema } from "../validations/services/incident.validation.js";
import { insertIncident, fetchIncidents, getIncidentById, updateIncident, deleteIncident } from "../DAL/incident.dal.js";

export async function createIncident(req, res) {
    try {
        const validData = incidentSchema.parse(req.body)
        
        const incdentToSave = {
            ...validData,
            createdBy: req.user ? req.user.id : "temp-user-id",
            createdAt: new Date(),
            updatedAt: new Date()
        }

        const result = await insertIncident(incdentToSave)
        res.status(201).json({ success: true, data: result })
    } catch (error) {
        console.log("create incdent err", error)
        res.status(400).json({ success: false, message: "Invalid data provided" })
    }   
}

export async function getIncidents(req, res) {
    try {
        const result = await fetchIncidents()
        res.status(200).json({ success: true, data: result })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Server error" })
    }
}

export async function updateIncidentReq(req, res) {
    try {
        const { id } = req.params
        const incident = await getIncidentById(id)
        
        if (!incident) {
            return res.status(404).json({ success: false, message: "Not found" })
        }

        if (incident.createdBy !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Forbidden" })
        }

        const validData = incidentSchema.partial().parse(req.body)
        validData.updatedAt = new Date()

        await updateIncident(id, validData)
        res.status(200).json({ success: true, message: "Updated" })

    } catch (error) {
        console.log("updte err", error)
        res.status(400).json({ success: false, message: "Invalid data" })
    }
}

export async function deleteIncidentReq(req, res) {
    try {
        const { id } = req.params
        const incident = await getIncidentById(id)
        
        if (!incident) {
            return res.status(404).json({ success: false, message: "Not found" })
        }

        if (incident.createdBy !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Forbidden" })
        }

        await deleteIncident(id)
        res.status(200).json({ success: true, message: "Deleted" })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Server error" })
    }
}