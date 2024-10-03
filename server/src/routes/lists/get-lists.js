import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'

export async function getLists(app) {
    app.withTypeProvider().get('/users/:userId/lists', {
        schema: {
            params: z.object({
                userId: z.string().uuid()
            }),
            response: {
                200: z.object({
                    lists: z.array(z.object({
                        id: z.string().uuid(),
                        title: z.string(),
                        color: z.string(),
                        tasksAmount: z.number()
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
                lists: {
                    include: {
                        _count: {
                            select: {
                                tasks: true
                            }
                        }
                    }
                }
            }
        })

        if (!user) {
            throw new Error('User not found.')
        }

        const lists = user.lists.map(list => {
            return {
                id: list.id,
                title: list.title,
                color: list.color,
                tasksAmount: list._count.tasks
            }
        })

        return reply.send({ lists })
    })
}
