import { sql } from "kysely";
import { jsonBuildObject } from "kysely/helpers/postgres";
import { z } from "zod";

import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";
import { RequestUser } from "../../../core/model/User";
import {
  countFermetures,
  countFermeturesApprentissage,
  countFermeturesSco,
  countOuvertures,
  countOuverturesApprentissage,
  countOuverturesSco,
  countPlacesColorees,
  countPlacesColoreesApprentissage,
  countPlacesColoreesSco,
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
    .select((eb) =>
      jsonBuildObject({
        total: sql<number>`
        COALESCE(
          SUM(
            ${countOuvertures(eb)} +
            ${countFermetures(eb)}
          ),
          0
        )`,
        scolaire: sql<number>`
        COALESCE(
          SUM(
            ${countOuverturesSco(eb)} +
            ${countFermeturesSco(eb)}
          ),
          0
        )`,
        apprentissage: sql<number>`
        COALESCE(
          SUM(
            ${countOuverturesApprentissage(eb)} +
            ${countFermeturesApprentissage(eb)}
          ),
          0
        )`,
      }).as("total")
    )
    .select((eb) =>
      jsonBuildObject({
        total: sql<number>`COALESCE(SUM(${countOuvertures(eb)}),0)`,
        scolaire: sql<number>`COALESCE(SUM(${countOuverturesSco(eb)}),0)`,
        apprentissage: sql<number>`COALESCE(
          SUM(${countOuverturesApprentissage(eb)}),0
        )`,
      }).as("ouvertures")
    )
    .select((eb) =>
      jsonBuildObject({
        total: sql<number>`COALESCE(SUM(${countFermetures(eb)}),0)`,
        scolaire: sql<number>`COALESCE(SUM(${countFermeturesSco(eb)}),0)`,
        apprentissage: sql<number>`COALESCE(
          SUM(${countFermeturesApprentissage(eb)}),0
        )`,
      }).as("fermetures")
    )
    .select((eb) =>
      jsonBuildObject({
        total: sql<number>`COALESCE(SUM(${countPlacesColorees(eb)}),0)`,
        scolaire: sql<number>`COALESCE(
          SUM(${countPlacesColoreesSco(eb)}),0
        )`,
        apprentissage: sql<number>`COALESCE(
          SUM(${countPlacesColoreesApprentissage(eb)}),0
        )`,
      }).as("coloration")
    )
    .select((eb) =>
      jsonBuildObject({
        total: sql<number>`
        COALESCE(
          SUM(
            CASE WHEN
            ${eb.ref("dataFormation.codeNiveauDiplome")} IN ('561', '461')
            THEN ${countOuvertures(eb)}
            ELSE 0
            END
          ),
          0
        )`,
        scolaire: sql<number>`
        COALESCE(
          SUM(
            CASE WHEN
            ${eb.ref("dataFormation.codeNiveauDiplome")} IN ('561', '461')
            THEN ${countOuverturesSco(eb)}
            ELSE 0
            END
          ),
          0
        )`,
        apprentissage: sql<number>`
        COALESCE(
          SUM(
            CASE WHEN
            ${eb.ref("dataFormation.codeNiveauDiplome")} IN ('561', '461')
            THEN ${countOuverturesApprentissage(eb)}
            ELSE 0
            END
          ),
          0
        )`,
      }).as("certifSpecialisation")
    )
    .select((eb) =>
      jsonBuildObject({
        total: sql<number>`
        COALESCE(
          SUM(
            CASE WHEN
            ${eb.ref(
              "dataFormation.codeNiveauDiplome"
            )} IN ('381', '481', '581')
            THEN ${countOuvertures(eb)}
            ELSE 0
            END
          ),
          0
        )`,
        scolaire: sql<number>`
        COALESCE(
          SUM(
            CASE WHEN
            ${eb.ref(
              "dataFormation.codeNiveauDiplome"
            )} IN ('381', '481', '581')
            THEN ${countOuverturesSco(eb)}
            ELSE 0
            END
          ),
          0
        )`,
        apprentissage: sql<number>`
        COALESCE(
          SUM(
            CASE WHEN
            ${eb.ref(
              "dataFormation.codeNiveauDiplome"
            )} IN ('381', '481', '581')
            THEN ${countOuverturesApprentissage(eb)}
            ELSE 0
            END
          ),
          0
        )`,
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
        return eb.where(
          "demande.coloration",
          "=",
          coloration === "true" ? sql<true>`true` : sql<false>`false`
        );
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
