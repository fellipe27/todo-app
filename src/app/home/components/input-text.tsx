import { ReactNode, useRef, useState } from 'react'

interface InputTextProps {
    children: ReactNode
    placeholder: string
    handleKeyDownAction: (text: string) => void
}

export function InputText({ children, placeholder, handleKeyDownAction }: InputTextProps) {
    const [typedText, setTypedText] = useState<string>('')
    const inputRef = useRef<HTMLInputElement>(null)

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key == 'Enter' && typedText.length > 0) {
            handleKeyDownAction(typedText)
            setTypedText('')

            if (inputRef.current) {
                inputRef.current.value = ''
            }
        }
    }

    return (
        <div className="w-full flex items-center gap-2 p-1 rounded-md border border-zinc-500">
            <div onClick={ () => inputRef.current?.focus() }>{ children }</div>
            <input spellCheck={ false } ref={ inputRef } value={ typedText } placeholder={ placeholder } onKeyDown={ e => handleKeyDown(e) } onChange={ e => setTypedText(e.target.value) } className="h-full flex-1 bg-transparent focus:outline-none" />
        </div>
    )
}
