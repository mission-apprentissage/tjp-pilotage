import { sql } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";

import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";
import { hasContinuum } from "../utils/hasContinuum";
import { notHistorique } from "../utils/notHistorique";
import { withPositionQuadrant } from "../utils/positionQuadrant";
import { withInsertionReg } from "../utils/tauxInsertion6mois";
import { withPoursuiteReg } from "../utils/tauxPoursuite";
import { selectTauxPression } from "../utils/tauxPression";

export const getEtablissement = async ({
  uai,
  millesimeSortie = "2020_2021",
  rentreeScolaire = "2022",
}: {
  uai: string;
  millesimeSortie?: string;
  rentreeScolaire?: string;
}) => {
  const etablissement = await kdb
    .selectFrom("etablissement")
    .leftJoin("indicateurEtablissement", (join) =>
      join
        .onRef("etablissement.UAI", "=", "indicateurEtablissement.UAI")
        .on("indicateurEtablissement.millesime", "=", millesimeSortie)
    )
    .leftJoin("region", "region.codeRegion", "etablissement.codeRegion")
    .select("etablissement.UAI as uai")
    .$narrowType<{ uai: string }>()
    .select([
      sql<string>`${rentreeScolaire}`.as("rentreeScolaire"),
      "libelleEtablissement",
      "valeurAjoutee",
      "region.libelleRegion",
      "region.codeRegion",
    ])
    .select((eb) =>
      jsonArrayFrom(
        eb
          .selectFrom("formationEtablissement")
          .innerJoin("indicateurEntree", (join) =>
            join
              .onRef(
                "formationEtablissement.id",
                "=",
                "indicateurEntree.formationEtablissementId"
              )
              .on("indicateurEntree.rentreeScolaire", "=", rentreeScolaire)
          )
          .innerJoin(
            "formation",
            "formation.codeFormationDiplome",
            "formationEtablissement.cfd"
          )
          .innerJoin(
            "etablissement as e",
            "e.UAI",
            "formationEtablissement.UAI"
          )
          .leftJoin(
            "niveauDiplome",
            "niveauDiplome.codeNiveauDiplome",
            "formation.codeNiveauDiplome"
          )
          .leftJoin(
            "dispositif",
            "dispositif.codeDispositif",
            "formationEtablissement.dispositifId"
          )
          .select([
            "formation.libelleDiplome",
            "formationEtablissement.cfd",
            "formationEtablissement.dispositifId",
            "libelleDispositif",
            "formation.codeNiveauDiplome",
            "libelleNiveauDiplome",
            "formation.libelleFiliere",
            "formation.CPC",
            "formation.CPCSecteur",
            "formation.CPCSousSecteur",
            sql<number>`NULLIF((jsonb_extract_path("indicateurEntree"."effectifs","indicateurEntree"."anneeDebut"::text)), 'null')::INT
            `.as("effectif"),
            selectTauxPression("indicateurEntree").as("tauxPression"),
          ])
          .select((eb) => [
            (eb) =>
              hasContinuum({
                eb,
                millesimeSortie,
                cfdRef: "formationEtablissement.cfd",
                dispositifIdRef: "formationEtablissement.dispositifId",
                codeRegionRef: "etablissement.codeRegion",
              }).as("continuum"),
            withInsertionReg({
              eb,
              millesimeSortie,
              cfdRef: "formationEtablissement.cfd",
              dispositifIdRef: "formationEtablissement.dispositifId",
              codeRegionRef: "etablissement.codeRegion",
            }).as("tauxInsertion"),
            withPoursuiteReg({
              eb,
              millesimeSortie,
              cfdRef: "formationEtablissement.cfd",
              dispositifIdRef: "formationEtablissement.dispositifId",
              codeRegionRef: "etablissement.codeRegion",
            }).as("tauxPoursuite"),
            withPositionQuadrant({
              eb,
              millesimeSortie,
              cfdRef: "formationEtablissement.cfd",
              dispositifIdRef: "formationEtablissement.dispositifId",
              codeRegionRef: "etablissement.codeRegion",
            }).as("positionQuadrant"),
          ])
          .where(notHistorique)
          .whereRef("formationEtablissement.UAI", "=", "etablissement.UAI")
          .groupBy([
            "formation.id",
            "formation.libelleDiplome",
            "formation.libelleFiliere",
            "formationEtablissement.cfd",
            "formationEtablissement.dispositifId",
            "indicateurEntree.effectifs",
            "indicateurEntree.capacites",
            "indicateurEntree.premiersVoeux",
            "indicateurEntree.anneeDebut",
            "indicateurEntree.rentreeScolaire",
            "formation.codeNiveauDiplome",
            "libelleNiveauDiplome",
            "libelleDispositif",
          ])
      ).as("formations")
    )
    .where("etablissement.UAI", "=", uai)
    .groupBy([
      "etablissement.codeRegion",
      "etablissement.UAI",
      "etablissement.libelleEtablissement",
      "indicateurEtablissement.valeurAjoutee",
      "region.codeRegion",
    ])
    .executeTakeFirst();

  return (
    etablissement &&
    cleanNull({
      ...etablissement,
      formations: etablissement.formations.map(cleanNull),
    })
  );
};
