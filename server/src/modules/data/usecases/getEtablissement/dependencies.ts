import { sql } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";

import { kdb } from "../../../../db/db";
import { effectifAnnee } from "../../queries/utils/effectifAnnee";
import { getMillesimePrecedent } from "../../queries/utils/getMillesime";
import { hasContinuum } from "../../queries/utils/hasContinuum";
import { notHistorique } from "../../queries/utils/notHistorique";
import { withPositionQuadrant } from "../../queries/utils/positionQuadrant";
import { withTauxDevenirFavorableReg } from "../../queries/utils/tauxDevenirFavorable";
import { withInsertionReg } from "../../queries/utils/tauxInsertion6mois";
import { withPoursuiteReg } from "../../queries/utils/tauxPoursuite";
import { selectTauxPression } from "../../queries/utils/tauxPression";
import { selectTauxRemplissageAgg } from "../../queries/utils/tauxRemplissage";

const getEtablissementInDb = async ({
  uai,
  millesimeSortie = "2020_2021",
  rentreeScolaire = "2022",
  orderBy
}: {
  uai: string;
  millesimeSortie?: string;
  rentreeScolaire?: string;
  orderBy?: { column: string; order: "asc" | "desc" };
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
          .leftJoin("indicateurEntree", (join) =>
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
          .leftJoin("indicateurEntree as iep", (join) =>
            join
              .onRef("formationEtablissement.id", "=", "iep.formationEtablissementId")
              .on("iep.rentreeScolaire", "=", "2021")
          )
          .select((sb) => [
            "formationEtablissement.cfd as codeFormationDiplome",
            "formationEtablissement.dispositifId",
            "libelleDispositif",
            "formation.codeNiveauDiplome",
            "libelleNiveauDiplome",
            "formation.libelleFiliere",
            "formation.CPC",
            "formation.CPCSecteur",
            sql<string>`CONCAT(${sb.ref("formation.libelleDiplome")},' (',${sb.ref("niveauDiplome.libelleNiveauDiplome")}, ')')`.as("libelleDiplome"),
            "formation.CPCSousSecteur",
            sql<number>`COUNT(e."UAI")`.as("nbEtablissement"),
            selectTauxRemplissageAgg("indicateurEntree").as("tauxRemplissage"),
            sql<number>`SUM(${effectifAnnee({ alias: "indicateurEntree" })})`.as(
              "effectif"
            ),
            sql<number>`SUM(${effectifAnnee({ alias: "iep" })})`.as(
              "effectifPrecedent"
            ),
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
            (eb) =>
              withInsertionReg({
                eb,
                millesimeSortie: getMillesimePrecedent(millesimeSortie),
                cfdRef: "formationEtablissement.cfd",
                dispositifIdRef: "formationEtablissement.dispositifId",
                codeRegionRef: "etablissement.codeRegion",
              }).as("tauxInsertionPrecedent"),
            (eb) =>
              withPoursuiteReg({
                eb,
                millesimeSortie: getMillesimePrecedent(millesimeSortie),
                cfdRef: "formationEtablissement.cfd",
                dispositifIdRef: "formationEtablissement.dispositifId",
                codeRegionRef: "etablissement.codeRegion",
              }).as("tauxPoursuitePrecedent"),
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
            withTauxDevenirFavorableReg({
              eb,
              millesimeSortie,
              cfdRef: "formationEtablissement.cfd",
              dispositifIdRef: "formationEtablissement.dispositifId",
              codeRegionRef: "etablissement.codeRegion",
            }).as("tauxDevenirFavorable"),
            withPositionQuadrant({
              eb,
              millesimeSortie,
              cfdRef: "formationEtablissement.cfd",
              dispositifIdRef: "formationEtablissement.dispositifId",
              codeRegionRef: "etablissement.codeRegion",
            }).as("positionQuadrant"),
          ])
          .$narrowType<{
            tauxInsertion: number;
            tauxPoursuite: number;
            tauxDevenirFavorable: number;
          }>()
          .having(
            (eb) =>
              withInsertionReg({
                eb,
                millesimeSortie,
                cfdRef: "formationEtablissement.cfd",
                dispositifIdRef: "formationEtablissement.dispositifId",
                codeRegionRef: "etablissement.codeRegion",
              }),
            "is not",
            null
          )
          .having(
            (eb) =>
              withPoursuiteReg({
                eb,
                millesimeSortie,
                cfdRef: "formationEtablissement.cfd",
                dispositifIdRef: "formationEtablissement.dispositifId",
                codeRegionRef: "etablissement.codeRegion",
              }),
            "is not",
            null
          )
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
          .$call((q) => {
            if (!orderBy) return q;
            return q.orderBy(
              sql.ref(orderBy.column),
              sql`${sql.raw(orderBy.order)} NULLS LAST`
            );
          })
          .orderBy("libelleDiplome", "asc")
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

  return etablissement;
};

export const dependencies = {
  getEtablissementInDb,
};
