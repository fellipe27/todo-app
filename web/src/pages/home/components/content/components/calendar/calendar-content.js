import { fredoka } from '@/pages/_app'
import { CaretLeft, CaretRight, Plus } from 'phosphor-react'
import { createContext, useContext, useEffect, useState } from 'react'
import { DayContent } from './day-content'
import { WeekContent } from './week-content'
import { MonthContent } from './month-content'
import { format } from 'date-fns'
import { getEvents } from '@/utils/events/get-events'
import { TodoContext } from '@/pages/home'
import { AddOrShowEventContent } from './add-or-show-event-content'

export const CalendarContext = createContext()

export function CalendarContent() {
    const [calendarContent, setCalendarContent] = useState()
    const [calendarTitle, setCalendarTitle] = useState('')
    const [today, setToday] = useState(new Date())
    const [startOfWeek, setStartOfWeek] = useState()
    const [endOfWeek, setEndOfWeek] = useState()
    const [events, setEvents] = useState()
    const [selectedEvent, setSelectedEvent] = useState()

    const { user } = useContext(TodoContext)

    useEffect(() => {
        setCalendarContent({ type: 'day', component: <DayContent /> })
    }, [])

    useEffect(() => {
        handleGetEvents(user?.id)
    }, [user])

    useEffect(() => {
        if (selectedEvent) {
            setSelectedEvent(events.find(event => event.id == selectedEvent.id))
        }
    }, [events])

    useEffect(() => {
        const startOfWeek = new Date(today)
        startOfWeek.setDate(startOfWeek.getDate() - today.getDay())

        const endOfWeek = new Date(today)
        endOfWeek.setDate(endOfWeek.getDate() + (6 - today.getDay()))
        
        setStartOfWeek(startOfWeek)
        setEndOfWeek(endOfWeek)

        handleChangeCalendarTitle()
    }, [today])

    useEffect(() => {
        setToday(new Date())
    }, [calendarContent])

    useEffect(() => {
        handleChangeCalendarTitle()
    }, [startOfWeek, endOfWeek])

    function handleAdvanceCalendar(shouldAdvance) {
        const day = new Date(today)
        const start = new Date(startOfWeek)
        const end = new Date(endOfWeek)

        if (calendarContent?.type == 'day') {
            day.setDate(day.getDate() + (shouldAdvance ? 1 : -1))
            setToday(day)
        } else if (calendarContent?.type == 'month') {
            setToday(new Date(day.getFullYear(), day.getMonth() + (shouldAdvance ? 1 : -1), 1))
        } else {
            start.setDate(start.getDate() + (shouldAdvance ? 7 : -7))
            end.setDate(end.getDate() + (shouldAdvance ? 7 : -7))

            setStartOfWeek(start)
            setEndOfWeek(end)
        }
    }

    function handleChangeCalendarTitle() {
        if (calendarContent?.type == 'day') {
            setCalendarTitle(format(today, 'dd MMMM yyyy'))
        } else if (calendarContent?.type == 'week') {
            if (startOfWeek.getMonth() == endOfWeek.getMonth()) {
                setCalendarTitle(`${startOfWeek?.getDate()}-${endOfWeek?.getDate()} ${format(startOfWeek, 'MMMM yyyy')}`)
            } else if (startOfWeek.getMonth() != endOfWeek.getMonth() && startOfWeek.getFullYear() == endOfWeek.getFullYear()) {
                setCalendarTitle(`${startOfWeek.getDate()} ${format(startOfWeek, 'LLL')} - ${endOfWeek.getDate()} ${format(endOfWeek, 'LLL')} ${format(today, 'yyyy')}`)
            } else {
                setCalendarTitle(`${startOfWeek.getDate()} ${format(startOfWeek, 'LLL')} ${format(startOfWeek, 'yyyy')} - ${endOfWeek.getDate()} ${format(endOfWeek, 'LLL')} ${format(endOfWeek, 'yyyy')}`)
            }
        } else if (calendarContent?.type == 'month') {
            setCalendarTitle(format(today, 'MMMM yyyy'))
        }
    }

    async function handleGetEvents(userId) {
        await getEvents(userId).then(response => {
            setEvents(response.events)
        })
    }

    return (
        <CalendarContext.Provider value={{ today, events, startOfWeek, endOfWeek, selectedEvent, setSelectedEvent }}>
            {
                selectedEvent ?
                <AddOrShowEventContent handleGetEvents={handleGetEvents} />
                : (
                    <section className="w-full h-full flex flex-col gap-3">
                        <header className="w-full flex items-center justify-between">
                            <h1 className={`${fredoka.className} text-3xl cursor-default`}>{calendarTitle}</h1>
                            <button onClick={() => setSelectedEvent('addEvent')} className="flex items-center gap-1 border border-zinc-400 rounded p-2 text-sm hover:text-black hover:bg-zinc-200">
                                <Plus />
                                <span>Add event</span>
                            </button>
                        </header>
                        <div className="w-full flex items-center justify-between text-black">
                            <div className="flex items-center gap-2 bg-zinc-200 p-1 rounded text-sm">
                                <button onClick={() => setCalendarContent({ type: 'day', component: <DayContent /> })} className={`w-12 h-6 rounded hover:bg-zinc-400 flex items-center justify-center border border-zinc-400 cursor-pointer ${calendarContent?.type == 'day' && `${fredoka.className} bg-zinc-400 border-none`}`}>Day</button>
                                <button onClick={() => setCalendarContent({ type: 'week', component: <WeekContent /> })} className={`w-14 h-6 rounded hover:bg-zinc-400 flex items-center justify-center border border-zinc-400 cursor-pointer ${calendarContent?.type == 'week' && `${fredoka.className} bg-zinc-400 border-none`}`}>Week</button>
                                <button onClick={() => setCalendarContent({ type: 'month', component: <MonthContent /> })} className={`w-14 h-6 rounded hover:bg-zinc-400 flex items-center justify-center border border-zinc-400 cursor-pointer ${calendarContent?.type == 'month' && `${fredoka.className} bg-zinc-400 border-none`}`}>Month</button>
                            </div>
                            <div className="flex items-center gap-2">
                                <div onClick={() => handleAdvanceCalendar(false)} className="w-7 h-7 flex items-center justify-center hover:bg-zinc-400 cursor-pointer rounded bg-zinc-200 text-black">
                                    <CaretLeft size={18} weight="bold" />
                                </div>
                                <div onClick={() => handleAdvanceCalendar(true)} className="w-7 h-7 flex items-center justify-center hover:bg-zinc-400 cursor-pointer rounded bg-zinc-200 text-black">
                                    <CaretRight size={18} weight="bold" />
                                </div>
                            </div>
                        </div>
                        {calendarContent && calendarContent.component}
                    </section>
                )
            }     
        </CalendarContext.Provider>
    )
}
