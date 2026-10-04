import { Router } from "express"
import { createIncident, getIncidents, updateIncidentReq, deleteIncidentReq } from "../ctrls/incidents.ctrl.js";
import { authenticate, authorizeRole } from "../utils/authMiddleware.js";

const router = Router()



router.get('/', authenticate, getIncidents)

router.post('/', authenticate, authorizeRole(['editor', 'admin']), createIncident)

router.patch('/:id', authenticate, updateIncidentReq)

router.delete('/:id', authenticate, deleteIncidentReq)




export default router


