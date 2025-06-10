import { TodoContext } from '@/app/home/page'
import { api } from '@/lib/axios'
import { Plus } from 'phosphor-react'
import { useContext, useEffect, useState } from 'react'
import { TagContent } from '../../content/components/tag-content'
import { Task } from '../../content/components/list-content'

export interface Tag {
    id: string
    title: string
    color: string
    lists?: [
        {
            id: string
            title: string
            color: string
            tasks: Task[]
        }
    ]
}

export function TagsSection() {
    const [tags, setTags] = useState<Tag[]>([])

    const context = useContext(TodoContext)

    if (!context) {
        return
    }

    const { content, setContent, changesOccured } = context

    useEffect(() => {
        handleGetTags()
    }, [])

    useEffect(() => {
        if (changesOccured) {
            handleGetTags()
        }
    }, [changesOccured])

    async function handleGetTags() {
        try {
            await api.get<{ tags: Tag[] }>('/tags').then(response => {
                setTags(response.data.tags)
            })
        } catch (error) {
            console.log(error)
        }
    }

    async function handleCreateTag() {
        try {
            await api.post<{ tag: Tag }>('/tags').then(response => {
                handleGetTags()
                setContent({ type: response.data.tag.id, component: <TagContent tag={ response.data.tag } handleGetTags={ handleGetTags } /> })
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <section className="w-full flex flex-col gap-1">
            <h2 className="text-sm font-bold">Tags</h2>
            <div className="w-full h-16 overflow-auto grid grid-cols-3 gap-2 text-sm">
                {
                    tags.map(tag => {
                        return (
                            <div key={ tag.id } onClick={ () => setContent({ type: tag.id, component: <TagContent tag={ tag } handleGetTags={ handleGetTags } /> }) } style={{ backgroundColor: tag.color }} className="h-8 rounded flex items-center justify-center cursor-pointer">
                                <span title={ tag.title } className={`max-w-[90%] truncate text-sm text-white ${content.type == tag.id && "font-bold"}`}>{ tag.title }</span>
                            </div>
                        )
                    })
                }
                <div onClick={ handleCreateTag } className="h-8 rounded flex items-center justify-center gap-1 cursor-pointer bg-zinc-300 text-black">
                    <Plus weight="bold" />
                    <span>Add tag</span>
                </div>
            </div>
        </section>
    )
}
