import { api } from '@/lib/api'

export async function updateTagTitle(tagId, title) {
    try {
        await api.patch(`/tags/${tagId}`, {
            title
        })
    } catch (error) {
        console.log(error)
    }
}
