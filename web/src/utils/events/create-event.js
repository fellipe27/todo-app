import { api } from '@/lib/api'

export async function createEvent(userId, title, date) {
    try {
        const response = await api.post(`/users/${userId}/events`, {
            title,
            date
        })

        return response.data
    } catch (error) {
        console.log(error)
    }
}
