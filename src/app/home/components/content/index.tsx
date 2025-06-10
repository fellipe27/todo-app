import { useContext } from 'react'
import { TodoContext } from '../../page'
import { Calendar, ListChecks, Sticker } from 'phosphor-react'

export function Content() {
    const context = useContext(TodoContext)

    if (!context) {
        return
    }

    const { user, content } = context

    return (
        <section className="w-full h-full flex flex-1 p-2 overflow-hidden">
            { 
                content.type ?
                content.component
                : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-10">
                        <h1 className="text-2xl">Welcome to your Todo App, { user.name }!</h1>
                        <img src="https://www.pngall.com/wp-content/uploads/8/Task-PNG-Photo.png" alt="Workspace image" className="w-60" />
                        <div className="flex flex-col gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <ListChecks size={ 20 } className="text-green-500" />
                                <span>Create a task to organize your day</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Sticker size={ 20 } weight="fill" className="text-yellow-500" />
                                <span>Make a quick note about your work</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={ 20 } weight="fill" className="text-blue-500" />
                                <span>Remember a party with the calendar</span>
                            </div>
                        </div>
                    </div>
                )
            }
        </section>
    )
}
