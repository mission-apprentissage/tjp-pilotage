import type { Kysely } from "kysely";
import { sql } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.executeQuery(
    sql`
      UPDATE "user" set "role" = 'invite' WHERE "role" = 'expert_region' and "codeRegion" not in ('84', '76');
    `.compile(db),
  );
};

export const down = async (db: Kysely<unknown>) => {
  await db.executeQuery(
    sql`
      UPDATE "user" set "role" = 'expert_region' WHERE "role" = 'invite' and "codeRegion" not in ('84', '76');
    `.compile(db),
  );
};
