import { ReactNode, useContext } from 'react'
import { Items } from './search-content'
import { TodoContext } from '@/app/home/page'
import { Calendar, CalendarX } from 'phosphor-react'
import { format } from 'date-fns'

interface ItemsCardsProps {
    sectionTitle: string
    children: ReactNode
    item: Items[keyof Items]
}

export function ItemsCards({ sectionTitle, children, item }: ItemsCardsProps) {
    const context = useContext(TodoContext)

    if (!context) {
        return
    }

    const { user } = context

    return (
        <div className="w-full text-sm">
            <div className="w-full text-xs mb-3 flex items-center">
                { children }
                <span className={`px-2 font-semibold ${user.isDarkMode ? "bg-black" : "bg-white"}`}>{ sectionTitle }</span>
                <div className="w-full h-[1px] bg-zinc-500" />
            </div>
            <div className="w-full flex flex-col gap-1">
                {
                    item.length > 0 ?
                    item.map(i => {
                        return (
                            <div key={ i.id } className="w-full flex items-center justify-between gap-3 border rounded-md p-2 border-zinc-500">
                                <div className="w-[85%] flex items-center gap-3">
                                    { 'color' in i && <div style={{ backgroundColor: i.color }} className="w-5 h-5 flex-shrink-0 rounded" /> }
                                    <div className="w-full flex flex-col gap-2">
                                        <span title={ i.title } className="w-full truncate">{ i.title }</span>
                                        { 'description' in i && <p title={ i.description } className="w-full truncate text-xs">{ i.description }</p> }
                                    </div>
                                </div>
                                {
                                    'tasksAmount' in i && (
                                        <div className="w-8 h-5 rounded flex items-center justify-center border border-zinc-500">
                                            <span>{ i.tasksAmount }</span>
                                        </div>
                                    )
                                }
                                {
                                    'createdAt' in i && (
                                        <div className={`flex flex-col text-xs ${('dueDate' in i || 'date' in i) && "gap-1"}`}>
                                            <div className="flex items-center gap-2">
                                                <Calendar weight="fill" className="text-blue-500" />
                                                <span>{ format(i.createdAt, 'MM-dd-yyyy') }</span>
                                            </div>
                                            {
                                                ('dueDate' in i || 'date' in i) && (
                                                    <div className="flex items-center gap-2">
                                                        <CalendarX weight="fill" className="text-red-500" />
                                                        <span>
                                                            {
                                                                'dueDate' in i && i.dueDate && format(i.dueDate, 'MM-dd-yyyy')
                                                                || 'date' in i && i.date && format(i.date, 'MM-dd-yyyy')
                                                            }
                                                        </span>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    )
                                }
                            </div>
                        )
                    })
                    : <span className="text-xs ml-2">No results for your search</span>
                }
            </div>
        </div>
    )
}
