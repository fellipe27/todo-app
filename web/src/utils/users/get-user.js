import { api } from '@/lib/api'

export async function getUser(userId) {
    try {
        const response = await api.get(`/users/${userId}`)

        return response.data
    } catch (error) {
        console.log(error)
    }
}
