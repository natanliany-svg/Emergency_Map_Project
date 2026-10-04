import { z } from 'zod'

export const registerSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
    fullName: z.string().min(2),
    role: z.enum(['viewer', 'editor', 'admin']).default('viewer')
})

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(6)
})