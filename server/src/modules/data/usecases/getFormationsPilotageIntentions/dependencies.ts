import { ExpressionBuilder, sql } from "kysely";
import { CURRENT_IJ_MILLESIME, CURRENT_RENTREE, MILLESIMES_IJ } from "shared";
import { getMillesimeFromRentreeScolaire } from "shared/utils/getMillesime";
import { z } from "zod";

import { DB, kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";
import { isDemandeNotDeletedOrRefused } from "../../../utils/isDemandeSelectable";
import { hasContinuum } from "../../utils/hasContinuum";
import { isScolaireIndicateurRegionSortie } from "../../utils/isScolaire";
import { notAnneeCommuneIndicateurRegionSortie } from "../../utils/notAnneeCommune";
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
import { getFormationsPilotageIntentionsSchema } from "./getFormationsPilotageIntentions.schema";

export interface Filters
  extends z.infer<typeof getFormationsPilotageIntentionsSchema.querystring> {
  millesimeSortie?: (typeof MILLESIMES_IJ)[number];
}

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

const selectPlacesColorees = (eb: ExpressionBuilder<DB, "demande">) =>
  sql`
    ${eb.ref("capaciteScolaireColoree")} +
    ${eb.ref("capaciteApprentissageColoree")}`;

const selectNbDemandes = (eb: ExpressionBuilder<DB, "demande">) =>
  eb.fn.count<number>("demande.numero").distinct();

const selectNbEtablissements = (
  eb: ExpressionBuilder<DB, "dataEtablissement">
) => eb.fn.count<number>("dataEtablissement.uai").distinct();

export const getCodeRegionFromDepartement = (
  codeDepartement: string | string[]
) => {
  return kdb
    .selectFrom("departement")
    .where((w) => {
      if (Array.isArray(codeDepartement)) {
        return w("codeDepartement", "in", codeDepartement);
      }
      return w("codeDepartement", "=", codeDepartement);
    })
    .select(["codeRegion"])
    .executeTakeFirstOrThrow();
};

export const getCodeRegionFromAcademie = (codeAcademie: string | string[]) => {
  return kdb
    .selectFrom("academie")
    .where((w) => {
      if (Array.isArray(codeAcademie)) {
        return w("codeAcademie", "in", codeAcademie);
      }
      return w("codeAcademie", "=", codeAcademie);
    })
    .select(["codeRegion"])
    .executeTakeFirstOrThrow();
};

const getFormationsPilotageIntentionsQuery = ({
  statut,
  type,
  rentreeScolaire,
  millesimeSortie = CURRENT_IJ_MILLESIME,
  codeRegion,
  codeAcademie,
  codeDepartement,
  tauxPression,
  codeNiveauDiplome,
  codeNsf,
  campagne,
  orderBy,
  order,
}: Filters) => {
  const partition = (() => {
    if (codeDepartement) return ["dataEtablissement.codeDepartement"] as const;
    if (codeAcademie) return ["dataEtablissement.codeAcademie"] as const;
    if (codeRegion) return ["dataEtablissement.codeRegion"] as const;
    return [];
  })();

  const effectifs = getEffectifsParCampagneCodeNiveauDiplomeCodeRegionQuery({
    statut,
    type,
    rentreeScolaire,
    millesimeSortie,
    codeRegion,
    codeAcademie,
    codeDepartement,
    tauxPression,
    codeNiveauDiplome,
    codeNsf,
    campagne,
    orderBy,
    order,
  });

  return kdb
    .selectFrom("latestDemandeIntentionView as demande")
    .innerJoin("campagne", (join) =>
      join.onRef("campagne.id", "=", "demande.campagneId").$call((eb) => {
        if (campagne) return eb.on("campagne.annee", "=", campagne);
        return eb;
      })
    )
    .innerJoin("dataEtablissement", "dataEtablissement.uai", "demande.uai")
    .innerJoin("dataFormation", "dataFormation.cfd", "demande.cfd")
    .leftJoin(
      "dispositif",
      "dispositif.codeDispositif",
      "demande.codeDispositif"
    )
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
    .leftJoin("positionFormationRegionaleQuadrant", (join) =>
      join.on((eb) =>
        eb.and([
          eb(
            eb.ref("positionFormationRegionaleQuadrant.cfd"),
            "=",
            eb.ref("demande.cfd")
          ),
          eb(
            eb.ref("positionFormationRegionaleQuadrant.codeRegion"),
            "=",
            eb.ref("dataEtablissement.codeRegion")
          ),
          eb(
            eb.ref("positionFormationRegionaleQuadrant.millesimeSortie"),
            "=",
            eb.val(
              getMillesimeFromRentreeScolaire({
                rentreeScolaire: CURRENT_RENTREE,
                offset: 0,
              })
            )
          ),
        ])
      )
    )
    .leftJoin(
      kdb
        .selectFrom(
          effectifs.as("effectifsParCampagneCodeNiveauDiplomeCodeRegion")
        )
        .select((eb) => [
          "effectifsParCampagneCodeNiveauDiplomeCodeRegion.annee",
          "effectifsParCampagneCodeNiveauDiplomeCodeRegion.cfd",
          "effectifsParCampagneCodeNiveauDiplomeCodeRegion.codeRegion",
          "effectifsParCampagneCodeNiveauDiplomeCodeRegion.codeNiveauDiplome",
          sql<number>`SUM(${eb.ref(
            "effectifsParCampagneCodeNiveauDiplomeCodeRegion.denominateur"
          )})`.as("denominateur"),
        ])
        .groupBy([
          "effectifsParCampagneCodeNiveauDiplomeCodeRegion.annee",
          "effectifsParCampagneCodeNiveauDiplomeCodeRegion.cfd",
          "effectifsParCampagneCodeNiveauDiplomeCodeRegion.codeRegion",
          "effectifsParCampagneCodeNiveauDiplomeCodeRegion.codeNiveauDiplome",
        ])
        .as("effectifs"),
      (join) =>
        join
          .onRef("campagne.annee", "=", "effectifs.annee")
          .onRef("demande.cfd", "=", "effectifs.cfd")
          .onRef(
            "dataFormation.codeNiveauDiplome",
            "=",
            "effectifs.codeNiveauDiplome"
          )
          .onRef("demande.codeRegion", "=", "effectifs.codeRegion")
    )
    .select((eb) => [
      sql<number>`COALESCE(${eb.ref("effectifs.denominateur")}, 0)`.as(
        "effectif"
      ),
      "positionFormationRegionaleQuadrant.positionQuadrant",
      "dataFormation.libelleFormation",
      "dispositif.libelleDispositif",
      "dataFormation.cfd",
      "demande.codeDispositif as codeDispositif",
      (eb) =>
        withInsertionReg({
          eb,
          millesimeSortie,
          cfdRef: "demande.cfd",
          codeDispositifRef: "demande.codeDispositif",
          codeRegionRef: "dataEtablissement.codeRegion",
        }).as("tauxInsertion"),
      withPoursuiteReg({
        eb,
        millesimeSortie,
        cfdRef: "demande.cfd",
        codeDispositifRef: "demande.codeDispositif",
        codeRegionRef: "dataEtablissement.codeRegion",
      }).as("tauxPoursuite"),
      withTauxPressionReg({
        eb,
        cfdRef: "demande.cfd",
        codeDispositifRef: "demande.codeDispositif",
        codeRegionRef: "dataEtablissement.codeRegion",
      }).as("tauxPression"),
      withTauxDevenirFavorableReg({
        eb,
        millesimeSortie,
        cfdRef: "demande.cfd",
        codeDispositifRef: "demande.codeDispositif",
        codeRegionRef: "dataEtablissement.codeRegion",
      }).as("tauxDevenirFavorable"),
      selectNbDemandes(eb).as("nbDemandes"),
      selectNbEtablissements(eb).as("nbEtablissements"),
      sql<number>`ABS(${eb.fn.sum(selectDifferencePlaces(eb, type))})`.as(
        "differencePlaces"
      ),
      eb.fn.sum<number>(selectPlacesOuvertes(eb)).as("placesOuvertes"),
      eb.fn.sum<number>(selectPlacesFermees(eb)).as("placesFermees"),
      eb.fn.sum<number>(selectPlacesColorees(eb)).as("placesColorees"),
      eb.fn.sum<number>(selectPlacesTransformees(eb)).as("placesTransformees"),
      hasContinuum({
        eb,
        millesimeSortie,
        cfdRef: "demande.cfd",
        codeDispositifRef: "demande.codeDispositif",
        codeRegionRef: "dataEtablissement.codeRegion",
      }).as("continuum"),
    ])
    .$call((eb) => {
      if (rentreeScolaire)
        return eb.where(
          "demande.rentreeScolaire",
          "in",
          rentreeScolaire.map((rentree) => parseInt(rentree))
        );
      return eb;
    })
    .where((wb) => {
      if (!type) return wb.val(true);
      return wb((eb) => selectDifferencePlaces(eb, type), ">", 0);
    })
    .having((h) => {
      if (!tauxPression) return h.val(true);
      return h(
        (eb) =>
          withTauxPressionReg({
            eb,
            cfdRef: "demande.cfd",
            codeDispositifRef: "demande.codeDispositif",
            codeRegionRef: "dataEtablissement.codeRegion",
          }),
        tauxPression === "eleve" ? ">" : "<",
        tauxPression === "eleve" ? 1.3 : 0.7
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
      "positionFormationRegionaleQuadrant.positionQuadrant",
      "demande.cfd",
      "dataFormation.cfd",
      "demande.codeDispositif",
      "dispositif.libelleDispositif",
      "dataFormation.libelleFormation",
      "effectif",
      ...partition,
    ])
    .$call((q) => {
      if (!statut) return q;
      return q.where("demande.statut", "=", statut);
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
      if (codeNsf === undefined || codeNsf.length === 0) return q;
      return q.where("dataFormation.codeNsf", "in", codeNsf);
    })
    .$call((q) => {
      if (!orderBy || !order) return q;
      return q.orderBy(sql.ref(orderBy), sql`${sql.raw(order)} NULLS LAST`);
    })
    .where(isDemandeNotDeletedOrRefused)
    .orderBy("tauxDevenirFavorable", "desc")
    .execute()
    .then(cleanNull);
};

const getRegionStats = async ({
  codeRegion,
  codeAcademie,
  codeDepartement,
  codeNiveauDiplome,
  millesimeSortie = CURRENT_IJ_MILLESIME,
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
      "formationScolaireView as formationView",
      "formationView.cfd",
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
      return q.where(
        "formationView.codeNiveauDiplome",
        "in",
        codeNiveauDiplome
      );
    })
    .where("indicateurRegionSortie.millesimeSortie", "=", millesimeSortie)
    .where(isScolaireIndicateurRegionSortie)
    .where(notAnneeCommuneIndicateurRegionSortie)
    .where(notHistoriqueIndicateurRegionSortie)
    .select([
      selectTauxInsertion6moisAgg("indicateurRegionSortie").as("tauxInsertion"),
      selectTauxPoursuiteAgg("indicateurRegionSortie").as("tauxPoursuite"),
    ])
    .executeTakeFirstOrThrow();

  return statsSortie;
};

const getEffectifsParCampagneCodeNiveauDiplomeCodeRegionQuery = ({
  ...filters
}: Filters) => {
  return (
    kdb
      .selectFrom("campagne")
      .leftJoin("constatRentree", (join) => join.onTrue())
      .leftJoin(
        "dataEtablissement",
        "dataEtablissement.uai",
        "constatRentree.uai"
      )
      .leftJoin("dataFormation", "dataFormation.cfd", "constatRentree.cfd")
      // .leftJoin("positionFormationRegionaleQuadrant", (join) =>
      //   join
      //     .onRef(
      //       "positionFormationRegionaleQuadrant.codeRegion",
      //       "=",
      //       "dataEtablissement.codeRegion"
      //     )
      //     .onRef(
      //       "positionFormationRegionaleQuadrant.cfd",
      //       "=",
      //       "dataFormation.cfd"
      //     )
      //     .onRef(
      //       "positionFormationRegionaleQuadrant.codeNiveauDiplome",
      //       "=",
      //       "dataFormation.codeNiveauDiplome"
      //     )
      // )
      .select((eb) => [
        "dataFormation.cfd",
        "dataFormation.codeNiveauDiplome",
        "dataEtablissement.codeRegion",
        "campagne.annee",
        "rentreeScolaire",
        sql<number>`SUM(${eb.ref("constatRentree.effectif")})`.as(
          "denominateur"
        ),
      ])
      .$call((eb) => {
        if (filters.campagne)
          return eb.where("campagne.annee", "=", filters.campagne);
        return eb;
      })
      .where(
        sql<boolean>`
      CASE WHEN "campagne"."annee" = '2023' THEN "constatRentree"."anneeDispositif" = 1
      ELSE
        CASE WHEN "dataFormation"."typeFamille" in ('specialite', 'option') THEN "constatRentree"."anneeDispositif" = 2
        WHEN "dataFormation"."typeFamille" in ('2nde_commune', '1ere_commune') THEN false
        ELSE "constatRentree"."anneeDispositif" = 1
        END
      END
      `
      )
      .where("constatRentree.rentreeScolaire", "=", "2023")
      .groupBy([
        "annee",
        "rentreeScolaire",
        "dataFormation.cfd",
        "dataFormation.codeNiveauDiplome",
        "dataEtablissement.codeRegion",
        // "positionQuadrant",
      ])
  );
};

export const dependencies = {
  getFormationsPilotageIntentionsQuery,
  getRegionStats,
};
