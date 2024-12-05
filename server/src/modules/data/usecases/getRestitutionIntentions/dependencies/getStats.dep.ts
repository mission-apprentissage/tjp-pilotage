import { jsonBuildObject } from "kysely/helpers/postgres";

import type { Filters } from "@/modules/data/usecases/getRestitutionIntentions/getRestitutionIntentions.usecase";
import {
  countPlacesColoreesFermees,
  countPlacesColoreesFermeesApprentissage,
  countPlacesColoreesFermeesScolaire,
  countPlacesColoreesOuvertes,
  countPlacesColoreesOuvertesApprentissage,
  countPlacesColoreesOuvertesScolaire,
  countPlacesFermees,
  countPlacesFermeesApprentissage,
  countPlacesFermeesScolaire,
  countPlacesNonColoreesTransformees,
  countPlacesNonColoreesTransformeesApprentissage,
  countPlacesNonColoreesTransformeesScolaire,
  countPlacesOuvertes,
  countPlacesOuvertesApprentissage,
  countPlacesOuvertesScolaire,
} from "@/modules/utils/countCapacite";
import { isRestitutionIntentionVisible } from "@/modules/utils/isRestitutionIntentionVisible";
import { cleanNull } from "@/utils/noNull";

import { getBase } from "./getBase.dep";

export const getStats = async ({
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
  const countDemandes = await getBase({
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
  })
    .select((eb) =>
      jsonBuildObject({
        total: eb.fn.coalesce(eb.fn.sum<number>(countPlacesNonColoreesTransformees(eb)), eb.val(0)),
        scolaire: eb.fn.coalesce(eb.fn.sum<number>(countPlacesNonColoreesTransformeesScolaire(eb)), eb.val(0)),
        apprentissage: eb.fn.coalesce(
          eb.fn.sum<number>(countPlacesNonColoreesTransformeesApprentissage(eb)),
          eb.val(0)
        ),
      }).as("total")
    )
    .select((eb) =>
      jsonBuildObject({
        total: eb.fn.coalesce(eb.fn.sum<number>(countPlacesOuvertes(eb)), eb.val(0)),
        colorationTotal: eb.fn.coalesce(eb.fn.sum<number>(countPlacesColoreesOuvertes(eb)), eb.val(0)),
        scolaire: eb.fn.coalesce(eb.fn.sum<number>(countPlacesOuvertesScolaire(eb)), eb.val(0)),
        colorationScolaire: eb.fn.coalesce(eb.fn.sum<number>(countPlacesColoreesOuvertesScolaire(eb)), eb.val(0)),
        apprentissage: eb.fn.coalesce(eb.fn.sum<number>(countPlacesOuvertesApprentissage(eb)), eb.val(0)),
        colorationApprentissage: eb.fn.coalesce(
          eb.fn.sum<number>(countPlacesColoreesOuvertesApprentissage(eb)),
          eb.val(0)
        ),
      }).as("ouvertures")
    )
    .select((eb) =>
      jsonBuildObject({
        total: eb.fn.coalesce(eb.fn.sum<number>(countPlacesFermees(eb)), eb.val(0)),
        colorationTotal: eb.fn.coalesce(eb.fn.sum<number>(countPlacesColoreesFermees(eb)), eb.val(0)),
        scolaire: eb.fn.coalesce(eb.fn.sum<number>(countPlacesFermeesScolaire(eb)), eb.val(0)),
        colorationScolaire: eb.fn.coalesce(eb.fn.sum<number>(countPlacesColoreesFermeesScolaire(eb)), eb.val(0)),
        apprentissage: eb.fn.coalesce(eb.fn.sum<number>(countPlacesFermeesApprentissage(eb)), eb.val(0)),
        colorationApprentissage: eb.fn.coalesce(
          eb.fn.sum<number>(countPlacesColoreesFermeesApprentissage(eb)),
          eb.val(0)
        ),
      }).as("fermetures")
    )
    .select((eb) =>
      jsonBuildObject({
        total: eb.fn.coalesce(
          eb.fn.sum<number>((s) =>
            s
              .case()
              .when(eb("dataFormation.codeNiveauDiplome", "in", ["561", "461"]))
              .then(countPlacesOuvertes(eb))
              .else(0)
              .end()
          ),
          eb.val(0)
        ),
        scolaire: eb.fn.coalesce(
          eb.fn.sum<number>((s) =>
            s
              .case()
              .when(eb("dataFormation.codeNiveauDiplome", "in", ["561", "461"]))
              .then(countPlacesOuvertesScolaire(eb))
              .else(0)
              .end()
          ),
          eb.val(0)
        ),
        apprentissage: eb.fn.coalesce(
          eb.fn.sum<number>((s) =>
            s
              .case()
              .when(eb("dataFormation.codeNiveauDiplome", "in", ["561", "461"]))
              .then(countPlacesOuvertesApprentissage(eb))
              .else(0)
              .end()
          ),
          eb.val(0)
        ),
      }).as("certifSpecialisation")
    )
    .select((eb) =>
      jsonBuildObject({
        total: eb.fn.coalesce(
          eb.fn.sum<number>((s) =>
            s
              .case()
              .when(eb("dataFormation.codeNiveauDiplome", "in", ["381", "481", "581"]))
              .then(countPlacesOuvertes(eb))
              .else(0)
              .end()
          ),
          eb.val(0)
        ),
        scolaire: eb.fn.coalesce(
          eb.fn.sum<number>((s) =>
            s
              .case()
              .when(eb("dataFormation.codeNiveauDiplome", "in", ["381", "481", "581"]))
              .then(countPlacesOuvertesScolaire(eb))
              .else(0)
              .end()
          ),
          eb.val(0)
        ),
        apprentissage: eb.fn.coalesce(
          eb.fn.sum<number>((s) =>
            s
              .case()
              .when(eb("dataFormation.codeNiveauDiplome", "in", ["381", "481", "581"]))
              .then(countPlacesOuvertesApprentissage(eb))
              .else(0)
              .end()
          ),
          eb.val(0)
        ),
      }).as("FCILs")
    )
    .where(isRestitutionIntentionVisible({ user }))
    .executeTakeFirstOrThrow()
    .then(cleanNull);

  return countDemandes;
};
