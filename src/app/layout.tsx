import { Fredoka } from 'next/font/google'
import './globals.css'

const fredoka = Fredoka({
  subsets: ['latin']
})

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${fredoka.className}`}>
        { children }
      </body>
    </html>
  )
}
