'use client'
import { api } from '@/lib/axios'
import { CredentialResponse, GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface GoogleOAuthResponse {
  name: string
  email: string
  picture: string | null
}

interface OAuthResponse {
  userId: string
}

export default function App() {
  const [userId, setUserId] = useState<string>('')

  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID as string
  const router = useRouter()

  useEffect(() => {
    document.title = 'Todo App - Login'
  }, [])

  useEffect(() => {
    if (userId) {
      router.push('/home')
    }
  }, [userId])

  async function handleGoogleLogin(credentialResponse: CredentialResponse) {
    if (credentialResponse.credential) {
      const { name, email, picture } = jwtDecode<GoogleOAuthResponse>(credentialResponse.credential)

      try {
        await api.post<OAuthResponse>('/users', {
          name,
          email,
          picture
        }).then(response => {
          setUserId(response.data.userId)
        })
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <main className="w-screen h-screen flex items-center justify-center">
      <GoogleOAuthProvider clientId={ clientId }>
        <GoogleLogin onSuccess={ credentialResponse => handleGoogleLogin(credentialResponse) } useOneTap />
      </GoogleOAuthProvider>
    </main>
  )
}
