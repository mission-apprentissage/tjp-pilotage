import type { ExpressionBuilder } from "kysely";
import { sql } from "kysely";
import { TypeFormationSpecifiqueEnum } from "shared/enum/formationSpecifiqueEnum";
import { getMillesimeFromCampagne } from "shared/time/millesimes";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";
import type { Filters } from "@/modules/data/usecases/getPilotageIntentions/getPilotageIntentions.usecase";
import { hasContinuum } from "@/modules/data/utils/hasContinuum";
import { genericOnConstatRentree } from "@/modules/data/utils/onConstatDeRentree";
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
import { isDemandeNotDeletedOrRefused } from "@/modules/utils/isDemandeSelectable";
import { isFormationActionPrioritaire } from "@/modules/utils/isFormationActionPrioritaire";
import { cleanNull } from "@/utils/noNull";

const selectNbDemandes = (eb: ExpressionBuilder<DB, "demande">) => eb.fn.count<number>("demande.numero").distinct();

const selectNbEtablissements = (eb: ExpressionBuilder<DB, "dataEtablissement">) =>
  eb.fn.count<number>("dataEtablissement.uai").distinct();

export const getFormationsQuery = ({ filters }: { filters: Filters }) => {
  const partition = (() => {
    if (filters.codeDepartement) return ["dataEtablissement.codeDepartement"] as const;
    if (filters.codeAcademie) return ["dataEtablissement.codeAcademie"] as const;
    if (filters.codeRegion) return ["dataEtablissement.codeRegion"] as const;
    return [];
  })();

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
            eb.val(getMillesimeFromCampagne(filters.campagne))
          ),
        ])
      )
    )
    .leftJoin(
      genericOnConstatRentree(filters)
        .select((eb) => [
          eb.ref("campagne.annee").as("annee"),
          eb.ref("dataFormation.codeNiveauDiplome").as("codeNiveauDiplome"),
          eb.ref("dataEtablissement.codeRegion").as("codeRegion"),
          eb.ref("constatRentree.cfd").as("cfd"),
          sql<number>`SUM(${eb.ref("constatRentree.effectif")})`.as("effectif"),
        ])
        .groupBy(["annee", "constatRentree.cfd", "dataFormation.codeNiveauDiplome", "dataEtablissement.codeRegion"])
        .as("effectifs"),
      (join) =>
        join
          .onRef("campagne.annee", "=", "effectifs.annee")
          .onRef("demande.cfd", "=", "effectifs.cfd")
          .onRef("formationView.codeNiveauDiplome", "=", "effectifs.codeNiveauDiplome")
          .onRef("demande.codeRegion", "=", "effectifs.codeRegion")
    )
    .select((eb) => [
      sql<number>`COALESCE(${eb.ref("effectifs.effectif")}, 0)`.as("effectif"),
      selectPositionQuadrant(eb).as("positionQuadrant"),
      "dataFormation.libelleFormation",
      "dispositif.libelleDispositif",
      "demande.cfd",
      "demande.codeDispositif",
      withInsertionReg({
        eb,
        millesimeSortie: getMillesimeFromCampagne(filters.campagne),
        cfdRef: "demande.cfd",
        codeDispositifRef: "demande.codeDispositif",
        codeRegionRef: "demande.codeRegion",
      }).as("tauxInsertion"),
      withPoursuiteReg({
        eb,
        millesimeSortie: getMillesimeFromCampagne(filters.campagne),
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
        millesimeSortie: getMillesimeFromCampagne(filters.campagne),
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
        millesimeSortie: getMillesimeFromCampagne(filters.campagne),
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
      if (!filters.type) return wb.val(true);
      switch (filters.type) {
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
      if (!filters.tauxPression) return h.val(true);
      return h(
        (eb) =>
          withTauxPressionReg({
            eb,
            cfdRef: "demande.cfd",
            codeDispositifRef: "demande.codeDispositif",
            codeRegionRef: "demande.codeRegion",
          }),
        filters.tauxPression === "eleve" ? ">" : "<",
        filters.tauxPression === "eleve" ? 1.3 : 0.7
      );
    })
    .$call((eb) => {
      if (filters.rentreeScolaire)
        return eb.where(
          "demande.rentreeScolaire",
          "in",
          filters.rentreeScolaire.map((rentree) => parseInt(rentree))
        );
      return eb;
    })
    .$call((eb) => {
      if (filters.CPC) return eb.where("formationView.cpc", "in", filters.CPC);
      return eb;
    })
    .$call((eb) => {
      if (filters.codeNsf) return eb.where("formationView.codeNsf", "in", filters.codeNsf);
      return eb;
    })
    .$call((eb) => {
      if (filters.codeNiveauDiplome)
        return eb.where("formationView.codeNiveauDiplome", "in", filters.codeNiveauDiplome);
      return eb;
    })
    .$call((eb) => {
      if (filters.codeRegion) return eb.where("dataEtablissement.codeRegion", "=", filters.codeRegion);
      return eb;
    })
    .$call((eb) => {
      if (filters.codeDepartement) return eb.where("dataEtablissement.codeDepartement", "=", filters.codeDepartement);
      return eb;
    })
    .$call((eb) => {
      if (filters.codeAcademie) return eb.where("dataEtablissement.codeAcademie", "=", filters.codeAcademie);
      return eb;
    })
    .$call((eb) => {
      if (filters.campagne) return eb.where("campagne.annee", "=", filters.campagne);
      return eb;
    })
    .$call((eb) => {
      if (filters.secteur) return eb.where("dataEtablissement.secteur", "in", filters.secteur);
      return eb;
    })
    .$call((eb) => {
      if (filters.statut) return eb.where("demande.statut", "in", filters.statut);
      return eb;
    })
    .$call((eb) => {
      if (filters.coloration)
        return eb.where("demande.coloration", "=", filters.coloration === "true" ? sql<true>`true` : sql<false>`false`);
      return eb;
    })
    .$call((q) => {
      if (!filters.orderByFormations || !filters.orderFormations) return q;
      return q.orderBy(sql.ref(filters.orderByFormations), sql`${sql.raw(filters.orderFormations)} NULLS LAST`);
    })
    .where(isDemandeNotDeletedOrRefused)
    .$narrowType<{ tauxPoursuite: number; tauxInsertion: number }>()
    .groupBy([
      "positionFormationRegionaleQuadrant.positionQuadrant",
      "demande.cfd",
      "formationView.cfd",
      "demande.codeDispositif",
      "demande.codeRegion",
      "dispositif.libelleDispositif",
      "dataFormation.libelleFormation",
      "dataFormation.typeFamille",
      "formationView.isTransitionDemographique",
      "formationView.isTransitionEcologique",
      "formationView.isTransitionNumerique",
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
