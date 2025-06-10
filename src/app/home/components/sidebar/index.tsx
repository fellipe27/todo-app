import { List, MagnifyingGlass, SignOut, SlidersHorizontal } from 'phosphor-react'
import { useContext, useState } from 'react'
import { InputText } from '../input-text'
import { TasksSection } from './components/tasks-section'
import { Content, TodoContext } from '../../page'
import { ListsSection } from './components/lists-section'
import { TagsSection } from './components/tags-section'
import { SettingsContent } from '../content/components/settings-content'
import { api } from '@/lib/axios'
import { useRouter } from 'next/navigation'
import { SearchContent } from '../content/components/search-content'

export function Sidebar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true)

    const context = useContext(TodoContext)

    if (!context) {
        return
    }

    const { user, setContent } = context
    const router = useRouter()

    async function handleSignOut() {
        try {
            await api.get('/logout', {
                withCredentials: true
            }).then(() => {
                router.push('/')
            })
        } catch (error) {
            console.log(error)
        }
    }

    function handleSearchTasks(searchText: string) {
        if (searchText.length > 0) {
            setContent({ type: 'search', component: <SearchContent text={ searchText } /> })
        }
    }

    return (
        <aside className={`h-full p-2 ${isSidebarOpen && "w-[300px] flex flex-col gap-2 border-r border-zinc-300"}`}>
            {
                isSidebarOpen ?
                <>
                    <header className="w-full flex items-center justify-between">
                        <h1 onClick={ () => setContent({} as Content) } className="font-bold text-xl cursor-pointer">Menu</h1>
                        <List onClick={ () => setIsSidebarOpen(false) } size={ 25 } weight="bold" className="cursor-pointer" />
                    </header>
                    <InputText placeholder="Search" handleKeyDownAction={ handleSearchTasks }>
                        <MagnifyingGlass size={ 16 } weight="bold" />
                    </InputText>
                    <TasksSection />
                    <ListsSection />
                    <TagsSection />
                    <footer className="text-sm absolute bottom-3 flex flex-col gap-2">
                        <div onClick={ () => setContent({ type: 'settings', component: <SettingsContent user={ user } /> }) } className="flex items-center gap-3 cursor-pointer">
                            <SlidersHorizontal size={ 20 } />
                            <span>Settings</span>
                        </div>
                        <div onClick={ handleSignOut } className="flex items-center gap-3 cursor-pointer">
                            <SignOut size={ 20 } />
                            <span>Sign out</span>
                        </div>
                    </footer>
                </>
                : <List onClick={ () => setIsSidebarOpen(true) } size={ 25 } weight="bold" className="cursor-pointer" />
            }
        </aside>
    )
}
