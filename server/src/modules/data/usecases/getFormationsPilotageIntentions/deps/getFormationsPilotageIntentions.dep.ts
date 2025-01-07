import type { ExpressionBuilder } from "kysely";
import { sql } from "kysely";
import type { MILLESIMES_IJ } from "shared";
import { CURRENT_IJ_MILLESIME } from "shared";
import { DemandeTypeEnum } from "shared/enum/demandeTypeEnum";
import { TypeFormationSpecifiqueEnum } from "shared/enum/formationSpecifiqueEnum";
import type { getFormationsPilotageIntentionsSchema } from "shared/routes/schemas/get.pilotage-intentions.formations.schema";
import { getMillesimeFromCampagne } from "shared/time/millesimes";
import type { z } from "zod";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";
import { hasContinuum } from "@/modules/data/utils/hasContinuum";
import { selectPositionQuadrant } from "@/modules/data/utils/selectPositionQuadrant";
import { withTauxDevenirFavorableReg } from "@/modules/data/utils/tauxDevenirFavorable";
import { withInsertionReg } from "@/modules/data/utils/tauxInsertion6mois";
import { withPoursuiteReg } from "@/modules/data/utils/tauxPoursuite";
import { withTauxPressionReg } from "@/modules/data/utils/tauxPression";
import {
  countPlacesColoreesFermees,
  countPlacesColoreesOuvertes,
  countPlacesColoreesTransformees,
  countPlacesFermees,
  countPlacesOuvertes,
  countPlacesTransformeesParCampagne,
} from "@/modules/utils/countCapacite";
import { formatFormationSpecifique } from "@/modules/utils/formatFormationSpecifique";
import { isDemandeProjetOrValidee } from "@/modules/utils/isDemandeProjetOrValidee";
import { isDemandeNotDeletedOrRefused } from "@/modules/utils/isDemandeSelectable";
import { isFormationActionPrioritaire } from "@/modules/utils/isFormationActionPrioritaire";
import { cleanNull } from "@/utils/noNull";

import { getEffectifsParCampagneCodeNiveauDiplomeCodeRegionQuery } from "./getEffectifsParCampagneCodeNiveauDiplomeCodeRegion.dep";

export interface Filters extends z.infer<typeof getFormationsPilotageIntentionsSchema.querystring> {
  millesimeSortie?: (typeof MILLESIMES_IJ)[number];
  campagne: string;
}

const selectNbDemandes = (eb: ExpressionBuilder<DB, "demande">) => eb.fn.count<number>("demande.numero").distinct();

const selectNbEtablissements = (eb: ExpressionBuilder<DB, "dataEtablissement">) =>
  eb.fn.count<number>("dataEtablissement.uai").distinct();

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

  return getKbdClient()
    .selectFrom("latestDemandeIntentionView as demande")
    .innerJoin("campagne", (join) => join.onRef("campagne.id", "=", "demande.campagneId"))
    .innerJoin("dataEtablissement", "dataEtablissement.uai", "demande.uai")
    .innerJoin("dataFormation", "dataFormation.cfd", "demande.cfd")
    .leftJoin("formationScolaireView as formationView", "formationView.cfd", "demande.cfd")
    .leftJoin("dispositif", "dispositif.codeDispositif", "demande.codeDispositif")
    .leftJoin("region", "region.codeRegion", "dataEtablissement.codeRegion")
    .leftJoin("academie", "academie.codeAcademie", "dataEtablissement.codeAcademie")
    .leftJoin("departement", "departement.codeDepartement", "dataEtablissement.codeDepartement")
    .leftJoin("positionFormationRegionaleQuadrant", (join) =>
      join.on((eb) =>
        eb.and([
          eb(eb.ref("positionFormationRegionaleQuadrant.cfd"), "=", eb.ref("demande.cfd")),
          eb(eb.ref("positionFormationRegionaleQuadrant.codeRegion"), "=", eb.ref("demande.codeRegion")),
          eb(
            eb.ref("positionFormationRegionaleQuadrant.millesimeSortie"),
            "=",
            eb.val(getMillesimeFromCampagne(campagne))
          ),
        ])
      )
    )
    .leftJoin(
      getKbdClient()
        .selectFrom(effectifs.as("effectifsParCampagneCodeNiveauDiplomeCodeRegion"))
        .select((eb) => [
          "effectifsParCampagneCodeNiveauDiplomeCodeRegion.annee",
          "effectifsParCampagneCodeNiveauDiplomeCodeRegion.cfd",
          "effectifsParCampagneCodeNiveauDiplomeCodeRegion.codeRegion",
          "effectifsParCampagneCodeNiveauDiplomeCodeRegion.codeNiveauDiplome",
          sql<number>`SUM(${eb.ref("effectifsParCampagneCodeNiveauDiplomeCodeRegion.denominateur")})`.as(
            "denominateur"
          ),
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
          .onRef("formationView.codeNiveauDiplome", "=", "effectifs.codeNiveauDiplome")
          .onRef("demande.codeRegion", "=", "effectifs.codeRegion")
    )
    .select((eb) => [
      sql<number>`COALESCE(${eb.ref("effectifs.denominateur")}, 0)`.as("effectif"),
      selectPositionQuadrant(eb).as("positionQuadrant"),
      "formationView.libelleFormation",
      "dispositif.libelleDispositif",
      "demande.cfd",
      "demande.codeDispositif",
      (eb) =>
        withInsertionReg({
          eb,
          millesimeSortie: getMillesimeFromCampagne(campagne),
          cfdRef: "demande.cfd",
          codeDispositifRef: "demande.codeDispositif",
          codeRegionRef: "demande.codeRegion",
        }).as("tauxInsertion"),
      withPoursuiteReg({
        eb,
        millesimeSortie: getMillesimeFromCampagne(campagne),
        cfdRef: "demande.cfd",
        codeDispositifRef: "demande.codeDispositif",
        codeRegionRef: "demande.codeRegion",
      }).as("tauxPoursuite"),
      withTauxPressionReg({
        eb,
        cfdRef: "demande.cfd",
        codeDispositifRef: "demande.codeDispositif",
        codeRegionRef: "demande.codeRegion",
      }).as("tauxPression"),
      withTauxDevenirFavorableReg({
        eb,
        millesimeSortie: getMillesimeFromCampagne(campagne),
        cfdRef: "demande.cfd",
        codeDispositifRef: "demande.codeDispositif",
        codeRegionRef: "demande.codeRegion",
      }).as("tauxDevenirFavorable"),
      selectNbDemandes(eb).as("nbDemandes"),
      selectNbEtablissements(eb).as("nbEtablissements"),
      eb.fn.sum<number>(countPlacesOuvertes(eb)).as("placesOuvertes"),
      eb.fn.sum<number>(countPlacesFermees(eb)).as("placesFermees"),
      eb.fn.sum<number>(countPlacesColoreesOuvertes(eb)).as("placesColoreesOuvertes"),
      eb.fn.sum<number>(countPlacesColoreesFermees(eb)).as("placesColoreesFermees"),
      eb.fn.sum<number>(countPlacesTransformeesParCampagne(eb)).as("placesTransformees"),
      hasContinuum({
        eb,
        millesimeSortie,
        cfdRef: "demande.cfd",
        codeDispositifRef: "demande.codeDispositif",
        codeRegionRef: "demande.codeRegion",
      }).as("continuum"),
      isFormationActionPrioritaire({
        cfdRef: "demande.cfd",
        codeDispositifRef: "demande.codeDispositif",
        codeRegionRef: "demande.codeRegion",
      }).as(TypeFormationSpecifiqueEnum["Action prioritaire"]),
      eb.ref("formationView.isTransitionDemographique").as(TypeFormationSpecifiqueEnum["Transition démographique"]),
      eb.ref("formationView.isTransitionEcologique").as(TypeFormationSpecifiqueEnum["Transition écologique"]),
      eb.ref("formationView.isTransitionNumerique").as(TypeFormationSpecifiqueEnum["Transition numérique"]),
    ])
    .where((wb) => {
      if (!type) return wb.val(true);
      switch (type) {
      case "ouverture":
        return wb(countPlacesOuvertes(wb), ">", 0);
      case "fermeture":
        return wb(countPlacesFermees(wb), ">", 0);
      case "coloration":
        return wb(countPlacesColoreesTransformees(wb), ">", 0);
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
            codeRegionRef: "demande.codeRegion",
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
      if (CPC) return eb.where("formationView.cpc", "in", CPC);
      return eb;
    })
    .$call((eb) => {
      if (codeNsf) return eb.where("formationView.codeNsf", "in", codeNsf);
      return eb;
    })
    .$call((eb) => {
      if (codeNiveauDiplome) return eb.where("formationView.codeNiveauDiplome", "in", codeNiveauDiplome);
      return eb;
    })
    .$call((eb) => {
      if (codeRegion) return eb.where("dataEtablissement.codeRegion", "=", codeRegion);
      return eb;
    })
    .$call((eb) => {
      if (codeDepartement) return eb.where("dataEtablissement.codeDepartement", "=", codeDepartement);
      return eb;
    })
    .$call((eb) => {
      if (codeAcademie) return eb.where("dataEtablissement.codeAcademie", "=", codeAcademie);
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
          w.or([w("demande.coloration", "=", false), w("demande.typeDemande", "!=", DemandeTypeEnum["coloration"])])
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
      "formationView.cfd",
      "demande.codeDispositif",
      "dispositif.libelleDispositif",
      "formationView.libelleFormation",
      "effectif",
      "dataFormation.typeFamille",
      "demande.codeRegion",
      "formationView.isTransitionDemographique",
      "formationView.isTransitionEcologique",
      "formationView.isTransitionNumerique",
      ...partition,
    ])
    .orderBy("tauxDevenirFavorable", "desc")
    .execute()
    .then(cleanNull)
    .then((formations) =>
      formations.map((formation) => ({
        ...formation,
        formationSpecifique: formatFormationSpecifique(formation),
      }))
    );
};
