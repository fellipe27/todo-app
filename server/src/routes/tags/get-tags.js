import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'

export async function getTags(app) {
    app.withTypeProvider().get('/users/:userId/tags', {
        schema: {
            params: z.object({
                userId: z.string().uuid()
            }),
            response: {
                200: z.object({
                    tags: z.array(z.object({
                        id: z.string().uuid(),
                        title: z.string(),
                        color: z.string(),
                        lists: z.array(z.object({
                            id: z.string().uuid(),
                            title: z.string(),
                            color: z.string(),
                            tasks: z.array(z.object({
                                id: z.string().uuid(),
                                title: z.string(),
                                description: z.string(),
                                createdAt: z.coerce.date(),
                                dueDate: z.coerce.date().nullable()
                            }))
                        }))
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
                        tasks: true
                    }
                },
                tags: {
                    include: {
                        tasks: true
                    }
                }
            }
        })

        if (!user) {
            throw new Error('User not found.')
        }

        const tagsWithTasksAndLists = await prisma.tag.findMany({
            include: {
                tasks: {
                    include: {
                        list: true
                    }
                }
            }
        })
          
        const tags = tagsWithTasksAndLists.map(tag => {
            const listsMap = new Map()
            
            tag.tasks.forEach(task => {
                const listId = task.list.id
                
                if (!listsMap.has(listId)) {
                    listsMap.set(listId, {
                        ...task.list,
                        tasks: []
                    })
                }

                listsMap.get(listId).tasks.push({
                    id: task.id,
                    title: task.title,
                    description: task.description,
                    createdAt: task.createdAt,
                    dueDate: task.dueDate
                })
            })

            const lists = Array.from(listsMap.values())
            
            return {
                id: tag.id,
                title: tag.title,
                color: tag.color,
                lists
            }
        })

        return reply.send({ tags })
    })
}
