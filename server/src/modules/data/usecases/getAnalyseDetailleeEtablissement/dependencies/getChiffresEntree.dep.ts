import { expressionBuilder, sql } from "kysely";
import { CURRENT_RENTREE } from "shared";

import { DB } from "../../../../../db/db";
import { cleanNull } from "../../../../../utils/noNull";
import { getRentreeScolaire } from "../../../services/getRentreeScolaire";
import { capaciteAnnee } from "../../../utils/capaciteAnnee";
import { effectifAnnee } from "../../../utils/effectifAnnee";
import { premiersVoeuxAnnee } from "../../../utils/premiersVoeuxAnnee";
import {
  selectTauxPression,
  withTauxPressionDep,
  withTauxPressionNat,
  withTauxPressionReg,
} from "../../../utils/tauxPression";
import { selectTauxRemplissage } from "../../../utils/tauxRemplissage";
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
      join.onRef(
        "ie.formationEtablissementId",
        "=",
        "formationEtablissement.id"
      )
    )
    .where("ie.rentreeScolaire", "in", [
      rentreeScolaire,
      getRentreeScolaire({ rentreeScolaire, offset: -1 }),
      getRentreeScolaire({ rentreeScolaire, offset: -2 }),
    ])
    .select((eb) => [
      sql<string>`CONCAT(
        ${eb.ref("dataEtablissement.uai")},
        ${eb.ref("dataFormation.cfd")},
        COALESCE(${eb.ref("formationEtablissement.dispositifId")},''),
        ${eb.ref("formationEtablissement.voie")}
      )`.as("offre"),
      eb.fn
        .coalesce("ie.rentreeScolaire", sql<string>`${rentreeScolaire}`)
        .as("rentreeScolaire"),
      "voie",
      "uai",
      "dataFormation.cfd",
      "dataFormation.dateOuverture",
      "dispositifId",
      sql<string[]>`COALESCE(${eb.ref("ie.effectifs")}, '[]')`.as("effectifs"),
      premiersVoeuxAnnee({ alias: "ie" }).as("premiersVoeux"),
      capaciteAnnee({ alias: "ie" }).as("capacite"),
      effectifAnnee({ alias: "ie" }).as("effectifEntree"),
      effectifAnnee({ alias: "ie", annee: sql`'0'` }).as("effectifAnnee1"),
      effectifAnnee({ alias: "ie", annee: sql`'1'` }).as("effectifAnnee2"),
      effectifAnnee({ alias: "ie", annee: sql`'2'` }).as("effectifAnnee3"),
      selectTauxPression("ie", "nd", true).as("tauxPression"),
      withTauxPressionNat({
        eb: eb2,
        cfdRef: "dataFormation.cfd",
        codeDispositifRef: "codeDispositif",
        indicateurEntreeAlias: "ie",
        withTauxDemande: true,
      }).as("tauxPressionNational"),
      withTauxPressionReg({
        eb: eb2,
        cfdRef: "dataFormation.cfd",
        codeDispositifRef: "codeDispositif",
        codeRegionRef: "dataEtablissement.codeRegion",
        indicateurEntreeAlias: "ie",
        withTauxDemande: true,
      }).as("tauxPressionRegional"),
      withTauxPressionDep({
        eb: eb2,
        cfdRef: "dataFormation.cfd",
        codeDispositifRef: "codeDispositif",
        codeDepartementRef: "dataEtablissement.codeDepartement",
        indicateurEntreeAlias: "ie",
        withTauxDemande: true,
      }).as("tauxPressionDepartemental"),
      selectTauxRemplissage("ie").as("tauxRemplissage"),
    ])
    .distinct()
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
      "ie.rentreeScolaire",
      "formationEtablissement.voie",
      "formationEtablissement.dispositifId",
      "codeDispositif",
      "dataEtablissement.uai",
      "dataFormation.cfd",
      "nd.codeNiveauDiplome",
      "ie.capacites",
      "ie.anneeDebut",
      "ie.premiersVoeux",
      "ie.effectifs",
    ])
    .execute()
    .then(cleanNull);
};
