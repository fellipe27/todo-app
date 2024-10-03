import { api } from '@/lib/api'

export async function getUserItems(userId, text) {
    try {
        const response = await api.get(`/users/${userId}/search/${text}`)

        return response.data
    } catch (error) {
        console.log(error)
    }
}
