import { useContext, useEffect, useRef, useState } from 'react'
import { Sticky } from './stickys-content'
import { Trash } from 'phosphor-react'
import { api } from '@/lib/axios'
import { TodoContext } from '@/app/home/page'

interface StickyCardProps {
    sticky: Sticky
    handleGetStickys: () => void
}

export function StickyCard({ sticky, handleGetStickys }: StickyCardProps) {
    const [title, setTitle] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [isUpdatingSticky, setIsUpdatingSticky] = useState<boolean>(false)
    const [isHoverSticky, setIsHoverSticky] = useState<boolean>(false)

    const context = useContext(TodoContext)

    if (!context) {
        return
    }
    
    const { user } = context
    const inputTitleRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        setTitle(sticky.title)
        setDescription(sticky.description)
    }, [sticky])

    useEffect(() => {
        if (inputTitleRef.current) {
            inputTitleRef.current.focus()
        }
    }, [isUpdatingSticky])

    async function handleUpdateSticky() {
        if (title.length > 0) {
            await api.put(`/stickys/${sticky.id}`, {
                title,
                description: description.length > 0 ? description : '...'
            }).then(() => {
                handleGetStickys()
            })
        } else {
            setTitle(sticky.title)
        }

        setIsUpdatingSticky(false)
    }

    async function handleDeleteSticky() {
        try {
            await api.delete(`/stickys/${sticky.id}`).then(() => {
                handleGetStickys()
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div onMouseEnter={ () => setIsHoverSticky(true) } onMouseLeave={ () => setIsHoverSticky(false) } style={{ backgroundColor: user.isStickysColored ? sticky.color : "#d1ee26" }} className="w-full h-full rounded relative p-2 flex flex-col gap-1 group text-black">
            {
                isUpdatingSticky ?
                <input spellCheck={ false } onBlur={ handleUpdateSticky } placeholder="Sticky title" ref={ inputTitleRef } type="text" onChange={ e => setTitle(e.target.value) } value={ title } className="w-[85%] h-8 text-xl focus:outline-none font-semibold bg-transparent" />
                : <h2 onClick={ () => setIsUpdatingSticky(true) } className="w-[85%] h-8 text-xl cursor-default truncate font-semibold">{ title }</h2>
            }
            { isHoverSticky && <Trash onClick={ handleDeleteSticky } size={ 20 } className="absolute top-3 right-2 cursor-pointer" /> }
            <textarea spellCheck={ false } onBlur={ handleUpdateSticky } placeholder="..." onChange={ e => setDescription(e.target.value)} value={ description } className="w-full h-full resize-none focus:outline-none cursor-default overflow-auto bg-transparent" />
        </div>
    )
}
