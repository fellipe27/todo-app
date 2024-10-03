import { fredoka } from '@/pages/_app'
import { Plus } from 'phosphor-react'
import { useContext, useEffect, useRef, useState } from 'react'
import { getLists } from '@/utils/lists/get-lists'
import { TodoContext } from '@/pages/home'
import { getTasks } from '@/utils/tasks/get-tasks'
import { SubtaskCard } from './subtask-card'

export function SubtasksContent({ taskId, subtasks, handleGetTasks }) {
    const [userTasks, setUserTasks] = useState([])
    const [searchedTasks, setSearchedTasks] = useState([])

    const { user } = useContext(TodoContext)
    const inputSubtaskRef = useRef()

    useEffect(() => {
        handleGetUserTasks(user?.id)
        inputSubtaskRef.current.value = ''
        setSearchedTasks([])
    }, [taskId])

    useEffect(() => {
        inputSubtaskRef.current.value = ''
        setSearchedTasks([])
    }, [subtasks])

    async function handleGetUserTasks(userId) {
        let lists = []
        let tasks = []

        await getLists(userId).then(response => {
            response.lists.map(list => {
                if (list.tasksAmount > 0) {
                    lists.push(list)
                }
            })
        })

        lists.map(async (list) => {
            await getTasks(list.id).then(response => {
                response?.tasks.map(task => {
                    tasks.push(task)
                })
            })
        })

        setUserTasks(tasks)
    }

    function handleSearchTasks(searchedTasks) {
        if (searchedTasks.length > 0) {
            setSearchedTasks(userTasks.filter(task => task.title.toLowerCase().includes(searchedTasks.toLowerCase())))
        } else {
            setSearchedTasks([])
        }
    }

    return (
        <div className="w-full flex flex-col gap-2 -mt-2">
            <h2 className={`${fredoka.className} text-xl`}>Subtasks</h2>
            <div className="w-full flex items-center gap-2 p-1 border border-zinc-500 rounded-md">
                <div onClick={() => inputSubtaskRef.current.focus()}>
                    <Plus size={16} />
                </div>
                <input spellCheck={false} onChange={e => handleSearchTasks(e.target.value)} ref={inputSubtaskRef} placeholder="Add new subtask" type="text" className="h-full flex-1 bg-transparent focus:outline-none" />
            </div>
            <div className="w-full h-[88px] px-2 flex flex-col gap-2 overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-700">
                {
                    searchedTasks.length > 0 ?
                    searchedTasks.map(task => {
                        return (
                            <SubtaskCard key={task.id} taskId={taskId} subtask={task} subtasks={subtasks} handleGetTasks={handleGetTasks} />
                        )
                    })
                    : subtasks?.length > 0 ?
                    subtasks.map(subtask => {
                        return (
                            <SubtaskCard key={subtask.id} taskId={taskId} subtask={subtask} subtasks={subtasks} handleGetTasks={handleGetTasks} />
                        )
                    })
                    : <span className="text-xs mx-auto mt-5">Add your first subtask</span>
                }
            </div>
        </div>
    )
}
