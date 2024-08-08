import { kdb } from "../../../../../db/db";

export interface Filters {
  uai: string;
}

export const getEtablissementCfds = async ({ uai }: Filters) =>
  await kdb
    .selectFrom("formationEtablissement")
    .select("cfd")
    .distinct()
    .where("uai", "=", uai)
    .execute();
