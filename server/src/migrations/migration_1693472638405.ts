/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Kysely } from "kysely";

export const up = async (db: Kysely<any>) => {
  await db.schema
    .alterTable("indicateurRegionSortie")
    .alterColumn("codeRegion", (c) => c.setNotNull())
    .alterColumn("dispositifId", (c) => c.setNotNull())
    .alterColumn("cfd", (c) => c.setNotNull())
    .alterColumn("millesimeSortie", (c) => c.setNotNull())
    .alterColumn("voie", (c) => c.setNotNull())
    .execute();
};

export const down = async () => {};
