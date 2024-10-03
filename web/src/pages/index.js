import { userLogin } from '@/utils/users/user-login'
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function Login() {
    const [userId, setUserId] = useState()

    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID
    const router = useRouter()

    useEffect(() => {
        localStorage.removeItem('userId')
        document.title = 'Todo App - Login'
    }, [])

    useEffect(() => {
        if (userId) {
            localStorage.setItem('userId', userId)
            router.push('/home')
        }
    }, [userId])

    async function handleGoogleLogin(credentialResponse) {
        const { name, email, picture } = jwtDecode(credentialResponse.credential)

        await userLogin(name, email, picture).then(response => {
            setUserId(response.userId)
        })
    }

    return (
        <main className="w-screen h-screen flex items-center justify-center">
            <GoogleOAuthProvider clientId={clientId}>
                <GoogleLogin onSuccess={credentialResponse => handleGoogleLogin(credentialResponse)} useOneTap />
            </GoogleOAuthProvider>
        </main>
    )
}
