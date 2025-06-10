import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { CaretDown } from 'phosphor-react'
import { useEffect, useRef, useState } from 'react'
import { List } from '../../sidebar/components/lists-section'
import { api } from '@/lib/axios'

interface SelectListProps {
    listId: string
    setListId: (listId: string) => void
}

export function SelectList({ listId, setListId }: SelectListProps) {
    const [lists, setLists] = useState<List[]>([])

    const popoverButtonRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        handleGetLists()
    }, [listId])

    async function handleGetLists() {
        try {
            await api.get<{ lists: List[] }>('/lists').then(response => {
                setLists(response.data.lists)
            })
        } catch (error) {
            console.log(error)
        }
    }

    function selectList(listId: string) {
        setListId(listId)
        popoverButtonRef.current?.click()
    }

    return (
        <Popover className="w-full relative flex items-center">
            <PopoverPanel className="w-[80%] h-28 z-50 p-2 flex flex-col gap-1 absolute inset-0 left-1/2 top-0 -translate-x-1/2 shadow-lg rounded overflow-auto bg-white">
                {
                    lists.map(list => {
                        return (
                            <div key={ list.id } onClick={ () => selectList(list.id) } className={`w-full p-1 flex items-center gap-3 cursor-pointer rounded hover:bg-zinc-300 ${listId == list.id && "bg-zinc-300"}`}>
                                <div style={{ backgroundColor: list.color }} className="w-5 h-5 rounded" />
                                <span className="max-w-40 truncate">{ list.title }</span>
                            </div>
                        )
                    })
                }
            </PopoverPanel>
            <span className="w-16 font-semibold">List</span>
            <PopoverButton ref={ popoverButtonRef } className="w-28 h-7 border rounded flex items-center justify-between px-1 cursor-pointer focus:outline-none border-zinc-500">
                <span className="max-w-20 truncate">{ lists.find(list => list.id == listId)?.title }</span>
                <CaretDown weight="bold" size={ 16 } />
            </PopoverButton>
            <div style={{ backgroundColor: lists.find(list => list.id == listId)?.color }} className="w-5 h-5 ml-2 rounded" />
        </Popover>
    )
}
