import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'

export async function getTasks(app) {
    app.withTypeProvider().get('/lists/:listId/tasks', {
        schema: {
            params: z.object({
                listId: z.string().uuid()
            }),
            response: {
                200: z.object({
                    tasks: z.array(z.object({
                        id: z.string().uuid(),
                        title: z.string(),
                        description: z.string(),
                        createdAt: z.coerce.date(),
                        dueDate: z.coerce.date().nullable(),
                        tags: z.array(z.object({
                            id: z.string().uuid(),
                            title: z.string(),
                            color: z.string()
                        })),
                        subtasks: z.array(z.object({
                            subtaskId: z.string().uuid(),
                            id: z.string().uuid(),
                            title: z.string()
                        })),
                        listId: z.string().uuid(),
                        listTitle: z.string(),
                        listColor: z.string()
                    }))
                })
            }
        }
    }, async (request, reply) => {
        const { listId } = request.params

        const list = await prisma.list.findUnique({
            where: {
                id: listId
            },
            include: {
                tasks: {
                    include: {
                        tags: true,
                        subtasks: true
                    }
                }
            }
        })

        if (!list) {
            throw new Error('List not found.')
        }

        const tasks = list.tasks.map(task => {
            return {
                id: task.id,
                title: task.title,
                description: task.description,
                createdAt: task.createdAt,
                dueDate: task.dueDate,
                tags: task.tags,
                subtasks: task.subtasks,
                listId: task.listId,
                listTitle: list.title,
                listColor: list.color
            }
        })

        return reply.send({ tasks })
    })
}
