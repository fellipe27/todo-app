import { fredoka } from '@/pages/_app'
import { TodoContext } from '@/pages/home'
import { format } from 'date-fns'
import { Calendar, CalendarX } from 'phosphor-react'
import { useContext } from 'react'

export function ItemsContent({ sectionTitle, icon, items }) {
    const { isDarkMode } = useContext(TodoContext)

    return (
        <div className="w-full text-sm">
            <div className="w-full text-xs mb-3 flex items-center">
                {icon}
                <span className={`${fredoka.className} px-2 ${isDarkMode ? "bg-black" : "bg-white"}`}>{sectionTitle}</span>
                <div className="w-full h-[1px] bg-zinc-500" />
            </div>
            <div className="w-full flex flex-col gap-1">
                {
                    items?.length > 0 ?
                    items.map(item => {
                        return (
                            <div key={item.id} className="w-full hover:bg-zinc-500/30 flex items-center justify-between gap-3 border border-zinc-500 rounded-md p-2 cursor-default">
                                <div className="w-[85%] flex items-center gap-3">
                                    {item.color && <div style={{ backgroundColor: item.color }} className="w-5 h-5 flex-shrink-0 rounded" />}
                                    <div className="w-full flex flex-col gap-2">
                                        <span className={`${fredoka.className}`}>{item.title}</span>
                                        {item?.description && <p title={item.description} className="w-full truncate text-xs">{item.description}</p>}
                                    </div>
                                </div>
                                {
                                    item.tasksAmount != null && item.tasksAmount != undefined && (
                                        <div className="w-8 h-5 rounded flex items-center justify-center border border-zinc-500">
                                            <span>{item.tasksAmount}</span>
                                        </div>
                                    )
                                }
                                {
                                    item.createdAt && (
                                        <div className={`flex flex-col text-xs ${(item.dueDate || item.date) && "gap-1"}`}>
                                            <div className="flex items-center gap-2">
                                                <Calendar weight="fill" className="text-blue-500" />
                                                <span>{format(item.createdAt, 'MM-dd-yyyy')}</span>
                                            </div>
                                            {
                                                (item.dueDate || item.date) && (
                                                    <div className="flex items-center gap-2">
                                                        <CalendarX weight="fill" className="text-red-500" />
                                                        <span>{format(item.dueDate ? item.dueDate : item.date, 'MM-dd-yyyy')}</span>
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
