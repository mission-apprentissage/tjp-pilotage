import { ExpressionBuilder, sql } from "kysely";

import { kdb } from "../../../../db/db";
import { DB } from "../../../../db/schema";
import { cleanNull } from "../../../../utils/noNull";
import { hasContinuum } from "../../queries/utils/hasContinuum";
import { withInsertionReg } from "../../queries/utils/tauxInsertion6mois";
import { withPoursuiteReg } from "../../queries/utils/tauxPoursuite";
import { withTauxPressionReg } from "../../queries/utils/tauxPression";

const selectDifferencePlaces = (eb: ExpressionBuilder<DB, "demande">) =>
  sql`${eb.ref("capaciteScolaire")} 
  + ${eb.ref("capaciteApprentissage")} 
  - ${eb.ref("capaciteScolaireActuelle")} 
  - ${eb.ref("capaciteApprentissageActuelle")}`;

const selectDifferencePlacesPartionned = (
  eb: ExpressionBuilder<DB, "demande">
) => eb.fn.sum(selectDifferencePlaces(eb));

const selectNbDemandes = (eb: ExpressionBuilder<DB, "demande">) =>
  eb.fn.count<number>("demande.id").distinct();

const selectNbEtablissements = (
  eb: ExpressionBuilder<DB, "dataEtablissement">
) => eb.fn.count<number>("dataEtablissement.uai").distinct();

export const getformationsTransformationStatsQuery = ({
  status,
  type,
  rentreeScolaire = 2024,
  codeRegion,
  codeAcademie,
  codeDepartement,
  tauxPression,
}: {
  status?: "draft" | "submitted";
  type: "fermeture" | "ouverture";
  rentreeScolaire?: number;
  codeRegion?: string;
  codeAcademie?: string;
  codeDepartement?: string;
  tauxPression?: "eleve" | "faible";
}) => {
  const partition = (() => {
    if (codeDepartement) return ["dataEtablissement.codeDepartement"] as const;
    if (codeAcademie) return ["dataEtablissement.codeAcademie"] as const;
    if (codeRegion) return ["dataEtablissement.codeRegion"] as const;
    return [];
  })();

  return kdb
    .selectFrom("demande")
    .innerJoin("dataEtablissement", "dataEtablissement.uai", "demande.uai")
    .innerJoin("dataFormation", "dataFormation.cfd", "demande.cfd")
    .leftJoin("dispositif", "dispositif.codeDispositif", "demande.dispositifId")
    .leftJoin("region", "region.codeRegion", "dataEtablissement.codeRegion")
    .leftJoin(
      "academie",
      "academie.codeAcademie",
      "dataEtablissement.codeAcademie"
    )
    .leftJoin(
      "departement",
      "departement.codeDepartement",
      "dataEtablissement.codeDepartement"
    )
    .select((eb) => [
      "dataFormation.libelle as libelleDiplome",
      "dispositif.libelleDispositif",
      "dataFormation.cfd",
      "demande.dispositifId",
      (eb) =>
        withInsertionReg({
          eb,
          millesimeSortie: "2020_2021",
          cfdRef: "demande.cfd",
          dispositifIdRef: "demande.dispositifId",
          codeRegionRef: "dataEtablissement.codeRegion",
        }).as("tauxInsertion"),
      withPoursuiteReg({
        eb,
        millesimeSortie: "2020_2021",
        cfdRef: "demande.cfd",
        dispositifIdRef: "demande.dispositifId",
        codeRegionRef: "dataEtablissement.codeRegion",
      }).as("tauxPoursuite"),
      withTauxPressionReg({
        eb,
        cfdRef: "demande.cfd",
        dispositifIdRef: "demande.dispositifId",
        codeRegionRef: "dataEtablissement.codeRegion",
      }).as("tauxPression"),
      selectNbDemandes(eb).as("nbDemandes"),
      selectNbEtablissements(eb).as("nbEtablissements"),
      sql<number>`ABS(${selectDifferencePlacesPartionned(eb)})`.as(
        "differencePlaces"
      ),
      hasContinuum({
        eb,
        millesimeSortie: "2020_2021",
        cfdRef: "demande.cfd",
        dispositifIdRef: "demande.dispositifId",
        codeRegionRef: "dataEtablissement.codeRegion",
      }).as("continuum"),
    ])
    .where("demande.rentreeScolaire", "=", rentreeScolaire)
    .where(
      (eb) => selectDifferencePlaces(eb),
      ({ ouverture: ">", fermeture: "<" } as const)[type],
      0
    )
    .having(
      (eb) =>
        withInsertionReg({
          eb,
          millesimeSortie: "2020_2021",
          cfdRef: "demande.cfd",
          dispositifIdRef: "demande.dispositifId",
          codeRegionRef: "dataEtablissement.codeRegion",
        }),
      "is not",
      null
    )
    .having(
      (eb) =>
        withPoursuiteReg({
          eb,
          millesimeSortie: "2020_2021",
          cfdRef: "demande.cfd",
          dispositifIdRef: "demande.dispositifId",
          codeRegionRef: "dataEtablissement.codeRegion",
        }),
      "is not",
      null
    )
    .having((h) => {
      if (!tauxPression) return h.val(true);
      return h(
        (eb) =>
          withTauxPressionReg({
            eb,
            cfdRef: "demande.cfd",
            dispositifIdRef: "demande.dispositifId",
            codeRegionRef: "dataEtablissement.codeRegion",
          }),
        tauxPression === "eleve" ? ">" : "<",
        tauxPression === "eleve" ? 130 : 70
      );
    })
    .$narrowType<{ tauxPoursuite: number; tauxInsertion: number }>()
    .where((w) => {
      if (!codeRegion) return w.val(true);
      return w("dataEtablissement.codeRegion", "=", codeRegion);
    })
    .where((w) => {
      if (!codeAcademie) return w.val(true);
      return w("dataEtablissement.codeAcademie", "=", codeAcademie);
    })
    .where((w) => {
      if (!codeDepartement) return w.val(true);
      return w("dataEtablissement.codeDepartement", "=", codeDepartement);
    })
    .groupBy([
      "demande.cfd",
      "dataFormation.cfd",
      "demande.dispositifId",
      "dispositif.libelleDispositif",
      "dataFormation.libelle",
      ...partition,
    ])
    .$call((q) => {
      if (!status) return q;
      return q.where("demande.status", "=", status);
    })
    .execute()
    .then(cleanNull);
};
