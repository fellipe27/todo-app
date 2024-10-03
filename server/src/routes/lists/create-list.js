import { z } from 'zod'
import { prisma } from  '../../lib/prisma.js'
import { generateColor } from '../../utils/generate-color.js'

export async function createList(app) {
    app.withTypeProvider().post('/users/:userId/lists', {
        schema: {
            params: z.object({
                userId: z.string().uuid()
            }),
            body: z.object({
                title: z.string()
            }),
            response: {
                201: z.object({
                    list: z.object({
                        id: z.string().uuid(),
                        title: z.string(),
                        color: z.string()
                    })
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

        const list = await prisma.list.create({
            data: {
                userId,
                title,
                color
            }
        })

        return reply.status(201).send({ list })
    })
}
