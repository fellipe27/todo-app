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
                stickys: true
            }
        })

        if (!user) {
            return NextResponse.json(
                { error: 'User not found.' },
                { status: 404 }
            )
        }

        return NextResponse.json(
            { stickys: user.stickys },
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

        await prisma.sticky.create({
            data: {
                title: 'Sticky title',
                description: 'Sticky description',
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
