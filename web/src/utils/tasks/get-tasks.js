import { api } from '@/lib/api'

export async function getTasks(listId) {
    try {
        const response = await api.get(`/lists/${listId}/tasks`)

        return response.data
    } catch (error) {
        console.log(error)
    }
}
