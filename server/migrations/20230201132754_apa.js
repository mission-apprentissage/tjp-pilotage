export function up(knex) {
  return knex.schema.createTable("newtable", function (table) {
    table.increments("id");
    table.string("first_name", 255).notNullable();
    table.string("last_name", 255).notNullable();
  });
}

export async function down(knex) {}
