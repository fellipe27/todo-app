import { useContext, useEffect, useState } from 'react'
import { Task } from './list-content'
import { CalendarX, CaretLeft, CaretRight, Check } from 'phosphor-react'
import { format } from 'date-fns'
import { api } from '@/lib/axios'
import { List } from '../../sidebar/components/lists-section'
import { TodoContext } from '@/app/home/page'

interface TaskCardProps {
    task: Task
    selectedTask: Task | null
    setSelectedTask: (task: Task | null) => void
    showList: boolean
    handleGetTasks: () => void
}

export function TaskCard({ task, selectedTask, setSelectedTask, showList, handleGetTasks }: TaskCardProps) {
    const [isHoverCheck, setIsHoverCheck] = useState<boolean>(false)
    const [list, setList] = useState<List>({} as List)

    const context = useContext(TodoContext)

    if (!context) {
        return
    }

    const { setChangesOccured } = context

    useEffect(() => {
        if (showList && (Object.keys(list).length == 0) || task.listId != selectedTask?.listId) {
            handleGetList()
        }
    }, [task])

    async function handleDeleteTask() {
        try {
            await api.delete(`/tasks/${task.id}`).then(() => {
                if (task.id == selectedTask?.id) {
                    setSelectedTask(null)
                }

                handleGetTasks()
                setChangesOccured(true)
            })
        } catch (error) {
            console.log(error)
        }
    }

    async function handleGetList() {
        try {
            await api.get<{ lists: List[] }>('/lists').then(response => {
                const list = response.data.lists.find(list => list.id == task.listId)
                setList(list || {} as List)
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="w-full flex items-start gap-4 border-b px-2 pt-3 relative border-zinc-400">
            <div onClick={ handleDeleteTask } onMouseEnter={ () => setIsHoverCheck(true) } onMouseLeave={ () => setIsHoverCheck(false) } className="w-5 h-5 rounded border cursor-pointer flex items-center justify-center border-zinc-400">
                { isHoverCheck && <Check weight="bold" size={ 17 } className="text-green-500" /> }
            </div>
            <div className="w-full flex flex-col gap-2">
                <span title={ task.title } className={`max-w-[90%] flex flex-1 ${task.id == selectedTask?.id && "font-bold"}`}>{ task.title }</span>
                <div className="text-xs pb-3 flex items-center gap-4">
                    {
                        showList &&
                        (
                            <div className="flex items-center gap-2">
                                <div style={{ backgroundColor: list.color }} className="w-4 h-4 rounded" />
                                <span>{ list.title }</span>
                            </div>
                        )
                    }
                    {
                        task.dueDate && (
                            <div className="flex items-center gap-2">
                                <CalendarX weight="fill" size={ 16 } className="text-red-500" />
                                <span>{ format(task.dueDate, 'MM-dd-yy') }</span>
                            </div>
                        )
                    }
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-4 flex items-center justify-center rounded bg-zinc-400 text-black">{ task.subtasks.length }</div>
                        <span>Subtasks</span>
                    </div>
                </div>
            </div>
            {
                task.id == selectedTask?.id ?
                <CaretLeft onClick={ () => setSelectedTask(null) } weight="bold" size={ 24 } className="cursor-pointer absolute right-1 text-red-500" />
                : <CaretRight onClick={ () => setSelectedTask(task) } weight="bold" size={ 24 } className="cursor-pointer absolute right-1" />
            }
        </div>
    )
}
