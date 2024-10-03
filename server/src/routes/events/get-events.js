import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'

export async function getEvents(app) {
    app.withTypeProvider().get('/users/:userId/events', {
        schema: {
            params: z.object({

                userId: z.string().uuid()
            }),
            response: {
                200: z.object({
                    events: z.array(z.object({
                        id: z.string().uuid(),
                        title: z.string(),
                        createdAt: z.coerce.date(),
                        date: z.coerce.date(),
                        color: z.string()
                    }))
                })
            }
        }
        
    }, async (request, reply) => {
        const { userId } = request.params

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {
                events: true
            }
        })

        if (!user) {
            throw new Error('User not found.')
        }

        return reply.send({ events: user.events })
    })
}
