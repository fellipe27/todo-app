import { getUserIdFromToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const listBodySchema = z.object({
    title: z.string()
})

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
                lists: {
                    include: {
                        _count: {
                            select: {
                                tasks: true
                            }
                        }
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

        const lists = user.lists.map(list => {
            return {
                id: list.id,
                title: list.title,
                color: list.color,
                tasksAmount: list._count.tasks
            }
        })

        return NextResponse.json(
            { lists },
            { status: 200 }
        )
    } catch (error) {
        console.log(error)

        return NextResponse.json(
            { error: 'Invalid request.' },
            { status: 400 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const userId = await getUserIdFromToken()
        const body = await request.json()
        const { title } = listBodySchema.parse(body)

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

        const list = await prisma.list.create({
            data: {
                title,
                color: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'),
                userId
            }
        })

        return NextResponse.json(
            { list },
            { status: 201 }
        )
    } catch (error) {
        console.log(error)

        return NextResponse.json(
            { error: 'Invalid request.' },
            { status: 400 }
        )
    }
}
