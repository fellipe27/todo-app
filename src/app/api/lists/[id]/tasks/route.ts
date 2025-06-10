import { getUserIdFromToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const taskBodySchema = z.object({
    title: z.string()
})

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const userId = await getUserIdFromToken()
        const { id } = params

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized.' },
                { status: 401 }
            )
        }

        const list = await prisma.list.findUnique({
            where: {
                id
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
            return NextResponse.json(
                { error: 'List not found.' },
                { status: 404 }
            )
        }

        return NextResponse.json(
            { tasks: list.tasks },
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

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const userId = await getUserIdFromToken()
        const body = await request.json()
        const { id } = params
        const { title } = taskBodySchema.parse(body)

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized.' },
                { status: 401 }
            )
        }

        const list = await prisma.list.findUnique({
            where: {
                id
            }
        })

        if (!list) {
            return NextResponse.json(
                { error: 'List not found.' },
                { status: 404 }
            )
        }

        const task = await prisma.task.create({
            data: {
                title,
                description: '...',
                listId: id
            },
            include: {
                tags: true
            }
        })

        return NextResponse.json(
            { task },
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
