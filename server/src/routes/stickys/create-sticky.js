import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'
import { generateColor } from '../../utils/generate-color.js'

export async function createSticky(app) {
    app.withTypeProvider().post('/users/:userId/stickys', {
        schema: {
            params: z.object({
                userId: z.string().uuid()
            }),
            body: z.object({
                title: z.string(),
                description: z.string()
            }),
            response: {
                201: z.object({
                    sticky: z.object({
                        id: z.string().uuid(),
                        title: z.string(),
                        description: z.string(),
                        createdAt: z.coerce.date(),
                        color: z.string()
                    })
                })
            }
        }
    }, async (request, reply) => {
        const { userId } = request.params
        const { title, description } = request.body

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!user) {
            throw new Error('User not found')
        }

        const color = generateColor()

        const sticky = await prisma.sticky.create({
            data: {
                userId,
                title,
                description,
                color
            }
        })

        return reply.status(201).send({ sticky })
    })
}
