import { sql } from "kysely";

import { kdb } from "../../../../../db/db";
import { getFormationMailleEtab } from "./getFormationMailleEtab.dep";

export const getEtablissements = async ({
  cfd,
  codeRegion,
  codeAcademie,
  codeDepartement,
}: {
  cfd: string;
  codeRegion?: string;
  codeAcademie?: string;
  codeDepartement?: string;
}) =>
  kdb
    .with("maille_etab", () =>
      getFormationMailleEtab({ codeRegion, codeAcademie, codeDepartement })
    )
    .selectFrom("maille_etab")
    .innerJoin(
      "indicateurEntree",
      "indicateurEntree.formationEtablissementId",
      "maille_etab.id"
    )
    .where("cfd", "=", cfd)
    .groupBy(["rentreeScolaire", "libelleFormation"])
    .select((eb) => [
      eb.ref("rentreeScolaire").as("rentreeScolaire"),
      sql<number>`count(distinct ${eb.ref("uai")})`.as("nbEtablissements"),
    ])
    .execute();
