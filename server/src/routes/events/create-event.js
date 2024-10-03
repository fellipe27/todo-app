import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'
import { generateColor } from '../../utils/generate-color.js'

export async function createEvent(app) {
    app.withTypeProvider().post('/users/:userId/events', {
        schema: {
            params: z.object({
                userId: z.string().uuid()
            }),
            body: z.object({
                title: z.string(),
                date: z.coerce.date()
            }),
            response: {
                201: z.object({
                    event: z.object({
                        id: z.string().uuid(),
                        title: z.string(),
                        createdAt: z.coerce.date(),
                        date: z.coerce.date(),
                        color: z.string()
                    })
                })
            }
        }
    }, async (request, reply) => {
        const { userId } = request.params
        const { title, date } = request.body

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!user) {
            throw new Error('User not found.')
        }

        const color = generateColor()

        const event = await prisma.event.create({
            data: {
                userId,
                title,
                date,
                color
            }
        })

        return reply.status(201).send({ event })
    })
}
