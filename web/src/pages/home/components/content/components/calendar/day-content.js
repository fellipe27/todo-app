import { format } from 'date-fns'
import { HoursChecker } from './hours-checker'
import { useContext } from 'react'
import { CalendarContext } from './calendar-content'

export function DayContent() {
    const { today, events } = useContext(CalendarContext)

    return (
        <>
            <span className="w-[calc(100%-148px)] text-xs font-semibold ml-[148px]">{format(today, 'EEEE').toUpperCase()}</span>
            <HoursChecker today={today} isDay={true} events={events} />
        </>
    )
}
