import { sql } from "kysely";
import { jsonBuildObject } from "kysely/helpers/postgres";
import { CURRENT_RENTREE } from "shared";
import { getMillesimeFromRentreeScolaire } from "shared/utils/getMillesime";
import { z } from "zod";

import { DemandeTypeEnum } from "../../../../../../shared/enum/demandeTypeEnum";
import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";
import { RequestUser } from "../../../core/model/User";
import {
  countPlacesColoreesTransformees,
  countPlacesColoreesTransformeesApprentissage,
  countPlacesColoreesTransformeesScolaire,
  countPlacesFermees,
  countPlacesFermeesApprentissage,
  countPlacesFermeesScolaire,
  countPlacesNonColoreesTransformees,
  countPlacesNonColoreesTransformeesApprentissage,
  countPlacesNonColoreesTransformeesScolaire,
  countPlacesOuvertes,
  countPlacesOuvertesApprentissage,
  countPlacesOuvertesScolaire,
} from "../../../utils/countCapacite";
import { isRestitutionIntentionVisible } from "../../../utils/isRestitutionIntentionVisible";
import { getNormalizedSearchArray } from "../../../utils/normalizeSearch";
import { FiltersSchema } from "./getStatsRestitutionIntentions.schema";

export interface Filters extends z.infer<typeof FiltersSchema> {
  user: RequestUser;
}

const getStatsRestitutionIntentionsQuery = async ({
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
}: Filters) => {
  const search_array = getNormalizedSearchArray(search);

  const countDemandes = await kdb
    .selectFrom("latestDemandeIntentionView as demande")
    .innerJoin("campagne", (join) =>
      join.onRef("campagne.id", "=", "demande.campagneId").$call((eb) => {
        if (campagne) return eb.on("campagne.annee", "=", campagne);
        return eb;
      })
    )
    .leftJoin("dataFormation", "dataFormation.cfd", "demande.cfd")
    .leftJoin("dataEtablissement", "dataEtablissement.uai", "demande.uai")
    .leftJoin("nsf", "dataFormation.codeNsf", "nsf.codeNsf")
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
    .leftJoin(
      "niveauDiplome",
      "niveauDiplome.codeNiveauDiplome",
      "dataFormation.codeNiveauDiplome"
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
            eb.ref("positionFormationRegionaleQuadrant.codeDispositif"),
            "=",
            eb.ref("demande.codeDispositif")
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
    .select((eb) =>
      jsonBuildObject({
        total: eb.fn.coalesce(
          eb.fn.sum<number>(countPlacesNonColoreesTransformees(eb)),
          eb.val(0)
        ),
        scolaire: eb.fn.coalesce(
          eb.fn.sum<number>(countPlacesNonColoreesTransformeesScolaire(eb)),
          eb.val(0)
        ),
        apprentissage: eb.fn.coalesce(
          eb.fn.sum<number>(
            countPlacesNonColoreesTransformeesApprentissage(eb)
          ),
          eb.val(0)
        ),
      }).as("total")
    )
    .select((eb) =>
      jsonBuildObject({
        total: eb.fn.coalesce(
          eb.fn.sum<number>(countPlacesOuvertes(eb)),
          eb.val(0)
        ),
        scolaire: eb.fn.coalesce(
          eb.fn.sum<number>(countPlacesOuvertesScolaire(eb)),
          eb.val(0)
        ),
        apprentissage: eb.fn.coalesce(
          eb.fn.sum<number>(countPlacesOuvertesApprentissage(eb)),
          eb.val(0)
        ),
      }).as("ouvertures")
    )
    .select((eb) =>
      jsonBuildObject({
        total: eb.fn.coalesce(
          eb.fn.sum<number>(countPlacesFermees(eb)),
          eb.val(0)
        ),
        scolaire: eb.fn.coalesce(
          eb.fn.sum<number>(countPlacesFermeesScolaire(eb)),
          eb.val(0)
        ),
        apprentissage: eb.fn.coalesce(
          eb.fn.sum<number>(countPlacesFermeesApprentissage(eb)),
          eb.val(0)
        ),
      }).as("fermetures")
    )
    .select((eb) =>
      jsonBuildObject({
        total: eb.fn.coalesce(
          eb.fn.sum<number>(countPlacesColoreesTransformees(eb)),
          eb.val(0)
        ),
        scolaire: eb.fn.coalesce(
          eb.fn.sum<number>(countPlacesColoreesTransformeesScolaire(eb)),
          eb.val(0)
        ),
        apprentissage: eb.fn.coalesce(
          eb.fn.sum<number>(countPlacesColoreesTransformeesApprentissage(eb)),
          eb.val(0)
        ),
      }).as("coloration")
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
              .when(
                eb("dataFormation.codeNiveauDiplome", "in", [
                  "381",
                  "481",
                  "581",
                ])
              )
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
              .when(
                eb("dataFormation.codeNiveauDiplome", "in", [
                  "381",
                  "481",
                  "581",
                ])
              )
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
              .when(
                eb("dataFormation.codeNiveauDiplome", "in", [
                  "381",
                  "481",
                  "581",
                ])
              )
              .then(countPlacesOuvertesApprentissage(eb))
              .else(0)
              .end()
          ),
          eb.val(0)
        ),
      }).as("FCILs")
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
        return eb.where(
          "positionFormationRegionaleQuadrant.positionQuadrant",
          "=",
          positionQuadrant
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
      if (codeDepartement)
        return eb.where(
          "dataEtablissement.codeDepartement",
          "in",
          codeDepartement
        );
      return eb;
    })
    .$call((eb) => {
      if (codeAcademie)
        return eb.where("dataEtablissement.codeAcademie", "in", codeAcademie);
      return eb;
    })
    .$call((eb) => {
      if (uai) return eb.where("dataEtablissement.uai", "in", uai);
      return eb;
    })
    .$call((eb) => {
      if (rentreeScolaire && !Number.isNaN(rentreeScolaire))
        return eb.where(
          "demande.rentreeScolaire",
          "=",
          parseInt(rentreeScolaire)
        );
      return eb;
    })
    .$call((eb) => {
      if (typeDemande)
        return eb.where("demande.typeDemande", "in", typeDemande);
      return eb;
    })
    .$call((eb) => {
      if (cfd) return eb.where("demande.cfd", "in", cfd);
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
      if (coloration)
        switch (coloration) {
          case "with":
            return eb.where("demande.coloration", "=", true);
          case "without":
            return eb.where((w) =>
              w.or([
                w("demande.coloration", "=", false),
                w("demande.typeDemande", "!=", DemandeTypeEnum["coloration"]),
              ])
            );
          case "all":
          default:
            return eb;
        }
      return eb;
    })
    .$call((eb) => {
      if (amiCMA)
        return eb.where(
          "demande.amiCma",
          "=",
          amiCMA === "true" ? sql<true>`true` : sql<false>`false`
        );
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
            sql<boolean>`ABS(
              ${ebw.ref("demande.capaciteApprentissage")} -
              ${ebw.ref("demande.capaciteApprentissageActuelle")}
            ) > 1`
        );
      }

      if (voie === "scolaire") {
        return eb.where(
          ({ eb: ebw }) =>
            sql<boolean>`ABS(
              ${ebw.ref("demande.capaciteScolaire")} -
              ${ebw.ref("demande.capaciteScolaireActuelle")}
            ) > 1`
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
    .where(isRestitutionIntentionVisible({ user }))
    .executeTakeFirstOrThrow()
    .then(cleanNull);

  return countDemandes;
};

export const dependencies = {
  getStatsRestitutionIntentionsQuery,
};
