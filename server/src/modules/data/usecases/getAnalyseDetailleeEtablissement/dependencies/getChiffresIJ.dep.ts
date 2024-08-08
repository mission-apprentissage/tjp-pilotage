import { expressionBuilder, sql } from "kysely";
import { CURRENT_IJ_MILLESIME } from "shared";

import { DB } from "../../../../../db/db";
import { cleanNull } from "../../../../../utils/noNull";
import { hasContinuum } from "../../../utils/hasContinuum";
import { selectTauxDevenirFavorable } from "../../../utils/tauxDevenirFavorable";
import {
  selectTauxInsertion6mois,
  withInsertionReg,
} from "../../../utils/tauxInsertion6mois";
import {
  selectTauxPoursuite,
  withPoursuiteReg,
} from "../../../utils/tauxPoursuite";
import { getBase } from "./base.dep";

export const getChiffresIj = async ({
  uai,
  codeNiveauDiplome,
  millesimeSortie = CURRENT_IJ_MILLESIME,
}: {
  uai: string;
  codeNiveauDiplome?: string[];
  millesimeSortie?: string;
}) => {
  const eb2 = expressionBuilder<DB, keyof DB>();
  return getBase({ uai })
    .innerJoin(
      "indicateurSortie",
      "indicateurSortie.formationEtablissementId",
      "formationEtablissement.id"
    )
    .select((eb) => [
      sql<string>`CONCAT(
        ${eb.ref("dataEtablissement.uai")},
        ${eb.ref("dataFormation.cfd")},
        COALESCE(${eb.ref("formationEtablissement.codeDispositif")},''),
        ${eb.ref("formationEtablissement.voie")}
      )`.as("offre"),
      "millesimeSortie",
      "voie",
      selectTauxPoursuite("indicateurSortie").as("tauxPoursuite"),
      selectTauxInsertion6mois("indicateurSortie").as("tauxInsertion"),
      selectTauxDevenirFavorable("indicateurSortie").as("tauxDevenirFavorable"),
      withInsertionReg({
        eb: eb2,
        millesimeSortie,
        cfdRef: "formationEtablissement.cfd",
        codeDispositifRef: "formationEtablissement.codeDispositif",
        codeRegionRef: "dataEtablissement.codeRegion",
      }).as("tauxPoursuiteRegional"),
      withPoursuiteReg({
        eb: eb2,
        millesimeSortie,
        cfdRef: "formationEtablissement.cfd",
        codeDispositifRef: "formationEtablissement.codeDispositif",
        codeRegionRef: "dataEtablissement.codeRegion",
      }).as("tauxInsertionRegional"),
      "dataFormation.cfd",
      "codeDispositif",
      "effectifSortie",
      "nbSortants",
      "nbPoursuiteEtudes",
      "nbInsertion6mois",
      hasContinuum({
        eb: eb2,
        millesimeSortie,
        cfdRef: "formationEtablissement.cfd",
        codeDispositifRef: "formationEtablissement.codeDispositif",
        codeRegionRef: "dataEtablissement.codeRegion",
      }).as("continuum"),
    ])
    .$call((q) => {
      if (codeNiveauDiplome?.length)
        return q.where(
          "dataFormation.codeNiveauDiplome",
          "in",
          codeNiveauDiplome
        );
      return q;
    })
    .groupBy([
      "dataEtablissement.uai",
      "dataFormation.cfd",
      "formationEtablissement.codeDispositif",
      "formationEtablissement.cfd",
      "voie",
      "millesimeSortie",
      "nbPoursuiteEtudes",
      "nbInsertion6mois",
      "effectifSortie",
      "nbSortants",
      "codeDispositif",
    ])
    .execute()
    .then(cleanNull);
};
