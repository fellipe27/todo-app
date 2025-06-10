import { useEffect, useState } from 'react'
import { Task } from './list-content'
import { TaskCard } from './task-card'
import { TaskContent } from './task-content'
import { api } from '@/lib/axios'

export function TodayContent() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [selectedTask, setSelectedTask] = useState<Task | null>(null)

    useEffect(() => {
        handleGetTodayTasks()
    }, [])

    useEffect(() => {
        if (selectedTask) {
            const task = tasks.find(task => task.id == selectedTask.id)
            setSelectedTask(task ? task : null)
        }
    }, [tasks])

    async function handleGetTodayTasks() {
        try {
            await api.get<{ todayTasks: Task[] }>('/tasks').then(response => {
                setTasks(response.data.todayTasks)
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <section className="w-full h-full flex flex-1 gap-3">
            <div className="w-full flex flex-col flex-1 gap-4">
                <header className="w-full flex items-center gap-4">
                    <h1 className="text-3xl font-bold">Today</h1>
                    <div className="w-12 h-8 flex items-center justify-center text-2xl border rounded border-zinc-400">{ tasks.length }</div>
                </header>
                <div className="w-full h-full flex flex-col -mt-2 overflow-auto">
                    {
                        tasks.length > 0 ?
                        tasks.map(task => {
                            return <TaskCard key={ task.id } task={ task } selectedTask={ selectedTask } setSelectedTask={ setSelectedTask } showList={ true } handleGetTasks={ handleGetTodayTasks } />
                        })
                        : <span className="text-sm mx-auto mt-10">You don't have tasks for today</span>
                    }
                </div>
            </div>
            { selectedTask && <TaskContent task={ selectedTask } setSelectedTask={ setSelectedTask } handleGetTasks={ handleGetTodayTasks } /> }   
        </section>
    )
}
