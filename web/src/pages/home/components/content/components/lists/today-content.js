import { fredoka } from '@/pages/_app'
import { useContext, useEffect, useState } from 'react'
import { TodoContext } from '@/pages/home'
import { TaskCard } from '../tasks/task-card'
import { TaskContent } from '../tasks/task-content'

export function TodayContent() {
    const [selectedTask, setSelectedTask] = useState()
    const [tasks, setTasks] = useState()

    const { user, upcomingTasks, handleGetUpcomingTasks } = useContext(TodoContext)

    useEffect(() => {
        setTasks(upcomingTasks?.todayTasks)
    }, [upcomingTasks])

    useEffect(() => {
        if (selectedTask) {
            setSelectedTask(tasks?.find(task => task.id == selectedTask.id))
        }
    }, [tasks])

    return (
        <section className="w-full h-full flex flex-1 gap-3">
            <div className="w-full flex flex-col flex-1 gap-4">
                <header className="w-full flex items-center gap-4">
                    <h1 className={`${fredoka.className} text-3xl cursor-default`}>Today</h1>
                    <div className="w-12 h-8 flex items-center justify-center text-2xl border border-zinc-400 rounded">{tasks?.length}</div>
                </header>
                <div className="w-full h-full flex flex-col -mt-2 overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-700">
                    {
                        tasks?.length > 0 ?
                        tasks.map(task => {
                            return (
                                <TaskCard key={task.id} task={task} selectedTask={selectedTask} setSelectedTask={setSelectedTask} handleGetTasks={() => handleGetUpcomingTasks(user?.id)} showList={true} />
                            )
                        })
                        : <span className="text-sm mx-auto mt-10">You don't have tasks for today</span>
                    }    
                </div>
            </div>
            {selectedTask && <TaskContent task={selectedTask} setSelectedTask={setSelectedTask} handleGetTasks={() => handleGetUpcomingTasks(user?.id)} />}
        </section>
    )
}
