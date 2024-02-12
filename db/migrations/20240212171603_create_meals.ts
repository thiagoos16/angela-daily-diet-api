import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('meals', (table) => {
        table.uuid('id').primary()
        table.string('name').notNullable()
        table.text('description').notNullable()
        table.dateTime('meal_datetime').notNullable()
        table.integer('user_id').unsigned().notNullable()
        table.foreign('user_id').references('id').inTable('users')
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('meals')
}

