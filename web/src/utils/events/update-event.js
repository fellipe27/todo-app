import { api } from '@/lib/api'

export async function updateEvent(eventId, title, date) {
    try {
        await api.put(`/events/${eventId}`, {
            title,
            date
        })
    } catch (error) {
        console.log(error)
    }
}
