import { kdb } from "../../../../../db/db";

export interface Filters {
  cfd: string;
}

export const getFormation = async ({ cfd }: Filters) =>
  await kdb
    .selectFrom("formationView")
    .selectAll()
    .where("cfd", "=", cfd)
    .executeTakeFirstOrThrow();
