import { fredoka } from '@/pages/_app'
import { TodoContext } from '@/pages/home'
import { useContext, useEffect, useState } from 'react'
import { TaskContent } from '../tasks/task-content'
import { TaskCard } from '../tasks/task-card'

export function UpcomingContent() {
    const [selectedTask, setSelectedTask] = useState()
    const [todayTasks, setTodayTasks] = useState()
    const [tomorrowTasks, setTomorrowTasks] = useState()
    const [thisWeekTasks, setThisWeekTasks] = useState()

    const { user, upcomingTasks, handleGetUpcomingTasks } = useContext(TodoContext)

    useEffect(() => {
        setTodayTasks(upcomingTasks?.todayTasks)
        setTomorrowTasks(upcomingTasks?.tomorrowTasks)
        setThisWeekTasks(upcomingTasks?.thisWeekTasks)

        if (selectedTask) {
            if (upcomingTasks?.todayTasks.find(task => task.id == selectedTask.id)) {
                setSelectedTask(upcomingTasks?.todayTasks.find(task => task.id == selectedTask.id))
            } else if (upcomingTasks?.tomorrowTasks.find(task => task.id == selectedTask.id)) {
                setSelectedTask(upcomingTasks?.tomorrowTasks.find(task => task.id == selectedTask.id))
            } else if (upcomingTasks?.thisWeekTasks.find(task => task.id == selectedTask.id)) {
                setSelectedTask(upcomingTasks?.thisWeekTasks.find(task => task.id == selectedTask.id))
            }
        }
    }, [upcomingTasks])

    useEffect(() => {
        if (selectedTask) {
            if (!todayTasks?.some(task => task.id == selectedTask.id) && !tomorrowTasks?.some(task => task.id == selectedTask.id) && !thisWeekTasks?.some(task => task.id == selectedTask.id)) {
                setSelectedTask(null)      
            } 
        }
    }, [todayTasks, tomorrowTasks, thisWeekTasks])

    return (
        <section className="w-full h-full flex gap-3">
            <div className="w-full h-full flex flex-col flex-1 gap-4">
                <header className="w-full flex items-center gap-4">
                    <h1 className={`${fredoka.className} text-3xl cursor-default`}>Upcoming</h1>
                    <div className="w-12 h-8 flex items-center justify-center text-2xl border border-zinc-400 rounded">{Object.values(upcomingTasks).reduce((acc, tasks) => acc + tasks.length, 0)}</div>
                </header>
                <div className="w-full h-1/2 flex flex-1 justify-between flex-col gap-2 overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-700">
                    <div className="w-full h-60 border border-zinc-400 rounded p-2 flex flex-col gap-2">
                        <h2 className={`${fredoka.className} text-xl cursor-default`}>Today</h2>
                        <div className="w-full h-full flex flex-col -mt-2 overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-700">
                            {
                                todayTasks?.length > 0 ?
                                todayTasks.map(task => {
                                    return (
                                        <TaskCard key={task.id} task={task} selectedTask={selectedTask} setSelectedTask={setSelectedTask} handleGetTasks={() => handleGetUpcomingTasks(user?.id)} showList={true} />
                                    )
                                })
                                : <span className="text-sm mx-auto mt-10">You don't have tasks for today</span>
                            }    
                        </div>
                    </div>
                    <div className={`w-full h-1/2 flex flex-1 gap-2 ${selectedTask && "flex-wrap"}`}>
                        <div className={`${selectedTask ? "w-full" : "w-1/2"} h-full border border-zinc-400 rounded p-2 flex flex-col gap-2`}>
                            <h2 className={`${fredoka.className} text-xl cursor-default`}>Tomorrow</h2>
                            <div className="w-full h-full flex flex-col -mt-2 overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-700">
                                {
                                    tomorrowTasks?.length > 0 ?
                                    tomorrowTasks.map(task => {
                                        return (
                                            <TaskCard key={task.id} task={task} selectedTask={selectedTask} setSelectedTask={setSelectedTask} handleGetTasks={() => handleGetUpcomingTasks(user?.id)} showList={true} />
                                        )
                                    })
                                    : <span className="text-sm mx-auto mt-10">You don't have tasks for tomorrow</span>
                                }
                            </div>
                        </div>
                        <div className={`${selectedTask ? "w-full" : "w-1/2"} h-full border border-zinc-400 rounded p-2 flex flex-col gap-2`}>
                            <h2 className={`${fredoka.className} text-xl cursor-default`}>This week</h2>
                            <div className="w-full h-full flex flex-col -mt-2 overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-700">
                                {
                                    thisWeekTasks?.length > 0 ?
                                    thisWeekTasks.map(task => {
                                        return (
                                            <TaskCard key={task.id} task={task} selectedTask={selectedTask} setSelectedTask={setSelectedTask} handleGetTasks={() => handleGetUpcomingTasks(user?.id)} showList={true} />
                                        )
                                    })
                                    : <span className="text-sm mx-auto mt-10">You don't have tasks for this week</span>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {selectedTask && <TaskContent task={selectedTask} setSelectedTask={setSelectedTask} handleGetTasks={() => handleGetUpcomingTasks(user?.id)} />}
        </section>
    )
}
