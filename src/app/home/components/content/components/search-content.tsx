import { BookmarkSimple, CalendarBlank, Check, List, MagnifyingGlass, Sticker } from 'phosphor-react'
import { InputText } from '../../input-text'
import { useEffect, useState } from 'react'
import { List as ListInterface } from '../../sidebar/components/lists-section'
import { Sticky } from './stickys-content'
import { Tag } from '../../sidebar/components/tags-section'
import { Event } from './calendar-content'
import { Task } from './list-content'
import { api } from '@/lib/axios'
import { ItemsCards } from './items-cards'

interface SearchContentProps {
    text: string
}

export interface Items {
    lists: ListInterface[]
    stickys: Sticky[]
    tags: Tag[]
    events: Event[]
    tasks: Task[]
}

export function SearchContent({ text }: SearchContentProps) {
    const [searchedText, setSearchedText] = useState<string>('')
    const [searchedItems, setSearchedItems] = useState<Items>({
        lists: [],
        stickys: [],
        tags: [],
        events: [],
        tasks: []
    })

    useEffect(() => {
        handleSearch(text)
    }, [text])

    async function handleSearch(text: string) {
        setSearchedText(text)

        await api.get<{ items: Items }>(`/users/items/${text}`).then(response => {
            setSearchedItems(response.data.items)
        })
    }

    return (
        <section className="w-full h-full flex flex-col gap-3">
            <header className="w-full flex items-center gap-3">
                <MagnifyingGlass weight="bold" size={ 30 } />
                <h1 className="text-3xl font-bold">Search item</h1>
            </header>
            <InputText placeholder="Do a search" handleKeyDownAction={ handleSearch }>
                <MagnifyingGlass weight="bold" size={ 16 } />
            </InputText>
            <span className="text-sm">Search for <span className="font-semibold">{ searchedText }</span></span>
            <div className="w-full h-full flex flex-col gap-4 overflow-auto">
                <ItemsCards sectionTitle="LISTS" item={ searchedItems.lists }>
                    <List weight="bold" size={ 20 } />
                </ItemsCards>
                <ItemsCards sectionTitle="TASKS" item={ searchedItems.tasks }>
                    <Check weight="bold" size={ 20 } />
                </ItemsCards>
                <ItemsCards sectionTitle="STICKYS" item={ searchedItems.stickys }>
                    <Sticker weight="bold" size={ 20 } />
                </ItemsCards>
                <ItemsCards sectionTitle="TAGS" item={ searchedItems.tags }>
                    <BookmarkSimple weight="bold" size={ 20 } />
                </ItemsCards>
                <ItemsCards sectionTitle="EVENTS" item={ searchedItems.events }>
                    <CalendarBlank weight="bold" size={ 20 } />
                </ItemsCards>
            </div>
        </section>
    )
}
