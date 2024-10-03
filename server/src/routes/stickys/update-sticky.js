import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'

export async function updateSticky(app) {
    app.withTypeProvider().put('/stickys/:stickyId', {
        schema: {
            params: z.object({
                stickyId: z.string().uuid()
            }),
            body: z.object({
                title: z.string(),
                description: z.string()
            })
        }
    }, async (request) => {
        const { stickyId } = request.params
        const { title, description } = request.body

        const sticky = await prisma.sticky.findUnique({
            where: {
                id: stickyId
            }
        })

        if (!sticky) {
            throw new Error('Sticky not found.')
        }

        await prisma.sticky.update({
            where: {
                id: stickyId
            },
            data: {
                title,
                description
            }
        })
    })
}
