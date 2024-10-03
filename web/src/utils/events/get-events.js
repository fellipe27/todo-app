import { api } from '@/lib/api'

export async function getEvents(userId) {
    try {
        const response = await api.get(`/users/${userId}/events`)

        return response.data
    } catch (error) {
        console.log(error)
    }
}
