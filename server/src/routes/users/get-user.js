import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'

export async function getUser(app) {
    app.withTypeProvider().get('/users/:userId', {
        schema: {
            params: z.object({
                userId: z.string().uuid()
            }),
            response: {
                200: z.object({
                    user: z.object({
                        id: z.string().uuid(),
                        name: z.string(),
                        email: z.string().email(),
                        picture: z.string().url().nullable(),
                        isDarkMode: z.boolean(),
                        isStickysColored: z.boolean()
                    })
                })
            }
        }
    }, async (request, reply) => {
        const { userId } = request.params

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!user) {
            throw new Error('User not found.')
        }

        return reply.send({ user })
    })
}
