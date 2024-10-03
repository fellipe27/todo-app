import { fredoka } from '@/pages/_app'
import { List, MagnifyingGlass, SignOut, SlidersHorizontal } from 'phosphor-react'
import { InputText } from '../input-text'
import { TasksSection } from './components/tasks-section'
import { ListsSection } from './components/lists-section'
import { TagsSection } from './components/tags-section'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { TodoContext } from '../..'
import { SettingsContent } from '../content/components/settings/settings-content'
import { SearchContent } from '../content/components/search/search-content'

export function Sidebar({ isSidebarOpen, setIsSidebarOpen }) {
    const router = useRouter()
    const { setContent } = useContext(TodoContext)

    function handleSearchTask(searchedText) {
        if (searchedText.length > 0) {
            setContent({ type: 'search', component: <SearchContent text={searchedText} /> })
        }
    }

    return (
        <section className={`h-full p-2 text-sm relative ${isSidebarOpen && "border-r border-zinc-400"}`}>
            {
                isSidebarOpen ?
                <aside className="w-[300px] h-full flex flex-col gap-2">
                    <header className="w-full flex items-center justify-between">
                        <h1 onClick={() => setContent(null)} className={`${fredoka.className} text-xl cursor-default`}>Menu</h1>
                        <List onClick={() => setIsSidebarOpen(false)} weight="bold" size={25} className="cursor-pointer" />
                    </header>
                    <InputText placeholder="Search" handleKeyDownAction={handleSearchTask}>
                        <MagnifyingGlass weight="bold" size={16} />
                    </InputText>
                    <TasksSection />
                    <ListsSection />
                    <TagsSection />
                    <footer className="absolute bottom-2 flex flex-col gap-1">
                        <div onClick={() => setContent({ type: 'settings', component: <SettingsContent /> })} className="flex items-center gap-3 cursor-pointer">
                            <SlidersHorizontal size={18} />
                            <span>Settings</span>
                        </div>  
                        <div onClick={() => router.push('/')} className="flex items-center gap-3 cursor-pointer">
                            <SignOut size={18} />
                            <span>Sign out</span>
                        </div>
                    </footer>
                </aside>
                : <List onClick={() => setIsSidebarOpen(true)} weight="bold" size={25} className="cursor-pointer" />
            }
        </section>
    )
}
