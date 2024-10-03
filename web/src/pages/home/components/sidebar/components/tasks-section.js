import { fredoka } from '@/pages/_app'
import { ListsAndTasksCard } from './lists-and-tasks-card'
import { Calendar, CaretDoubleRight, ListChecks, Sticker } from 'phosphor-react'
import { useContext, useEffect, useState } from 'react'
import { TodoContext } from '@/pages/home'
import { CalendarContent } from '../../content/components/calendar/calendar-content'
import { StickysContent } from '../../content/components/stickys/stickys-content'
import { UpcomingContent } from '../../content/components/lists/upcoming-content'
import { TodayContent } from '../../content/components/lists/today-content'

export function TasksSection() {
    const [todayTasks, setTodayTasks] = useState()
    const [tomorrowTasks, setTomorrowTasks] = useState()
    const [thisWeekTasks, setThisWeekTasks] = useState()

    const { user, content, upcomingTasks, handleGetUpcomingTasks } = useContext(TodoContext)

    useEffect(() => {
        handleGetUpcomingTasks(user?.id)
    }, [user])

    useEffect(() => {
        setTodayTasks(upcomingTasks?.todayTasks)
        setTomorrowTasks(upcomingTasks?.tomorrowTasks)
        setThisWeekTasks(upcomingTasks?.thisWeekTasks)
    }, [upcomingTasks])

    return (
        <section className="w-full flex flex-col gap-1">
            <h2 className={`${fredoka.className}`}>Tasks</h2>
            <ListsAndTasksCard type="upcoming" component={<UpcomingContent />}>
                <CaretDoubleRight size={18} />
                <span>Upcoming</span>
                <div className={`w-8 h-5 rounded absolute right-1 bg-zinc-300 flex items-center justify-center text-black group-hover:bg-white ${content?.type == 'upcoming' && "!bg-white"}`}>{todayTasks?.length + tomorrowTasks?.length + thisWeekTasks?.length | 0}</div>
            </ListsAndTasksCard>
            <ListsAndTasksCard type="today" component={<TodayContent />}>
                <ListChecks size={18} />
                <span>Today</span>
                <div className={`w-8 h-5 rounded absolute right-1 bg-zinc-300 flex items-center justify-center text-black group-hover:bg-white ${content?.type == 'today' && "!bg-white"}`}>{todayTasks?.length | 0}</div>
            </ListsAndTasksCard>
            <ListsAndTasksCard type="calendar" component={<CalendarContent />}>
                <Calendar size={18} />
                <span>Calendar</span>
            </ListsAndTasksCard>
            <ListsAndTasksCard type="stickys" component={<StickysContent />}>
                <Sticker size={18} />
                <span>Sticky wall</span>
            </ListsAndTasksCard>
        </section>
    )
}
