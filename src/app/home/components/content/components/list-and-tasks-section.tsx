import { format } from 'date-fns'
import { Task } from './list-content'
import { Calendar } from 'phosphor-react'

interface ListAndTasksSectionProps {
    list: {
        id: string
        title: string
        color: string
        tasks: Task[]
    }
}

export function ListAndTasksSection({ list }: ListAndTasksSectionProps) {
    return (
        <div className="w-72 flex flex-col">
            <header style={{ backgroundColor: list.color }} className="w-full flex items-center justify-between p-2 rounded translate-y-[2px]">
                <h2 className="font-semibold">{ list.title }</h2>
                <div className="w-8 h-6 border rounded flex items-center justify-center border-black text-black">{ list.tasks.length }</div>
            </header>
            <div className="w-full pt-2 flex flex-col gap-3 overflow-auto">
                {
                    list.tasks.map(task => {
                        return (
                            <div key={ task.id } className="w-full rounded p-2 text-sm flex flex-col gap-2 bg-zinc-200 text-black">
                                <span title={ task.title } className="max-w-[90%] truncate font-semibold">{ task.title }</span>
                                <p title={ task.description } className="max-w-[90%] truncate">{ task.description }</p>
                                <div className="w-full flex items-center justify-between">
                                    <span title={`Created at ${format(task.createdAt, 'MM-dd-yy')}`} className="flex items-center gap-2 text-xs">
                                        <Calendar weight="fill" size={ 16 } className="text-blue-500" />
                                        <span>{ format(task.createdAt, 'MM-dd-yy') }</span>
                                    </span>
                                    {
                                        task.dueDate && (
                                            <span className="flex items-center gap-2 text-xs">
                                                <Calendar weight="fill" size={ 16 } className="text-red-500" />
                                                <span>{ format(task.dueDate, 'MM-dd-yy') }</span>
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
