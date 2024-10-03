import { addOrRemoveSubtask } from '@/utils/tasks/add-or-remove-subtask'
import { Check } from 'phosphor-react'
import { useState } from 'react'

export function SubtaskCard({ taskId, subtask, subtasks, handleGetTasks }) {
    const [isHoverCheck, setIsHoverCheck] = useState()

    async function handleAddOrRemoveSubtask(subtaskId) {
        await addOrRemoveSubtask(taskId, subtaskId).then(() => {
            handleGetTasks()
        })
    }

    return (
        <div className="w-full flex items-center gap-3">
            <div onClick={() => handleAddOrRemoveSubtask(subtask.id)} onMouseEnter={() => setIsHoverCheck(true)} onMouseLeave={() => setIsHoverCheck(false)} className="w-5 h-5 flex items-center justify-center border border-zinc-500 rounded cursor-pointer group">
                {(isHoverCheck || subtasks?.find(task => task.id == subtask.id)) && <Check weight="bold" size={20} className="text-green-500" />}
            </div>
            <span title={subtask.title} className="max-w-[80%] truncate">{subtask.title}</span>
        </div>
    )
}
