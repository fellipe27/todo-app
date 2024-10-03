import { useEffect } from 'react'

export function SwitchButton({ option, setOption, handleAction }) {
    useEffect(() => {
        handleAction()
    }, [option])

    return (
        <div onClick={() => setOption(!option)} className={`w-14 h-7 border border-zinc-500 rounded-3xl p-1 flex items-center ${option ? "justify-end bg-white" : "justify-start bg-zinc-400"} cursor-pointer`}>
            <div className={`w-6 h-6 rounded-full ${option ? "bg-blue-500" : "bg-white"}`} />
        </div>
    )
}
