import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getUserIdFromToken } from '@/lib/auth'
import { SignJWT } from 'jose'

const userBodySchema = z.object({
    name: z.string(), 
    email: z.string().email(), 
    picture: z.string().url().nullable()
})

const userSettingsBodyScema = z.object({
    isDarkMode: z.boolean(),
    isStickysColored: z.boolean()
})

export async function GET() {
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

        return NextResponse.json(
            { user },
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

export async function PUT(request: NextRequest) {
    try {
        const userId = await getUserIdFromToken()
        const body = await request.json()
        const { isDarkMode, isStickysColored } = userSettingsBodyScema.parse(body)

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

        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                isDarkMode,
                isStickysColored
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

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, email, picture } = userBodySchema.parse(body)

        const user = await prisma.user.findUnique({
            where: { 
                email
            }
        })

        const userId = user ? user.id : (
            await prisma.user.create({
                data: { 
                    name, 
                    email, 
                    picture 
                }
            })
        ).id

        const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
        const token = await new SignJWT({ userId }).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('1y').sign(secret)

        const response = NextResponse.json(
            { userId },
            { status: user ? 200 : 201 }
        )

        response.cookies.set('token', token, {
            httpOnly: true,
            path: '/',
            secure: process.env.NODE_ENV === 'production'
        })

        return response
    } catch (error) {
        console.log(error)

        return NextResponse.json(
            { error: 'Invalid request.' },
            { status: 400 }
        )
    }
}
