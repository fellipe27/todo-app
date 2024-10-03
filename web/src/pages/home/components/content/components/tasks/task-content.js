import { fredoka } from '@/pages/_app'
import { useEffect, useState } from 'react'
import { updateTask } from '@/utils/tasks/update-task'
import { SelectList } from './select-list'
import { SelectDueDate } from './select-due-date'
import { SelectTags } from './select-tags'
import { SubtasksContent } from './subtasks-content'

export function TaskContent({ task, setSelectedTask, handleGetTasks }) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState()
    const [selectedList, setSelectedList] = useState()
    const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState()
    const [dueDate, setDueDate] = useState()
    const [selectedTags, setSelectedTags] = useState([])
    const [subtasks, setSubtasks] = useState([])

    useEffect(() => {
        if ((title != task?.title && title?.length > 0) || description != task?.description || selectedList?.id != task.listId || dueDate != task?.dueDate || compareTags(task?.tags, selectedTags)) {
            setIsSaveButtonDisabled(false)
        } else {
            setIsSaveButtonDisabled(true)
        }
    }, [title, description, selectedList, dueDate, selectedTags])

    useEffect(() => {
        setTitle(task?.title)
        setDescription(task?.description)
        setSelectedList({ id: task?.listId, title: task?.listTitle, color: task?.listColor })
        setDueDate(task?.dueDate)
        setSelectedTags(task?.tags)
        setSubtasks(task?.subtasks)
    }, [task])

    async function handleUpdateTask() {
        const tags = selectedTags?.map(tag => {
            return {
                id: tag.id
            }
        })

        await updateTask(task.id, title, description, dueDate, selectedList.id, tags).then(() => {
            handleGetTasks()
            setIsSaveButtonDisabled(true)
        })
    }

    function compareTags(tags, selectedTags) {
        if (tags?.length != selectedTags?.length) {
            return true
        }

        const orderedTags = tags?.sort((a, b) => a.id.localeCompare(b.id))
        const orderedSelectedTags = selectedTags?.sort((a, b) => a.id.localeCompare(b.id))

        return orderedTags?.some((obj, i) => obj.id != orderedSelectedTags[i].id)
    }

    return (
        <div className="w-[320px] h-full bg-zinc-200 rounded-md relative p-2 text-sm flex flex-col gap-3 text-black">
            <h2 className={`${fredoka.className} text-xl`}>Task</h2>
            <div className="w-full flex flex-col gap-2">
                <input placeholder="Task title" spellCheck={false} onChange={e => setTitle(e.target.value)} value={title} type="text" className="w-full bg-transparent border border-zinc-500 focus:outline-none p-1 rounded" />
                <textarea placeholder="Task description" spellCheck={false} onChange={e => setDescription(e.target.value)} value={description} className="w-full h-36 bg-transparent border border-zinc-500 p-1 focus:outline-none rounded resize-none overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-700" />
            </div>
            <div className="w-full h-28 text-sm flex flex-col gap-2">
                <SelectList selectedList={selectedList} setSelectedList={setSelectedList} />
                <SelectDueDate dueDate={dueDate} setDueDate={setDueDate} />
                <SelectTags selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
            </div>
            <SubtasksContent taskId={task.id} subtasks={subtasks} handleGetTasks={handleGetTasks} />
            <footer className="w-full -translate-x-2 absolute bottom-2 flex items-center justify-center gap-4 text-sm">
                <button onClick={() => setSelectedTask(null)} className="w-32 rounded-lg border border-zinc-500 p-1">Close</button>
                <button onClick={handleUpdateTask} disabled={isSaveButtonDisabled} className="w-32 rounded-lg bg-blue-500 p-1 disabled:cursor-default disabled:bg-blue-500/50 disabled:text-black/50">Save changes</button>
            </footer>
        </div>
    )
}
