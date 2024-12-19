import { expressionBuilder, sql } from "kysely";
import { CURRENT_RENTREE } from "shared";

import type { DB } from "@/db/db";
import { getRentreeScolaire } from "@/modules/data/services/getRentreeScolaire";
import { capaciteAnnee } from "@/modules/data/utils/capaciteAnnee";
import { effectifAnnee } from "@/modules/data/utils/effectifAnnee";
import { premiersVoeuxAnnee } from "@/modules/data/utils/premiersVoeuxAnnee";
import {
  selectTauxPression,
  withTauxPressionDep,
  withTauxPressionNat,
  withTauxPressionReg,
} from "@/modules/data/utils/tauxPression";
import { selectTauxRemplissage } from "@/modules/data/utils/tauxRemplissage";
import { cleanNull } from "@/utils/noNull";

import { getBase } from "./base.dep";
export const getChiffresEntree = async ({
  uai,
  codeNiveauDiplome,
  rentreeScolaire = CURRENT_RENTREE,
}: {
  uai: string;
  codeNiveauDiplome?: string[];
  rentreeScolaire?: string;
}) => {
  const eb2 = expressionBuilder<DB, keyof DB>();

  return getBase({ uai })
    .innerJoin("indicateurEntree as ie", (join) =>
      join.onRef("ie.formationEtablissementId", "=", "formationEtablissement.id")
    )
    .where("ie.rentreeScolaire", "in", [
      rentreeScolaire,
      getRentreeScolaire({ rentreeScolaire, offset: -1 }),
      getRentreeScolaire({ rentreeScolaire, offset: -2 }),
    ])
    .select((eb) => [
      sql<string>`CONCAT(
        ${eb.ref("formationEtablissement.uai")},
        ${eb.ref("formationEtablissement.cfd")},
        COALESCE(${eb.ref("formationEtablissement.codeDispositif")},''),
        ${eb.ref("formationEtablissement.voie")}
      )`.as("offre"),
      eb.fn.coalesce("ie.rentreeScolaire", sql<string>`${rentreeScolaire}`).as("rentreeScolaire"),
      "formationEtablissement.voie",
      "formationEtablissement.uai",
      "formationEtablissement.cfd",
      "formationEtablissement.codeDispositif",
      sql<number>`EXTRACT('year' FROM ${eb.ref("formationView.dateOuverture")})`.as("dateOuverture"),
      sql<string[]>`COALESCE(${eb.ref("ie.effectifs")}, '[]')`.as("effectifs"),
      premiersVoeuxAnnee({ alias: "ie" }).as("premiersVoeux"),
      capaciteAnnee({ alias: "ie" }).as("capacite"),
      effectifAnnee({ alias: "ie" }).as("effectifEntree"),
      effectifAnnee({ alias: "ie", annee: sql`'0'` }).as("effectifAnnee1"),
      effectifAnnee({ alias: "ie", annee: sql`'1'` }).as("effectifAnnee2"),
      effectifAnnee({ alias: "ie", annee: sql`'2'` }).as("effectifAnnee3"),
      selectTauxPression("ie", "niveauDiplome", true).as("tauxPression"),
      withTauxPressionNat({
        eb: eb2,
        cfdRef: "formationEtablissement.cfd",
        codeDispositifRef: "formationEtablissement.codeDispositif",
        indicateurEntreeAlias: "ie",
        withTauxDemande: true,
      }).as("tauxPressionNational"),
      withTauxPressionReg({
        eb: eb2,
        cfdRef: "formationEtablissement.cfd",
        codeDispositifRef: "formationEtablissement.codeDispositif",
        codeRegionRef: "dataEtablissement.codeRegion",
        indicateurEntreeAlias: "ie",
        withTauxDemande: true,
      }).as("tauxPressionRegional"),
      withTauxPressionDep({
        eb: eb2,
        cfdRef: "formationEtablissement.cfd",
        codeDispositifRef: "formationEtablissement.codeDispositif",
        codeDepartementRef: "dataEtablissement.codeDepartement",
        indicateurEntreeAlias: "ie",
        withTauxDemande: true,
      }).as("tauxPressionDepartemental"),
      selectTauxRemplissage("ie").as("tauxRemplissage"),
    ])
    .distinct()
    .$call((q) => {
      if (codeNiveauDiplome?.length) return q.where("formationView.codeNiveauDiplome", "in", codeNiveauDiplome);
      return q;
    })
    .groupBy([
      "ie.rentreeScolaire",
      "formationEtablissement.voie",
      "formationEtablissement.codeDispositif",
      "formationEtablissement.uai",
      "formationEtablissement.cfd",
      "formationView.dateOuverture",
      "niveauDiplome.codeNiveauDiplome",
      "ie.capacites",
      "ie.anneeDebut",
      "ie.premiersVoeux",
      "ie.effectifs",
    ])
    .execute()
    .then(cleanNull);
};
