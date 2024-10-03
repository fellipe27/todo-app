import { fredoka } from '@/pages/_app'
import { TodoContext } from '@/pages/home'
import { getTags } from '@/utils/tags/get-tags'
import { Plus } from 'phosphor-react'
import { useContext, useEffect, useRef, useState } from 'react'

export function SelectTags({ selectedTags, setSelectedTags }) {
    const [tags, setTags] = useState()
    const [isSelectingTag, setIsSelectingTag] = useState()

    const { user } = useContext(TodoContext)
    const selectTagRef = useRef()

    useEffect(() => {
        function handleClickOutside(e) {
            if (!selectTagRef.current?.contains(e.target)) {
                setIsSelectingTag(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)

        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        handleGetTags(user?.id)
    }, [user])

    async function handleGetTags(userId) {
        await getTags(userId).then(response => {
            setTags(response.tags)
        })
    }

    return (
        <div className="w-full flex items-center relative">
            <span className={`w-16 ${fredoka.className}`}>Tags</span>
            <div className="w-full max-h-10 flex flex-1 flex-wrap items-center gap-1 overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-700">
                {
                    selectedTags?.map(tag => {
                        return (
                            <div onClick={() => setSelectedTags(selectedTags?.filter(selectedTag => selectedTag.id != tag.id))} style={{ backgroundColor: tag.color }} key={tag.id} className="w-[72px] h-7 rounded flex items-center justify-center cursor-pointer">
                                <span className="max-w-[90%] truncate">{tag.title}</span>
                            </div>
                        )
                    })
                }
                <div onClick={() => setIsSelectingTag(true)} className="w-[72px] h-7 bg-zinc-500 text-white text-xs flex gap-1 items-center justify-center rounded cursor-pointer">
                    <Plus />
                    <span>Add tag</span>
                </div>
                {
                    isSelectingTag && (
                        <div ref={selectTagRef} className="w-[80%] h-24 z-50 p-2 flex flex-wrap gap-1 absolute inset-0 left-1/2 top-0 -translate-x-1/2 rounded shadow-lg bg-white overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-700">
                            {
                                tags?.length > 0 && tags?.length != selectedTags?.length ?
                                tags.map(tag => {
                                    if (!selectedTags?.find(selectedTag => selectedTag.id == tag.id)) {
                                        return (
                                            <div onClick={() => setSelectedTags([...selectedTags, tag])} style={{ backgroundColor: tag.color }} key={tag.id} className="w-[calc(50%-2px)] h-8 rounded flex items-center justify-center cursor-pointer">
                                                <span className="max-w-[90%] truncate">{tag.title}</span>
                                            </div>
                                        )
                                    } 
                                })
                                : <span className="mx-auto text-sm">You don't have any tag</span>
                            }
                        </div>
                    )
                }
            </div>
        </div>
    )
}
