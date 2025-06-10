import { getUserIdFromToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const eventBodySchema = z.object({
    title: z.string(),
    date: z.coerce.date()
})

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

        await prisma.event.delete({
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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const userId = await getUserIdFromToken()
        const body = await request.json()
        const { id } = params
        const { title, date } = eventBodySchema.parse(body)

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized.' },
                { status: 401 }
            )
        }

        await prisma.event.update({
            where: {
                id
            },
            data: {
                title,
                date
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
