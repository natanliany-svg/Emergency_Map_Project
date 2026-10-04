import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { loginSchema, registerSchema } from '../validations/services/auth.validation.js'
import { insertUser, findUserByEmail , findUserById} from '../DAL/user.dal.js'


export async function registerUser(req, res) {
    try {
        const validData = registerSchema.parse(req.body)
        
        const existngUser = await findUserByEmail(validData.email)
        if (existngUser) {
            return res.status(400).json({ success: false, message: "User exist" })
        }

        const hashedPassword = await bcrypt.hash(validData.password, 10)
        
        const userToSave = {
            email: validData.email,
            password: hashedPassword,
            fullName: validData.fullName,
            role: validData.role || 'viewer'
        }

        const result = await insertUser(userToSave)
                const token = jwt.sign(
            { id: result.insertedId, role: userToSave.role },
            process.env.JWT_SECRET || 'defaltSecrt123',
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        )

        res.status(201).json({ success: true, data: { user: result, token } })
    } catch (error) {
        console.log("register err", error)
        res.status(400).json({ success: false, message: "Invalid data provided" })
    }
}


export async function loginUser(req, res) {
    try {
        const validData = loginSchema.parse(req.body)

        const user = await findUserByEmail(validData.email)
        if (!user) {
            return res.status(401).json({ success: false, message: "אחד או יותר מהנתונים שגויים" })
        }

        const isValid = await bcrypt.compare(validData.password, user.password)
        if (!isValid) {
            return res.status(401).json({ success: false, message: "אחד או יותר מהנתונים שגויים" })
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'defaltSecrt123',
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        )

        res.status(200).json({ success: true, data: { token } })
    } catch (error) {
        console.log(error)
        res.status(400).json({ success: false, message: "Invalid data provided" })
    }
}

export async function getMe(req, res) {
    try {
        const user = await findUserById(req.user.id)
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }
        res.status(200).json({ success: true, data: user })
    } catch (error) {
        console.log("me err", error)
        res.status(500).json({ success: false, message: "Server error" })
    }
}