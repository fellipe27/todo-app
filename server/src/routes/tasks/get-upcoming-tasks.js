import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'

export async function getUpcomingTasks(app) {
    app.withTypeProvider().get('/users/:userId/tasks', {
        schema: {
            params: z.object({
                userId: z.string().uuid()
            }),
            response: {
                200: z.object({
                    todayTasks: z.array(z.object({
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
                    })),
                    tomorrowTasks: z.array(z.object({
                        id: z.string().uuid(),
                        title: z.string(),
                        description: z.string(),
                        createdAt: z.coerce.date(),
                        dueDate: z.coerce.date().nullable(),
                        subtasks: z.array(z.object({
                            subtaskId: z.string().uuid(),
                            id: z.string().uuid(),
                            title: z.string()
                        })),
                        listId: z.string().uuid(),
                        listTitle: z.string(),
                        listColor: z.string()
                    })),
                    thisWeekTasks: z.array(z.object({
                        id: z.string().uuid(),
                        title: z.string(),
                        description: z.string(),
                        createdAt: z.coerce.date(),
                        dueDate: z.coerce.date().nullable(),
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
        const { userId } = request.params

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {
                lists: {
                    include: {
                        tasks: {
                            include: {
                                tags: true,
                                subtasks: true
                            }
                        }
                    }
                }
            }
        })

        if (!user) {
            throw new Error('User not found.')
        }

        const tasks = user.lists.flatMap(list => {
            return list.tasks
        })

        const todayTasks = []
        const tomorrowTasks = []
        const thisWeekTasks = []

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const tomorrow = new Date(today)
        tomorrow.setDate(today.getDate() + 1)

        const startOfWeek = new Date(tomorrow)
        startOfWeek.setDate(tomorrow.getDate() + 1)
        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + (6 - startOfWeek.getDay()))

        tasks.filter(task => {
            const dueDate = new Date(task?.dueDate)
            dueDate.setHours(0, 0, 0, 0)

            const taskList = user.lists.find(list => list.id == task.listId)
            const newTask = {
                id: task.id,
                title: task.title,
                description: task.description,
                createdAt: task.createdAt,
                dueDate: task.dueDate,
                tags: task.tags,
                subtasks: task.subtasks,
                listId: taskList.id,
                listTitle: taskList.title,
                listColor: taskList.color
            }

            if (dueDate.getTime() == today.getTime()) {
                todayTasks.push(newTask)
            } else if (dueDate.getTime() == tomorrow.getTime()) {
                tomorrowTasks.push(newTask)
            } else if (startOfWeek.getTime() <= dueDate.getTime() && dueDate.getTime() <= endOfWeek.getTime()) {
                if (!todayTasks.some(task => task.id == newTask.id) && !tomorrowTasks.some(task => task.id == newTask.id)) {
                    thisWeekTasks.push(newTask)
                }
            }
        })

        return reply.send({ todayTasks, tomorrowTasks, thisWeekTasks })
    })
}
