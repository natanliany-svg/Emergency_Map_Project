import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { loginSchema, registerSchema } from '../validations/services/auth.validation.js'
import { insertUser, findUserByUsername } from '../DAL/user.dal.js'


export async function registerUser(req,res) {
    try {
        const validData = registerSchema.parse(req.body)
        const hashedPassword = await bcrypt.hash(validData.password, 5)
        
        const result = await insertUser({ 
        username: validData.username, 
        password: hashedPassword 
        })
        res.status(201).json(result)
    } catch (error) {
        res.status(400).json({error:error.message})
    } 
}


export async function loginUser(req, res) {
    const validData = loginSchema.parse(req.body)
    const user = await findUserByUsername(validData.username)
    
    if (!user) return res.status(401).json({ error: "User not found" })
        const isMatch = await bcrypt.compare(
                                            validData.password,
                                            user.password
                                        )
    if (!isMatch) return res.status(401).json({ error: "Wrong password" })
        const token = jwt.sign({ 
                                id: user._id, 
                                username: user.username 
                                },
                                "MY_SECRET_KEY",
                                { expiresIn: "1h" 
                                })

    res.status(200).json({ message: "Login successful", token: token })
}