import { api } from '@/lib/api'

export async function addOrRemoveSubtask(taskId, subtaskId) {
    try {
        await api.post(`/tasks/${taskId}/subtasks/${subtaskId}`)
    } catch (error) {
        console.log(error)
    }
}
