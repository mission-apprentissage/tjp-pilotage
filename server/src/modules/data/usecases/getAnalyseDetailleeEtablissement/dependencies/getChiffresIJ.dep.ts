import { expressionBuilder, sql } from "kysely";
import { CURRENT_IJ_MILLESIME } from "shared";
import type {VoieType} from 'shared/enum/voieEnum';

import type { DB } from "@/db/db";
import { hasContinuum } from "@/modules/data/utils/hasContinuum";
import { selectTauxDevenirFavorable } from "@/modules/data/utils/tauxDevenirFavorable";
import { selectTauxInsertion6mois, withInsertionReg } from "@/modules/data/utils/tauxInsertion6mois";
import { selectTauxPoursuite, withPoursuiteReg } from "@/modules/data/utils/tauxPoursuite";
import { cleanNull } from "@/utils/noNull";

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
    .innerJoin("indicateurSortie", "indicateurSortie.formationEtablissementId", "formationEtablissement.id")
    .select((eb) => [
      sql<string>`CONCAT(
        ${eb.ref("formationEtablissement.uai")},
        ${eb.ref("formationEtablissement.cfd")},
        COALESCE(${eb.ref("formationEtablissement.codeDispositif")},''),
        ${eb.ref("formationEtablissement.voie")}
      )`.as("offre"),
      "millesimeSortie",
      "formationEtablissement.voie",
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
      "formationEtablissement.cfd",
      "formationEtablissement.codeDispositif",
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
      if (codeNiveauDiplome?.length) return q.where("formationView.codeNiveauDiplome", "in", codeNiveauDiplome);
      return q;
    })
    .groupBy([
      "formationEtablissement.uai",
      "formationEtablissement.cfd",
      "formationEtablissement.codeDispositif",
      "formationEtablissement.cfd",
      "formationEtablissement.voie",
      "millesimeSortie",
      "nbPoursuiteEtudes",
      "nbInsertion6mois",
      "effectifSortie",
      "nbSortants",
    ])
    .$narrowType<{ voie: VoieType }>()
    .execute()
    .then(cleanNull);
};
