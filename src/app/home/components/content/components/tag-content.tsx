import { useContext, useEffect, useRef, useState } from 'react'
import { Tag } from '../../sidebar/components/tags-section'
import { BookmarkSimple, Trash } from 'phosphor-react'
import { api } from '@/lib/axios'
import { Content, TodoContext } from '@/app/home/page'
import { ListAndTasksSection } from './list-and-tasks-section'

interface TagContentProps {
    tag: Tag
    handleGetTags: () => void
}

export function TagContent({ tag, handleGetTags }: TagContentProps) {
    const [isUpdatingTagTitle, setIsUpdatingTagTitle] = useState<boolean>(false)
    const [tagTitle, setTagTitle] = useState<string>('')
    const [tasksAmount, setTasksAmount] = useState<number>(0)

    const context = useContext(TodoContext)

    if (!context) {
        return
    }

    const { setContent } = context
    const inputTagTitleRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (tag) {
            setTagTitle(tag.title)

            let amount = 0
            tag.lists?.map(list => amount += list.tasks.length)

            setTasksAmount(amount)
        }
    }, [tag])

    useEffect(() => {
        if (inputTagTitleRef.current) {
            inputTagTitleRef.current.focus()
        }
    }, [isUpdatingTagTitle])

    async function handleDeleteTag() {
        try {
            await api.delete(`/tags/${tag.id}`).then(() => {
                handleGetTags()
                setContent({} as Content)
            })
        } catch (error) {
            console.log(error)
        }
    }

    async function handleUpdateTagTitle() {
        if (tagTitle.length > 0) {
            try {
                await api.put(`/tags/${tag.id}`, {
                    title: tagTitle
                }).then(() => {
                    handleGetTags()
                })
            } catch (error) {
                console.log(error)
            }
        } else {
            setTagTitle(tag.title)
        }

        setIsUpdatingTagTitle(false)
    }

    return (
        <section className="w-full h-full flex flex-col gap-3">
            <header className="w-full flex items-center gap-4 relative font-bold">
                <BookmarkSimple style={{ color: tag.color }} weight="fill" size={ 40 } />
                {
                    isUpdatingTagTitle ?
                    <input spellCheck={ false } type="text" onBlur={ handleUpdateTagTitle } ref={ inputTagTitleRef } onChange={ e => setTagTitle(e.target.value) } value={ tagTitle } placeholder={ tag.title } className="w-[80%] text-3xl focus:outline-none bg-transparent" />
                    : (
                        <>
                            <h1 onClick={ () => setIsUpdatingTagTitle(true) } className="max-w-[75%] truncate text-3xl cursor-default">{ tagTitle }</h1>
                            <div className="w-12 h-8 flex items-center justify-center text-2xl rounded font-normal border border-zinc-400">{ tasksAmount }</div>
                        </>
                    )
                }
                <Trash onClick={ handleDeleteTag } size={ 35 } className="cursor-pointer absolute right-0 hover:text-red-500" />
            </header>
            <div className="w-full h-full flex overflow-x-auto">
                {
                    tag?.lists && tag.lists.length > 0 ?
                    <div className="flex gap-3 px-2">
                        {
                            tag.lists.map(list => {
                                return <ListAndTasksSection key={ list.id } list={ list } />
                            })
                        }
                    </div>
                    : <span className="text-sm mx-auto mt-10">This tag doesn't have any task</span>
                }
            </div>
        </section>
    )
}
