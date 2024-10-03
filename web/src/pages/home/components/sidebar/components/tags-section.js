import { fredoka } from '@/pages/_app'
import { TodoContext } from '@/pages/home'
import { Plus } from 'phosphor-react'
import { useContext, useEffect, useState } from 'react'
import { TagContent } from '../../content/components/tags/tag-content'
import { getTags } from '@/utils/tags/get-tags'
import { createTag } from '@/utils/tags/create-tag'

export function TagsSection() {
    const [tags, setTags] = useState()

    const { user, content, setContent } = useContext(TodoContext)

    useEffect(() => {
        handleGetTags(user?.id)
    }, [user])

    async function handleGetTags(userId) {
        await getTags(userId).then(response => {
            setTags(response.tags)
        })
    }

    async function handleCreateTag() {
        await createTag(user.id, `Tag ${tags?.length + 1}`).then(response => {
            setContent({ type: response.tagId, component: <TagContent tagId={response.tagId} handleGetTags={() => handleGetTags(user?.id)} /> })
            handleGetTags(user.id)
        })
    }

    return (
        <section className="w-full flex flex-col gap-1">
            <h2 className={`${fredoka.className}`}>Tags</h2>
            <div style={{ gap: '4%' }} className="w-full h-16 px-2 overflow-auto flex flex-wrap gap-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-700">
                {
                    tags?.map(tag => {
                        return (
                            <div key={tag.id} style={{ width: '30%', backgroundColor: tag.color }} onClick={() => setContent({ type: tag.id, component: <TagContent tagId={tag.id} handleGetTags={() => handleGetTags(user?.id)} /> })} className={`h-8 mb-1 text-black rounded flex items-center justify-center cursor-pointer ${content?.type == tag.id && `${fredoka.className}`}`}>
                                <span title={tag.title} className="max-w-[90%] truncate">{tag.title}</span>
                            </div>
                        )
                    })
                }
                <div style={{ width: '30%' }} onClick={handleCreateTag} className="h-8 bg-zinc-300 text-black rounded flex items-center justify-center gap-1 cursor-pointer">
                    <Plus />
                    <span>Add tag</span>
                </div>
            </div>
        </section>
    )
}
