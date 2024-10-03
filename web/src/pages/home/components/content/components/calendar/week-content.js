import { useContext } from 'react'
import { HoursChecker } from './hours-checker'
import { CalendarContext } from './calendar-content'

export function WeekContent() {
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
    const { events } = useContext(CalendarContext)

    return (
        <>
            <div className="w-[calc(100%-168px)] text-xs font-semibold ml-[148px] flex items-center justify-around -translate-x-1">
                {
                    daysOfWeek.map((day, i) => {
                        return (
                            <span key={i} className={`${i == 6 ? "translate-x-3" : i == 5 && "translate-x-2"}`}>{day}</span>
                        )
                    })
                }
            </div>
            <HoursChecker isDay={false} events={events} />
        </>
    )
}
