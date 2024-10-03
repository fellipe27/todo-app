import { api } from '@/lib/api'

export async function deleteTag(tagId) {
    try {
        await api.delete(`/tags/${tagId}`)
    } catch (error) {
        console.log(error)
    }
}
