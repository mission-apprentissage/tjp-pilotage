import { kdb } from "../../../../../db/db";

export const getEtablissement = ({ uai }: { uai: string }) =>
  kdb
    .selectFrom("etablissement")
    .where("uai", "=", uai)
    .select("id")
    .executeTakeFirst();
