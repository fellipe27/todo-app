import { getUserIdFromToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const taskBodySchema = z.object({
    title: z.string(),
    description: z.string(),
    listId: z.string().uuid(),
    dueDate: z.coerce.date().nullable(),
    tags: z.array(z.object({
        id: z.string().uuid()
    }))
})

const subtaskBodySchema = z.object({
    subtaskId: z.string().uuid()
})

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const userId = await getUserIdFromToken()
        const body = await request.json()
        const { id } = params
        const { subtaskId } = subtaskBodySchema.parse(body)

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized.' },
                { status: 401 }
            )
        }

        const parentTask = await prisma.task.findUnique({
            where: {
                id
            }
        })

        const childTask = await prisma.task.findUnique({
            where: {
                id: subtaskId
            }
        })

        if (!parentTask || !childTask) {
            return NextResponse.json(
                { error: 'Some task not found.' },
                { status: 404 }
            )
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
                        id
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
                        id
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
                    id
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

        if (checkSubtask?.tasks.length == 0) {
            await prisma.subtask.delete({
                where: {
                    subtaskId: checkSubtask.subtaskId
                }
            })
        }

        return NextResponse.json({ status: 200 })
    } catch (error) {
        console.log(error)

        return NextResponse.json(
            { error: 'Invalid request.' },
            { status: 400 }
        )
    }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const userId = await getUserIdFromToken()
        const body = await request.json()
        const { id } = params
        const { title, description, listId, dueDate, tags } = taskBodySchema.parse(body)

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized.' },
                { status: 401 }
            )
        }

        const task = await prisma.task.findUnique({
            where: {
                id
            }
        })

        if (!task) {
            return NextResponse.json(
                { error: 'Task not found.' },
                { status: 404 }
            )
        }

        await prisma.task.update({
            where: {
                id
            },
            data: {
                title,
                description,
                listId,
                dueDate,
                tags: {
                    set: tags.map(tag => ({
                        id: tag.id
                    }))
                }
            }
        })

        return NextResponse.json({ status: 200 })
    } catch (error) {
        console.log(error)

        return NextResponse.json(
            { error: 'Invalid request.' },
            { status: 400 }
        )
    }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const userId = await getUserIdFromToken()
        const { id } = params

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized.' },
                { status: 401 }
            )
        }

        const task = await prisma.task.findUnique({
            where: {
                id
            }
        })

        if (!task) {
            return NextResponse.json(
                { error: 'Task not found.' },
                { status: 404 }
            )
        }

        await prisma.task.delete({
            where: {
                id
            }
        })

        return NextResponse.json({ status: 200 })
    } catch (error) {
        console.log(error)

        return NextResponse.json(
            { error: 'Invalid request.' },
            { status: 400 }
        )
    }
}
