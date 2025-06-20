import { getUserIdFromToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const stickyBodySchema = z.object({
    title: z.string(),
    description: z.string()
})

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const userId = await getUserIdFromToken()
        const body = await request.json()
        const { id } = params
        const { title, description } = stickyBodySchema.parse(body)

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized.' },
                { status: 401 }
            )
        }

        const sticky = await prisma.sticky.findUnique({
            where: {
                id
            }
        })

        if (!sticky) {
            return NextResponse.json(
                { error: 'Sticky not found.' },
                { status: 404 }
            )
        }
        
        await prisma.sticky.update({
            where: {
                id
            },
            data: {
                title,
                description
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

        const sticky = await prisma.sticky.findUnique({
            where: {
                id
            }
        })

        if (!sticky) {
            return NextResponse.json(
                { error: 'Sticky not found.' },
                { status: 404 }
            )
        }
        
        await prisma.sticky.delete({
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
