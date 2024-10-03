import { fredoka } from '@/pages/_app'
import { TodoContext } from '@/pages/home'
import { deleteTag } from '@/utils/tags/delete-tag'
import { getTags } from '@/utils/tags/get-tags'
import { BookmarkSimple, Trash } from 'phosphor-react'
import { useContext, useEffect, useRef, useState } from 'react'
import { ListAndTasksSection } from './list-and-tasks-section'
import { updateTagTitle } from '@/utils/tags/update-tag-title'

export function TagContent({ tagId, handleGetTags }) {
    const [tag, setTag] = useState()
    const [tasksAmount, setTasksAmount] = useState()
    const [isUpdatingTagTitle, setIsUpdatingTagTitle] = useState()
    const [tagTitle, setTagTitle] = useState()

    const { user, setContent } = useContext(TodoContext)
    const inputTagTitleRef = useRef()

    useEffect(() => {
        if (tagId) {
            handleGetTag(user?.id, tagId)
        }
    }, [user, tagId])

    useEffect(() => {
        if (tag) {
            setTagTitle(tag.title)

            let amount = 0

            tag.lists?.map(list => amount += list.tasks.length)
            setTasksAmount(amount)
        }
    }, [tag])

    useEffect(() => {
        if (isUpdatingTagTitle) {
            inputTagTitleRef.current.focus()
        }
    }, [isUpdatingTagTitle])

    async function handleDeleteTag() {
        await deleteTag(tag.id).then(() => {
            handleGetTags()
            setContent(null)
        })
    }

    async function handleGetTag(userId, tagId) {
        await getTags(userId).then(response => {
            setTag(response.tags.find(tag => tag.id == tagId))
        })
    }

    async function handleUpdateTagTitle() {
        if (tagTitle.length > 0) {
            await updateTagTitle(tag.id, tagTitle).then(() => {
                handleGetTags()
            })
        } else {
            setTagTitle(tag.title)
        }
        
        setIsUpdatingTagTitle(false)
    }

    return (
        <section className="w-full h-full flex flex-col gap-3">
            <header className="w-full flex items-center gap-3 relative">
                <BookmarkSimple style={{ color: tag?.color }} weight="fill" size={40} />
                {
                    isUpdatingTagTitle ?
                    <input spellCheck={false} onBlur={handleUpdateTagTitle} ref={inputTagTitleRef} onChange={e => setTagTitle(e.target.value)} value={tagTitle} placeholder={tag?.title} type="text" className={`w-[80%] bg-transparent text-3xl focus:outline-none ${fredoka.className}`} />
                    : (
                        <>
                            <h1 onClick={() => setIsUpdatingTagTitle(true)} className={`max-w-[75%] truncate ${fredoka.className} text-3xl cursor-default`}>{tagTitle}</h1>
                            <div className="w-12 h-8 flex items-center justify-center text-2xl border border-zinc-400 rounded">{tasksAmount}</div>
                        </>
                    ) 
                }
                <Trash onClick={handleDeleteTag} size={35} className="cursor-pointer hover:text-red-500 absolute right-0" />
            </header>
            <main className="w-full h-full flex overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-700">
                {
                    tag?.lists.length > 0 ?
                        <div className="flex gap-3 px-2">
                            {
                                tag?.lists.map(list => {
                                    return (
                                        <ListAndTasksSection list={list} />
                                    )
                                })
                            }
                        </div>
                    : <span className="text-sm mx-auto mt-10">This tag doesn't have any task</span>
                }
            </main>
        </section>
    )
}
