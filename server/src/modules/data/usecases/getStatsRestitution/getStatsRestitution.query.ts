import { sql } from "kysely";
import { jsonBuildObject } from "kysely/helpers/postgres";
import { TypeFormationSpecifiqueEnum } from "shared/enum/formationSpecifiqueEnum";
import { getMillesimeFromCampagne } from "shared/time/millesimes";

import { getKbdClient } from "@/db/db";
import {
  countPlacesColorees,
  countPlacesColoreesFermees,
  countPlacesColoreesFermeesApprentissage,
  countPlacesColoreesFermeesScolaire,
  countPlacesColoreesOuvertes,
  countPlacesColoreesOuvertesApprentissage,
  countPlacesColoreesOuvertesScolaire,
  countPlacesFermees,
  countPlacesFermeesApprentissage,
  countPlacesFermeesScolaire,
  countPlacesOuvertes,
  countPlacesOuvertesApprentissage,
  countPlacesOuvertesScolaire,
  countPlacesTransformees,
  countPlacesTransformeesApprentissage,
  countPlacesTransformeesScolaire,
} from "@/modules/utils/countCapacite";
import { isDemandeSelectable } from "@/modules/utils/isDemandeSelectable";
import { getNormalizedSearchArray } from "@/modules/utils/normalizeSearch";
import { cleanNull } from "@/utils/noNull";

import type { Filters } from "./getStatsRestitution.usecase";

export const getStatsRestitutionQuery = async ({
  statut,
  codeRegion,
  rentreeScolaire,
  typeDemande,
  cfd,
  codeNiveauDiplome,
  coloration,
  amiCMA,
  secteur,
  codeDepartement,
  codeAcademie,
  uai,
  user,
  voie,
  codeNsf,
  campagne,
  search,
  positionQuadrant,
  formationSpecifique,
}: Filters) => {
  const search_array = getNormalizedSearchArray(search);

  const countDemandes = await getKbdClient()
    .selectFrom("latestDemandeView as demande")
    .innerJoin("campagne", (join) =>
      join.onRef("campagne.id", "=", "demande.campagneId").$call((eb) => {
        if (campagne) return eb.on("campagne.annee", "=", campagne);
        return eb;
      })
    )
    .leftJoin("formationScolaireView as formationView", "formationView.cfd", "demande.cfd")
    .innerJoin("dataFormation", "dataFormation.cfd", "demande.cfd")
    .innerJoin("dataEtablissement", "dataEtablissement.uai", "demande.uai")
    .leftJoin("nsf", "dataFormation.codeNsf", "nsf.codeNsf")
    .leftJoin("region", "region.codeRegion", "dataEtablissement.codeRegion")
    .leftJoin("academie", "academie.codeAcademie", "dataEtablissement.codeAcademie")
    .leftJoin("departement", "departement.codeDepartement", "dataEtablissement.codeDepartement")
    .leftJoin("niveauDiplome", "niveauDiplome.codeNiveauDiplome", "dataFormation.codeNiveauDiplome")
    .leftJoin("positionFormationRegionaleQuadrant", (join) =>
      join.on((eb) =>
        eb.and([
          eb(eb.ref("positionFormationRegionaleQuadrant.cfd"), "=", eb.ref("demande.cfd")),
          eb(eb.ref("positionFormationRegionaleQuadrant.codeDispositif"), "=", eb.ref("demande.codeDispositif")),
          eb(eb.ref("positionFormationRegionaleQuadrant.codeRegion"), "=", eb.ref("dataEtablissement.codeRegion")),
          eb(
            eb.ref("positionFormationRegionaleQuadrant.millesimeSortie"),
            "=",
            eb.val(getMillesimeFromCampagne(campagne))
          ),
        ])
      )
    )
    .leftJoin("actionPrioritaire", (join) =>
      join
        .onRef("actionPrioritaire.cfd", "=", "demande.cfd")
        .onRef("actionPrioritaire.codeDispositif", "=", "demande.codeDispositif")
        .onRef("actionPrioritaire.codeRegion", "=", "demande.codeRegion")
    )
    .select((eb) =>
      [
        jsonBuildObject({
          total: eb.fn.coalesce(eb.fn.sum<number>(countPlacesTransformees(eb)), eb.val(0)),
          scolaire: eb.fn.coalesce(eb.fn.sum<number>(countPlacesTransformeesScolaire(eb)), eb.val(0)),
          apprentissage: eb.fn.coalesce(eb.fn.sum<number>(countPlacesTransformeesApprentissage(eb)), eb.val(0)),
        }).as("total"),
        jsonBuildObject({
          total: eb.fn.coalesce(eb.fn.sum<number>(countPlacesOuvertes(eb)), eb.val(0)),
          scolaire: eb.fn.coalesce(eb.fn.sum<number>(countPlacesOuvertesScolaire(eb)), eb.val(0)),
          apprentissage: eb.fn.coalesce(eb.fn.sum<number>(countPlacesOuvertesApprentissage(eb)), eb.val(0)),
        }).as("ouvertures"),
        jsonBuildObject({
          total: eb.fn.coalesce(eb.fn.sum<number>(countPlacesFermees(eb)), eb.val(0)),
          scolaire: eb.fn.coalesce(eb.fn.sum<number>(countPlacesFermeesScolaire(eb)), eb.val(0)),
          apprentissage: eb.fn.coalesce(eb.fn.sum<number>(countPlacesFermeesApprentissage(eb)), eb.val(0)),
        }).as("fermetures"),
        jsonBuildObject({
          total: eb.fn.coalesce(eb.fn.sum<number>(countPlacesColoreesOuvertes(eb)), eb.val(0)),
          scolaire: eb.fn.coalesce(eb.fn.sum<number>(countPlacesColoreesOuvertesScolaire(eb)), eb.val(0)),
          apprentissage: eb.fn.coalesce(eb.fn.sum<number>(countPlacesColoreesOuvertesApprentissage(eb)), eb.val(0)),
        }).as("ouverturesColorations"),
        jsonBuildObject({
          total: eb.fn.coalesce(eb.fn.sum<number>(countPlacesColoreesFermees(eb)), eb.val(0)),
          scolaire: eb.fn.coalesce(eb.fn.sum<number>(countPlacesColoreesFermeesScolaire(eb)), eb.val(0)),
          apprentissage: eb.fn.coalesce(eb.fn.sum<number>(countPlacesColoreesFermeesApprentissage(eb)), eb.val(0)),
        }).as("fermeturesColorations")
      ]
    )
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
      if(coloration === "true") return eb.where(
        (eb) => eb.or([
          sql<boolean>`${countPlacesColorees(eb)} > 0`,
        ])
      );
      if(coloration === "false") return eb.where(
        (eb) => eb.or([
          sql<boolean>`${countPlacesColorees(eb)} < 0`,
        ])
      );
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
          (eb) => eb.or([
            sql<boolean>`${countPlacesOuvertesApprentissage(eb)} > 0`,
            sql<boolean>`${countPlacesFermeesApprentissage(eb)} > 0`,
            sql<boolean>`${countPlacesColoreesOuvertesApprentissage(eb)} > 0`,
            sql<boolean>`${countPlacesColoreesFermeesApprentissage(eb)} > 0`,
          ])
        );
      }
      if (voie === "scolaire") {
        return eb.where(
          (eb) => eb.or([
            sql<boolean>`${countPlacesOuvertesScolaire(eb)} > 0`,
            sql<boolean>`${countPlacesFermeesScolaire(eb)} > 0`,
            sql<boolean>`${countPlacesColoreesOuvertesScolaire(eb)} > 0`,
            sql<boolean>`${countPlacesColoreesFermeesScolaire(eb)} > 0`,
          ])
        );
      }
      return eb;
    })
    .$call((eb) => {
      if (codeNsf && codeNsf.length > 0) {
        return eb.where("dataFormation.codeNsf", "in", codeNsf);
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
    .where(isDemandeSelectable({ user }))
    .executeTakeFirstOrThrow()
    .then(cleanNull);

  return countDemandes;
};
