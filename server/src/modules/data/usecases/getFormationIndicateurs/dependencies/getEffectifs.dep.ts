import { sql } from "kysely";

import { getKbdClient } from "@/db/db";

import { getFormationMailleEtab } from "./getFormationMailleEtab.dep";

export const getEffectifs = async ({
  cfd,
  codeRegion,
  codeDepartement,
  codeAcademie,
}: {
  cfd: string;
  codeRegion?: string;
  codeAcademie?: string;
  codeDepartement?: string;
}) =>
  getKbdClient()
    .with("maille_etab", () => getFormationMailleEtab({ codeRegion, codeAcademie, codeDepartement }))
    .selectFrom("maille_etab")
    .innerJoin("indicateurEntree", "indicateurEntree.formationEtablissementId", "maille_etab.id")
    .where("voie", "=", "scolaire")
    .where("cfd", "=", cfd)
    .groupBy(["rentreeScolaire", "libelleFormation"])
    .select((eb) => [
      eb.ref("rentreeScolaire").as("rentreeScolaire"),
      sql<number>`sum(coalesce((effectifs->>${eb.ref("anneeDebut")})::integer,0))`.as("effectif"),
    ])
    .execute();
