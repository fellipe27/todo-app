import { getUserIdFromToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const tagBodySchema = z.object({
    title: z.string()
})

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const userId = await getUserIdFromToken()
        const body = await request.json()
        const { id } = params
        const { title } = tagBodySchema.parse(body)

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized.' },
                { status: 401 }
            )
        }

        const tag = await prisma.tag.findUnique({
            where: {
                id
            }
        })

        if (!tag) {
            return NextResponse.json(
                { error: 'Tag not found.' },
                { status: 404 }
            )
        }

        await prisma.tag.update({
            where: {
                id
            },
            data: {
                title
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

        const tag = await prisma.tag.findUnique({
            where: {
                id
            }
        })

        if (!tag) {
            return NextResponse.json(
                { error: 'Tag not found.' },
                { status: 404 }
            )
        }

        await prisma.tag.delete({
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
