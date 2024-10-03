import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'
import { generateColor } from '../../utils/generate-color.js'

export async function createTag(app) {
    app.withTypeProvider().post('/users/:userId/tags', {
        schema: {
            params: z.object({
                userId: z.string().uuid()
            }),
            body: z.object({
                title: z.string()
            }),
            response: {
                201: z.object({
                    tagId: z.string().uuid()
                })
            }
        }
    }, async (request, reply) => {
        const { userId } = request.params
        const { title } = request.body

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!user) {
            throw new Error('User not found.')
        }

        const color = generateColor()

        const tag = await prisma.tag.create({
            data: {
                userId,
                title,
                color
            }
        })

        return reply.status(201).send({ tagId: tag.id })
    })
}
