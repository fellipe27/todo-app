import { useContext, useEffect, useRef, useState } from 'react'
import { CalendarContext } from './calendar-content'
import { fredoka } from '@/pages/_app'
import { DateTimePicker } from './datetime-picker'
import { Alarm, Calendar, Trash } from 'phosphor-react'
import { createEvent } from '@/utils/events/create-event'
import { TodoContext } from '@/pages/home'
import { deleteEvent } from '@/utils/events/delete-event'
import { format, formatDistance, isDate } from 'date-fns'
import { updateEvent } from '@/utils/events/update-event'

export function AddOrShowEventContent({ handleGetEvents }) {
    const [title, setTitle] = useState()
    const [date, setDate] = useState(undefined)
    const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState()
    const [isUpdatingEventTitle, setIsUpdatingEventTitle] = useState()

    const { selectedEvent, setSelectedEvent } = useContext(CalendarContext)
    const { user } = useContext(TodoContext)
    const inputEventTitleRef = useRef()

    useEffect(() => {
        if (selectedEvent && typeof selectedEvent == 'object') {
            setTitle(selectedEvent.title)
            setDate(selectedEvent.date)            
        }
    }, [selectedEvent])

    useEffect(() => {
        const newDate = new Date(date).getTime()
        const selectedEventDate = new Date(selectedEvent.date).getTime()

        if (selectedEvent && typeof selectedEvent == 'object' && title?.length > 0 && (title != selectedEvent.title || newDate != selectedEventDate)) {
            setIsSaveButtonDisabled(false)
        } else if (selectedEvent && typeof selectedEvent == 'string' && title?.length > 0 && date instanceof Date && !isNaN(date.getTime())) {
            setIsSaveButtonDisabled(false)
        } else {
            setIsSaveButtonDisabled(true)
        }
    }, [title, date])

    useEffect(() => {
        if (isUpdatingEventTitle) {
            inputEventTitleRef.current.focus()
        }
    }, [isUpdatingEventTitle])

    async function handleSaveChanges() {
        if (typeof selectedEvent == 'string') {
            await createEvent(user?.id, title, date).then(() => {
                handleGetEvents(user?.id)
                setSelectedEvent(null)
            })
        } else if (typeof selectedEvent == 'object') {
            if (title.length > 0) {
                await updateEvent(selectedEvent.id, title, date).then(() => {
                    handleGetEvents(user?.id)
                    setIsSaveButtonDisabled(true)
                })
            } else {
                setTitle(selectedEvent.title)
            }
        }
    }

    async function handleDeleteEvent() {
        await deleteEvent(selectedEvent.id).then(() => {
            handleGetEvents(user?.id)
            setSelectedEvent(null)
        })
    }

    return (
        <section className="w-full h-full flex flex-col gap-3">
            <header className={`w-full flex items-center text-3xl ${fredoka.className}`}>
                {
                    selectedEvent && typeof selectedEvent == 'object' ?
                    <div className="w-full flex items-center gap-3">
                        <Calendar style={{ color: selectedEvent.color }} weight="fill" size={40} />
                        {
                            isUpdatingEventTitle ?
                            <input spellCheck={false} onBlur={() => setIsUpdatingEventTitle(false)} ref={inputEventTitleRef} onChange={e => setTitle(e.target.value)} value={title} placeholder={selectedEvent.title} type="text" className={`w-[80%] bg-transparent text-3xl focus:outline-none ${fredoka.className}`} />
                            : <h1 onClick={() => setIsUpdatingEventTitle(true)} className={`max-w-[75%] truncate ${fredoka.className} text-3xl cursor-default`}>{title}</h1>
                        }
                        <Trash onClick={handleDeleteEvent} size={35} className="cursor-pointer hover:text-red-500 absolute right-2" />
                    </div>
                    : <h1>Create event</h1>
                }
            </header>
            <main className="w-full h-full relative flex flex-col items-center text-sm gap-4">
                {
                    selectedEvent && typeof selectedEvent == 'string' && (
                        <div className="w-2/3 flex flex-col gap-1">
                            <label htmlFor="title" className="font-semibold">Title</label>
                            <input spellCheck={false} onChange={e => setTitle(e.target.value)} value={title} placeholder="Event title" id="title" className="w-full bg-transparent focus:outline-none border border-zinc-500 rounded p-2" />
                        </div>
                    )
                }
                <div className="flex items-center gap-3">
                    <Alarm style={{ color: selectedEvent && typeof selectedEvent == 'object' && selectedEvent.color }} weight="fill" size={25} />
                    <span>Date and time</span>
                </div>
                <DateTimePicker event={selectedEvent} setDate={setDate} />
                {selectedEvent && typeof selectedEvent == 'object' && <span className="text-xs">Created at {format(selectedEvent.createdAt, 'MM-dd-yyyy')}</span>}
                {selectedEvent && typeof selectedEvent == 'object' && date && <span>Event set for <span className={`${fredoka.className}`}>{format(date, 'MM-dd-yyyy')}</span> at <span className={`${fredoka.className}`}>{format(date, 'hh:00 aaa')}</span></span>}
                {selectedEvent && typeof selectedEvent == 'object' && <span style={{ color: selectedEvent.color }} className={`${fredoka.className} text-base`}>{formatDistance(selectedEvent.date, new Date(), { addSuffix: true })}</span>}
                <div className="w-1/3 absolute bottom-4 flex items-center gap-3">
                    <button onClick={() => setSelectedEvent(null)} className="w-full bg-transparent border border-zinc-500 rounded-md p-1">Close</button>
                    <button onClick={handleSaveChanges} disabled={isSaveButtonDisabled} className="w-full text-black bg-blue-500 rounded-md p-1 disabled:cursor-default disabled:bg-blue-500/50 disabled:text-black/50">Save changes</button>
                </div>
            </main>
        </section>
    )
}
