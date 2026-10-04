import { z } from 'zod'

export const incidentSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    category: z.enum(['fire', 'medical', 'police', 'general']),
        location: z.object({
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180)
    }),
    status: z.enum(['open', 'in_progress', 'closed']).default('open')
})