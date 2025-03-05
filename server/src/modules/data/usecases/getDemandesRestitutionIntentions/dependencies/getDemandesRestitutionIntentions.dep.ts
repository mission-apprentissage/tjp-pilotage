import { sql } from "kysely";
import { CURRENT_RENTREE } from "shared";
import { TypeFormationSpecifiqueEnum } from "shared/enum/formationSpecifiqueEnum";
import { getMillesimeFromCampagne } from "shared/time/millesimes";
import { MAX_LIMIT } from "shared/utils/maxLimit";

import { getKbdClient } from "@/db/db";
import type { Filters } from "@/modules/data/usecases/getDemandesRestitutionIntentions/getDemandesRestitutionIntentions.usecase";
import { capaciteAnnee } from "@/modules/data/utils/capaciteAnnee";
import { effectifAnnee } from "@/modules/data/utils/effectifAnnee";
import { isScolaireIndicateurRegionSortie } from "@/modules/data/utils/isScolaire";
import { nbEtablissementFormationRegion } from "@/modules/data/utils/nbEtablissementFormationRegion";
import { premiersVoeuxAnnee } from "@/modules/data/utils/premiersVoeuxAnnee";
import { selectPositionQuadrant } from "@/modules/data/utils/selectPositionQuadrant";
import { selectTauxDevenirFavorable } from "@/modules/data/utils/tauxDevenirFavorable";
import { selectTauxInsertion6mois } from "@/modules/data/utils/tauxInsertion6mois";
import { selectTauxPoursuite } from "@/modules/data/utils/tauxPoursuite";
import { selectTauxPression, selectTauxPressionParFormationEtParRegionDemande } from "@/modules/data/utils/tauxPression";
import { selectTauxRemplissage } from "@/modules/data/utils/tauxRemplissage";
import { castDemandeStatutWithoutSupprimee } from "@/modules/utils/castDemandeStatut";
import { castTypeDemande } from "@/modules/utils/castTypeDemande";
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
import { getNormalizedSearchArray } from "@/modules/utils/normalizeSearch";
import { cleanNull } from "@/utils/noNull";

export const getDemandesRestitutionIntentionsQuery = async ({
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
  const search_array = getNormalizedSearchArray(search);
  const demandes = await getKbdClient()
    .selectFrom("latestDemandeIntentionView as demande")
    .innerJoin("campagne", (join) =>
      join.onRef("campagne.id", "=", "demande.campagneId").$call((eb) => {
        if (campagne) return eb.on("campagne.annee", "=", campagne);
        return eb;
      })
    )
    .leftJoin("dataFormation", "dataFormation.cfd", "demande.cfd")
    .leftJoin("dataEtablissement", "dataEtablissement.uai", "demande.uai")
    .leftJoin("dispositif", "dispositif.codeDispositif", "demande.codeDispositif")
    .leftJoin("region", "region.codeRegion", "dataEtablissement.codeRegion")
    .leftJoin("academie", "academie.codeAcademie", "dataEtablissement.codeAcademie")
    .leftJoin("departement", "departement.codeDepartement", "dataEtablissement.codeDepartement")
    .leftJoin("niveauDiplome", "niveauDiplome.codeNiveauDiplome", "dataFormation.codeNiveauDiplome")
    .leftJoin("nsf", "nsf.codeNsf", "dataFormation.codeNsf")
    .leftJoin("formationScolaireView as formationView", "formationView.cfd", "demande.cfd")
    .leftJoin("indicateurRegionSortie", (join) =>
      join
        .onRef("indicateurRegionSortie.cfd", "=", "demande.cfd")
        .onRef("indicateurRegionSortie.codeRegion", "=", "demande.codeRegion")
        .onRef("indicateurRegionSortie.codeDispositif", "=", "demande.codeDispositif")
        .on("indicateurRegionSortie.millesimeSortie", "=", getMillesimeFromCampagne(campagne))
        .on(isScolaireIndicateurRegionSortie)
    )
    .leftJoin("positionFormationRegionaleQuadrant", (join) =>
      join.on((eb) =>
        eb.and([
          eb(eb.ref("positionFormationRegionaleQuadrant.cfd"), "=", eb.ref("demande.cfd")),
          eb(eb.ref("positionFormationRegionaleQuadrant.codeDispositif"), "=", eb.ref("demande.codeDispositif")),
          eb(eb.ref("positionFormationRegionaleQuadrant.codeRegion"), "=", eb.ref("dataEtablissement.codeRegion")),
          eb("positionFormationRegionaleQuadrant.millesimeSortie", "=", getMillesimeFromCampagne(campagne)),
        ])
      )
    )
    .leftJoin("actionPrioritaire", (join) =>
      join
        .onRef("actionPrioritaire.cfd", "=", "demande.cfd")
        .onRef("actionPrioritaire.codeDispositif", "=", "demande.codeDispositif")
        .onRef("actionPrioritaire.codeRegion", "=", "demande.codeRegion")
    )
    .leftJoin((eb) => eb.selectFrom("formationScolaireView")
      .innerJoin("formationEtablissement", (join) =>
        join
          .onRef("formationEtablissement.cfd", "=", "formationScolaireView.cfd")
          .onRef("formationEtablissement.voie", "=", "formationScolaireView.voie")
      )
      .innerJoin("indicateurEntree", "indicateurEntree.formationEtablissementId", "formationEtablissement.id")
      .select(sb => [
        sql<number>`CAST(${sb.ref("indicateurEntree.rentreeScolaire")} AS INT)`.as("rentreeScolaire"),
        sb.ref("formationScolaireView.cfd").as("cfd"),
        sb.ref("formationEtablissement.codeDispositif").as("codeDispositif"),
        sb.ref("formationScolaireView.voie").as("voie"),
        sb.ref("formationEtablissement.uai").as("uai"),
        capaciteAnnee({ alias: "indicateurEntree"}).as("capacite"),
        effectifAnnee({ alias: "indicateurEntree" }).as("effectifEntree"),
        premiersVoeuxAnnee({alias: "indicateurEntree"}).as("premierVoeu"),
        selectTauxPression("indicateurEntree", "formationScolaireView", true).as("pression"),
        selectTauxRemplissage("indicateurEntree").as("remplissage")
      ]).as("tauxEntree"),
    (join) => join.onRef("tauxEntree.cfd", "=", "demande.cfd").onRef("tauxEntree.rentreeScolaire", "=", "demande.rentreeScolaire").onRef("tauxEntree.codeDispositif", "=", "demande.codeDispositif").onRef("tauxEntree.uai", "=", "demande.uai")
    )
    .selectAll("demande")
    .select((eb) => [
      sql<string>`count(*) over()`.as("count"),
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
      "campagne.annee as anneeCampagne",
      "campagne.statut as statutCampagne",
      "campagne.dateDebut as dateDebutCampagne",
      "campagne.dateFin as dateFinCampagne",
      countDifferenceCapaciteScolaire(eb).as("differenceCapaciteScolaire"),
      countDifferenceCapaciteApprentissage(eb).as("differenceCapaciteApprentissage"),
      countDifferenceCapaciteScolaireColoree(eb).as("differenceCapaciteScolaireColoree"),
      countDifferenceCapaciteApprentissageColoree(eb).as("differenceCapaciteApprentissageColoree"),
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
        cfdRef: "demande.cfd",
        codeDispositifRef: "demande.codeDispositif",
        codeRegionRef: "demande.codeRegion",
      }).as(TypeFormationSpecifiqueEnum["Action prioritaire"]),
      eb.ref("formationView.isTransitionDemographique").as(TypeFormationSpecifiqueEnum["Transition démographique"]),
      eb.ref("formationView.isTransitionEcologique").as(TypeFormationSpecifiqueEnum["Transition écologique"]),
      eb.ref("formationView.isTransitionNumerique").as(TypeFormationSpecifiqueEnum["Transition numérique"]),
      eb.ref("tauxEntree.capacite").as("pilotageCapacite"),
      eb.ref("tauxEntree.effectifEntree").as("pilotageEffectif"),
      eb.ref("tauxEntree.pression").as("pilotageTauxPression"),
      eb.ref("tauxEntree.remplissage").as("pilotageTauxRemplissage"),
      eb.ref("tauxEntree.premierVoeu").as("pilotagePremierVoeu"),
      sql<boolean>`LEFT(${eb.ref("demande.cfd")}, 3) = '320'`.as("isBTS"),
    ])
    .$call((eb) => {
      if (search)
        return eb.where((eb) =>
          eb.and(
            search_array.map((search_word) =>
              eb(
                sql`concat(
                  unaccent(${eb.ref("demande.numero")}),
                  ' ',
                  unaccent(${eb.ref("demande.cfd")}),
                  ' ',
                  unaccent(${eb.ref("dataFormation.libelleFormation")}),
                  ' ',
                  unaccent(${eb.ref("niveauDiplome.libelleNiveauDiplome")}),
                  ' ',
                  unaccent(${eb.ref("nsf.libelleNsf")}),
                  ' ',
                  unaccent(${eb.ref("dataEtablissement.libelleEtablissement")}),
                  ' ',
                  unaccent(${eb.ref("dataEtablissement.commune")}),
                  ' ',
                  unaccent(${eb.ref("region.libelleRegion")}),
                  ' ',
                  unaccent(${eb.ref("academie.libelleAcademie")}),
                  ' ',
                  unaccent(${eb.ref("departement.libelleDepartement")})
                )`,
                "ilike",
                `%${search_word}%`
              )
            )
          )
        );
      return eb;
    })
    .$call((eb) => {
      if (positionQuadrant)
        return eb.where("positionFormationRegionaleQuadrant.positionQuadrant", "=", positionQuadrant);
      return eb;
    })
    .$call((eb) => {
      if (statut) return eb.where("demande.statut", "in", statut);
      return eb;
    })
    .$call((eb) => {
      if (codeRegion) return eb.where("demande.codeRegion", "in", codeRegion);
      return eb;
    })
    .$call((eb) => {
      if (codeDepartement) return eb.where("dataEtablissement.codeDepartement", "in", codeDepartement);
      return eb;
    })
    .$call((eb) => {
      if (codeAcademie) return eb.where("dataEtablissement.codeAcademie", "in", codeAcademie);
      return eb;
    })
    .$call((eb) => {
      if (uai) return eb.where("dataEtablissement.uai", "in", uai);
      return eb;
    })
    .$call((eb) => {
      if (rentreeScolaire && !Number.isNaN(rentreeScolaire))
        return eb.where("demande.rentreeScolaire", "=", parseInt(rentreeScolaire));
      return eb;
    })
    .$call((eb) => {
      if (typeDemande) return eb.where("demande.typeDemande", "in", typeDemande);
      return eb;
    })
    .$call((eb) => {
      if (cfd) return eb.where("demande.cfd", "in", cfd);
      return eb;
    })
    .$call((eb) => {
      if (codeNiveauDiplome) return eb.where("dataFormation.codeNiveauDiplome", "in", codeNiveauDiplome);
      return eb;
    })
    .$call((eb) => {
      if (codeNsf) return eb.where("dataFormation.codeNsf", "in", codeNsf);
      return eb;
    })
    .$call((eb) => {
      if (coloration)
        return eb.where("demande.coloration", "=", coloration === "true" ? sql<true>`true` : sql<false>`false`);
      return eb;
    })
    .$call((eb) => {
      if (amiCMA) return eb.where("demande.amiCma", "=", amiCMA === "true" ? sql<true>`true` : sql<false>`false`);
      return eb;
    })
    .$call((eb) => {
      if (secteur) return eb.where("dataEtablissement.secteur", "=", secteur);
      return eb;
    })
    .$call((eb) => {
      if (voie === "apprentissage") {
        return eb.where(
          ({ eb: ebw }) =>
            sql<boolean>`abs(${ebw.ref(
              "demande.capaciteApprentissage"
            )} - ${ebw.ref("demande.capaciteApprentissageActuelle")}) > 1`
        );
      }

      if (voie === "scolaire") {
        return eb.where(
          ({ eb: ebw }) =>
            sql<boolean>`abs(${ebw.ref("demande.capaciteScolaire")} - ${ebw.ref(
              "demande.capaciteScolaireActuelle"
            )}) > 1`
        );
      }

      return eb;
    })
    .$call((q) => {
      if (formationSpecifique?.length) {
        return q.where((w) =>
          w.or([
            formationSpecifique.includes(TypeFormationSpecifiqueEnum["Action prioritaire"])
              ? w("actionPrioritaire.cfd", "is not", null)
              : sql.val(false),
            formationSpecifique.includes(TypeFormationSpecifiqueEnum["Transition écologique"])
              ? w("formationView.isTransitionEcologique", "=", true)
              : sql.val(false),
            formationSpecifique.includes(TypeFormationSpecifiqueEnum["Transition démographique"])
              ? w("formationView.isTransitionDemographique", "=", true)
              : sql.val(false),
            formationSpecifique.includes(TypeFormationSpecifiqueEnum["Transition numérique"])
              ? w("formationView.isTransitionNumerique", "=", true)
              : sql.val(false),
          ])
        );
      }
      return q;
    })
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
      campagne: {
        id: demande.campagneId,
        annee: demande.anneeCampagne,
        statut: demande.statutCampagne,
        dateDebut: demande.dateDebutCampagne?.toISOString(),
        dateFin: demande.dateFinCampagne?.toISOString(),
      },
      statut: castDemandeStatutWithoutSupprimee(demande.statut),
      typeDemande: castTypeDemande(demande.typeDemande),
      createdAt: demande.createdAt?.toISOString(),
      updatedAt: demande.updatedAt?.toISOString(),
      formationSpecifique: formatFormationSpecifique(demande),
    })),
    count: parseInt(demandes[0]?.count) || 0,
  };
};
