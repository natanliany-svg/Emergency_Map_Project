import { Router } from "express";
import { createIncident, getIncidents } from "../ctrls/incidents.ctrl.js";


const router = Router()


router.post('/', createIncident)
router.get('/',getIncidents)




export default router