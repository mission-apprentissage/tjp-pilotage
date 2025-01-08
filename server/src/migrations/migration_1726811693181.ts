import type { Kysely } from "kysely";
import { sql } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.executeQuery(
    sql`
    UPDATE "user" SET "email" = LOWER("email");
  `.compile(db),
  );
};

export const down = async () => {};
