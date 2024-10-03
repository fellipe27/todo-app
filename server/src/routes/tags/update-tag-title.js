import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'

export async function updateTagTitle(app) {
    app.withTypeProvider().patch('/tags/:tagId', {
        schema: {
            params: z.object({
                tagId: z.string().uuid()
            }),
            body: z.object({
                title: z.string()
            })
        }
    }, async (request) => {
        const { tagId } = request.params
        const { title } = request.body

        const tag = await prisma.tag.findUnique({
            where: {
                id: tagId
            }
        })

        if (!tag) {
            throw new Error('Tag not found.')
        }

        await prisma.tag.update({
            where: {
                id: tagId
            },
            data: {
                title
            }
        })
    })
}
