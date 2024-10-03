import { api } from '@/lib/api'

export async function deleteEvent(eventId) {
    try {
        await api.delete(`/events/${eventId}`)
    } catch (error) {
        console.log(error)
    }
}