import { fredoka } from '@/pages/_app'
import { TodoContext } from '@/pages/home'
import { createSticky } from '@/utils/stickys/create-sticky'
import { getStickys } from '@/utils/stickys/get-stickys'
import { Plus } from 'phosphor-react'
import { useContext, useEffect, useRef, useState } from 'react'
import { StickyCard } from './sticky-card'

export function StickysContent() {
    const [stickys, setStickys] = useState()
    const [stickysSectionWidth, setStickysSectionWidth] = useState()

    const { user, isSidebarOpen } = useContext(TodoContext)
    const stickysSection = useRef()

    useEffect(() => {
        setStickysSectionWidth(Math.floor(stickysSection.current?.offsetWidth / 3.3))
    }, [])

    useEffect(() => {
        handleGetStickys(user?.id)
    }, [user])

    useEffect(() => {
        setStickysSectionWidth(Math.floor(stickysSection.current?.offsetWidth / 3.3))
    }, [isSidebarOpen])

    async function handleGetStickys(userId) {
        await getStickys(userId).then(response => {
            setStickys(response?.stickys)
        })
    }

    async function handleCreateSticky() {
        await createSticky(user?.id, `Sticky ${stickys?.length + 1}`, '...').then(() => {
            handleGetStickys(user?.id)
        })
    }

    return (
        <section className="w-full h-full flex flex-col flex-1 gap-2">
            <h1 className={`${fredoka.className} text-3xl cursor-default`}>Sticky wall</h1>
            <div className="w-full h-full rounded border border-zinc-400 p-2 flex flex-col items-center overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-700">
                <div className="w-[95%] h-full">
                    <div style={{ gap: '3.9%' }} ref={stickysSection} className="w-full flex flex-wrap">
                        {
                            stickys?.map(sticky => {
                                return (
                                    <StickyCard key={sticky.id} sticky={sticky} size={stickysSectionWidth} handleGetStickys={() => handleGetStickys(user?.id)} />
                                )
                            })
                        }
                        <div style={{ width: `${stickysSectionWidth}px`, height: `${stickysSectionWidth}px` }} onClick={handleCreateSticky} className="bg-zinc-300 text-black rounded cursor-pointer flex items-center justify-center">
                            <Plus weight="bold" size={45} />
                        </div>
                    </div>
                    <div className="w-full h-3" />
                </div>
            </div>
        </section>
    )
}
