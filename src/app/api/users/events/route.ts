import { getUserIdFromToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const eventBodySchema = z.object({
    title: z.string(),
    date: z.coerce.date()
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
                events: true
            }
        })

        return NextResponse.json(
            { events: user?.events },
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
        const { title, date } = eventBodySchema.parse(body)

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized.' },
                { status: 401 }
            )
        }

        await prisma.event.create({
            data: {
                title,
                date,
                color: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'),
                userId
            }
        })

        return NextResponse.json({ status: 201 })
    } catch (error) {
        console.log(error)

        return NextResponse.json(
            { error: 'Invalid request.' },
            { status: 400 }
        )
    }
}
