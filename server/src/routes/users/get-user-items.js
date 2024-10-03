import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'

export async function getUserItems(app) {
    app.withTypeProvider().get('/users/:userId/search/:text', {
        schema: {
            params: z.object({
                userId: z.string().uuid(),
                text: z.string()
            }),
            response: {
                200: z.object({
                    result: z.object({
                        lists: z.array(z.object({
                            id: z.string().uuid(),
                            title: z.string(),
                            color: z.string(),
                            tasksAmount: z.number()
                        })),
                        stickys: z.array(z.object({
                            id: z.string().uuid(),
                            title: z.string(),
                            description: z.string(),
                            createdAt: z.coerce.date(),
                            color: z.string()
                        })),
                        tags: z.array(z.object({
                            id: z.string().uuid(),
                            title: z.string(),
                            color: z.string(),
                            tasksAmount: z.number()
                        })),
                        events: z.array(z.object({
                            id: z.string().uuid(),
                            title: z.string(),
                            createdAt: z.coerce.date(),
                            date: z.coerce.date(),
                            color: z.string()
                        })),
                        tasks: z.array(z.object({
                            id: z.string().uuid(),
                            title: z.string(),
                            description: z.string(),
                            createdAt: z.coerce.date(),
                            dueDate: z.coerce.date().nullable()
                        }))
                    })
                })
            }
        }
    }, async (request, reply) => {
        const { userId, text } = request.params

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {
                lists: {
                    include: {
                        tasks: true,
                        _count: {
                            select: {
                                tasks: true
                            }
                        }
                    }
                },
                stickys: true,
                tags: {
                    include: {
                        _count: {
                            select: {
                                tasks: true
                            }
                        }
                    }
                },
                events: true
            }
        })

        if (!user) {
            throw new Error('User not found.')
        }

        const userTasks = user.lists.flatMap(list => {
            return list.tasks
        })

        const result = {
            lists: user.lists.filter(list => list.title.toLowerCase().includes(text.toLowerCase())).map(list => ({
                id: list.id,
                title: list.title,
                color: list.color,
                tasksAmount: list._count.tasks
            })),
            stickys: user.stickys.filter(sticky => sticky.title.toLowerCase().includes(text.toLowerCase()) || sticky.description.toLowerCase().includes(text.toLowerCase())).map(sticky => ({
                id: sticky.id,
                title: sticky.title,
                description: sticky.description,
                createdAt: sticky.createdAt,
                color: sticky.color
            })),
            tags: user.tags.filter(tag => tag.title.toLowerCase().includes(text.toLowerCase())).map(tag => ({
                id: tag.id,
                title: tag.title,
                color: tag.color,
                tasksAmount: tag._count.tasks
            })),
            events: user.events.filter(event => event.title.toLowerCase().includes(text.toLowerCase())).map(event => ({
                id: event.id,
                title: event.title,
                createdAt: event.createdAt,
                date: event.date,
                color: event.color
            })),
            tasks: userTasks.filter(task => task.title.toLowerCase().includes(text.toLowerCase()) || task.description.toLowerCase().includes(text.toLowerCase())).map(task => ({
                id: task.id,
                title: task.title,
                description: task.description,
                createdAt: task.createdAt,
                dueDate: task.dueDate
            }))
        }

        return reply.send({ result })
    })
}
