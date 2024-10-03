import { api } from '@/lib/api'

export async function getTags(userId) {
    try {
        const response = await api.get(`/users/${userId}/tags`)

        return response.data
    } catch (error) {
        console.log(error)
    }
}
