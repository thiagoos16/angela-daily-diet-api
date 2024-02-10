import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { knex } from '../database'
import { z } from "zod"
import { randomUUID } from "crypto"

export async function usersRoutes(app: FastifyInstance) {
    app.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const createUserBodySchema = z.object({
                name: z.string(),
                birthday: z.string(),
                height: z.number(),
                weight: z.number(),
            })

            const { name, birthday, height, weight } = createUserBodySchema.parse(
                request.body
            )

            await knex('users').insert({
                id: randomUUID(),
                name, 
                birthday,
                height, 
                weight
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

    app.get('/', async () => {
		const users = await knex('users').select()

		return { users }
	})
}