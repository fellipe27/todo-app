import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'

export async function deleteList(app) {
    app.withTypeProvider().delete('/lists/:listId', {
        schema: {
            params: z.object({
                listId: z.string().uuid()
            })
        }
    }, async (request) => {
        const { listId } = request.params

        const list = await prisma.list.findUnique({
            where: {
                id: listId
            }
        })

        if (!list) {
            throw new Error('List not found.')
        }

        await prisma.list.delete({
            where: {
                id: listId
            }
        })
    })
}
