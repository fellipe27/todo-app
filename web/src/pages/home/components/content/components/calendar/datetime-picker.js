import 'react-day-picker/style.css'
import { DayPicker } from 'react-day-picker'
import { fredoka } from '@/pages/_app'
import { useEffect, useState } from 'react'

export function DateTimePicker({ event, setDate }) {
    const [calendarDate, setCalendarDate] = useState()
    const [time, setTime] = useState()

    useEffect(() => {
        if (event) {
            const dateTime = new Date(event.date)

            setCalendarDate(dateTime)
            setTime(dateTime.getHours())
        }
    }, [event])

    useEffect(() => {
        if (time != undefined && time != null && calendarDate) {
            const date = new Date(calendarDate)
            date.setHours(time, 0, 0, 0)

            setDate(date)
        }
    }, [calendarDate, time])

    return (
        <div className="flex items-center justify-between gap-4">
            <div className="w-72 h-72 border border-zinc-500 rounded flex items-center justify-center">
                <DayPicker mode="single" selected={calendarDate} onSelect={setCalendarDate} classNames={{ day: 'p-2', selected: `${fredoka.className} text-blue-500 bg-zinc-700 rounded-md`, today: 'text-blue-500', root: 'text-sm', chevron: 'fill-blue-500 my-2', month_caption: `${fredoka.className} text-lg my-2`, weekday: 'font-semibold' }} />
            </div>
            <div className="h-72 flex flex-col gap-1 p-1 border border-zinc-500 rounded overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-700">
                {
                    Array.from({ length: 24 }, (_, i) => {
                        return (
                            <div onClick={() => setTime(Number(i))} key={i} className={`p-3 hover:rounded flex items-center justify-center text-xs cursor-pointer hover:bg-zinc-200 hover:text-black ${time != undefined && time == i && `bg-zinc-200 text-black rounded ${fredoka.className}`}`}>
                                <span>{String(i > 12 ? i - 12 : i).padStart(2, '0')}:00 {i >= 12 ? 'PM' : 'AM'}</span>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
