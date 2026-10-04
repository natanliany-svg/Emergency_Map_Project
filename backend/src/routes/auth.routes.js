import { Router } from "express"
import { loginUser, registerUser } from "../ctrls/auth.ctrl.js"


const router = Router()


router.post('/register', registerUser)

router.post('/login', loginUser)



export default router