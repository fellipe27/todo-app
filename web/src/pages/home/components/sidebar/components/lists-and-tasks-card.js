import { fredoka } from '@/pages/_app'
import { TodoContext } from '@/pages/home'
import { useContext } from 'react'

export function ListsAndTasksCard({ children, type, component }) {
    const { content, setContent } = useContext(TodoContext)

    return (
        <div onClick={() => setContent({ type, component })} className={`w-full flex items-center gap-3 p-1 rounded cursor-pointer relative hover:bg-zinc-300 hover:text-black group ${content?.type == type && `bg-zinc-300 text-black ${fredoka.className}`}`}>
            {children}
        </div>
    )
}
