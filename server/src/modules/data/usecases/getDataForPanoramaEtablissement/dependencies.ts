// @ts-nocheck -- TODO
import Boom from "@hapi/boom";
import { sql } from "kysely";
import { CURRENT_IJ_MILLESIME, CURRENT_RENTREE } from "shared";

import { getKbdClient } from "@/db/db";
import { getMillesimePrecedent } from "@/modules/data/services/getMillesime";
import { getDateRentreeScolaire, getRentreeScolairePrecedente } from "@/modules/data/services/getRentreeScolaire";
import { effectifAnnee } from "@/modules/data/utils/effectifAnnee";
import { hasContinuum } from "@/modules/data/utils/hasContinuum";
import { notAnneeCommune, notSpecialite } from "@/modules/data/utils/notAnneeCommune";
import { notHistoriqueUnlessCoExistant } from "@/modules/data/utils/notHistorique";
import { withTauxDevenirFavorableReg } from "@/modules/data/utils/tauxDevenirFavorable";
import { withInsertionReg } from "@/modules/data/utils/tauxInsertion6mois";
import { withPoursuiteReg } from "@/modules/data/utils/tauxPoursuite";
import { selectTauxPression } from "@/modules/data/utils/tauxPression";
import { selectTauxRemplissageAgg } from "@/modules/data/utils/tauxRemplissage";
import { cleanNull } from "@/utils/noNull";

export const getStatsEtablissement = async ({
  uai,
  millesimeSortie = CURRENT_IJ_MILLESIME,
  rentreeScolaire = CURRENT_RENTREE,
}: {
  uai: string;
  millesimeSortie?: string;
  rentreeScolaire?: string;
}) => {
  const baseStatsEntree = getKbdClient()
    .selectFrom("formationEtablissement")
    .leftJoin("formationScolaireView as formationView", "formationView.cfd", "formationEtablissement.cfd")
    .leftJoin("indicateurEntree", (join) =>
      join.onRef("formationEtablissement.id", "=", "indicateurEntree.formationEtablissementId")
    )
    .innerJoin("etablissement", "formationEtablissement.uai", "etablissement.uai")
    .leftJoin("indicateurEtablissement", (join) =>
      join
        .onRef("etablissement.uai", "=", "indicateurEtablissement.uai")
        .on("indicateurEtablissement.millesime", "=", millesimeSortie)
    )
    .where("etablissement.uai", "=", uai)
    .where((w) =>
      w.or([
        w("etablissement.dateFermeture", "is", null),
        w("etablissement.dateFermeture", ">", sql<Date>`${getDateRentreeScolaire(CURRENT_RENTREE)}`),
      ])
    )
    .where("indicateurEntree.rentreeScolaire", "=", rentreeScolaire);

  const informationsEtablissement = await baseStatsEntree
    .leftJoin("nsf", "nsf.codeNsf", "formationView.codeNsf")
    .innerJoin("region", "region.codeRegion", "etablissement.codeRegion")
    .select([
      sql<string>`${rentreeScolaire}`.as("rentreeScolaire"),
      "etablissement.uai as uai",
      "etablissement.libelleEtablissement",
      "region.libelleRegion",
      "region.codeRegion",
      "valeurAjoutee",
      "nsf.libelleNsf",
    ])
    .executeTakeFirstOrThrow()
    .catch(() => {
      throw Boom.badRequest(`Code uai invalide : ${uai}`);
    });

  const nbFormations = await baseStatsEntree
    .where(notAnneeCommune)
    .select([
      sql<number>`COUNT(distinct CONCAT("formationEtablissement"."cfd", "formationEtablissement"."codeDispositif"))`.as(
        "nbFormations"
      ),
    ])
    .executeTakeFirst();

  const statsEntree = await baseStatsEntree
    .where(notSpecialite)
    .select([
      sql<number>`SUM(${effectifAnnee({
        alias: "indicateurEntree",
      })})`.as("effectif"),
    ])
    .executeTakeFirst();

  return cleanNull({
    ...informationsEtablissement,
    ...statsEntree,
    ...nbFormations,
  });
};

const getFormationsEtablissement = async ({
  uai,
  millesimeSortie = CURRENT_IJ_MILLESIME,
  rentreeScolaire = CURRENT_RENTREE,
  orderBy,
}: {
  uai: string;
  millesimeSortie?: string;
  rentreeScolaire?: string;
  orderBy?: { column: string; order: "asc" | "desc" };
}) => {
  const formations = await getKbdClient()
    .selectFrom("formationEtablissement")
    .leftJoin("indicateurEntree", (join) =>
      join
        .onRef("formationEtablissement.id", "=", "indicateurEntree.formationEtablissementId")
        .on("indicateurEntree.rentreeScolaire", "=", rentreeScolaire)
    )
    .innerJoin("formationScolaireView as formationView", "formationView.cfd", "formationEtablissement.cfd")
    .innerJoin("etablissement", "etablissement.uai", "formationEtablissement.uai")
    .leftJoin("niveauDiplome", "niveauDiplome.codeNiveauDiplome", "formationView.codeNiveauDiplome")
    .leftJoin("dispositif", "dispositif.codeDispositif", "formationEtablissement.codeDispositif")
    .leftJoin("indicateurEntree as iep", (join) =>
      join
        .onRef("formationEtablissement.id", "=", "iep.formationEtablissementId")
        .on("iep.rentreeScolaire", "=", getRentreeScolairePrecedente(rentreeScolaire))
    )
    .leftJoin("region", "region.codeRegion", "etablissement.codeRegion")
    .leftJoin("nsf", "nsf.codeNsf", "formationView.codeNsf")
    .select((sb) => [
      "formationEtablissement.cfd as cfd",
      "formationEtablissement.codeDispositif as codeDispositif",
      "libelleDispositif",
      "formationView.codeNiveauDiplome",
      "formationView.typeFamille",
      "libelleNiveauDiplome",
      sql<string>`CONCAT(${sb.ref(
        "formationView.libelleFormation"
      )},' (',${sb.ref("niveauDiplome.libelleNiveauDiplome")}, ')')`.as("libelleFormation"),
      selectTauxRemplissageAgg("indicateurEntree").as("tauxRemplissage"),
      sql<number>`SUM(${effectifAnnee({
        alias: "indicateurEntree",
      })})`.as("effectif"),
      sql<number>`SUM(${effectifAnnee({ alias: "iep" })})`.as("effectifPrecedent"),
      selectTauxPression("indicateurEntree", "formationView", true).as("tauxPression"),
    ])
    .select((eb) => [
      (eb) =>
        hasContinuum({
          eb,
          millesimeSortie,
          cfdRef: "formationEtablissement.cfd",
          codeDispositifRef: "formationEtablissement.codeDispositif",
          codeRegionRef: "etablissement.codeRegion",
        }).as("continuum"),
      (eb) =>
        withInsertionReg({
          eb,
          millesimeSortie: getMillesimePrecedent(millesimeSortie),
          cfdRef: "formationEtablissement.cfd",
          codeDispositifRef: "formationEtablissement.codeDispositif",
          codeRegionRef: "etablissement.codeRegion",
        }).as("tauxInsertionPrecedent"),
      (eb) =>
        withPoursuiteReg({
          eb,
          millesimeSortie: getMillesimePrecedent(millesimeSortie),
          cfdRef: "formationEtablissement.cfd",
          codeDispositifRef: "formationEtablissement.codeDispositif",
          codeRegionRef: "etablissement.codeRegion",
        }).as("tauxPoursuitePrecedent"),
      withInsertionReg({
        eb,
        millesimeSortie,
        cfdRef: "formationEtablissement.cfd",
        codeDispositifRef: "formationEtablissement.codeDispositif",
        codeRegionRef: "etablissement.codeRegion",
      }).as("tauxInsertion"),
      withPoursuiteReg({
        eb,
        millesimeSortie,
        cfdRef: "formationEtablissement.cfd",
        codeDispositifRef: "formationEtablissement.codeDispositif",
        codeRegionRef: "etablissement.codeRegion",
      }).as("tauxPoursuite"),
      withTauxDevenirFavorableReg({
        eb,
        millesimeSortie,
        cfdRef: "formationEtablissement.cfd",
        codeDispositifRef: "formationEtablissement.codeDispositif",
        codeRegionRef: "etablissement.codeRegion",
      }).as("tauxDevenirFavorable"),
    ])
    .$narrowType<{
      tauxInsertion: number;
      tauxPoursuite: number;
      tauxDevenirFavorable: number;
    }>()
    .where((eb) => notHistoriqueUnlessCoExistant(eb, rentreeScolaire))
    .where("formationEtablissement.uai", "=", uai)
    .groupBy([
      "formationView.id",
      "formationView.libelleFormation",
      "nsf.libelleNsf",
      "formationView.typeFamille",
      "formationEtablissement.cfd",
      "formationEtablissement.codeDispositif",
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
      return q.orderBy(sql.ref(orderBy.column), sql`${sql.raw(orderBy.order)} NULLS LAST`);
    })
    .orderBy("libelleFormation", "asc")
    .execute();

  return formations.map(cleanNull);
};

export const dependencies = {
  getFormationsEtablissement,
  getStatsEtablissement,
};
