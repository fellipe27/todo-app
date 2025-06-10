import { useEffect, useState } from 'react'
import { Task } from './list-content'
import { TaskCard } from './task-card'
import { api } from '@/lib/axios'
import { TaskContent } from './task-content'

export function UpcomingContent() {
    const [selectedTask, setSelectedTask] = useState<Task | null>(null)
    const [todayTasks, setTodayTasks] = useState<Task[]>([])
    const [tomorrowTasks, setTomorrowTasks] = useState<Task[]>([])
    const [thisWeekTasks, setThisWeekTasks] = useState<Task[]>([])

    useEffect(() => {
        handleGetUpcomingTasks()
    }, [])

    useEffect(() => {
        if (selectedTask) {
            const today = todayTasks.find(task => task.id == selectedTask.id)
            const tomorrow = tomorrowTasks.find(task => task.id == selectedTask.id)
            const thisWeek = thisWeekTasks.find(task => task.id == selectedTask.id)

            if (today) {
                setSelectedTask(today)
            } else if (tomorrow) {
                setSelectedTask(tomorrow)
            } else if (thisWeek) {
                setSelectedTask(thisWeek)
            }
        }
    }, [todayTasks, tomorrowTasks, thisWeekTasks])

    async function handleGetUpcomingTasks() {
        try {
            await api.get<{ todayTasks: Task[], tomorrowTasks: Task[], thisWeekTasks: Task[] }>('/tasks').then(response => {
                setTodayTasks(response.data.todayTasks)
                setTomorrowTasks(response.data.tomorrowTasks)
                setThisWeekTasks(response.data.thisWeekTasks)
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <section className="w-full h-full flex gap-3">
            <div className="w-full h-full flex flex-col flex-1 gap-4">
                <header className="w-full flex items-center gap-4">
                    <h1 className="text-3xl font-bold">Upcoming</h1>
                    <div className="w-12 h-8 flex items-center justify-center text-2xl border rounded border-zinc-400">{ todayTasks.length + tomorrowTasks.length + thisWeekTasks.length }</div>
                </header>
                <div className="w-full h-1/2 flex flex-1 justify-between flex-col gap-2 overflow-auto">
                    <div className="w-full h-60 border rounded p-2 flex flex-col gap-2 border-zinc-400">
                        <h2 className="text-xl font-bold">Today</h2>
                        <div className="w-full h-full flex flex-col -mt-2 overflow-auto">
                            {
                                todayTasks.length > 0 ?
                                todayTasks.map(task => {
                                    return <TaskCard key={ task.id } task={ task } selectedTask={ selectedTask } setSelectedTask={ setSelectedTask } handleGetTasks={ handleGetUpcomingTasks } showList={ true } />
                                })
                                : <span className="text-sm mx-auto mt-10">You don't have tasks for today</span>
                            }
                        </div>
                    </div>
                    <div className={`w-full h-1/2 flex flex-1 gap-2 ${selectedTask && "flex-wrap"}`}>
                        <div className={`${selectedTask ? "w-full" : "w-1/2"} h-full border rounded p-2 flex flex-col gap-2 border-zinc-400`}>
                            <h2 className="text-xl font-bold">Tomorrow</h2>
                            <div className="w-full h-full flex flex-col -mt-2 overflow-auto">
                                {
                                    tomorrowTasks.length > 0 ?
                                    tomorrowTasks.map(task => {
                                        return <TaskCard key={ task.id } task={ task } selectedTask={ selectedTask } setSelectedTask={ setSelectedTask } handleGetTasks={ handleGetUpcomingTasks } showList={ true } />
                                    })
                                    : <span className="text-sm mx-auto mt-10">You don't have tasks for tomorrow</span>
                                }
                            </div>
                        </div>
                        <div className={`${selectedTask ? "w-full" : "w-1/2"} h-full border rounded p-2 flex flex-col gap-2 border-zinc-400`}>
                            <h2 className="text-xl font-bold">This week</h2>
                            <div className="w-full h-full flex flex-col -mt-2 overflow-auto">
                                {
                                    thisWeekTasks.length > 0 ?
                                    thisWeekTasks.map(task => {
                                        return <TaskCard key={ task.id } task={ task } selectedTask={ selectedTask } setSelectedTask={ setSelectedTask } handleGetTasks={ handleGetUpcomingTasks } showList={ true } />
                                    })
                                    : <span className="text-sm mx-auto mt-10">You don't have tasks for this week</span>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            { selectedTask && <TaskContent task={ selectedTask } setSelectedTask={ setSelectedTask } handleGetTasks={ handleGetUpcomingTasks } /> }   
        </section>
    )
}
