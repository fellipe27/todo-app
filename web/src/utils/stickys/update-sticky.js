import { api } from '@/lib/api'

export async function updateSticky(stickyId, title, description) {
    try {
        await api.put(`/stickys/${stickyId}`, {
            title,
            description
        })
    } catch (error) {
        console.log(error)
    }
}
