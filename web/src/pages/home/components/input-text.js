import { useEffect, useRef, useState } from 'react'

export function InputText({ children, placeholder, handleKeyDownAction }) {
    const [typedText, setTypedText] = useState()

    const inputRef = useRef()

    function handleKeyDown(e) {
        if (e.key == 'Enter' && typedText?.length > 0) {
            handleKeyDownAction(typedText)
            setTypedText('')
            inputRef.current.value = ''
        }
    }

    return (
        <div className="w-full flex items-center gap-2 p-1 border border-zinc-500 rounded-md">
            <div onClick={() => inputRef.current.focus()}>{children}</div>
            <input spellCheck={false} value={typedText} onKeyDown={e => handleKeyDown(e)} onChange={e => setTypedText(e.target.value)} ref={inputRef} placeholder={placeholder} type="text" className="h-full flex-1 bg-transparent focus:outline-none" />
        </div>
    )
}
