import { sql } from "kysely";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import { z } from "zod";

import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";
import { RequestUser } from "../../../core/model/User";
import {
  isIntentionBrouillonVisible,
  isIntentionNotDeleted,
  isIntentionSelectable,
} from "../../../utils/isDemandeSelectable";
import { countIntentionsSchema } from "./countIntentions.schema";

export interface Filters
  extends z.infer<typeof countIntentionsSchema.querystring> {
  user: RequestUser;
}
export const countIntentionsQuery = async ({
  user,
  anneeCampagne,
}: Filters) => {
  const countIntentions = kdb
    .selectFrom("latestDemandeIntentionView as intention")
    .innerJoin("campagne", (join) =>
      join.onRef("campagne.id", "=", "intention.campagneId").$call((eb) => {
        if (anneeCampagne) {
          return eb.on("campagne.annee", "=", anneeCampagne);
        }
        return eb;
      })
    )
    .leftJoin("suivi", (join) =>
      join
        .onRef("suivi.intentionNumero", "=", "intention.numero")
        .on("suivi.userId", "=", user.id)
    )
    .select((eb) =>
      sql<number>`count(${eb.ref("intention.numero")})`.as("total")
    )
    .select((eb) =>
      sql<number>`COALESCE(
        SUM(
          CASE WHEN ${eb.ref("intention.statut")} = ${
            DemandeStatutEnum["proposition"]
          }
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
          CASE WHEN ${eb.ref("intention.statut")} = ${
            DemandeStatutEnum["projet de demande"]
          }
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
          CASE WHEN ${eb.ref("intention.statut")} = ${
            DemandeStatutEnum["demande validée"]
          }
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
          CASE WHEN ${eb.ref("intention.statut")} = ${
            DemandeStatutEnum["refusée"]
          }
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
          CASE WHEN ${eb.ref("intention.statut")} = ${
            DemandeStatutEnum["brouillon"]
          }
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
          CASE WHEN ${eb.ref("intention.statut")} = ${
            DemandeStatutEnum["dossier complet"]
          }
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
          CASE WHEN ${eb.ref("intention.statut")} = ${
            DemandeStatutEnum["dossier incomplet"]
          }
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
          CASE WHEN ${eb.ref("intention.statut")} = ${
            DemandeStatutEnum["prêt pour le vote"]
          }
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
    .where(isIntentionNotDeleted)
    .where(isIntentionSelectable({ user }))
    .where(isIntentionBrouillonVisible({ user }))
    .executeTakeFirstOrThrow()
    .then(cleanNull);

  return countIntentions;
};
