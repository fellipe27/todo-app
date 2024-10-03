import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'

export async function deleteTask(app) {
    app.withTypeProvider().delete('/tasks/:taskId', {
        schema: {
            params: z.object({
                taskId: z.string().uuid()
            })
        }
    }, async (request) => {
        const { taskId } = request.params

        const task = await prisma.task.findUnique({
            where: {
                id: taskId
            }
        })

        if (!task) {
            throw new Error('Task not found.')
        }

        await prisma.task.delete({
            where: {
                id: taskId
            }
        })

        const isSubtaskToo = await prisma.subtask.findFirst({
            where: {
                id: taskId
            }
        })

        if (isSubtaskToo) {
            await prisma.subtask.delete({
                where: {
                    subtaskId: isSubtaskToo.subtaskId
                }
            })
        }
    })
}
