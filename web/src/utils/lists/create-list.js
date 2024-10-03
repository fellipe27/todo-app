import { api } from '@/lib/api'

export async function createList(userId, title) {
    try {
        const response = await api.post(`/users/${userId}/lists`, {
            title
        })

        return response.data
    } catch (error) {
        console.log(error)
    }
}
