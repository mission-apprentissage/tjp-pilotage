import { Kysely } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .createTable("requeteEnregistree")
    .addColumn("id", "uuid", (c) => c.defaultTo(db.fn("uuid_generate_v4")))
    .addColumn("userId", "uuid", (c) => c.notNull())
    .addColumn("nom", "varchar(255)", (c) => c.notNull())
    .addColumn("couleur", "varchar(255)", (c) => c.notNull())
    .addColumn("page", "varchar(255)", (c) => c.notNull())
    .addColumn("filtres", "jsonb", (c) => c.notNull())
    .addColumn("createdAt", "timestamp", (c) => c.defaultTo(db.fn("now")))
    .execute();

  await db.schema
    .alterTable("requeteEnregistree")
    .addPrimaryKeyConstraint("requeteEnregistree_pkey", ["id"])
    .execute();

  await db.schema
    .alterTable("requeteEnregistree")
    .addForeignKeyConstraint(
      "requeteEnregistree_userId_fk",
      ["userId"],
      "user",
      ["id"]
    )
    .execute();

  await db.schema
    .alterTable("requeteEnregistree")
    .addUniqueConstraint("requeteEnregistree_unique_constraint", [
      "userId",
      "nom",
      "page",
    ])
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema.dropTable("requeteEnregistree").execute();
};
