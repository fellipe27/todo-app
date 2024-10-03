import { getUser } from '@/utils/users/get-user'
import { useRouter } from 'next/router'
import { createContext, useEffect, useState } from 'react'
import { inter } from '../_app'
import { Content } from './components/content'
import { Sidebar } from './components/sidebar'
import { getUpcomingTasks } from '@/utils/tasks/get-upcoming-tasks'

export const TodoContext = createContext()

export default function Home() {
    const [user, setUser] = useState()
    const [isSidebarOpen, setIsSidebarOpen] = useState()
    const [content, setContent] = useState()
    const [isDarkMode, setIsDarkMode] = useState()
    const [upcomingTasks, setUpcomingTasks] = useState()
    const [isStickysColored, setIsStickysColored] = useState()

    const router = useRouter()

    useEffect(() => {
        const userId = localStorage.getItem('userId')

        if (!userId) {
            router.push('/')
        }

        handleGetUser(userId)
        handleGetUpcomingTasks(userId)
    }, [])

    useEffect(() => {
        document.title = `Todo App - ${user?.name}`
    }, [user])

    async function handleGetUser(userId) {
        await getUser(userId).then(response => {
            setUser(response?.user)
            setIsDarkMode(response.user.isDarkMode)
            setIsStickysColored(response.user.isStickysColored)
        })
    }

    async function handleGetUpcomingTasks(userId) {
        await getUpcomingTasks(userId).then(response => {
            setUpcomingTasks(response)
        })
    }

    return (
        <main className={`w-screen h-screen flex ${inter.className} ${isDarkMode ? "dark-mode" : "light-mode"}`}>
            <TodoContext.Provider value={{ user, content, setContent, isSidebarOpen, setIsSidebarOpen, isDarkMode, setIsDarkMode, upcomingTasks, handleGetUpcomingTasks, isStickysColored, setIsStickysColored }}>
                <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
                <Content />
            </TodoContext.Provider>
        </main>
    )
}
