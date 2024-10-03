import { api } from '@/lib/api'

export async function createTag(userId, title) {
    try {
        const response = await api.post(`/users/${userId}/tags`, {
            title
        })

        return response.data
    } catch (error) {
        console.log(error)
    }
}
