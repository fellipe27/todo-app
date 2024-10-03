import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'

export async function createTask(app) {
    app.withTypeProvider().post('/lists/:listId/tasks', {
        schema: {
            params: z.object({
                listId: z.string().uuid()
            }),
            body: z.object({
                title: z.string(),
                description: z.string(),
                dueDate: z.coerce.date().nullable()
            }),
            response: {
                201: z.object({
                    task: z.object({
                        id: z.string().uuid(),
                        title: z.string(),
                        description: z.string(),
                        createdAt: z.coerce.date(),
                        dueDate: z.coerce.date().nullable(),
                        listId: z.string().uuid(),
                        listTitle: z.string(),
                        listColor: z.string()
                    })
                })
            }
        }
    }, async (request, reply) => {
        const { listId } = request.params
        const { title, description, dueDate } = request.body

        const list = await prisma.list.findUnique({
            where: {
                id: listId
            }
        })

        if (!list) {
            throw new Error('List not found.')
        }

        const newTask = await prisma.task.create({
            data: {
                listId,
                title,
                description,
                dueDate
            }
        })

        const task = {
            id: newTask.id,
            title: newTask.title,
            description: newTask.description,
            createdAt: newTask.createdAt,
            dueDate: newTask.dueDate,
            listId: list.id,
            listTitle: list.title,
            listColor: list.color
        }

        return reply.status(201).send({ task })
    })
}
