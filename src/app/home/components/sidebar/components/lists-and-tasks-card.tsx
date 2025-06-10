import { TodoContext } from '@/app/home/page'
import { ReactNode, useContext } from 'react'

interface ListsAndTasksCardProps {
    children: ReactNode
    type: string
    component: ReactNode
}

export function ListsAndTasksCard({ children, type, component }: ListsAndTasksCardProps) {
    const context = useContext(TodoContext)

    if (!context) {
        return
    }

    const { content, setContent } = context

    return (
        <div onClick={ () => setContent({ type, component }) } className={`w-full flex items-center gap-3 p-1 rounded cursor-pointer group relative hover:bg-zinc-300 hover:text-black ${content.type == type && `font-semibold bg-zinc-300 text-black`}`}>
            { children }
        </div>
    )
}
