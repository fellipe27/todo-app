import 'react-day-picker/style.css'
import { CaretDown, Trash } from 'phosphor-react'
import { useEffect, useRef, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import { fredoka } from '@/pages/_app'
import { format } from 'date-fns'

export function SelectDueDate({ dueDate, setDueDate }) {
    const [isSelectingDueDate, setIsSelectingDueDate] = useState()

    const selectDueDateRef = useRef()

    useEffect(() => {
        function handleClickOutside(e) {
            if (!selectDueDateRef.current?.contains(e.target)) {
                setIsSelectingDueDate(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)

        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        setIsSelectingDueDate(false)
    }, [dueDate])

    return (
        <div className="w-full relative flex items-center">
            <span className={`w-16 ${fredoka.className}`}>Due date</span>
            <div onClick={() => setIsSelectingDueDate(true)} className="w-28 h-7 mr-[10px] cursor-pointer border border-zinc-500 rounded flex items-center justify-between px-1">
                <span>{dueDate ? format(dueDate, 'MM-dd-yy') : '-- -- --'}</span>
                <CaretDown weight="bold" size={16} />
            </div>
            {dueDate && <Trash onClick={() => setDueDate(null)} size={18} className="cursor-pointer" />}
            {
                isSelectingDueDate && (
                    <div ref={selectDueDateRef} className="w-[80%] h-72 z-50 p-2 flex flex-col items-center justify-center gap-1 absolute inset-0 left-1/2 top-0 -translate-x-1/2 rounded shadow-lg bg-white">
                        <DayPicker mode="single" selected={dueDate} onSelect={setDueDate} classNames={{ day: 'p-2', selected: `${fredoka.className} text-blue-500 bg-zinc-700 rounded-md`, today: 'text-blue-500', root: 'text-sm', chevron: 'fill-blue-500 my-2', month_caption: `${fredoka.className} text-lg my-2`, weekday: 'font-semibold' }} />
                    </div>
                )
            }
        </div>
    )
}
