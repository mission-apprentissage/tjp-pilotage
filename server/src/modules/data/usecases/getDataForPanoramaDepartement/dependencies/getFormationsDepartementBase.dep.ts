import { sql } from "kysely";
import { CURRENT_IJ_MILLESIME, CURRENT_RENTREE } from "shared";
import { getMillesimePrecedent } from "shared/utils/getMillesime";
import { getRentreeScolairePrecedente } from "shared/utils/getRentreeScolaire";

import { kdb } from "../../../../../db/db";
import { effectifAnnee } from "../../../utils/effectifAnnee";
import { hasContinuum } from "../../../utils/hasContinuum";
import { notAnneeCommune } from "../../../utils/notAnneeCommune";
import { notHistoriqueUnlessCoExistant } from "../../../utils/notHistorique";
import { withTauxDevenirFavorableReg } from "../../../utils/tauxDevenirFavorable";
import { withInsertionReg } from "../../../utils/tauxInsertion6mois";
import { withPoursuiteReg } from "../../../utils/tauxPoursuite";
import { selectTauxPressionAgg } from "../../../utils/tauxPression";
import { selectTauxRemplissageAgg } from "../../../utils/tauxRemplissage";
import { Filters } from "../getDataForPanoramaDepartement.schema";

export const getFormationsDepartementBase = ({
  codeDepartement,
  rentreeScolaire = CURRENT_RENTREE,
  millesimeSortie = CURRENT_IJ_MILLESIME,
  codeNiveauDiplome,
  codeNsf,
  order,
  orderBy,
}: Filters) =>
  kdb
    .selectFrom("formationScolaireView as formationView")
    .leftJoin(
      "formationEtablissement",
      "formationEtablissement.cfd",
      "formationView.cfd"
    )
    .leftJoin(
      "niveauDiplome",
      "niveauDiplome.codeNiveauDiplome",
      "formationView.codeNiveauDiplome"
    )
    .leftJoin(
      "dispositif",
      "formationEtablissement.dispositifId",
      "dispositif.codeDispositif"
    )
    .leftJoin("indicateurEntree", (join) =>
      join
        .onRef(
          "formationEtablissement.id",
          "=",
          "indicateurEntree.formationEtablissementId"
        )
        .on("indicateurEntree.rentreeScolaire", "=", rentreeScolaire)
    )
    .leftJoin(
      "etablissement",
      "etablissement.UAI",
      "formationEtablissement.UAI"
    )
    .leftJoin("indicateurEntree as iep", (join) =>
      join
        .onRef("formationEtablissement.id", "=", "iep.formationEtablissementId")
        .on(
          "iep.rentreeScolaire",
          "=",
          getRentreeScolairePrecedente(rentreeScolaire)
        )
    )
    .where((eb) => notHistoriqueUnlessCoExistant(eb, rentreeScolaire))
    .where(notAnneeCommune)
    .where("etablissement.codeDepartement", "=", codeDepartement)
    .$call((q) => {
      if (!codeNiveauDiplome) return q;
      return q.where(
        "formationView.codeNiveauDiplome",
        "in",
        codeNiveauDiplome
      );
    })
    .$call((q) => {
      if (!codeNsf) return q;
      return q.where("formationView.codeNsf", "in", codeNsf);
    })
    .select((eb) => [
      "formationView.cfd",
      "formationEtablissement.dispositifId as codeDispositif",
      "libelleDispositif",
      "libelleNiveauDiplome",
      "formationView.codeNiveauDiplome",
      sql<number>`COUNT(etablissement."UAI")`.as("nbEtablissement"),
      selectTauxRemplissageAgg("indicateurEntree").as("tauxRemplissage"),
      sql<number>`SUM(${effectifAnnee({ alias: "indicateurEntree" })})`.as(
        "effectif"
      ),
      sql<number>`SUM(${effectifAnnee({ alias: "iep" })})`.as(
        "effectifPrecedent"
      ),
      sql<string>`CONCAT(${eb.ref(
        "formationView.libelleFormation"
      )},' (',${eb.ref("niveauDiplome.libelleNiveauDiplome")}, ')')`.as(
        "libelleFormation"
      ),
      selectTauxPressionAgg("indicateurEntree", "formationView").as(
        "tauxPression"
      ),
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
      (eb) =>
        withInsertionReg({
          eb,
          millesimeSortie,
          cfdRef: "formationEtablissement.cfd",
          codeDispositifRef: "formationEtablissement.dispositifId",
          codeRegionRef: "etablissement.codeRegion",
        }).as("tauxInsertion"),
      (eb) =>
        withPoursuiteReg({
          eb,
          millesimeSortie,
          cfdRef: "formationEtablissement.cfd",
          codeDispositifRef: "formationEtablissement.dispositifId",
          codeRegionRef: "etablissement.codeRegion",
        }).as("tauxPoursuite"),
      (eb) =>
        hasContinuum({
          eb,
          millesimeSortie,
          cfdRef: "formationEtablissement.cfd",
          codeDispositifRef: "formationEtablissement.dispositifId",
          codeRegionRef: "etablissement.codeRegion",
        }).as("continuum"),
      (eb) =>
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
    .groupBy([
      "formationEtablissement.cfd",
      "formationView.id",
      "formationView.cfd",
      "formationView.libelleFormation",
      "formationView.codeNiveauDiplome",
      "formationEtablissement.dispositifId",
      "dispositif.codeDispositif",
      "niveauDiplome.libelleNiveauDiplome",
    ])
    .$call((q) => {
      if (!orderBy || !order) return q;
      return q.orderBy(sql.ref(orderBy), sql`${sql.raw(order)} NULLS LAST`);
    })
    .orderBy("libelleFormation", "asc");