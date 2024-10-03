import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'

export async function deleteSticky(app) {
    app.withTypeProvider().delete('/stickys/:stickyId', {
        schema: {
            params: z.object({
                stickyId: z.string().uuid()
            })
        }
    }, async (request) => {
        const { stickyId } = request.params

        const sticky = await prisma.sticky.findUnique({
            where: {
                id: stickyId
            }
        })

        if (!sticky) {
            throw new Error('Sticky not found.')
        }

        await prisma.sticky.delete({
            where: {
                id: stickyId
            }
        })
    })
}
