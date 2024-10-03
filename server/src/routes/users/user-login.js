import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'

export async function userLogin(app) {
    app.withTypeProvider().post('/users', {
        schema: {
            body: z.object({
                name: z.string(),
                email: z.string().email(),
                picture: z.string().url().nullable()
            }),
            response: {
                200: z.object({
                    userId: z.string().uuid()
                }),
                201: z.object({
                    userId: z.string().uuid()
                })
            }
        }
    }, async (request, reply) => {
        const { name, email, picture } = request.body

        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (!user) {
            const newUser = await prisma.user.create({
                data: {
                    name,
                    email,
                    picture
                }
            })

            return reply.status(201).send({ userId: newUser.id })
        }

        return reply.send({ userId: user.id })
    })
}
