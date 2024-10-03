import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'

export async function updateUserSettings(app) {
    app.withTypeProvider().put('/users/:userId', {
        schema: {
            params: z.object({
                userId: z.string().uuid()
            }),
            body: z.object({
                isDarkMode: z.boolean(),
                isStickysColored: z.boolean()
            })
        }
    }, async (request) => {
        const { userId } = request.params
        const { isDarkMode, isStickysColored } = request.body

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!user) {
            throw new Error('User not found.')
        }

        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                isDarkMode,
                isStickysColored
            }
        })
    })
}
