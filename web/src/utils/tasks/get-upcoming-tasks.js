import { api } from '@/lib/api'

export async function getUpcomingTasks(userId) {
    try {
        const response = await api.get(`/users/${userId}/tasks`)

        return response.data
    } catch (error) {
        console.log(error)
    }
}
