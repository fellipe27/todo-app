import '@/styles/globals.css'
import { Inter, Fredoka } from 'next/font/google'

export const inter = Inter({
    subsets: ['latin']
})

export const fredoka = Fredoka({
    subsets: ['latin'],
    weight: '700'
})

export default function App({ Component, pageProps }) {
    return <Component {...pageProps} />
}
