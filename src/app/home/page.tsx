'use client'
import { api } from '@/lib/axios'
import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react'
import { Sidebar } from './components/sidebar'
import { Content } from './components/content'

export interface User {
    name: string
    email: string
    picture: string | null
    isDarkMode: boolean
    isStickysColored: boolean
}

export interface Content {
    type: string
    component: ReactNode
}

interface TodoContextType {
    user: User
    handleGetUserData: () => void
    content: Content
    setContent: Dispatch<SetStateAction<Content>>
    changesOccured: boolean
    setChangesOccured: Dispatch<SetStateAction<boolean>>
}

export const TodoContext = createContext<TodoContextType | null>(null)

export default function Home() {
    const [user, setUser] = useState<User>({} as User)
    const [content, setContent] = useState<Content>({} as Content)
    const [changesOccured, setChangesOccured] = useState<boolean>(false)
    const [_isDarkMode, setIsDarkMode] = useState<boolean>(false)
    const [_isStickysColored, setIsStickysColored] = useState<boolean>(false)

    useEffect(() => {
        handleGetUserData()
    }, [])

    useEffect(() => {
        document.title = `Todo App - ${user.name}`
        setIsDarkMode(user.isDarkMode)
        setIsStickysColored(user.isStickysColored)
    }, [user])

    useEffect(() => {
        if (changesOccured) {
            setChangesOccured(false)
        }
    }, [changesOccured])

    async function handleGetUserData() {
        await api.get<{ user: User }>('/users').then(response => {
            setUser(response.data.user)
        })
    }

    return (
        <main className={`w-screen h-screen flex ${user.isDarkMode ? "bg-black text-white" : "bg-white text-black"}`}>
            <TodoContext.Provider value={{ user, handleGetUserData, content, setContent, changesOccured, setChangesOccured }}>
                <Sidebar />
                <Content />
            </TodoContext.Provider>
        </main>
    )
}
