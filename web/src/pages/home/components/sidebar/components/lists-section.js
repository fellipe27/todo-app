import { fredoka } from '@/pages/_app'
import { InputText } from '../../input-text'
import { Plus } from 'phosphor-react'
import { ListsAndTasksCard } from './lists-and-tasks-card'
import { ListContent } from '../../content/components/lists/list-content'
import { useContext, useEffect, useState } from 'react'
import { TodoContext } from '@/pages/home'
import { getLists } from '@/utils/lists/get-lists'
import { createList } from '@/utils/lists/create-list'

export function ListsSection() {
    const [lists, setLists] = useState()

    const { user, content, setContent, upcomingTasks } = useContext(TodoContext)

    useEffect(() => {
        handleGetLists(user?.id)
    }, [user])

    useEffect(() => {
        handleGetLists(user?.id)
    }, [upcomingTasks])

    async function handleGetLists(userId) {
        await getLists(userId).then(response => {
            setLists(response.lists)
        })
    }

    async function handleCreateList(title) {
        await createList(user?.id, title).then(response => {
            handleGetLists(user?.id)
            setContent({ type: response.list.id, component: <ListContent list={response.list} handleGetLists={() => handleGetLists(user.id)} /> })
        })
    }

    return (
        <section className="w-full flex flex-col gap-1">
            <h2 className={`${fredoka.className}`}>Lists</h2>
            <div className="w-full max-h-28 flex flex-col gap-1 overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-700">
                {
                    lists?.length > 0 ?
                    lists.map(list => {
                        return (
                            <ListsAndTasksCard key={list.id} type={list.id} component={<ListContent list={list} handleGetLists={() => handleGetLists(user.id)} />}>
                                <div style={{ backgroundColor: list.color }} className="w-5 h-5 rounded" />
                                <span title={list.title} className="max-w-[75%] truncate">{list.title}</span>
                                <div className={`w-8 h-5 rounded absolute right-1 bg-zinc-300 flex items-center justify-center text-black group-hover:bg-white ${content?.type == list.id && "!bg-white"}`}>{list.tasksAmount}</div>
                            </ListsAndTasksCard>
                        )
                    })
                    : <span className="text-xs">Create your first list</span>
                }
            </div>
            <InputText placeholder="Add new list" handleKeyDownAction={handleCreateList}>
                <Plus weight="bold" size={16} />
            </InputText>
        </section>
    )
}
