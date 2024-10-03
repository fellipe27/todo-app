import { fredoka } from '@/pages/_app'
import { format } from 'date-fns'
import { Calendar, CalendarX } from 'phosphor-react'

export function ListAndTasksSection({ list }) {
    return (
        <div key={list.id} className="w-72 flex flex-col cursor-default">
            <header style={{ backgroundColor: list.color }} className="w-full flex items-center justify-between p-2 rounded text-black translate-y-[2px]">
                <h2 className={`${fredoka.className}`}>{list.title}</h2>
                <div className="w-8 h-6 border border-black rounded flex items-center justify-center">{list.tasks.length}</div>
            </header>
            <div className="w-full pt-2 flex flex-col gap-3 overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-700">
                {
                    list.tasks.map(task => {
                        return (
                            <div key={task.id} className="w-full bg-zinc-200 text-black rounded p-2 text-sm flex flex-col gap-2">
                                <span title={task.title} className={`${fredoka.className}`}>{task.title}</span>
                                <p title={task.description} className="max-w-[90%] truncate">{task.description}</p>                   
                                <div className="w-full flex items-center justify-between">
                                    <span title={`Created at ${format(task.createdAt, 'MM-dd-yy')}`} className="flex items-center gap-2 text-xs">
                                        <Calendar weight="fill" size={16} className="text-blue-500" />
                                        {format(task.createdAt, 'MM-dd-yy')}
                                    </span>
                                    {
                                        task.dueDate && (
                                            <span className="flex items-center gap-2 text-xs">
                                                <CalendarX weight="fill" size={16} className="text-red-500" />
                                                {format(task.dueDate, 'MM-dd-yy')}
                                            </span>
                                        )
                                    }
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
