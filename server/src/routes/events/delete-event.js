import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'

export async function deleteEvent(app) {
    app.withTypeProvider().delete('/events/:eventId', {
        schema: {
            params: z.object({
                eventId: z.string().uuid()
            })
        }
    }, async (request) => {
        const { eventId } = request.params

        const event = await prisma.event.findUnique({
            where: {
                id: eventId
            }
        })

        if (!event) {
            throw new Error('Event not found.')
        }

        await prisma.event.delete({
            where: {
                id: eventId
            }
        })
    })
}
