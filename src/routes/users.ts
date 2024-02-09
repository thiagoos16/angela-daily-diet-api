import { FastifyInstance } from "fastify"
import { knex } from '../database'

export async function usersRoutes(app: FastifyInstance) {
    app.get('/',  async () => {
        const users = await knex('users')
                        .where('name', '')
                        .select('*')

        return users
    })
}