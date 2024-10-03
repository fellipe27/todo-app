import { useContext } from 'react'
import { CalendarContext } from './calendar-content'
import { fredoka } from '@/pages/_app'

export function MonthContent() {
    const { today, events, setSelectedEvent } = useContext(CalendarContext)
    const currentMonthDays = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
    const firstDayOfWeek = new Date(today.getFullYear(), today.getMonth(), 1).getDay()
    const monthHaveSixWeeks = (currentMonthDays == 31 && (firstDayOfWeek == 5 || firstDayOfWeek == 6)) || (currentMonthDays == 30 && (firstDayOfWeek == 6))

    return (
        <section className="w-full h-full flex flex-col">
            <div className="w-full flex items-center justify-around text-xs font-semibold -translate-x-2">
                {
                    daysOfWeek.map((day, i) => {
                        return (
                            <span key={i} className={`${i == 6 && "translate-x-1"}`}>{day}</span>
                        )
                    })
                }
            </div>
            <div className="w-full h-full flex flex-wrap items-center justify-around">
                {
                    Array.from({ length: !monthHaveSixWeeks ? 35 : 42 }, (_, i) => {
                        return (
                            <div key={i} className={`w-[calc(100%/7.5)] ${!monthHaveSixWeeks ? "h-[calc(100%/5.5)]" : "h-[calc(100%/6.5)]"} flex flex-col gap-1 border border-zinc-400 rounded p-1 text-xs font-semibold`}>
                                <header className={`${fredoka.className}`}>
                                    {i - firstDayOfWeek + 1 <= currentMonthDays && i >= firstDayOfWeek && i - firstDayOfWeek + 1}
                                </header>
                                <main className="w-full h-full text-black flex flex-col gap-1 overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-700">
                                    {
                                        events?.map(event => {
                                            const eventDate = new Date(event.date)

                                            return (
                                                eventDate.getMonth() == today.getMonth() && i - firstDayOfWeek + 1 <= currentMonthDays && i >= firstDayOfWeek && i - firstDayOfWeek + 1 == eventDate.getDate() && (
                                                    <div onClick={() => setSelectedEvent(event)} title={event.title} style={{ backgroundColor: `${event.color}CC` }} className="w-full h-full rounded p-1 cursor-pointer">
                                                        <p className={`max-w-[90%] truncate ${fredoka.className}`}>{event.title}</p>
                                                    </div>
                                                )
                                            )
                                        })
                                    }
                                </main>
                            </div>
                        )
                    })
                }
            </div>
        </section>
    )
}
