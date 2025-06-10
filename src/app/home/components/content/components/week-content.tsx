import { useContext } from 'react'
import { CalendarContext } from './calendar-content'
import { HoursChecker } from './hours-checker'

export function WeekContent() {
    const context = useContext(CalendarContext)
    
    if (!context) {
        return
    }

    const { today, events } = context
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

    return (
        <>
            <div className="w-[calc(100%-168px)] text-xs font-semibold ml-[148px] flex items-center justify-around -translate-x-1">
                {
                    daysOfWeek.map((day, i) => {
                        return <span key={ i } className={`${i == 6 ? "translate-x-3" : i == 5 && "translate-x-2"}`}>{ day }</span>
                    })
                }
            </div>
            <HoursChecker today={ today } isDay={ false } events={ events } />
        </>
    )
}
