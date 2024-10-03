import { api } from '@/lib/api'

export async function createTask(listId, title, description, dueDate) {
    try {
        const response = await api.post(`/lists/${listId}/tasks`, {
            title,
            description,
            dueDate
        })

        return response.data
    } catch (error) {
        console.log(error)
    }
}
