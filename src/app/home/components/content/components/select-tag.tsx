import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { Plus } from 'phosphor-react'
import { useEffect, useState } from 'react'
import { Tag } from '../../sidebar/components/tags-section'
import { api } from '@/lib/axios'

interface SelectTagProps {
    selectedTags: Tag[]
    setSelectedTags: (tags: Tag[]) => void
}

export function SelectTag({ selectedTags, setSelectedTags }: SelectTagProps) {
    const [tags, setTags] = useState<Tag[]>([])

    useEffect(() => {
        handleGetTags()
    }, [selectedTags])

    async function handleGetTags() {
        try {
            await api.get<{ tags: Tag[] }>('/tags').then(response => {
                setTags(response.data.tags)
            })
        } catch (error) {
            console.log(error)
        }
    }

    function selectTag(tag: Tag) {
        if (selectedTags.find(selectedTag => tag.id == selectedTag.id)) {
            setSelectedTags(selectedTags.filter(selectedTag => selectedTag.id != tag.id))
        } else {
            setSelectedTags([...selectedTags, tag])
        }
    }

    return (
        <Popover className="w-full relative flex items-center">
            <PopoverPanel className="w-[80%] h-24 z-50 p-2 flex flex-wrap gap-1 absolute inset-0 left-1/2 top-0 -translate-x-1/2 shadow-lg rounded overflow-auto bg-white">
                {
                    tags.length > 0 && tags.length != selectedTags.length ?
                    tags.map(tag => {
                        if (!selectedTags.find(selectTag => selectTag.id == tag.id)) {
                            return (
                                <div key={ tag.id } onClick={ () => selectTag(tag) } style={{ backgroundColor: tag.color }} className="w-[calc(50%-2px)] h-8 rounded flex items-center justify-center cursor-pointer">
                                    <span className="max-w-[90%] truncate text-white">{ tag.title }</span>
                                </div>
                            )
                        }
                    })
                    : <span className="mx-auto text-sm">You don't have any tag</span>
                }
            </PopoverPanel>
            <span className="w-16 font-semibold">Tags</span>
            <div className="w-full max-h-10 flex flex-1 flex-wrap items-center gap-1 overflow-auto">
                <PopoverButton className="w-[72px] h-7 text-xs flex items-center justify-center gap-1 rounded cursor-pointer focus:outline-none bg-zinc-500">
                    <Plus />
                    <span className="max-w-20 truncate">Add tag</span>
                </PopoverButton>
                {
                    selectedTags.map(selectedTag => {
                        return (
                            <div key={ selectedTag.id } title={ selectedTag.title } onClick={ () => selectTag(selectedTag) } style={{ backgroundColor: selectedTag.color }} className="w-[72px] h-7 rounded flex items-center justify-center cursor-pointer">
                                <span className="max-w-[90%] truncate text-white">{ selectedTag.title }</span>
                            </div>
                        )
                    })
                }
            </div>
        </Popover>
    )
}
