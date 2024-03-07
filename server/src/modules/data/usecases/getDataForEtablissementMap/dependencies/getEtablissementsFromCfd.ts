import { kdb } from "../../../../../db/db";

export interface Filters {
  cfd: string;
}

export const getEtablissementsFromCfd = async ({ cfd }: Filters) =>
  await kdb
    .selectFrom("etablissement")
    .leftJoin(
      "formationEtablissement",
      "formationEtablissement.UAI",
      "etablissement.UAI"
    )
    .selectAll("etablissement")
    .where("formationEtablissement.cfd", "=", cfd)
    .execute();
