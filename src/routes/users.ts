import { FastifyInstance } from "fastify"
import { knex } from '../database'

export async function usersRoutes(app: FastifyInstance) {
    // app.get('/hello', async () => {
    //     const tables = await knex('sqlite_schema').select('*')
    
    //     return tables
    // })

    app.get('/users',  async () => {
        const users = await knex('users')
                        .where('name', '')
                        .select('*')

        return users
    })
}