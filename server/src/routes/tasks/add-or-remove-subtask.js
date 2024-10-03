import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'

export async function addOrRemoveSubtask(app) {
    app.withTypeProvider().post('/tasks/:taskId/subtasks/:subtaskId', {
        schema: {
            params: z.object({
                taskId: z.string().uuid(),
                subtaskId: z.string().uuid()
            })
        }
    }, async (request) => {
        const { taskId, subtaskId } = request.params

        const parentTask = await prisma.task.findUnique({
            where: { 
                id: taskId 
            },
            include: { 
                subtasks: true 
            }
        })

        const childTask = await prisma.task.findUnique({
            where: { 
                id: subtaskId 
            }
        })

        if (!parentTask || !childTask) {
            throw new Error('Task not found.')
        }

        const subtask = await prisma.subtask.findFirst({
            where: {
                id: subtaskId
            },
            include: {
                tasks: true
            }
        })

        if (subtask) {
            const taskAlreadyConnected = subtask.tasks.some(task => task.id == parentTask.id)

            if (taskAlreadyConnected) {
                await prisma.task.update({
                    where: {
                        id: taskId
                    },
                    data: {
                        subtasks: {
                            disconnect: {
                                subtaskId: subtask.subtaskId
                            }
                        }
                    }
                })
            } else {
                await prisma.task.update({
                    where: {
                        id: taskId
                    },
                    data: {
                        subtasks: {
                            connect: {
                                subtaskId: subtask.subtaskId
                            }
                        }
                    }
                })
            } 
        } else {
            const newSubtask = await prisma.subtask.create({
                data: {
                    id: subtaskId,
                    title: childTask.title
                }
            })

            await prisma.task.update({
                where: {
                    id: taskId
                },
                data: {
                    subtasks: {
                        connect: {
                            subtaskId: newSubtask.subtaskId
                        }
                    }
                }
            })
        }

        const checkSubtask = await prisma.subtask.findFirst({
            where: {
                id: subtaskId
            },
            include: {
                tasks: true
            }
        })

        if (checkSubtask.tasks.length == 0) {
            await prisma.subtask.delete({
                where: {
                    subtaskId: checkSubtask.subtaskId
                }
            })
        }
    })
}
