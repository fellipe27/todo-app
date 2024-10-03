import { fredoka } from '@/pages/_app'
import { TodoContext } from '@/pages/home'
import { getLists } from '@/utils/lists/get-lists'
import { CaretDown } from 'phosphor-react'
import { useContext, useEffect, useRef, useState } from 'react'

export function SelectList({ selectedList, setSelectedList }) {
    const [isSelectingList, setIsSelectingList] = useState()
    const [lists, setLists] = useState()

    const { user } = useContext(TodoContext)
    const selectListRef = useRef()

    useEffect(() => {
        function handleClickOutside(e) {
            if (!selectListRef.current?.contains(e.target)) {
                setIsSelectingList(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)

        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        handleGetLists(user?.id)
    }, [user])

    async function handleGetLists(userId) {
        await getLists(userId).then(response => {
            setLists(response.lists)
        })
    }

    function handleChangeList(list) {
        setSelectedList(list)
        setIsSelectingList(false)
    }

    return (
        <div className="w-full relative flex items-center">
            <span className={`w-16 ${fredoka.className}`}>List</span>
            <div onClick={() => setIsSelectingList(true)} className="w-28 h-7 cursor-pointer border border-zinc-500 rounded flex items-center justify-between px-1">
                <span className="max-w-20 truncate">{selectedList?.title}</span>
                <CaretDown weight="bold" size={16} />
            </div>
            {
                isSelectingList && (
                    <div ref={selectListRef} className="w-[80%] h-28 z-50 p-2 flex flex-col gap-1 absolute inset-0 left-1/2 top-0 -translate-x-1/2 rounded shadow-lg bg-white overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-700">
                        {
                            lists?.map(list => {
                                return (
                                    <div key={list.id} onClick={() => handleChangeList(list)} className={`w-full p-1 flex items-center gap-3 cursor-pointer rounded hover:bg-zinc-300 ${selectedList?.id == list.id && "bg-zinc-300"}`}>
                                        <div style={{ backgroundColor: list.color }} className="w-4 h-4 rounded" />
                                        <span className="max-w-40 truncate">{list.title}</span>
                                    </div>
                                )
                            })
                        }
                    </div>
                )
            }
            <div style={{ backgroundColor: selectedList?.color }} className="w-5 h-5 ml-2 rounded" />
        </div>
    )
}
