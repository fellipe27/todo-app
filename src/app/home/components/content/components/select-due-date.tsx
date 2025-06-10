import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { format } from 'date-fns'
import { CaretDown, Trash } from 'phosphor-react'
import { useRef } from 'react'
import { DayPicker } from 'react-day-picker'

interface SelectDueDateProps {
    dueDate: Date | undefined
    setDueDate: (date: Date | undefined) => void
}

export function SelectDueDate({ dueDate, setDueDate }: SelectDueDateProps) {
    const popoverButtonRef = useRef<HTMLButtonElement>(null)

    function selectDate(date: Date) {
        setDueDate(date)
        popoverButtonRef.current?.click()
    }   

    return (
        <Popover className="w-full relative flex items-center">
            <PopoverPanel className="w-[80%] h-72 z-50 p-2 flex items-center justify-center gap-1 absolute inset-0 left-1/2 top-0 -translate-x-1/2 shadow-lg rounded overflow-auto bg-white">
                <DayPicker required mode="single" selected={ dueDate } onSelect={ selectDate } classNames={{ day: 'p-[6px]', selected: 'rounded-full text-blue-500 bg-zinc-700', today: 'bg-blue-500 rounded-full', root: 'text-sm', chevron: 'fill-blue-500', weekday: 'font-bold text-xs', month_caption: 'text-xs font-bold my-1' }} />
            </PopoverPanel>
            <span className="w-16 font-semibold">Due date</span>
            <PopoverButton ref={ popoverButtonRef } className="w-28 h-7 border rounded flex items-center justify-between px-1 cursor-pointer focus:outline-none border-zinc-500">
                <span className="max-w-20 truncate">{ dueDate ? format(dueDate, 'MM-dd-yy') : '-- -- --' }</span>
                <CaretDown weight="bold" size={ 16 } />
            </PopoverButton>
            { dueDate && <Trash onClick={ () => setDueDate(undefined) } size={ 18 } className="ml-[10px] cursor-pointer" /> }
        </Popover>
    )
}
