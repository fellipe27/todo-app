import { BookmarkSimple, CalendarBlank, Check, List, MagnifyingGlass, Sticker } from 'phosphor-react'
import { InputText } from '../../../input-text'
import { fredoka } from '@/pages/_app'
import { useContext, useEffect, useState } from 'react'
import { getUserItems } from '@/utils/users/get-user-items'
import { TodoContext } from '@/pages/home'
import { ItemsContent } from './items-content'

export function SearchContent({ text }) {
    const [searchedText, setSearchedText] = useState()
    const [searchedItems, setSearchedItems] = useState()

    const { user } = useContext(TodoContext)

    useEffect(() => {
        if (text) {
            handleSearch(text)
        }
    }, [text])

    async function handleSearch(text) {
        setSearchedText(text)

        await getUserItems(user?.id, text).then(response => {
            setSearchedItems(response.result)
        })
    }

    return (
        <section className="w-full h-full flex flex-col gap-3">
            <header className="w-full flex items-center gap-3">
                <MagnifyingGlass weight="bold" size={30} />
                <h1 className={`${fredoka.className} text-3xl`}>Search item</h1>
            </header>
            <InputText placeholder="Do a search" handleKeyDownAction={handleSearch}>
                <MagnifyingGlass weight="bold" size={16} />
            </InputText>
            <span className="text-sm">Search for "<span className={`${fredoka.className}`}>{searchedText}</span>"</span>
            <main className="w-full h-full flex flex-col gap-4 overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-700">
                {searchedItems?.lists && <ItemsContent sectionTitle="LISTS" items={searchedItems.lists} icon={<List weight="bold" size={20} />} />}
                {searchedItems?.tasks && <ItemsContent sectionTitle="TASKS" items={searchedItems.tasks} icon={<Check weight="bold" size={20} />} />}
                {searchedItems?.stickys && <ItemsContent sectionTitle="STICKYS" items={searchedItems.stickys} icon={<Sticker weight="bold" size={20} />} />}
                {searchedItems?.tags && <ItemsContent sectionTitle="TAGS" items={searchedItems.tags} icon={<BookmarkSimple weight="bold" size={20} />} />}
                {searchedItems?.events && <ItemsContent sectionTitle="EVENTS" items={searchedItems.events} icon={<CalendarBlank weight="bold" size={20} />} />}
            </main>
        </section>
    )
}
