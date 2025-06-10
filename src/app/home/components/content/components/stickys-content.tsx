import { api } from '@/lib/axios'
import { Plus } from 'phosphor-react'
import { useEffect, useState } from 'react'
import { StickyCard } from './sticky-card'

export interface Sticky {
    id: string
    title: string
    description: string
    color: string
}

export function StickysContent() {
    const [stickys, setStickys] = useState<Sticky[]>([])

    useEffect(() => {
        handleGetStickys()
    }, [])

    async function handleGetStickys() {
        try {
            await api.get<{ stickys: Sticky[] }>('/stickys').then(response => {
                setStickys(response.data.stickys)
            })
        } catch (error) {
            console.log(error)
        }
    }

    async function handleCreateSticky() {
        try {
            await api.post('/stickys').then(() => {
                handleGetStickys()
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <section className="w-full h-full flex flex-col flex-1 gap-2">
            <h1 className="text-3xl font-bold">Sticky wall</h1>
            <div className="w-full h-[calc(100%-48px)] rounded border p-2 flex flex-col gap-4 border-zinc-400">
                <div className="w-full h-full grid grid-cols-3 gap-4 mx-auto overflow-auto">
                    {
                        stickys.map(sticky => (
                            <div key={sticky.id} className="aspect-square">
                                <StickyCard sticky={sticky} handleGetStickys={ handleGetStickys } />
                            </div>
                        ))
                    }
                    <div onClick={handleCreateSticky} className="aspect-square mb-2 rounded cursor-pointer flex items-center justify-center bg-zinc-300">
                        <Plus weight="bold" size={45} className="text-black" />
                    </div>
                </div>
            </div>
        </section>
    )
}
