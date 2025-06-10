import { Plus } from 'phosphor-react'
import { InputText } from '../../input-text'
import { api } from '@/lib/axios'
import { useContext, useEffect, useState } from 'react'
import { ListsAndTasksCard } from './lists-and-tasks-card'
import { TodoContext } from '@/app/home/page'
import { ListContent } from '../../content/components/list-content'

export interface List {
    id: string
    title: string
    color: string
    tasksAmount: number
}

export function ListsSection() {
    const [lists, setLists] = useState<List[]>([])

    const context = useContext(TodoContext)

    if (!context) {
        return
    }

    const { content, setContent, changesOccured } = context

    useEffect(() => {
        handleGetLists()
    }, [])

    useEffect(() => {
        if (changesOccured) {
            handleGetLists()
        }
    }, [changesOccured])

    async function handleGetLists() {
        try {
            await api.get<{ lists: List[] }>('/lists').then(response => {
                setLists(response.data.lists)
            })
        } catch (error) {
            console.log(error)
        }
    }

    async function handleCreateList(title: string) {
        try {
            await api.post<{ list: List }>('/lists', {
                title
            }).then(response => {
                handleGetLists()
                setContent({ type: response.data.list.id, component: <ListContent list={ response.data.list } handleGetLists={ handleGetLists } /> })
            }) 
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <section className="w-full flex flex-col gap-1">
            <h2 className="text-sm font-bold">Lists</h2>
            <div className="w-full max-h-24 flex flex-col gap-1 overflow-auto">
                {
                    lists.length > 0 ?
                    lists.map(list => {
                        return (
                            <ListsAndTasksCard key={ list.id } type={ list.id } component={ <ListContent list={ list } handleGetLists={ handleGetLists } /> }>
                                <div style={{ backgroundColor: list.color }} className="w-5 h-5 rounded" />
                                <span title={ list.title } className="max-w-[75%] truncate">{ list.title }</span>
                                <div className={`w-8 h-5 rounded absolute right-1 flex items-center justify-center bg-zinc-300 text-black group-hover:bg-white ${content.type == list.id && "!bg-white"}`}>{ list.tasksAmount }</div>
                            </ListsAndTasksCard>
                        )
                    })
                    : <span className="text-xs mx-auto py-2">Create your first list</span>
                }
            </div>
            <InputText placeholder="Add new list" handleKeyDownAction={ handleCreateList }>
                <Plus weight="bold" size={ 16 } />
            </InputText>
        </section>
    )
}
