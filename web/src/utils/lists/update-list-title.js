import { api } from '@/lib/api'

export async function updateListTitle(listId, title) {
    try {
        await api.patch(`/lists/${listId}`, {
            title
        })
    } catch (error) {
        console.log(error)
    }
}
