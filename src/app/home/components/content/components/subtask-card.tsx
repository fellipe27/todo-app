import { Check } from 'phosphor-react'
import { useState } from 'react'
import { Task } from './list-content'
import { api } from '@/lib/axios'

interface SubtaskCardProps {
    taskId: string
    subtask: Task
    subtasks: Task[]
    handleGetTasks: () => void
}

export function SubtaskCard({ taskId, subtask, subtasks, handleGetTasks }: SubtaskCardProps) {
    const [isHoverCheck, setIsHoverCheck] = useState<boolean>(false)

    async function handleAddOrRemoveSubtask() {
        try {
            await api.post(`/tasks/${taskId}`, {
                subtaskId: subtask.id
            }).then(() => {
                handleGetTasks()
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="w-full flex items-center gap-3">
            <div onClick={ handleAddOrRemoveSubtask } onMouseEnter={ () => setIsHoverCheck(true) } onMouseLeave={ () => setIsHoverCheck(false) } className="w-5 h-5 flex items-center justify-center border rounded cursor-pointer border-zinc-500">
                { (isHoverCheck || subtasks.some(task => task.id == subtask.id)) && <Check weight="bold" size={ 20 } className="text-green-500" /> }
            </div>
            <span title={ subtask.title } className="max-w-[80%] truncate">{ subtask.title }</span>
        </div>
    )
}
