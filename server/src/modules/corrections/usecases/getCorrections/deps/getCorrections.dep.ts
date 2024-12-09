import { sql } from "kysely";
import { CURRENT_IJ_MILLESIME, CURRENT_RENTREE } from "shared";
import { TypeFormationSpecifiqueEnum } from "shared/enum/formationSpecifiqueEnum";
import { getMillesimeFromCampagne } from "shared/time/millesimes";
import { MAX_LIMIT } from "shared/utils/maxLimit";

import { getKbdClient } from "@/db/db";
import type { Filters } from "@/modules/corrections/usecases/getCorrections/getCorrections.usecase";
import { isScolaireIndicateurRegionSortie } from "@/modules/data/utils/isScolaire";
import { nbEtablissementFormationRegion } from "@/modules/data/utils/nbEtablissementFormationRegion";
import { selectPositionQuadrant } from "@/modules/data/utils/selectPositionQuadrant";
import { selectTauxDevenirFavorable } from "@/modules/data/utils/tauxDevenirFavorable";
import { selectTauxInsertion6mois } from "@/modules/data/utils/tauxInsertion6mois";
import { selectTauxPoursuite } from "@/modules/data/utils/tauxPoursuite";
import { selectTauxPressionParFormationEtParRegionDemande } from "@/modules/data/utils/tauxPression";
import { isDemandeNotDeleted, isDemandeSelectable } from "@/modules/utils/isDemandeSelectable";
import { isFormationActionPrioritaireDemande } from "@/modules/utils/isFormationActionPrioritaire";
import { getNormalizedSearchArray } from "@/modules/utils/normalizeSearch";
import { cleanNull } from "@/utils/noNull";

export const getCorrectionsQuery = async ({
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
  millesimeSortie = CURRENT_IJ_MILLESIME,
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

  const corrections = await getKbdClient()
    .selectFrom("correction")
    .innerJoin("latestDemandeView as demande", "demande.numero", "correction.intentionNumero")
    .innerJoin("campagne", (join) =>
      join.onRef("campagne.id", "=", "demande.campagneId").$call((eb) => {
        if (campagne) return eb.on("campagne.annee", "=", campagne);
        return eb;
      })
    )
    .innerJoin("dataFormation", "dataFormation.cfd", "demande.cfd")
    .leftJoin("formationScolaireView as formationView", "formationView.cfd", "demande.cfd")
    .leftJoin("nsf", "formationView.codeNsf", "nsf.codeNsf")
    .leftJoin("dataEtablissement", "dataEtablissement.uai", "demande.uai")
    .leftJoin("dispositif", "dispositif.codeDispositif", "demande.codeDispositif")
    .leftJoin("region", "region.codeRegion", "dataEtablissement.codeRegion")
    .leftJoin("academie", "academie.codeAcademie", "dataEtablissement.codeAcademie")
    .leftJoin("departement", "departement.codeDepartement", "dataEtablissement.codeDepartement")
    .leftJoin("niveauDiplome", "niveauDiplome.codeNiveauDiplome", "formationView.codeNiveauDiplome")
    .leftJoin("indicateurRegionSortie", (join) =>
      join
        .onRef("indicateurRegionSortie.cfd", "=", "demande.cfd")
        .onRef("indicateurRegionSortie.codeRegion", "=", "demande.codeRegion")
        .onRef("indicateurRegionSortie.codeDispositif", "=", "demande.codeDispositif")
        .on("indicateurRegionSortie.millesimeSortie", "=", millesimeSortie)
        .on(isScolaireIndicateurRegionSortie)
    )
    .leftJoin("user", "user.id", "demande.createdBy")
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
    .select((eb) => [
      eb.fn.count<number>("correction.id").over().as("count"),
      "demande.uai",
      "demande.cfd",
      "demande.codeDispositif",
      "demande.codeRegion",
      sql<string>`
        CONCAT(
          ${eb.ref("user.firstname")},
          ' ',
          ${eb.ref("user.lastname")}
        )`.as("userName"),
      "niveauDiplome.codeNiveauDiplome as codeNiveauDiplome",
      "niveauDiplome.libelleNiveauDiplome as niveauDiplome",
      "formationView.libelleFormation",
      "nsf.libelleNsf as libelleNsf",
      "dataEtablissement.libelleEtablissement",
      "dataEtablissement.commune as commune",
      "dataEtablissement.secteur",
      "dispositif.libelleDispositif",
      "region.libelleRegion as libelleRegion",
      "departement.libelleDepartement",
      "departement.codeDepartement as codeDepartement",
      "academie.libelleAcademie",
      "academie.codeAcademie as codeAcademie",
      "formationView.typeFamille",
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
      eb.fn
        .coalesce(
          sql<number>`
            ${eb.ref("correction.capaciteScolaire")} -
            ${eb.ref("demande.capaciteScolaire")}
          `,
          eb.val(0)
        )
        .as("ecartScolaire"),

      eb.fn
        .coalesce(
          sql<number>`
            ${eb.ref("correction.capaciteApprentissage")} -
            ${eb.ref("demande.capaciteApprentissage")}
          `,
          eb.val(0)
        )
        .as("ecartApprentissage"),
      "correction.capaciteScolaire as capaciteScolaireCorrigee",
      "correction.capaciteApprentissage as capaciteApprentissageCorrigee",
      "correction.intentionNumero",
      "correction.raison as raisonCorrection",
      "correction.motif as motifCorrection",
      "correction.autreMotif as autreMotifCorrection",
      "correction.createdAt",
      "correction.updatedAt",
      "correction.commentaire",
      selectPositionQuadrant(eb).as("positionQuadrant"),
      isFormationActionPrioritaireDemande(eb).as(TypeFormationSpecifiqueEnum["Action prioritaire"]),
      eb.ref("formationView.isTransitionDemographique").as(TypeFormationSpecifiqueEnum["Transition démographique"]),
      eb.ref("formationView.isTransitionEcologique").as(TypeFormationSpecifiqueEnum["Transition écologique"]),
      eb.ref("formationView.isTransitionNumerique").as(TypeFormationSpecifiqueEnum["Transition numérique"]),
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
                  unaccent(${eb.ref("formationView.libelleFormation")}),
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
      if (codeNiveauDiplome) return eb.where("formationView.codeNiveauDiplome", "in", codeNiveauDiplome);
      return eb;
    })
    .$call((eb) => {
      if (codeNsf) return eb.where("formationView.codeNsf", "in", codeNsf);
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
    .$call((eb) => {
      if (positionQuadrant)
        return eb.where("positionFormationRegionaleQuadrant.positionQuadrant", "=", positionQuadrant);
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
    .where(isDemandeSelectable({ user }))
    .where(isDemandeNotDeleted)
    .offset(offset)
    .limit(limit)
    .execute();

  const campagnes = await getKbdClient().selectFrom("campagne").selectAll().orderBy("annee desc").execute();

  return {
    corrections: corrections.map((correction) =>
      cleanNull({
        ...correction,
        createdAt: correction.createdAt?.toISOString(),
        updatedAt: correction.updatedAt?.toISOString(),
        formationSpecifique: {
          [TypeFormationSpecifiqueEnum["Action prioritaire"]]:
            !!correction[TypeFormationSpecifiqueEnum["Action prioritaire"]],
          [TypeFormationSpecifiqueEnum["Transition démographique"]]:
            !!correction[TypeFormationSpecifiqueEnum["Transition démographique"]],
          [TypeFormationSpecifiqueEnum["Transition écologique"]]:
            !!correction[TypeFormationSpecifiqueEnum["Transition écologique"]],
          [TypeFormationSpecifiqueEnum["Transition numérique"]]:
            !!correction[TypeFormationSpecifiqueEnum["Transition numérique"]],
        },
      })
    ),
    campagnes: campagnes.map(cleanNull),
    count: corrections[0]?.count || 0,
  };
};
