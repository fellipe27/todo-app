import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

interface TokenResponse {
    userId: string
}

export async function getUserIdFromToken() {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    console.log(token)

    if (!token) {
        return null
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenResponse

        return decoded.userId
    } catch {
        return null
    }
}
