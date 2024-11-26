import type { Kysely } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema.alterTable("avis").renameColumn("userId", "createdBy").execute();

  await db.schema
    .alterTable("avis")
    .addColumn("updatedBy", "uuid", (c) => c.references("user.id"))
    .execute();

  await db.schema.alterTable("changementStatut").renameColumn("userId", "createdBy").execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema.alterTable("changementStatut").renameColumn("createdBy", "userId").execute();

  await db.schema.alterTable("avis").dropColumn("updatedBy").execute();

  await db.schema.alterTable("avis").renameColumn("createdBy", "userId").execute();
};
