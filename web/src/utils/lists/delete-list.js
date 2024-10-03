import { api } from '@/lib/api'

export async function deleteList(listId) {
    try {
        await api.delete(`/lists/${listId}`)
    } catch (error) {
        console.log(error)
    }
}
