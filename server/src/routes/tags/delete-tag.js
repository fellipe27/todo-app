import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'

export async function deleteTag(app) {
    app.withTypeProvider().delete('/tags/:tagId', {
        schema: {
            params: z.object({
                tagId: z.string().uuid()
            })
        }
    }, async (request) => {
        const { tagId } = request.params

        const tag = await prisma.tag.findUnique({
            where: {
                id: tagId
            }
        })

        if (!tag) {
            throw new Error('Tag not found.')
        }

        await prisma.tag.delete({
            where: {
                id: tagId
            }
        })
    })
}
