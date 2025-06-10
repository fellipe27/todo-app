import { NextRequest, NextResponse } from 'next/server'

export async function GET(_request: NextRequest) {
    try {
        const response = NextResponse.json({ status: 200 })

        response.cookies.set('token', '', {
            expires: new Date(0),
            path: '/'
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
