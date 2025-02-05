import { expressionBuilder, sql } from "kysely";
import { FIRST_ANNEE_CAMPAGNE } from "shared";

import type { DB } from "@/db/db";

import { isInPerimetreIJDataEtablissement } from "./isInPerimetreIJ";

export const effectifTauxTransformationCumule = ({
  codeRegion,
  codeNiveauDiplome,
}: {
  codeRegion?: string;
  codeNiveauDiplome?: string;
}) => {
  return expressionBuilder<DB, keyof DB>()
    .selectFrom("constatRentree")
    .leftJoin("dataEtablissement", "dataEtablissement.uai", "constatRentree.uai")
    .leftJoin("dataFormation", "dataFormation.cfd", "constatRentree.cfd")
    .where(wb => wb
      .case()
      .when("dataFormation.typeFamille", "in", ["specialite", "option"])
      .then(wb("constatRentree.anneeDispositif", "=", 2))
      .when("dataFormation.typeFamille", "in", ["2nde_commune", "1ere_commune"])
      .then(false)
      .else(wb("constatRentree.anneeDispositif", "=", 1))
      .end())
    .where(isInPerimetreIJDataEtablissement)
    .where("constatRentree.rentreeScolaire", "=", FIRST_ANNEE_CAMPAGNE)
    .$if(!!codeRegion, (qb) => qb.where("dataEtablissement.codeRegion", "=", codeRegion!))
    .$if(!!codeNiveauDiplome, (qb) => qb.where(wb => sql<string>`LEFT(${wb.ref("constatRentree.cfd")}, 3)`, "=", codeNiveauDiplome!))
    .select(sb => [
      sb.ref("dataEtablissement.codeRegion").as("codeRegion"),
      sb.fn.sum("constatRentree.effectif").as("effectif")
    ])
    .groupBy(["dataEtablissement.codeRegion"]);
};
