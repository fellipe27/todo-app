import { fredoka } from '@/pages/_app'
import { TodoContext } from '@/pages/home'
import { deleteSticky } from '@/utils/stickys/delete-sticky'
import { updateSticky } from '@/utils/stickys/update-sticky'
import { Trash } from 'phosphor-react'
import { useContext, useEffect, useRef, useState } from 'react'

export function StickyCard({ sticky, size, handleGetStickys }) {
    const [title, setTitle] = useState()
    const [description, setDescription] = useState()
    const [isUpdatingSticky, setIsUpdatingSticky] = useState()
    const [isHoverSticky, setIsHoverSticky] = useState()

    const inputTitleRef = useRef()
    const { isStickysColored } = useContext(TodoContext)

    useEffect(() => {
        setTitle(sticky?.title)
        setDescription(sticky?.description)
    }, [sticky])

    useEffect(() => {
        if (isUpdatingSticky) {
            inputTitleRef.current?.focus()
        }
    }, [isUpdatingSticky])

    async function handleUpdateSticky() {
        if (title.length > 0) {
            await updateSticky(sticky.id, title, description.length > 0 ? description : '...').then(() => {
                handleGetStickys()
            })
        }
        
        setIsUpdatingSticky(false)
    }

    async function handleDeleteSticky() {
        await deleteSticky(sticky.id).then(() => {
            handleGetStickys()
        })
    }

    return (
        <div onMouseEnter={() => setIsHoverSticky(true)} onMouseLeave={() => setIsHoverSticky(false)} style={{ width: `${size}px`, height: `${size}px`, backgroundColor: isStickysColored ? sticky.color : '#d1ee26' }} className="rounded relative mb-4 p-2 flex flex-col gap-1 text-black group">
            {
                isUpdatingSticky ?
                <input onBlur={handleUpdateSticky} placeholder="Sticky title" ref={inputTitleRef} spellCheck={false} onChange={e => setTitle(e.target.value)} value={title} type="text" className={`w-[85%] h-8 ${fredoka.className} text-xl bg-transparent focus:outline-none`} />
                : <h2 onClick={() => setIsUpdatingSticky(true)} className={`w-[85%] h-8 truncate ${fredoka.className} text-xl cursor-default`}>{title}</h2>
            }
            {isHoverSticky && <Trash onClick={handleDeleteSticky} size={20} className="absolute top-3 right-2 cursor-pointer" />}
            <textarea onBlur={handleUpdateSticky} placeholder="..." spellCheck={false} onChange={e => setDescription(e.target.value)} value={description} className="w-full h-full bg-transparent resize-none focus:outline-none overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-700 cursor-default" />
        </div>
    )
}
