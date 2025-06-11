
import { getKbdClient } from "@/db/db";

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
  getKbdClient()
    .with("maille_etab", () => getFormationMailleEtab({ codeRegion, codeAcademie, codeDepartement }))
    .selectFrom("maille_etab")
    .innerJoin("indicateurEntree", "indicateurEntree.formationEtablissementId", "maille_etab.id")
    .where("cfd", "=", cfd)
    .select((eb) => [
      eb.ref("rentreeScolaire").as("rentreeScolaire"),
      eb.ref("maille_etab.uai").as("uai"),
      eb.ref("maille_etab.voie").as("voie")
    ])
    .execute();
