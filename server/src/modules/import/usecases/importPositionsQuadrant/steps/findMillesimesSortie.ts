import { kdb } from "../../../../../db/db";

export const findMillesimesSortie = async () =>
  await kdb
    .selectFrom("indicateurSortie")
    .distinct()
    .select(["millesimeSortie"])
    .execute();
