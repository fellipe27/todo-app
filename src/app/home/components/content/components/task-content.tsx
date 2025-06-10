import { useContext, useEffect, useState } from 'react'
import { Task } from './list-content'
import { SelectDueDate } from './select-due-date'
import { SelectList } from './select-list'
import { SelectTag } from './select-tag'
import { Tag } from '../../sidebar/components/tags-section'
import { api } from '@/lib/axios'
import { SubtasksContent } from './subtasks-content'
import { TodoContext } from '@/app/home/page'

interface TaskContentProps {
    task: Task
    setSelectedTask: (task: Task | null) => void
    handleGetTasks: () => void
}

export interface Subtask {
    subtaskId: string
    id: string
    title: string
}

export function TaskContent({ task, setSelectedTask, handleGetTasks }: TaskContentProps) {
    const [title, setTitle] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
    const [listId, setListId] = useState<string>('')
    const [selectedTags, setSelectedTags] = useState<Tag[]>([])
    const [isUpdateButtonDisabled, setIsUpdateButtonDisabled] = useState<boolean>(true)
    const [subtasks, setSubtasks] = useState<Task[]>([])

    const context = useContext(TodoContext)
    
    if (!context) {
        return
    }

    const { setChangesOccured } = context

    useEffect(() => {
        setTitle(task.title)
        setDescription(task.description)
        setListId(task.listId)
        setSelectedTags(task.tags)

        if (task.dueDate) {
            setDueDate(new Date(task.dueDate))
        } else {
            setDueDate(undefined)
        }
    }, [task])

    useEffect(() => {
        if (
            (title.length > 0 && title != task.title) || description != task.description 
            || listId != task.listId || !isSameDate(dueDate, task.dueDate ? new Date(task.dueDate) : undefined) 
            || compareTags(task.tags, selectedTags)
        ) {
            setIsUpdateButtonDisabled(false)
        } else {
            setIsUpdateButtonDisabled(true)
        }
    }, [title, description, dueDate, listId, selectedTags])

    async function handleUpdateTask() {
        try {
            const tags = selectedTags.map(tag => {
                return {
                    id: tag.id
                }
            })

            await api.put(`/tasks/${task.id}`, {
                title,
                description,
                listId,
                dueDate: dueDate ? dueDate : null,
                tags
            }).then(() => {
                setChangesOccured(true)
                handleGetTasks()
            })
        } catch (error) {
            console.log(error)
        }
    }

    function compareTags(tags: Tag[], selectedTags: Tag[]) {
        if (tags.length != selectedTags.length) {
            return true
        }

        const orderedTags = tags.sort((a, b) => a.id.localeCompare(b.id))
        const orderedSelectedTags = selectedTags.sort((a, b) => a.id.localeCompare(b.id))

        return orderedTags.some((obj, i) => obj.id != orderedSelectedTags[i].id)
    }

    function isSameDate(a: Date | undefined, b: Date | undefined) {
        if (!a && !b) {
            return true
        }

        if (!a || !b) {
            return false
        }

        return a.getTime() == b.getTime()
    }

    return (
        <div className="w-[320px] h-full rounded-md relative p-2 text-sm flex flex-col gap-3 bg-zinc-200 text-black">
            <h2 className="text-xl font-semibold">Task</h2>
            <div className="w-full flex flex-col gap-2">
                <input spellCheck={ false } placeholder="Task title" onChange={ e => setTitle(e.target.value) } value={ title } type="text" className="w-full border p-1 rounded focus:outline-none bg-transparent border-zinc-500" />
                <textarea spellCheck={ false } placeholder="Task description" onChange={ e => setDescription(e.target.value) } value={ description } className="w-full h-36 border p-1 rounded overflow-auto resize-none focus:outline-none bg-transparent border-zinc-500" />
            </div>
            <div className="w-full h-28 text-sm flex flex-col gap-2">
                <SelectList listId={ listId } setListId={ setListId } />
                <SelectDueDate dueDate={ dueDate } setDueDate={ setDueDate } />
                <SelectTag selectedTags={ selectedTags } setSelectedTags={ setSelectedTags } />
            </div>
            <SubtasksContent task={ task } subtasks={ subtasks } setSubtasks={ setSubtasks } handleGetTasks={ handleGetTasks } />
            <div className="w-full -translate-x-2 absolute bottom-2 flex items-center justify-center gap-4">
                <button onClick={ () => setSelectedTask(null) } className="w-32 rounded-lg border p-1 cursor-pointer border-zinc-500">Close</button>
                <button onClick={ handleUpdateTask } disabled={ isUpdateButtonDisabled } className="w-32 rounded-lg p-1 cursor-pointer disabled:cursor-default disabled:bg-blue-500/50 text-white bg-blue-500">Save</button>
            </div>
        </div>
    )
}
