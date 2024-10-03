import { useContext } from 'react'
import { TodoContext } from '../..'
import { Calendar, ListChecks, Sticker } from 'phosphor-react'
import { StickysContent } from './components/stickys/stickys-content'
import { CalendarContent } from './components/calendar/calendar-content'

export function Content() {
    const { user, content, setContent, setIsSidebarOpen } = useContext(TodoContext)

    return (
        <section className="w-full h-full flex-1 p-2 overflow-hidden">
            {
                content?.type ?
                content.component
                : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-10">
                        <h1 className="text-xl">Welcome to your Todo App, {user?.name}!</h1>
                        <img src="https://www.pngall.com/wp-content/uploads/8/Task-PNG-Photo.png" alt="Workspace image" className="w-60" />
                        <div className="flex flex-col gap-4 text-sm cursor-default">
                            <div className="flex items-center gap-2">
                                <ListChecks onClick={() => setIsSidebarOpen(true)} size={20} className="text-green-500" />
                                <span>Create a task to organize your day</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Sticker onClick={() => setContent({ type: 'stickys', component: <StickysContent />})} size={20} weight="fill" className="text-yellow-500" />
                                <span>Make a quick note about your work</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar onClick={() => setContent({ type: 'calendar', component: <CalendarContent />})} size={20} weight="fill" className="text-blue-500" /> 
                                <span>Remember a party with the calendar</span>
                            </div>
                        </div>
                    </div>
                )
            }
        </section>
    )
}
