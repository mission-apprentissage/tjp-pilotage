import { sql } from "kysely";
import { CURRENT_RENTREE } from "shared";
import { TypeFormationSpecifiqueEnum } from "shared/enum/formationSpecifiqueEnum";
import { MAX_LIMIT } from "shared/utils/maxLimit";

import type { Filters } from "@/modules/data/usecases/getRestitutionIntentions/getRestitutionIntentions.usecase";
import { nbEtablissementFormationRegion } from "@/modules/data/utils/nbEtablissementFormationRegion";
import { selectPositionQuadrant } from "@/modules/data/utils/selectPositionQuadrant";
import { selectTauxDevenirFavorable } from "@/modules/data/utils/tauxDevenirFavorable";
import { selectTauxInsertion6mois } from "@/modules/data/utils/tauxInsertion6mois";
import { selectTauxPoursuite } from "@/modules/data/utils/tauxPoursuite";
import { selectTauxPressionParFormationEtParRegionDemande } from "@/modules/data/utils/tauxPression";
import { castDemandeStatutWithoutSupprimee } from "@/modules/utils/castDemandeStatut";
import {
  countDifferenceCapaciteApprentissage,
  countDifferenceCapaciteApprentissageColoree,
  countDifferenceCapaciteScolaire,
  countDifferenceCapaciteScolaireColoree,
} from "@/modules/utils/countCapacite";
import { formatFormationSpecifique } from "@/modules/utils/formatFormationSpecifique";
import { isDemandeNotDeleted } from "@/modules/utils/isDemandeSelectable";
import { isFormationActionPrioritaire } from "@/modules/utils/isFormationActionPrioritaire";
import { isRestitutionIntentionVisible } from "@/modules/utils/isRestitutionIntentionVisible";
import { cleanNull } from "@/utils/noNull";

import { getBase } from "./getBase.dep";

export const getDemandes = async ({
  statut,
  codeRegion,
  rentreeScolaire,
  typeDemande,
  cfd,
  codeNiveauDiplome,
  codeNsf,
  coloration,
  amiCMA,
  secteur,
  codeDepartement,
  codeAcademie,
  uai,
  user,
  voie,
  campagne,
  positionQuadrant,
  formationSpecifique,
  offset = 0,
  limit = MAX_LIMIT,
  order = "desc",
  orderBy = "createdAt",
  search,
}: Filters) => {
  const demandes = await getBase({
    statut,
    codeRegion,
    rentreeScolaire,
    typeDemande,
    cfd,
    codeNiveauDiplome,
    codeNsf,
    coloration,
    amiCMA,
    secteur,
    codeDepartement,
    codeAcademie,
    uai,
    user,
    voie,
    campagne,
    positionQuadrant,
    formationSpecifique,
    search,
  })
    .selectAll("demande")
    .select((eb) => [
      "dataFormation.libelleFormation",
      "dataFormation.typeFamille",
      "dispositif.libelleDispositif",
      "nsf.libelleNsf",
      "niveauDiplome.codeNiveauDiplome",
      "niveauDiplome.libelleNiveauDiplome",
      "dataEtablissement.libelleEtablissement",
      "dataEtablissement.commune",
      "dataEtablissement.secteur",
      "region.libelleRegion",
      "departement.libelleDepartement",
      "departement.codeDepartement",
      "academie.libelleAcademie",
      "academie.codeAcademie",
      countDifferenceCapaciteScolaire(eb).as("differenceCapaciteScolaire"),
      countDifferenceCapaciteApprentissage(eb).as("differenceCapaciteApprentissage"),
      countDifferenceCapaciteScolaireColoree(eb).as("differenceCapaciteScolaireColoree"),
      countDifferenceCapaciteApprentissageColoree(eb).as("differenceCapaciteApprentissageColoree"),
      sql<string>`count(*) over()`.as("count"),
      selectTauxInsertion6mois("indicateurRegionSortie").as("tauxInsertionRegional"),
      selectTauxPoursuite("indicateurRegionSortie").as("tauxPoursuiteRegional"),
      selectTauxDevenirFavorable("indicateurRegionSortie").as("tauxDevenirFavorableRegional"),
      selectTauxPressionParFormationEtParRegionDemande({
        eb,
        rentreeScolaire: CURRENT_RENTREE,
      }).as("tauxPressionRegional"),
      nbEtablissementFormationRegion({
        eb,
        rentreeScolaire: CURRENT_RENTREE,
      }).as("nbEtablissement"),
      selectPositionQuadrant(eb).as("positionQuadrant"),
      isFormationActionPrioritaire({
        cfdRef: "formationEtablissement.cfd",
        codeDispositifRef: "formationEtablissement.codeDispositif",
        codeRegionRef: "etablissement.codeRegion",
      }).as(TypeFormationSpecifiqueEnum["Action prioritaire"]),
      eb.ref("formationView.isTransitionDemographique").as(TypeFormationSpecifiqueEnum["Transition démographique"]),
      eb.ref("formationView.isTransitionEcologique").as(TypeFormationSpecifiqueEnum["Transition écologique"]),
      eb.ref("formationView.isTransitionNumerique").as(TypeFormationSpecifiqueEnum["Transition numérique"]),
    ])
    .$call((q) => {
      if (!orderBy || !order) return q;
      return q.orderBy(sql`${sql.ref(orderBy)}`, sql`${sql.raw(order)} NULLS LAST`);
    })
    .where(isDemandeNotDeleted)
    .where(isRestitutionIntentionVisible({ user }))
    .offset(offset)
    .limit(limit)
    .execute()
    .then(cleanNull);

  return {
    demandes: demandes.map((demande) => ({
      ...demande,
      statut: castDemandeStatutWithoutSupprimee(demande.statut),
      createdAt: demande.createdAt?.toISOString(),
      updatedAt: demande.updatedAt?.toISOString(),
      formationSpecifique: formatFormationSpecifique(demande),
    })),
    count: parseInt(demandes[0]?.count) || 0,
  };
};
