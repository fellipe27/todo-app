import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'

export async function updateEvent(app) {
    app.withTypeProvider().put('/events/:eventId', {
        schema: {
            params: z.object({
                eventId: z.string().uuid()
            }),
            body: z.object({
                title: z.string(),
                date: z.coerce.date()
            })
        }
    }, async (request) => {
        const { eventId } = request.params
        const { title, date } = request.body

        const event = await prisma.event.findUnique({
            where: {
                id: eventId
            }
        })

        if (!event) {
            throw new Error('Event not found.')
        }

        await prisma.event.update({
            where: {
                id: eventId
            },
            data: {
                title, 
                date
            }
        })
    })
}
