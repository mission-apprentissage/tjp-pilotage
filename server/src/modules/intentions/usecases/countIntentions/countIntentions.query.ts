import { sql } from "kysely";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";

import { getKbdClient } from "@/db/db";
import {
  isIntentionBrouillonVisible,
  isIntentionSelectable,
} from "@/modules/utils/isDemandeSelectable";
import { getNormalizedSearchArray } from "@/modules/utils/normalizeSearch";
import { cleanNull } from "@/utils/noNull";

import type { Filters } from "./countIntentions.usecase";

export const countIntentionsQuery = async ({
  user,
  campagne,
  search,
  codeAcademie,
  codeNiveauDiplome,
}: Filters) => {
  const search_array = getNormalizedSearchArray(search);
  const countIntentions = getKbdClient()
    .selectFrom("latestDemandeIntentionView as intention")
    .leftJoin("dataFormation", "dataFormation.cfd", "intention.cfd")
    .leftJoin("dataEtablissement", "dataEtablissement.uai", "intention.uai")
    .leftJoin("departement", "departement.codeDepartement", "dataEtablissement.codeDepartement")
    .leftJoin("academie", "academie.codeAcademie", "dataEtablissement.codeAcademie")
    .leftJoin("user", "user.id", "intention.createdBy")
    .innerJoin("campagne", "campagne.id", "intention.campagneId")
    .leftJoin("suivi", (join) =>
      join.onRef("suivi.intentionNumero", "=", "intention.numero").on("suivi.userId", "=", user.id)
    )
    .select((eb) => sql<number>`count(${eb.ref("intention.numero")})`.as("total"))
    .select((eb) =>
      sql<number>`COALESCE(
        SUM(
          CASE WHEN ${eb.ref("intention.statut")} = ${DemandeStatutEnum["proposition"]}
          THEN 1
          ELSE 0
          END
        ),
        0
      )`.as(DemandeStatutEnum["proposition"])
    )
    .select((eb) =>
      sql<number>`COALESCE(
        SUM(
          CASE WHEN ${eb.ref("intention.statut")} = ${DemandeStatutEnum["projet de demande"]}
          THEN 1
          ELSE 0
          END
        ),
        0
      )`.as(DemandeStatutEnum["projet de demande"])
    )
    .select((eb) =>
      sql<number>`COALESCE(
        SUM(
          CASE WHEN ${eb.ref("intention.statut")} = ${DemandeStatutEnum["demande validée"]}
          THEN 1
          ELSE 0
          END
        ),
        0
      )`.as(DemandeStatutEnum["demande validée"])
    )
    .select((eb) =>
      sql<number>`COALESCE(
        SUM(
          CASE WHEN ${eb.ref("intention.statut")} = ${DemandeStatutEnum["refusée"]}
          THEN 1
          ELSE 0
          END
        ),
        0
      )`.as(DemandeStatutEnum["refusée"])
    )
    .select((eb) =>
      sql<number>`COALESCE(
        SUM(
          CASE WHEN ${eb.ref("intention.statut")} = ${DemandeStatutEnum["brouillon"]}
          THEN 1
          ELSE 0
          END
        ),
        0
      )`.as(DemandeStatutEnum["brouillon"])
    )
    .select((eb) =>
      sql<number>`COALESCE(
        SUM(
          CASE WHEN ${eb.ref("intention.statut")} = ${DemandeStatutEnum["dossier complet"]}
          THEN 1
          ELSE 0
          END
        ),
        0
      )`.as(DemandeStatutEnum["dossier complet"])
    )
    .select((eb) =>
      sql<number>`COALESCE(
        SUM(
          CASE WHEN ${eb.ref("intention.statut")} = ${DemandeStatutEnum["dossier incomplet"]}
          THEN 1
          ELSE 0
          END
        ),
        0
      )`.as(DemandeStatutEnum["dossier incomplet"])
    )
    .select((eb) =>
      sql<number>`COALESCE(
        SUM(
          CASE WHEN ${eb.ref("intention.statut")} = ${DemandeStatutEnum["prêt pour le vote"]}
          THEN 1
          ELSE 0
          END
        ),
        0
      )`.as(DemandeStatutEnum["prêt pour le vote"])
    )
    .select((eb) =>
      sql<number>`COALESCE(
        SUM(
          CASE WHEN ${eb.ref("suivi.userId")} = ${user.id}
          THEN 1
          ELSE 0
          END
        ),
        0
      )`.as("suivies")
    )
    .$call((eb) => {
      if (search)
        return eb.where((eb) =>
          eb.and(
            search_array.map((search_word) =>
              eb(
                sql`concat(
                  unaccent(${eb.ref("intention.numero")}),
                  ' ',
                  unaccent(${eb.ref("dataFormation.libelleFormation")}),
                  ' ',
                  unaccent(${eb.ref("dataEtablissement.libelleEtablissement")})
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
      if (codeAcademie) {
        return eb.where("academie.codeAcademie", "in", codeAcademie);
      }
      return eb;
    })
    .$call((eb) => {
      if (codeNiveauDiplome) {
        return eb.where("dataFormation.codeNiveauDiplome", "in", codeNiveauDiplome);
      }
      return eb;
    })
    .$call((eb) => {
      if (campagne) {
        return eb.where("campagne.annee", "=", campagne);
      }
      return eb;
    })
    .where(isIntentionSelectable({ user }))
    .where(isIntentionBrouillonVisible({ user }))
    .executeTakeFirstOrThrow()
    .then(cleanNull);

  return countIntentions;
};
