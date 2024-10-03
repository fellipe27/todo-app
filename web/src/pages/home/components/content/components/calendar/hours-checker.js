import { fredoka } from '@/pages/_app'
import {useContext, useEffect, useState } from 'react'
import { CalendarContext } from './calendar-content'

export function HoursChecker({ today, isDay, events }) {
    const [currentHour, setCurrentHour] = useState(new Date().getHours())
    const [currentMinute, setCurrentMinute] = useState(new Date().getMinutes())

    const squareHeight = 112
    const hourBarPosition = (squareHeight / 60).toFixed(1) * currentMinute
    const { startOfWeek, endOfWeek, setSelectedEvent } = useContext(CalendarContext)

    startOfWeek.setHours(0, 0, 0, 0)
    endOfWeek.setHours(0, 0, 0, 0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentHour(new Date().getHours())
            setCurrentMinute(new Date().getMinutes())
        }, 10000)

        return () => clearInterval(interval)
    }, [])

    return (
        <section className="w-full h-full flex flex-col gap-2 text-xs overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-700">
            {
                Array.from({ length: 24 }, (_, i) => {
                    return (
                        <div key={i} className="w-full flex gap-10 relative">
                            {
                                i == currentHour && (
                                    <div style={{ top: `${hourBarPosition}px` }} className={`w-full translate-x-32 -translate-y-1 absolute flex items-center`}>
                                        <div className="w-2 h-2 rounded-full bg-red-500" />
                                        <div className="w-[calc(100%-136px)] h-[1px] bg-red-500" />
                                    </div>
                                )
                            }
                            <div style={{ height: `${squareHeight}px` }} className="w-32 flex flex-col items-end justify-center">
                                <p>{String(i > 12 ? i - 12 : i).padStart(2, '0')}:00</p>
                                <p>{i >= 12 ? 'PM' : 'AM'}</p>
                            </div>
                            {
                                isDay ?
                                <div style={{ height: `${squareHeight}px` }} className="w-full text-black border border-zinc-400 rounded p-1 flex flex-col gap-1 overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-700">
                                    {
                                        events?.map(event => {
                                            const eventDate = new Date(event.date)

                                            return (
                                                eventDate.toDateString() == today.toDateString() && eventDate.getHours() == i && (
                                                    <div key={event.id} onClick={() => setSelectedEvent(event)} title={event.title} style={{ backgroundColor: `${event.color}CC` }} className="w-full h-full rounded p-2 cursor-pointer">
                                                        <p className={`max-w-[90%] truncate ${fredoka.className} text-sm`}>{event.title}</p>
                                                    </div>
                                                )
                                            )
                                        })
                                    }
                                </div>
                                : (
                                    <div className="w-full flex items-center gap-2">
                                        {
                                            Array.from({ length: 7 }, (_, j) => {
                                                return (
                                                    <div key={j} style={{ height: `${squareHeight}px` }} className="w-full text-black flex flex-col gap-1 rounded p-1 border border-zinc-400 overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-700">
                                                        {
                                                            events?.map(event => {
                                                                const eventDay = new Date(event.date)
                                                                eventDay.setHours(0, 0, 0, 0)

                                                                return (
                                                                    eventDay.getTime() >= startOfWeek.getTime() && eventDay.getTime() <= endOfWeek.getTime() && eventDay.getHours() == i && eventDay.getDay() == j && (
                                                                        <div onClick={() => setSelectedEvent(event)} title={event.title} key={event.id} style={{ backgroundColor: `${event.color}CC` }} className="w-full h-full rounded p-1 cursor-pointer">
                                                                            <p className={`max-w-[90%] truncate ${fredoka.className}`}>{event.title}</p>
                                                                        </div>
                                                                    )
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                )
                            }
                        </div>
                    )
                })
            }
        </section>
    )
}
