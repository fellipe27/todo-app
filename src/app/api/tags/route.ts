import { getUserIdFromToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(_request: NextRequest) {
    try {
        const userId = await getUserIdFromToken()

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized.' },
                { status: 401 }
            )
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {
                tags: {
                    include: {
                        tasks: true
                    }
                }
            }
        })

        if (!user) {
            return NextResponse.json(
                { error: 'User not found.' },
                { status: 404 }
            )
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
                const listId = task.listId

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

        return NextResponse.json(
            { tags },
            { status: 200 }
        )
    } catch (error) {
        console.log(error)

        return  NextResponse.json(
            { error: 'Invalid request.' },
            { status: 400 }
        )
    }
}

export async function POST(_request: NextRequest) {
    try {
        const userId = await getUserIdFromToken()

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized.' },
                { status: 401 }
            )
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!user) {
            return NextResponse.json(
                { error: 'User not found.' },
                { status: 404 }
            )
        }

        const tag = await prisma.tag.create({
            data: {
                title: 'Tag title',
                color: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'),
                userId
            }
        })

        return NextResponse.json(
            { tag },
            { status: 201 }
        )
    } catch (error) {
        console.log(error)

        return  NextResponse.json(
            { error: 'Invalid request.' },
            { status: 400 }
        )
    }
}
