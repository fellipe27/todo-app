import { ListsAndTasksCard } from './lists-and-tasks-card'
import { UpcomingContent } from '../../content/components/upcoming-content'
import { Calendar, CaretDoubleRight, ListChecks, Sticker } from 'phosphor-react'
import { useContext, useEffect, useState } from 'react'
import { TodoContext } from '@/app/home/page'
import { TodayContent } from '../../content/components/today-content'
import { CalendarContent } from '../../content/components/calendar-content'
import { StickysContent } from '../../content/components/stickys-content'
import { api } from '@/lib/axios'
import { Task } from '../../content/components/list-content'

export function TasksSection() {
    const [todayTasksLength, setTodayTasksLength] = useState<number>(0)
    const [upcomingTasksLength, setUpcomingTasksLength] = useState<number>(0)

    const context = useContext(TodoContext)

    if (!context) {
        return
    }

    const { content, changesOccured } = context

    useEffect(() => {
        handleGetTodayTasksLenght()
    }, [])

    useEffect(() => {
        if (changesOccured) {
            handleGetTodayTasksLenght()
        }
    }, [changesOccured])

    async function handleGetTodayTasksLenght() {
        try {
            await api.get<{ todayTasks: Task[], tomorrowTasks: Task[], thisWeekTasks: Task[] }>('/tasks').then(response => {
                setTodayTasksLength(response.data.todayTasks.length)

                const upcomingLength = response.data.todayTasks.length + response.data.tomorrowTasks.length + response.data.thisWeekTasks.length
                setUpcomingTasksLength(upcomingLength)
            })
        } catch (error) {
            console.log(error)
        }
    }
 
    return (
        <section className="w-full flex flex-col gap-1 text-sm">
            <h2 className="font-bold">Tasks</h2>
            <ListsAndTasksCard type="upcoming" component={ <UpcomingContent /> }>
                <CaretDoubleRight size={ 18 } />
                <span>Upcoming</span>
                <div className={`w-8 h-5 rounded absolute right-1 flex items-center justify-center bg-zinc-300 text-black group-hover:bg-white ${content.type == 'upcoming' && "!bg-white"}`}>{ upcomingTasksLength }</div>
            </ListsAndTasksCard>
            <ListsAndTasksCard type="today" component={ <TodayContent /> }>
                <ListChecks size={ 18 } />
                <span>Today</span>
                <div className={`w-8 h-5 rounded absolute right-1 flex items-center justify-center bg-zinc-300 text-black group-hover:bg-white ${content.type == 'today' && "!bg-white"}`}>{ todayTasksLength }</div>
            </ListsAndTasksCard>
            <ListsAndTasksCard type="calendar" component={ <CalendarContent /> }>
                <Calendar size={ 18 } />
                <span>Calendar</span>
            </ListsAndTasksCard>
            <ListsAndTasksCard type="stickys" component={ <StickysContent /> }>
                <Sticker size={ 18 } />
                <span>Stickys</span>
            </ListsAndTasksCard>
        </section>
    )
}
