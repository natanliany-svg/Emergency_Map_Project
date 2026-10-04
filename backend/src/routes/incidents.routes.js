import { Router } from "express"
import { createIncident, getIncidents, getIncidentReq, updateIncidentReq, deleteIncidentReq } from "../ctrls/incidents.ctrl.js";
import { authenticate } from "../utils/authMiddleware.js";

const router = Router()



router.get('/', authenticate, getIncidents)

router.get('/:id', authenticate, getIncidentReq)

router.post('/', authenticate, createIncident)

router.patch('/:id', authenticate, updateIncidentReq)

router.delete('/:id', authenticate, deleteIncidentReq)




export default router


