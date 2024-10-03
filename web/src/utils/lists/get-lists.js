import { api } from '@/lib/api'

export async function getLists(userId) {
    try {
        const response = await api.get(`/users/${userId}/lists`)

        return response.data
    } catch (error) {
        console.log(error)
    }
}