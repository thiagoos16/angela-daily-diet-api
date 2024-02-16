import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { knex } from '../database'
import { z } from "zod"
import { randomUUID } from "crypto"
import { checkSessionIdExists } from "../middlewares/check-session-id-exists"

export async function mealsRoutes(app: FastifyInstance) {
    app.post(
        '/', 
        {
            preHandler: [checkSessionIdExists]
        },
        async (request: FastifyRequest, reply: FastifyReply) => {
            try {
                let sessionId = request.cookies.sessionId

                const userId = await knex('users')
                                        .where('session_id', sessionId)
                                        .select('id')
                
                const createMealBodySchema = z.object({
                    name: z.string(),
                    description: z.string(),
                    meal_datetime: z.string(),
                    in_diet: z.boolean(),
                    user_id: z.string(),
                })

                request.body.user_id = userId[0].id

                const { name, description, meal_datetime, in_diet, user_id } = createMealBodySchema.parse(
                    request.body
                )

                await knex('meals').insert({
                    id: randomUUID(),
                    name, 
                    description,
                    meal_datetime, 
                    in_diet,
                    user_id
                })

                reply.send({
                    success: true,
                    message: 'Meal created successfully'
                })
            } catch (error: any) {
                console.log(error)
                reply.status(400).send({
                    success: false,
                    message: 'Invalid request body',
                    error: error.message
                })
            }
	})

    app.get(
        '/', 
        {
            preHandler: [checkSessionIdExists]
        }, 
        async (request: FastifyRequest, reply: FastifyReply) => {
            let sessionId = request.cookies.sessionId

            const userId = await knex('users')
                                    .where('session_id', sessionId)
                                    .select('id')
        
        
            const meals = await knex('meals')
                                    .where('user_id', userId[0].id)
                                    .select()

            return { meals }
	})
}