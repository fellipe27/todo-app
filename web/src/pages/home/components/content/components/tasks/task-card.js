import { fredoka } from '@/pages/_app'
import { deleteTask } from '@/utils/tasks/delete-task'
import { CalendarX, CaretLeft, CaretRight, Check } from 'phosphor-react'
import { useState } from 'react'
import { format } from 'date-fns'

export function TaskCard({ task, selectedTask, setSelectedTask, handleGetTasks, showList }) {
    const [isHoverCheck, setIsHoverCheck] = useState()

    async function handleDeleteTask() {
        await deleteTask(task.id).then(() => {
            if (task.id == selectedTask?.id) {
                setSelectedTask(null)
            }
            handleGetTasks()
        })
    }

    return (
        <div className="w-full flex items-start gap-4 border-b border-zinc-400 px-2 pt-3 relative">
            <div onClick={handleDeleteTask} onMouseLeave={() => setIsHoverCheck(false)} onMouseEnter={() => setIsHoverCheck(true)} className="w-5 h-5 rounded border border-zinc-400 cursor-pointer flex items-center justify-center">
                {isHoverCheck && <Check weight="bold" size={17} className="text-green-500" />}
            </div>
            <div className="w-full flex flex-1 flex-col gap-2">
                <span title={task.title} className={`max-w-[90%] flex flex-1 ${selectedTask?.id == task.id && `${fredoka.className}`}`}>{task.title}</span>
                <div className="text-xs pb-3 flex items-center gap-4">
                    {
                        showList && (
                            <div className="flex items-center gap-2">
                                <div style={{ backgroundColor: task.listColor }} className="w-4 h-4 rounded" />
                                <span>{task.listTitle}</span>
                            </div>
                        )
                    }
                    {
                        task.dueDate && (
                            <div className="flex items-center gap-2">
                                <CalendarX weight="fill" size={16} className="text-red-500" />
                                <span>{format(task.dueDate, 'MM-dd-yy')}</span>
                            </div>
                        )
                    }
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-4 text-black flex items-center justify-center bg-zinc-400 rounded">{task.subtasks?.length}</div>
                        <span>Subtasks</span>
                    </div>
                </div>
            </div>
            {
                selectedTask?.id == task.id ?
                <CaretLeft onClick={() => setSelectedTask(null)} weight="bold" size={24} className="cursor-pointer absolute right-1 text-red-500" />
                : <CaretRight onClick={() => setSelectedTask(task)} weight="bold" size={24} className="cursor-pointer absolute right-1" />
            }
        </div>
    )
}
