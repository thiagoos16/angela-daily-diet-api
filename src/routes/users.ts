import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { knex } from '../database'
import { z } from "zod"
import { randomUUID } from "crypto"
import { checkSessionIdExists } from "../middlewares/check-session-id-exists"
import { request } from "http"

export async function usersRoutes(app: FastifyInstance) {
    app.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            let sessionId = request.cookies.sessionId

            if (!sessionId) {
                sessionId = randomUUID()

                reply.setCookie('sessionId', sessionId, {
                    path: '/',
                    maxAge: 60 * 60 * 24 * 7
                })
            }

            const createUserBodySchema = z.object({
                name: z.string(),
                birthday: z.string(),
                height: z.number(),
                weight: z.number()
            })

            const { name, birthday, height, weight } = createUserBodySchema.parse(
                request.body
            )

            await knex('users').insert({
                id: randomUUID(),
                name, 
                birthday,
                height, 
                weight,
                session_id: sessionId
            })

            reply.send({
                success: true,
                message: 'User created successfully'
            })
        } catch (error: any) {
            reply.status(400).send({
                success: false,
                message: 'Invalid request body',
                error: error.message
            })
        }
	})

    app.get(
        '/me', 
        {
            preHandler: [checkSessionIdExists]
        },
        async (request, reply) => {
            const { sessionId } = request.cookies

            const users = await knex('users')
                            .where('session_id', sessionId)
                            .select()

            return { users }
	})
}