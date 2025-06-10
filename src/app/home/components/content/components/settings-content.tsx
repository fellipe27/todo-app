import { TodoContext, User } from '@/app/home/page'
import { useContext, useEffect, useState } from 'react'
import { SwitchButton } from './switch-button'
import { api } from '@/lib/axios'

interface SettingsContentProps {
    user: User
}

export function SettingsContent({ user }: SettingsContentProps) {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(user.isDarkMode)
    const [isStickysColored, setIsStickysColored] = useState<boolean>(user.isStickysColored)

    const context = useContext(TodoContext)

    if (!context) {
        return
    }

    const { handleGetUserData } = context

    useEffect(() => {
        setIsDarkMode(user.isDarkMode)
        setIsStickysColored(user.isStickysColored)
    }, [user])

    async function handleUpdateSettings() {
        try {
            await api.put('/users', {
                isDarkMode,
                isStickysColored
            }).then(() => {
                handleGetUserData()
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <section className="w-full h-full flex flex-col flex-1 items-center justify-center gap-10">
            <div className="flex flex-col gap-1 items-center">
                <img src={ user.picture as string } alt={`${user.name} picture`} className="rounded-full" />
                <p className="text-xl">{ user.name }</p>
                <span className="text-sm">{ user.email }</span>
            </div>
            <div className="w-80 flex flex-col gap-3">
                <div className="flex items-center justify-between text-sm">
                    <span>App in dark mode</span>
                    <SwitchButton option={ isDarkMode } setOption={ setIsDarkMode } handleAction={ handleUpdateSettings } />
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span>Colored stickys</span>
                    <SwitchButton option={ isStickysColored } setOption={ setIsStickysColored } handleAction={ handleUpdateSettings } />
                </div>
            </div>
        </section>
    )
}
