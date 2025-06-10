import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react'
import { DayContent } from './day-content'
import { format } from 'date-fns'
import { CaretLeft, CaretRight, Plus } from 'phosphor-react'
import { WeekContent } from './week-content'
import { MonthContent } from './month-content'
import { AddOrShowEventContent } from './add-or-show-event-content'
import { api } from '@/lib/axios'

export interface Event {
    id: string
    title: string
    createdAt: string
    date: string
    color: string
}

interface CalendarContent {
    type: string
    component: ReactNode
}

interface CalendarContextType {
    today: Date
    events: Event[]
    startOfWeek: Date
    endOfWeek: Date
    selectedEvent: Event | undefined
    setSelectedEvent: Dispatch<SetStateAction<Event | undefined>>
}

export const CalendarContext = createContext<CalendarContextType | null>(null)

export function CalendarContent() {
    const [calendarContent, setCalendarContent] = useState<CalendarContent>({} as CalendarContent)
    const [calendarTitle, setCalendarTitle] = useState<string>('')
    const [today, setToday] = useState<Date>(new Date())
    const [events, setEvents] = useState<Event[]>([])
    const [startOfWeek, setStartOfWeek] = useState<Date>(new Date())
    const [endOfWeek, setEndOfWeek] = useState<Date>(new Date())
    const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(undefined)

    useEffect(() => {
        setCalendarContent({ type: 'day', component: <DayContent /> })
        handleGetEvents()
    }, [])

    useEffect(() => {
        setToday(new Date())
    }, [calendarContent])

    useEffect(() => {
        if (selectedEvent) {
            setSelectedEvent(events.find(event => event.id == selectedEvent.id))
        }
    }, [events])

    useEffect(() => {
        const start = new Date(today)
        start.setDate(start.getDate() - today.getDay())

        const end = new Date(today)
        end.setDate(end.getDate() + (6 - today.getDay()))

        setStartOfWeek(start)
        setEndOfWeek(end)
        handleChangeCalendarTitle()
    }, [today])

    useEffect(() => {
        handleChangeCalendarTitle()
    }, [startOfWeek, endOfWeek])

    async function handleGetEvents() {
        try {
            await api.get<{ events: Event[] }>('/users/events').then(response => {
                setEvents(response.data.events)
            })
        } catch (error) {
            console.log(error)
        }
    }

    function handleChangeCalendarTitle() {
        if (calendarContent.type == 'day') {
            setCalendarTitle(format(today, 'dd MMMM yyyy'))
        } else if (calendarContent.type == 'week') {
            if (startOfWeek.getMonth() == endOfWeek.getMonth()) {
                setCalendarTitle(`${startOfWeek.getDate()}-${endOfWeek.getDate()} ${format(startOfWeek, 'MMMM yyyy')}`)
            } else if (startOfWeek.getMonth() != endOfWeek.getMonth() && startOfWeek.getFullYear() == endOfWeek.getFullYear()) {
                setCalendarTitle(`${startOfWeek.getDate()} ${format(startOfWeek, 'LLL')} - ${endOfWeek.getDate()} ${format(endOfWeek, 'LLL')} ${format(today, 'yyyy')}`)
            } else {
                setCalendarTitle(`${startOfWeek.getDate()} ${format(startOfWeek, 'LLL')} ${format(startOfWeek, 'yyyy')} - ${endOfWeek.getDate()} ${format(endOfWeek, 'LLL')} ${format(endOfWeek, 'yyyy')}`)
            }
        } else if (calendarContent.type == 'month') {
            setCalendarTitle(format(today, 'MMMM yyyy'))
        }
    }

    function handleAdvanceCalendar(shouldAdvance: boolean) {
        const day = new Date(today)
        const start = new Date(startOfWeek)
        const end = new Date(endOfWeek)

        if (calendarContent.type == 'day') {
            day.setDate(day.getDate() + (shouldAdvance ? 1 : -1))
            setToday(day)
        } else if (calendarContent.type == 'month') {
            setToday(new Date(day.getFullYear(), day.getMonth() + (shouldAdvance ? 1 : -1), 1))
        } else {
            start.setDate(start.getDate() + (shouldAdvance ? 7 : -7))
            end.setDate(end.getDate() + (shouldAdvance ? 7 : -7))

            setStartOfWeek(start)
            setEndOfWeek(end)
        }
    }

    return (
        <CalendarContext.Provider value={{ today, events, startOfWeek, endOfWeek, selectedEvent, setSelectedEvent }}>
            {
                selectedEvent ?
                <AddOrShowEventContent handleGetEvents={ handleGetEvents } />
                : (
                    <section className="w-full h-full flex flex-col gap-3">
                        <header className="w-full flex items-center justify-between">
                            <h1 className="text-3xl font-bold">{ calendarTitle }</h1>
                            <button onClick={ () => setSelectedEvent({} as Event) } className="flex items-center gap-1 border rounded p-2 text-sm cursor-pointer hover:text-black hover:bg-zinc-200 border-zinc-400">
                                <Plus />
                                <span>Add event</span>
                            </button>
                        </header>
                        <div className="w-full flex items-center justify-between text-black">
                            <div className="flex items-center gap-2 p-1 rounded text-sm bg-zinc-200">
                                <button onClick={ () => setCalendarContent({ type: 'day', component: <DayContent /> }) } className={`w-12 h-6 rounded flex items-center justify-center border cursor-pointer hover:bg-zinc-400 border-zinc-400 ${calendarContent.type == 'day' && "bg-zinc-400 border-none"}`}>Day</button>
                                <button onClick={ () => setCalendarContent({ type: 'week', component: <WeekContent /> }) } className={`w-12 h-6 rounded flex items-center justify-center border cursor-pointer hover:bg-zinc-400 border-zinc-400 ${calendarContent.type == 'week' && "bg-zinc-400 border-none"}`}>Week</button>
                                <button onClick={ () => setCalendarContent({ type: 'month', component: <MonthContent /> }) } className={`w-12 h-6 rounded flex items-center justify-center border cursor-pointer hover:bg-zinc-400 border-zinc-400 ${calendarContent.type == 'month' && "bg-zinc-400 border-none"}`}>Month</button>
                            </div>
                            <div className="flex items-center gap-2">
                                <div onClick={ () => handleAdvanceCalendar(false) } className="w-7 h-7 flex items-center justify-center cursor-pointer rounded hover:bg-zinc-400 bg-zinc-200">
                                    <CaretLeft weight="bold" size={ 18 } />
                                </div>
                                <div onClick={ () => handleAdvanceCalendar(true) } className="w-7 h-7 flex items-center justify-center cursor-pointer rounded hover:bg-zinc-400 bg-zinc-200">
                                    <CaretRight weight="bold" size={ 18 } />
                                </div>
                            </div>
                        </div>
                        { calendarContent.component }
                    </section>
                )
            }
        </CalendarContext.Provider>
    )
}
