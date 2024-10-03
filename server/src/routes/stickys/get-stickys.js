import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'

export async function getStickys(app) {
    app.withTypeProvider().get('/users/:userId/stickys', {
        schema: {
            params: z.object({
                userId: z.string().uuid()
            }),
            response: {
                200: z.object({
                    stickys: z.array(z.object({
                        id: z.string().uuid(),
                        title: z.string(),
                        description: z.string(),
                        createdAt: z.coerce.date(),
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
                stickys: true
            }
        })

        if (!user) {
            throw new Error('User not found.')
        }

        return reply.send({ stickys: user.stickys })
    })
}
