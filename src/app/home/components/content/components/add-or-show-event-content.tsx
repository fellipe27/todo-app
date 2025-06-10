import { Alarm, Calendar, Trash } from 'phosphor-react'
import { useContext, useEffect, useRef, useState } from 'react'
import { CalendarContext } from './calendar-content'
import { format, formatDistance } from 'date-fns'
import { DatetimePicker } from './datetime-picker'
import { api } from '@/lib/axios'

interface AddOrShowEventContentProps {
    handleGetEvents: () => void
}

export function AddOrShowEventContent({ handleGetEvents }: AddOrShowEventContentProps) {
    const [title, setTitle] = useState<string>('')
    const [date, setDate] = useState<Date | null>(null)
    const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState<boolean>(true)
    const [isUpdatingEventTitle, setIsUpdatingEventTitle] = useState<boolean>(false)

    const context = useContext(CalendarContext)

    if (!context) {
        return
    }

    const { selectedEvent, setSelectedEvent } = context
    const inputEventTitleRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (selectedEvent?.id) {
            setTitle(selectedEvent.title)
            setDate(new Date(selectedEvent.date))
        }
    }, [selectedEvent])

    useEffect(() => {
        if (selectedEvent) {
            const newDate = new Date(date as Date).getTime()
            const selectedEventDate = new Date(selectedEvent.date).getTime()

            if (selectedEvent.id && title.length > 0 && (title != selectedEvent.title || newDate != selectedEventDate)) {
                setIsSaveButtonDisabled(false)
            } else if (!selectedEvent.id && title.length > 0 && date instanceof Date && !isNaN(date.getTime())) {
                setIsSaveButtonDisabled(false)
            } else {
                setIsSaveButtonDisabled(true)
            } 
        }
    }, [title, date])

    useEffect(() => {
        if (isUpdatingEventTitle && inputEventTitleRef.current) {
            inputEventTitleRef.current.focus()
        }
    }, [isUpdatingEventTitle])

    async function handleSave() {
        if (!selectedEvent?.id) {
            try {
                await api.post('/users/events', {
                    title,
                    date
                }).then(() => {
                    handleGetEvents()
                    setSelectedEvent(undefined)
                })
            } catch (error) {
                console.log(error)
            }
        } else {
            if (title.length > 0) {
                try {
                    await api.put(`/users/events/${selectedEvent?.id}`, {
                        title,
                        date
                    }).then(() => {
                        handleGetEvents()
                        setIsSaveButtonDisabled(true)
                    })
                } catch (error) {
                    console.log(error)
                }
            } else {
                setTitle(selectedEvent.title)
            }
        }
    }

    async function handleDeleteEvent() {
        try {
            await api.delete(`/users/events/${selectedEvent?.id}`).then(() => {
                handleGetEvents()
                setSelectedEvent(undefined)
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <section className="w-full h-full flex flex-col gap-3">
            <header className="w-full flex items-center text-3xl font-bold">
                {
                    selectedEvent?.id ?
                    <div className="w-full flex items-center gap-3">
                        <Calendar style={{ color: selectedEvent.color }} weight="fill" size={ 40 } />
                        {
                            isUpdatingEventTitle ?
                            <input spellCheck={ false } onBlur={ () => setIsUpdatingEventTitle(false) } ref={ inputEventTitleRef } onChange={ e => setTitle(e.target.value) } value={ title } placeholder={ selectedEvent.title } type="text" className="w-[80%] focus:outline-none bg-transparent" />
                            : <h1 onClick={ () => setIsUpdatingEventTitle(true) } className="max-w-[75%] truncate">{ title }</h1>
                        }
                        <Trash onClick={ handleDeleteEvent } size={ 35 } className="cursor-pointer absolute right-2 hover:text-red-500" />
                    </div>
                    : <h1>Create event</h1>
                }
            </header>
            <div className="w-full h-full relative flex flex-col items-center text-sm gap-4">
                {
                    !selectedEvent?.id && (
                        <div className="w-2/3 flex flex-col gap-1">   
                            <label htmlFor="title" className="font-semibold">Title</label>
                            <input spellCheck={ false } onChange={ e => setTitle(e.target.value) } value={ title } placeholder="Event title" id="title" className="w-full border focus:outline-none rounded p-2 border-zinc-500 bg-transparent" />
                        </div>
                    )
                }
                <div className="flex items-center gap-3">
                    <Alarm style={{ color: selectedEvent?.color }} weight="fill" size={ 25 } />
                    <span>Date and time</span>
                </div>
                <DatetimePicker event={ selectedEvent } setDate={ setDate } />
                { selectedEvent?.id && <span className="text-xs">Created at { format(selectedEvent.createdAt, 'MM-dd-yyyy') }</span> }
                { selectedEvent?.id && <span>Event set for <span>{ date && format(date, 'MM-dd-yyyy') }</span> at <span>{ date && format(date, 'hh:00 aaa') }</span></span> }
                { selectedEvent?.id && <span style={{ color: selectedEvent.color }} className="text-base font-semibold">{ formatDistance(selectedEvent.date, new Date(), { addSuffix: true }) }</span> }
                <div className="w-1/3 absolute bottom-4 flex items-center gap-3">
                    <button onClick={ () => setSelectedEvent(undefined) } className="w-full border rounded-md p-1 border-zinc-500 bg-transparent cursor-pointer">Close</button>
                    <button onClick={ handleSave } disabled={ isSaveButtonDisabled } className="w-full rounded-md p-1 cursor-pointer disabled:bg-blue-500/50 disabled:text-black/50 bg-blue-500 text-black">Save</button>
                </div>
            </div>
        </section>
    )
}
