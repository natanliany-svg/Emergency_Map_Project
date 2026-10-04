import {z} from 'zod'



export const incidentSchema = z.object({
                                title: z.string().min(3),
                                discraption: z.string(),
                                urgency: z.string(),
                                location: z.object({
                                                    lat: z.number(),
                                                    lng: z.number()
                                                    })
                            })