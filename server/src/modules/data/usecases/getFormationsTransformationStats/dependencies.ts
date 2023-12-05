import { ExpressionBuilder, sql } from "kysely";

import { kdb } from "../../../../db/db";
import { DB } from "../../../../db/schema";
import { cleanNull } from "../../../../utils/noNull";
import { hasContinuum } from "../../utils/hasContinuum";
import { notHistoriqueIndicateurRegionSortie } from "../../utils/notHistorique";
import { withTauxDevenirFavorableReg } from "../../utils/tauxDevenirFavorable";
import {
  selectTauxInsertion6moisAgg,
  withInsertionReg,
} from "../../utils/tauxInsertion6mois";
import {
  selectTauxPoursuiteAgg,
  withPoursuiteReg,
} from "../../utils/tauxPoursuite";
import { withTauxPressionReg } from "../../utils/tauxPression";

const selectDifferencePlaces = (
  eb: ExpressionBuilder<DB, "demande">,
  type?: "fermeture" | "ouverture"
) => {
  if (type === "ouverture")
    return sql`GREATEST(${eb.ref("capaciteScolaire")}
  - ${eb.ref("capaciteScolaireActuelle")}, 0)
+ GREATEST(${eb.ref("capaciteApprentissage")}
  - ${eb.ref("capaciteApprentissageActuelle")}, 0)`;

  if (type === "fermeture")
    return sql`GREATEST(${eb.ref("capaciteScolaireActuelle")}
  - ${eb.ref("capaciteScolaire")}, 0)
+ GREATEST(${eb.ref("capaciteApprentissageActuelle")}
  - ${eb.ref("capaciteApprentissage")}, 0)`;

  return sql`ABS(${eb.ref("capaciteScolaire")}
  - ${eb.ref("capaciteScolaireActuelle")})
+ ABS(${eb.ref("capaciteApprentissage")}
  - ${eb.ref("capaciteApprentissageActuelle")})`;
};

const selectPlacesTransformees = (eb: ExpressionBuilder<DB, "demande">) =>
  sql`GREATEST(${eb.ref("capaciteScolaire")}
  - ${eb.ref("capaciteScolaireActuelle")}, 0)
  + GREATEST(${eb.ref("capaciteApprentissage")}
  - ${eb.ref("capaciteApprentissageActuelle")}, 0)
  + GREATEST(${eb.ref("capaciteScolaireActuelle")}
  - ${eb.ref("capaciteScolaire")}, 0)`;

const selectPlacesOuvertes = (eb: ExpressionBuilder<DB, "demande">) =>
  sql`GREATEST(${eb.ref("capaciteScolaire")}
            - ${eb.ref("capaciteScolaireActuelle")}, 0)
          + GREATEST(${eb.ref("capaciteApprentissage")}
            - ${eb.ref("capaciteApprentissageActuelle")}, 0)`;

const selectPlacesFermees = (eb: ExpressionBuilder<DB, "demande">) =>
  sql`GREATEST(${eb.ref("capaciteScolaireActuelle")}
            - ${eb.ref("capaciteScolaire")}, 0)
          + GREATEST(${eb.ref("capaciteApprentissageActuelle")}
            - ${eb.ref("capaciteApprentissage")}, 0)`;

const selectNbDemandes = (eb: ExpressionBuilder<DB, "demande">) =>
  eb.fn.count<number>("demande.id").distinct();

const selectNbEtablissements = (
  eb: ExpressionBuilder<DB, "dataEtablissement">
) => eb.fn.count<number>("dataEtablissement.uai").distinct();

const getFormationsTransformationStatsQuery = ({
  status,
  type,
  rentreeScolaire = "2024",
  millesimeSortie = "2020_2021",
  codeRegion,
  codeAcademie,
  codeDepartement,
  tauxPression,
  codeNiveauDiplome,
  filiere,
  orderBy,
}: {
  status?: "draft" | "submitted";
  type?: "fermeture" | "ouverture";
  rentreeScolaire?: string;
  millesimeSortie?: string;
  codeRegion?: string;
  codeAcademie?: string;
  codeDepartement?: string;
  tauxPression?: "eleve" | "faible";
  codeNiveauDiplome?: string[];
  filiere?: string[];
  orderBy?: { column: string; order: "asc" | "desc" };
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
          millesimeSortie,
          cfdRef: "demande.cfd",
          dispositifIdRef: "demande.dispositifId",
          codeRegionRef: "dataEtablissement.codeRegion",
        }).as("tauxInsertion"),
      withPoursuiteReg({
        eb,
        millesimeSortie,
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
      withTauxDevenirFavorableReg({
        eb,
        millesimeSortie,
        cfdRef: "demande.cfd",
        dispositifIdRef: "demande.dispositifId",
        codeRegionRef: "dataEtablissement.codeRegion",
      }).as("tauxDevenirFavorable"),
      selectNbDemandes(eb).as("nbDemandes"),
      selectNbEtablissements(eb).as("nbEtablissements"),
      sql<number>`ABS(${eb.fn.sum(selectDifferencePlaces(eb, type))})`.as(
        "differencePlaces"
      ),
      eb.fn.sum<number>(selectPlacesOuvertes(eb)).as("placesOuvertes"),
      eb.fn.sum<number>(selectPlacesFermees(eb)).as("placesFermees"),
      eb.fn.sum<number>(selectPlacesTransformees(eb)).as("placesTransformees"),
      hasContinuum({
        eb,
        millesimeSortie,
        cfdRef: "demande.cfd",
        dispositifIdRef: "demande.dispositifId",
        codeRegionRef: "dataEtablissement.codeRegion",
      }).as("continuum"),
    ])
    .$call((eb) => {
      if (rentreeScolaire && !Number.isNaN(rentreeScolaire))
        return eb.where(
          "demande.rentreeScolaire",
          "=",
          parseInt(rentreeScolaire)
        );
      return eb;
    })
    .where((wb) => {
      if (!type) return wb.val(true);
      return wb((eb) => selectDifferencePlaces(eb, type), ">", 0);
    })
    .having(
      (eb) =>
        withInsertionReg({
          eb,
          millesimeSortie,
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
          millesimeSortie,
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
    .$call((q) => {
      if (!codeNiveauDiplome?.length) return q;
      return q.where(
        "dataFormation.codeNiveauDiplome",
        "in",
        codeNiveauDiplome
      );
    })
    .$call((q) => {
      if (!filiere?.length) return q;
      return q.where("dataFormation.libelleFiliere", "in", filiere);
    })
    .$call((q) => {
      if (!orderBy) return q;
      return q.orderBy(
        sql.ref(orderBy.column),
        sql`${sql.raw(orderBy.order)} NULLS LAST`
      );
    })
    .where("demande.status", "!=", "refused")
    .orderBy("tauxDevenirFavorable", "desc")
    .execute()
    .then(cleanNull);
};

const getRegionStats = async ({
  codeRegion,
  codeAcademie,
  codeDepartement,
  codeNiveauDiplome,
  millesimeSortie = "2020_2021",
}: {
  codeRegion?: string;
  codeAcademie?: string;
  codeDepartement?: string;
  millesimeSortie?: string;
  codeNiveauDiplome?: string[];
}) => {
  const statsSortie = await kdb
    .selectFrom("indicateurRegionSortie")
    .innerJoin(
      "formation",
      "formation.codeFormationDiplome",
      "indicateurRegionSortie.cfd"
    )
    .where((w) => {
      if (!codeRegion) return w.val(true);
      return w("indicateurRegionSortie.codeRegion", "=", codeRegion);
    })
    .$call((q) => {
      if (!codeDepartement && !codeAcademie) {
        return q;
      }
      return q
        .innerJoin(
          "departement",
          "departement.codeRegion",
          "indicateurRegionSortie.codeRegion"
        )
        .where((w) => {
          if (!codeAcademie) return w.val(true);
          return w("departement.codeAcademie", "=", codeAcademie);
        })
        .where((w) => {
          if (!codeDepartement) return w.val(true);
          return w("departement.codeDepartement", "=", codeDepartement);
        });
    })
    .$call((q) => {
      if (!codeNiveauDiplome?.length) return q;
      return q.where("formation.codeNiveauDiplome", "in", codeNiveauDiplome);
    })
    .where("indicateurRegionSortie.millesimeSortie", "=", millesimeSortie)
    .where(notHistoriqueIndicateurRegionSortie)
    .select([
      selectTauxInsertion6moisAgg("indicateurRegionSortie").as("tauxInsertion"),
      selectTauxPoursuiteAgg("indicateurRegionSortie").as("tauxPoursuite"),
    ])
    .executeTakeFirstOrThrow();

  return statsSortie;
};

export const dependencies = {
  getFormationsTransformationStatsQuery,
  getRegionStats,
};
