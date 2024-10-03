import { fredoka } from '@/pages/_app'
import { TodoContext } from '@/pages/home'
import { useContext } from 'react'
import { SwitchButton } from './switch-button'
import { updateUserSettings } from '@/utils/users/update-user-settings'

export function SettingsContent() {
    const { user, isDarkMode, setIsDarkMode, isStickysColored, setIsStickysColored } = useContext(TodoContext)

    async function handleUpdateUserSettings() {
        await updateUserSettings(user.id, isDarkMode, isStickysColored)
    }

    return (
        <section className="w-full h-full flex flex-col flex-1 items-center justify-center gap-10">
            <div className="flex flex-col gap-1 items-center">
                <img src={user?.picture} className="rounded-full" alt={`${user?.name} picture`} />
                <p className={`${fredoka.className} text-xl`}>{user?.name}</p>
                <span className="text-xs">{user?.email}</span>
            </div>
            <div className="w-80 flex flex-col gap-3">
                <div className="flex items-center justify-between text-sm">
                    <span>App in dark mode</span>
                    <SwitchButton option={isDarkMode} setOption={setIsDarkMode} handleAction={handleUpdateUserSettings} />
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span>Colored stickys</span>
                    <SwitchButton option={isStickysColored} setOption={setIsStickysColored} handleAction={handleUpdateUserSettings} />
                </div>
            </div>
        </section>
    )
}
