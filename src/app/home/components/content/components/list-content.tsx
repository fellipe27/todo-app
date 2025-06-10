import { Plus, Trash } from 'phosphor-react'
import { InputText } from '../../input-text'
import { List } from '../../sidebar/components/lists-section'
import { useContext, useEffect, useRef, useState } from 'react'
import { Content, TodoContext } from '@/app/home/page'
import { api } from '@/lib/axios'
import { TaskCard } from './task-card'
import { Subtask, TaskContent } from './task-content'
import { Tag } from '../../sidebar/components/tags-section'

interface ListContentProps {
    list: List
    handleGetLists: () => void
}

export interface Task {
    id: string
    title: string
    description: string
    createdAt: string
    dueDate: string | null
    listId: string
    tags: Tag[]
    subtasks: Subtask[]
}

export function ListContent({ list, handleGetLists }: ListContentProps) {
    const [listTitle, setListTitle] = useState<string>('')
    const [isUpdatingListTitle, setIsUpdatingListTitle] = useState<boolean>(false)
    const [tasks, setTasks] = useState<Task[]>([])
    const [selectedTask, setSelectedTask] = useState<Task | null>(null)

    const context = useContext(TodoContext)

    if (!context) {
        return
    }

    const { setContent, setChangesOccured } = context
    const inputListTitleRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (selectedTask) {
            const task = tasks.find(task => task.id == selectedTask.id)
            setSelectedTask(task ? task : null)
        }
    }, [tasks])

    useEffect(() => {
        setListTitle(list.title)
        handleGetTasks()
        setSelectedTask(null)
    }, [list])

    useEffect(() => {
        if (isUpdatingListTitle) {
            inputListTitleRef.current?.focus()
        }
    }, [isUpdatingListTitle])

    async function handleGetTasks() {
        try {
            await api.get<{ tasks: Task[] }>(`/lists/${list.id}/tasks`).then(response => {
                setTasks(response.data.tasks)
                handleGetLists()
            })
        } catch (error) {
            console.log(error)
        }
    }

    async function handleCreateTask(title: string) {
        if (title.length > 0) {
            try {
                await api.post<{ task: Task }>(`/lists/${list.id}/tasks`, {
                    title
                }).then(response => {
                    setSelectedTask(response.data.task)
                    handleGetTasks()
                })
            } catch (error) {
                console.log(error)
            }
        }
    }

    async function handleUpdateListTitle() {
        if (listTitle.length > 0) {
            try {
                await api.put(`/lists/${list.id}`, {
                    title: listTitle
                }).then(() => {
                    handleGetLists()
                })
            } catch (error) {
                console.log(error)
            }
        } else {
            setListTitle(list.title)
        }
        
        setIsUpdatingListTitle(false)
    }

    async function handleDeleteList() {
        try {
            await api.delete(`/lists/${list.id}`).then(() => {
                handleGetLists()
                setContent({} as Content)
                setChangesOccured(true)
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <section className="w-full h-full flex gap-2">
            <div className="w-full h-full flex flex-1 flex-col gap-3">
                <header className="w-full flex items-center gap-4 relative font-bold">
                    <div style={{ backgroundColor: list.color }} className="w-8 h-8 rounded" />
                    {
                        isUpdatingListTitle ?
                        <input spellCheck={ false } type="text" onBlur={ handleUpdateListTitle } ref={ inputListTitleRef } onChange={ e => setListTitle(e.target.value) } value={ listTitle } placeholder={ list.title } className="w-[80%] text-3xl focus:outline-none bg-transparent" />
                        : (
                            <>
                                <h1 onClick={ () => setIsUpdatingListTitle(true) } className="max-w-[75%] truncate text-3xl cursor-default">{ listTitle }</h1>
                                <div className="w-12 h-8 flex items-center justify-center text-2xl rounded font-normal border border-zinc-400">{ tasks.length }</div>
                            </>
                        )
                    }
                    <Trash onClick={ handleDeleteList } size={ 35 } className="cursor-pointer absolute right-0 hover:text-red-500" />
                </header>
                <InputText placeholder="Add new task" handleKeyDownAction={ handleCreateTask }>
                    <Plus size={ 25 } />
                </InputText>
                <div className="w-full h-full flex flex-col -mt-2 overflow-auto">
                    {
                        tasks.length > 0 ?
                        tasks.map(task => {
                            return <TaskCard key={ task.id } task={ task } selectedTask={ selectedTask } setSelectedTask={ setSelectedTask } showList={ false } handleGetTasks={ handleGetTasks } />
                        })
                        : <span className="text-sm mx-auto mt-10">Create your first task</span>
                    }
                </div>
            </div>
            { selectedTask && <TaskContent task={ selectedTask } setSelectedTask={ setSelectedTask } handleGetTasks={ handleGetTasks } /> }
        </section>
    )
}
