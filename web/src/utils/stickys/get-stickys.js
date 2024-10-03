import { api } from '@/lib/api'

export async function getStickys(userId) {
    try {
        const response = await api.get(`/users/${userId}/stickys`)

        return response.data
    } catch (error) {
        console.log(error)
    }
}
