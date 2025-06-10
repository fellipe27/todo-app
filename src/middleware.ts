import { NextResponse, NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const response = NextResponse.next()

    if (pathname.startsWith('/_next') || pathname.startsWith('/static') || pathname === '/favicon.ico') {
        return NextResponse.next()
    }

    response.headers.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.set('Access-Control-Allow-Credentials', 'true')

    if (request.method === 'OPTIONS') {
        return response
    }

    const token = request.cookies.get('token')?.value

    if (pathname === '/home' && !token) {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        
        return NextResponse.redirect(url, { status: 303 })
    }

    if (!token) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    try {
        const { payload } = await jwtVerify(token, secret)
        const userId = payload.userId as string

        response.headers.set('X-User-Id', userId)
    } catch (error) {
        return new NextResponse('Invalid token', { status: 401 })
    }

    return response
}

export const config = {
    matcher: '/home'
}
