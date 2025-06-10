import { useContext } from 'react'
import { CalendarContext } from './calendar-content'
import { format } from 'date-fns'
import { HoursChecker } from './hours-checker'

export function DayContent() {
    const context = useContext(CalendarContext)

    if (!context) {
        return
    }

    const { today, events } = context

    return (
        <>
            <span className="w-[calc(100%-148px)] text-xs font-semibold ml-[148px]">{ format(today, 'EEEE').toUpperCase() }</span>
            <HoursChecker today={ today } isDay={ true } events={ events } />
        </>
    )
}
