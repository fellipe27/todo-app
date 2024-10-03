import { api } from '@/lib/api'

export async function createSticky(userId, title, description) {
    try {
        await api.post(`/users/${userId}/stickys`, {
            title,
            description
        })
    } catch (error) {
        console.log(error)
    }
}
