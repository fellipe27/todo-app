import { api } from '@/lib/api'

export async function deleteSticky(stickyId) {
    try {
        await api.delete(`/stickys/${stickyId}`)
    } catch (error) {
        console.log(error)
    }
}
