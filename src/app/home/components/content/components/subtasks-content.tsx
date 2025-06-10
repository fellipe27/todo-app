import { Plus } from 'phosphor-react'
import { Task } from './list-content'
import { useEffect, useRef, useState } from 'react'
import { SubtaskCard } from './subtask-card'
import { api } from '@/lib/axios'
import { List } from '../../sidebar/components/lists-section'

interface SubtasksContentProps {
    task: Task
    subtasks: Task[]
    setSubtasks: (tasks: Task[]) => void
    handleGetTasks: () => void
}

export function SubtasksContent({ task, subtasks, setSubtasks, handleGetTasks }: SubtasksContentProps) {
    const [searchedTasks, setSearchedTasks] = useState<Task[]>([])
    const [tasks, setTasks] = useState<Task[]>([])
    const [lists, setLists] = useState<List[]>([])

    const inputSubtaskRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (inputSubtaskRef.current) {
            inputSubtaskRef.current.value = ''
            setSearchedTasks([])
        }

        handleGetLists()
    }, [task])

    useEffect(() => {
        handleGetSubtasks()
    }, [lists])

    async function handleGetSubtasks() {
        try {
            const searchAllTasks = await Promise.all(
                lists.map(async (list) => {
                    return await api.get<{ tasks: Task[] }>(`/lists/${list.id}/tasks`).then(response => response.data.tasks)
                })
            )

            const subtasksIds = task.subtasks?.map(subtask => subtask.id)
            const subtasks = searchAllTasks.flat().filter(task => subtasksIds.includes(task.id))

            setTasks(searchAllTasks.flat())
            setSubtasks(subtasks)
        } catch (error) {
            console.log(error)
        }
    }

    async function handleGetLists() {
        try {
            await api.get<{ lists: List[] }>('/lists').then(response => {
                setLists(response.data.lists)
            })
        } catch (error) {
            console.log(error)
        }
    }

    function handleSearchTasks(text: string) {
        if (text.length > 0) {
            setSearchedTasks(tasks.filter(task => task.title.toLowerCase().includes(text.toLowerCase())))
        } else {
            setSearchedTasks([])
        }
    }

    return (
        <div className="w-full flex flex-col gap-2 -mt-2">
            <h2 className="font-semibold">Subtasks</h2>
            <div className="w-full flex items-center gap-2 p-1 border rounded-md border-zinc-500">
                <Plus size={ 16 } />
                <input spellCheck={ false } ref={ inputSubtaskRef } onChange={ e => handleSearchTasks(e.target.value) } placeholder="Add new subtask" type="text" className="h-full flex-1 focus:outline-none bg-transparent" />
            </div>
            <div className="w-full h-[88px] px-2 flex flex-col gap-2 overflow-auto">
                {
                    searchedTasks.length > 0 ?
                    searchedTasks.map(searchedTask => {
                        if (searchedTask.id != task.id) {
                            return <SubtaskCard key={ searchedTask.id } taskId={ task.id } subtask={ searchedTask } subtasks={ subtasks } handleGetTasks={ handleGetTasks } />
                        }
                    })
                    : subtasks.length > 0 ?
                    subtasks.map(subtask => {
                        return <SubtaskCard key={ subtask.id } taskId={ task.id } subtask={ subtask } subtasks={ subtasks } handleGetTasks={ handleGetTasks } />
                    })
                    : <span className="text-xs mx-auto mt-5">Add a subtask</span>
                }
            </div>
        </div>
    )
}
