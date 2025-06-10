import { useEffect, useState } from 'react'
import { Event } from './calendar-content'
import { DayPicker } from 'react-day-picker'

interface DatetimePickerProps {
    event: Event | undefined
    setDate: (date: Date) => void
}

export function DatetimePicker({ event, setDate }: DatetimePickerProps) {
    const [calendarDate, setCalendarDate] = useState<Date | undefined>(new Date())
    const [time, setTime] = useState<number>(-1)

    useEffect(() => {
        if (event) {
            const datetime = new Date(event.date)
            setCalendarDate(datetime)
            setTime(datetime.getHours())
        }
    }, [event])

    useEffect(() => {
        if (time > -1 && calendarDate) {
            const date = new Date(calendarDate)
            date.setHours(time, 0, 0, 0)

            setDate(date)
        }
    }, [calendarDate, time])

    return (
        <div className="flex items-center justify-between gap-4">
            <div className="w-72 h-72 border rounded flex items-center justify-center zinc-500">
                <DayPicker mode="single" selected={ calendarDate } onSelect={ setCalendarDate } classNames={{ day: 'p-2', selected: 'rounded-full text-blue-500 bg-zinc-700', today: 'bg-blue-500 rounded-full', root: 'text-sm', chevron: 'fill-blue-500', weekday: 'font-bold text-xs', month_caption: 'text-xs font-bold my-1' }} />
            </div>
            <div className="h-72 flex flex-col gap-1 p-1 border rounded overflow-auto border-zinc-500">
                {
                    Array.from({ length: 24 }, (_, i) => {
                        return (
                            <div key={ i } onClick={ () => setTime(i) } className={`p-3 flex items-center justify-center text-xs cursor-pointer hover:rounded hover:bg-zinc-500 hover:text-black ${time == i && "bg-zinc-500 text-black rounded"}`}>
                                <span>{ String(i > 12 ? i - 12 : i).padStart(2, '0') }:00 { i >= 12 ? 'PM' : 'AM' }</span>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
