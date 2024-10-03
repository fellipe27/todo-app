import { api } from '@/lib/api'

export async function updateTask(taskId, title, description, dueDate, listId, tags) {
    try {
        await api.put(`/tasks/${taskId}`, {
            title,
            description,
            dueDate,
            listId,
            tags
        })
    } catch (error) {
        console.log(error)
    }
}
