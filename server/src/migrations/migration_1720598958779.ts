import type { Kysely } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .createTable("intentionAccessLog")
    .addColumn("id", "uuid", (c) => c.primaryKey().defaultTo(db.fn("uuid_generate_v4")))
    .addColumn("intentionNumero", "varchar")
    .addColumn("userId", "uuid")
    .addColumn("updatedAt", "timestamp")
    .execute();

  await db.schema
    .alterTable("intentionAccessLog")
    .addUniqueConstraint("intentionAccessLog_unique", ["intentionNumero", "userId"])
    .execute();

  await db.schema
    .alterTable("intentionAccessLog")
    .addForeignKeyConstraint("fk_intentionAccessLog_user", ["userId"], "user", ["id"])
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema.dropTable("intentionAccessLog").execute();
};
