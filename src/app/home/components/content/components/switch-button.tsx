import { useEffect } from 'react'

interface SwitchButtonProps {
    option: boolean
    setOption: (option: boolean) => void
    handleAction: () => void
}

export function SwitchButton({ option, setOption, handleAction }: SwitchButtonProps) {
    useEffect(() => {
        handleAction()
    }, [option])

    return (
        <div onClick={ () => setOption(!option) } className={`w-14 h-7 border rounded-3xl p-1 flex items-center cursor-pointer border-zinc-500 ${option ? "justify-end bg-white" : "justify-start bg-zinc-400"}`}>
            <div className={`w-6 h-6 rounded-full ${option ? "bg-blue-500" : "bg-white"}`} />
        </div>
    )
}
