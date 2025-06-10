import { getUserIdFromToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(_request: NextRequest, { params }: { params: { text: string } }) {
    try {
        const userId = await getUserIdFromToken()
        const { text } = params

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

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
            return NextResponse.json(
                { error: 'User not found.' },
                { status: 404 }
            )
        }

        const userTasks = user.lists.flatMap(list => list.tasks)

        const items = {
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
                color: event.color,
                createdAt: event.createdAt,
                date: event.date
            })),
            tasks: userTasks.filter(task => task.title.toLowerCase().includes(text.toLowerCase()) || task.description.toLowerCase().includes(text.toLowerCase())).map(task => ({
                id: task.id,
                title: task.title,
                description: task.description,
                createdAt: task.createdAt,
                dueDate: task.dueDate
            }))
        }

        return NextResponse.json(
            { items },
            { status: 200 }
        )
    } catch (error) {
        console.log(error)

        return NextResponse.json(
            { error: 'Invalid request' },
            { status: 400 }
        )
    }
}
