import { api } from '@/lib/api'

export async function deleteTask(taskId) {
    try {
        await api.delete(`/tasks/${taskId}`)
    } catch (error) {
        console.log(error)
    }
}
