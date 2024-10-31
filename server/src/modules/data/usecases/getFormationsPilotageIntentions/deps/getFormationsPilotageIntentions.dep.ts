import { ExpressionBuilder, sql } from "kysely";
import { CURRENT_IJ_MILLESIME, MILLESIMES_IJ } from "shared";
import { DemandeTypeEnum } from "shared/enum/demandeTypeEnum";
import { getMillesimeFromCampagne } from "shared/time/millesimes";
import { z } from "zod";

import { DB, kdb } from "../../../../../db/db";
import { cleanNull } from "../../../../../utils/noNull";
import {
  countPlacesColorees,
  countPlacesColoreesFermees,
  countPlacesColoreesOuvertes,
  countPlacesFermees,
  countPlacesOuvertes,
  countPlacesTransformeesParCampagne,
} from "../../../../utils/countCapacite";
import { isDemandeProjetOrValidee } from "../../../../utils/isDemandeProjetOrValidee";
import { isDemandeNotDeletedOrRefused } from "../../../../utils/isDemandeSelectable";
import { hasContinuum } from "../../../utils/hasContinuum";
import { selectPositionQuadrant } from "../../../utils/positionFormationRegionaleQuadrant";
import { withTauxDevenirFavorableReg } from "../../../utils/tauxDevenirFavorable";
import { withInsertionReg } from "../../../utils/tauxInsertion6mois";
import { withPoursuiteReg } from "../../../utils/tauxPoursuite";
import { withTauxPressionReg } from "../../../utils/tauxPression";
import { getFormationsPilotageIntentionsSchema } from "../getFormationsPilotageIntentions.schema";
import { getEffectifsParCampagneCodeNiveauDiplomeCodeRegionQuery } from "./getEffectifsParCampagneCodeNiveauDiplomeCodeRegion.dep";

export interface Filters
  extends z.infer<typeof getFormationsPilotageIntentionsSchema.querystring> {
  millesimeSortie?: (typeof MILLESIMES_IJ)[number];
  campagne: string;
}

const selectNbDemandes = (eb: ExpressionBuilder<DB, "demande">) =>
  eb.fn.count<number>("demande.numero").distinct();

const selectNbEtablissements = (
  eb: ExpressionBuilder<DB, "dataEtablissement">
) => eb.fn.count<number>("dataEtablissement.uai").distinct();

export const getFormationsPilotageIntentionsQuery = ({
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
  CPC,
  secteur,
  campagne,
  withColoration,
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
    CPC,
    secteur,
    campagne,
    orderBy,
    order,
  });

  return kdb
    .selectFrom("latestDemandeIntentionView as demande")
    .innerJoin("campagne", (join) =>
      join.onRef("campagne.id", "=", "demande.campagneId")
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
            eb.val(getMillesimeFromCampagne(campagne))
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
      selectPositionQuadrant(eb).as("positionQuadrant"),
      "dataFormation.libelleFormation",
      "dispositif.libelleDispositif",
      "dataFormation.cfd",
      "demande.codeDispositif as codeDispositif",
      (eb) =>
        withInsertionReg({
          eb,
          millesimeSortie: getMillesimeFromCampagne(campagne),
          cfdRef: "demande.cfd",
          codeDispositifRef: "demande.codeDispositif",
          codeRegionRef: "dataEtablissement.codeRegion",
        }).as("tauxInsertion"),
      withPoursuiteReg({
        eb,
        millesimeSortie: getMillesimeFromCampagne(campagne),
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
        millesimeSortie: getMillesimeFromCampagne(campagne),
        cfdRef: "demande.cfd",
        codeDispositifRef: "demande.codeDispositif",
        codeRegionRef: "dataEtablissement.codeRegion",
      }).as("tauxDevenirFavorable"),
      selectNbDemandes(eb).as("nbDemandes"),
      selectNbEtablissements(eb).as("nbEtablissements"),
      eb.fn.sum<number>(countPlacesOuvertes(eb)).as("placesOuvertes"),
      eb.fn.sum<number>(countPlacesFermees(eb)).as("placesFermees"),
      eb.fn
        .sum<number>(countPlacesColoreesOuvertes(eb))
        .as("placesColoreesOuvertes"),
      eb.fn
        .sum<number>(countPlacesColoreesFermees(eb))
        .as("placesColoreesFermees"),
      eb.fn
        .sum<number>(countPlacesTransformeesParCampagne(eb))
        .as("placesTransformees"),
      hasContinuum({
        eb,
        millesimeSortie,
        cfdRef: "demande.cfd",
        codeDispositifRef: "demande.codeDispositif",
        codeRegionRef: "dataEtablissement.codeRegion",
      }).as("continuum"),
    ])
    .where((wb) => {
      if (!type) return wb.val(true);
      switch (type) {
        case "ouverture":
          return wb(countPlacesOuvertes(wb), ">", 0);
        case "fermeture":
          return wb(countPlacesFermees(wb), ">", 0);
        case "coloration":
          return wb(countPlacesColorees(wb), ">", 0);
        default:
          return wb.val(true);
      }
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
    .$call((eb) => {
      if (rentreeScolaire)
        return eb.where(
          "demande.rentreeScolaire",
          "in",
          rentreeScolaire.map((rentree) => parseInt(rentree))
        );
      return eb;
    })
    .$call((eb) => {
      if (CPC) return eb.where("dataFormation.cpc", "in", CPC);
      return eb;
    })
    .$call((eb) => {
      if (codeNsf) return eb.where("dataFormation.codeNsf", "in", codeNsf);
      return eb;
    })
    .$call((eb) => {
      if (codeNiveauDiplome)
        return eb.where(
          "dataFormation.codeNiveauDiplome",
          "in",
          codeNiveauDiplome
        );
      return eb;
    })
    .$call((eb) => {
      if (codeRegion)
        return eb.where("dataEtablissement.codeRegion", "=", codeRegion);
      return eb;
    })
    .$call((eb) => {
      if (codeDepartement)
        return eb.where(
          "dataEtablissement.codeDepartement",
          "=",
          codeDepartement
        );
      return eb;
    })
    .$call((eb) => {
      if (codeAcademie)
        return eb.where("dataEtablissement.codeAcademie", "=", codeAcademie);
      return eb;
    })
    .$call((eb) => {
      if (campagne) return eb.where("campagne.annee", "=", campagne);
      return eb;
    })
    .$call((q) => {
      if (!secteur || secteur.length === 0) return q;
      return q.where("dataEtablissement.secteur", "in", secteur);
    })
    .$call((q) => {
      if (!statut || statut.length === 0) {
        return q.where(isDemandeProjetOrValidee);
      }
      return q.where("demande.statut", "in", statut);
    })
    .$call((q) => {
      if (!withColoration || withColoration === "false")
        return q.where((w) =>
          w.or([
            w("demande.coloration", "=", false),
            w("demande.typeDemande", "!=", DemandeTypeEnum["coloration"]),
          ])
        );
      return q;
    })
    .$call((q) => {
      if (!orderBy || !order) return q;
      return q.orderBy(sql.ref(orderBy), sql`${sql.raw(order)} NULLS LAST`);
    })
    .where(isDemandeNotDeletedOrRefused)
    .$narrowType<{ tauxPoursuite: number; tauxInsertion: number }>()
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
    .orderBy("tauxDevenirFavorable", "desc")
    .execute()
    .then(cleanNull);
};
