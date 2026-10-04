import { Router } from "express"
import { loginUser, registerUser, getMe } from "../ctrls/auth.ctrl.js"
import { authenticate } from "../utils/authMiddleware.js"

const router = Router()

router.post('/register', registerUser)

router.post('/login', loginUser)

router.get('/me', authenticate, getMe)


export default router