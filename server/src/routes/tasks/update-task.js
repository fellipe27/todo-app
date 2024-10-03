import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'

export async function updateTask(app) {
    app.withTypeProvider().put('/tasks/:taskId', {
        schema: {
            params: z.object({
                taskId: z.string().uuid()
            }),
            body: z.object({
                title: z.string(),
                description: z.string(),
                dueDate: z.coerce.date().nullable(),
                listId: z.string().uuid(),
                tags: z.array(z.object({
                    id: z.string().uuid()
                }))
            })
        }
    }, async (request) => {
        const { taskId } = request.params
        const { title, description, dueDate, listId, tags } = request.body

        const task = await prisma.task.findUnique({
            where: {
                id: taskId
            }
        })

        if (!task) {
            throw new Error('Task not found.')
        }

        await prisma.task.update({
            where: {
                id: taskId
            },
            data: {
                title,
                description,
                dueDate,
                listId,
                tags: {
                    set: tags.map(tag => ({ 
                        id: tag.id 
                    }))
                }
            }
        })
    })
}
