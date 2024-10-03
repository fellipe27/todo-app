import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'

export async function updateListTitle(app) {
    app.withTypeProvider().patch('/lists/:listId', {
        schema: {
            params: z.object({
                listId: z.string().uuid()
            }),
            body: z.object({
                title: z.string()
            })
        }
    }, async (request) => {
        const { listId } = request.params
        const { title } = request.body

        const list = await prisma.list.findUnique({
            where: {
                id: listId
            }
        })

        if (!list) {
            throw new Error('List not found.')
        }

        await prisma.list.update({
            where: {
                id: listId
            },
            data: {
                title
            }
        })
    })
}
