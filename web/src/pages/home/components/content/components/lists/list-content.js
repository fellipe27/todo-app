import { fredoka } from '@/pages/_app'
import { Plus, Trash} from 'phosphor-react'
import { useContext, useEffect, useRef, useState } from 'react'
import { updateListTitle } from '@/utils/lists/update-list-title'
import { deleteList } from '@/utils/lists/delete-list'
import { TodoContext } from '@/pages/home'
import { TaskContent } from '../tasks/task-content'
import { createTask } from '@/utils/tasks/create-task'
import { getTasks } from '@/utils/tasks/get-tasks'
import { TaskCard } from '../tasks/task-card'
import { InputText } from '../../../input-text'

export function ListContent({ list, handleGetLists }) {
    const [listTitle, setListTitle] = useState()
    const [isUpdatingListTitle, setIsUpdatingListTitle] = useState()
    const [selectedTask, setSelectedTask] = useState()
    const [tasks, setTasks] = useState()

    const inputListTitleRef = useRef()
    const { user, setContent, handleGetUpcomingTasks } = useContext(TodoContext)

    useEffect(() => {
        setListTitle(list?.title)
        setSelectedTask(null)
        handleGetTasks(list?.id)
    }, [list])

    useEffect(() => {
        if (isUpdatingListTitle) {
            inputListTitleRef.current.focus()
        }
    }, [isUpdatingListTitle])

    useEffect(() => {
        if (selectedTask) {
            setSelectedTask(tasks?.find(task => task.id == selectedTask.id))
        }
        handleGetUpcomingTasks(user?.id)
    }, [tasks])

    async function handleUpdateListTitle() {
        if (listTitle.length > 0) {
            await updateListTitle(list.id, listTitle).then(() => {
                handleGetLists()
            })
        } else {
            setListTitle(list.title)
        }
        setIsUpdatingListTitle(false)
    }

    async function handleDeleteList() {
        await deleteList(list.id).then(() => {
            setContent(null)
            handleGetLists()
        })
    }

    async function handleCreateTask(title) {
        await createTask(list.id, title, '...', null).then(response => {
            setSelectedTask(response.task)
            handleGetTasks(list.id)
        })
    }

    async function handleGetTasks(listId) {
        await getTasks(listId).then(response => {
            setTasks(response?.tasks)
            handleGetLists()
        })
    }

    return (
        <section className="w-full h-full flex gap-2">
            <div className="w-full h-full flex flex-col gap-3 flex-1">
                <header className="w-full flex items-center gap-4 relative">
                    <div style={{ backgroundColor: list.color }} className="w-8 h-8 rounded" />
                    {
                        isUpdatingListTitle ?
                        <input spellCheck={false} onBlur={handleUpdateListTitle} ref={inputListTitleRef} onChange={e => setListTitle(e.target.value)} value={listTitle} placeholder={list.title} type="text" className={`w-[80%] bg-transparent text-3xl focus:outline-none ${fredoka.className}`} />
                        : (
                            <>
                                <h1 onClick={() => setIsUpdatingListTitle(true)} className={`max-w-[75%] truncate ${fredoka.className} text-3xl cursor-default`}>{listTitle}</h1>
                                <div className="w-12 h-8 flex items-center justify-center text-2xl border border-zinc-400 rounded">{tasks?.length}</div>
                            </>
                        ) 
                    }
                    <Trash onClick={handleDeleteList} size={35} className="cursor-pointer hover:text-red-500 absolute right-0" />
                </header>
                <InputText placeholder="Add new task" handleKeyDownAction={handleCreateTask}>
                    <Plus size={25} />
                </InputText>
                <div className="w-full h-full flex flex-col -mt-2 overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-700">
                    {
                        tasks?.length > 0 ?
                        tasks.map(task => {
                            return (
                                <TaskCard key={task.id} task={task} selectedTask={selectedTask} setSelectedTask={setSelectedTask} handleGetTasks={() => handleGetTasks(list.id)} showList={false} />
                            )
                        })
                        : <span className="text-sm mx-auto mt-10">Create your first task</span>
                    }    
                </div>
            </div>
            {selectedTask && <TaskContent task={selectedTask} setSelectedTask={setSelectedTask} handleGetTasks={() => handleGetTasks(list.id)} />}
        </section>
    )
}
