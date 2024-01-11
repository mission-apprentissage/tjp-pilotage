import { sql } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";

import { kdb } from "../../../../db/db";
import { getMillesimePrecedent } from "../../services/getMillesime";
import { getRentreeScolairePrecedente } from "../../services/getRentreeScolaire";
import { effectifAnnee } from "../../utils/effectifAnnee";
import { hasContinuum } from "../../utils/hasContinuum";
import { notHistoriqueCoExistence } from "../../utils/notHistorique";
import { notSecondeCommune } from "../../utils/notSecondeCommune";
import { withTauxDevenirFavorableReg } from "../../utils/tauxDevenirFavorable";
import { withInsertionReg } from "../../utils/tauxInsertion6mois";
import { withPoursuiteReg } from "../../utils/tauxPoursuite";
import { selectTauxPression } from "../../utils/tauxPression";
import { selectTauxRemplissageAgg } from "../../utils/tauxRemplissage";

const getFormationsEtablissement = async ({
  uai,
  millesimeSortie = "2020_2021",
  rentreeScolaire = "2022",
  orderBy,
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
            "formationView",
            "formationView.cfd",
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
            "formationView.codeNiveauDiplome"
          )
          .leftJoin(
            "dispositif",
            "dispositif.codeDispositif",
            "formationEtablissement.dispositifId"
          )
          .leftJoin("indicateurEntree as iep", (join) =>
            join
              .onRef(
                "formationEtablissement.id",
                "=",
                "iep.formationEtablissementId"
              )
              .on(
                "iep.rentreeScolaire",
                "=",
                getRentreeScolairePrecedente(rentreeScolaire)
              )
          )
          .select((sb) => [
            "formationEtablissement.cfd as cfd",
            "formationEtablissement.dispositifId as codeDispositif",
            "libelleDispositif",
            "formationView.codeNiveauDiplome",
            "libelleNiveauDiplome",
            sql<string>`CONCAT(${sb.ref(
              "formationView.libelleFormation"
            )},' (',${sb.ref("niveauDiplome.libelleNiveauDiplome")}, ')')`.as(
              "libelleFormation"
            ),
            sql<number>`COUNT(e."UAI")`.as("nbEtablissement"),
            selectTauxRemplissageAgg("indicateurEntree").as("tauxRemplissage"),
            sql<number>`SUM(${effectifAnnee({
              alias: "indicateurEntree",
            })})`.as("effectif"),
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
                codeDispositifRef: "formationEtablissement.dispositifId",
                codeRegionRef: "etablissement.codeRegion",
              }).as("continuum"),
            (eb) =>
              withInsertionReg({
                eb,
                millesimeSortie: getMillesimePrecedent(millesimeSortie),
                cfdRef: "formationEtablissement.cfd",
                codeDispositifRef: "formationEtablissement.dispositifId",
                codeRegionRef: "etablissement.codeRegion",
              }).as("tauxInsertionPrecedent"),
            (eb) =>
              withPoursuiteReg({
                eb,
                millesimeSortie: getMillesimePrecedent(millesimeSortie),
                cfdRef: "formationEtablissement.cfd",
                codeDispositifRef: "formationEtablissement.dispositifId",
                codeRegionRef: "etablissement.codeRegion",
              }).as("tauxPoursuitePrecedent"),
            withInsertionReg({
              eb,
              millesimeSortie,
              cfdRef: "formationEtablissement.cfd",
              codeDispositifRef: "formationEtablissement.dispositifId",
              codeRegionRef: "etablissement.codeRegion",
            }).as("tauxInsertion"),
            withPoursuiteReg({
              eb,
              millesimeSortie,
              cfdRef: "formationEtablissement.cfd",
              codeDispositifRef: "formationEtablissement.dispositifId",
              codeRegionRef: "etablissement.codeRegion",
            }).as("tauxPoursuite"),
            withTauxDevenirFavorableReg({
              eb,
              millesimeSortie,
              cfdRef: "formationEtablissement.cfd",
              codeDispositifRef: "formationEtablissement.dispositifId",
              codeRegionRef: "etablissement.codeRegion",
            }).as("tauxDevenirFavorable"),
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
                codeDispositifRef: "formationEtablissement.dispositifId",
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
                codeDispositifRef: "formationEtablissement.dispositifId",
                codeRegionRef: "etablissement.codeRegion",
              }),
            "is not",
            null
          )
          .where((eb) => notHistoriqueCoExistence(eb, rentreeScolaire))
          .where(notSecondeCommune)
          .whereRef("formationEtablissement.UAI", "=", "etablissement.UAI")
          .groupBy([
            "formationView.id",
            "formationView.libelleFormation",
            "formationView.libelleFiliere",
            "formationEtablissement.cfd",
            "formationEtablissement.dispositifId",
            "indicateurEntree.effectifs",
            "indicateurEntree.capacites",
            "indicateurEntree.premiersVoeux",
            "indicateurEntree.anneeDebut",
            "indicateurEntree.rentreeScolaire",
            "formationView.codeNiveauDiplome",
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
          .orderBy("libelleFormation", "asc")
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
  getFormationsEtablissement,
};
