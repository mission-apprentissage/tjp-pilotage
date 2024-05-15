import { sql } from "kysely";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import { z } from "zod";

import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";
import { RequestUser } from "../../../core/model/User";
import {
  isDemandeNotDeleted,
  isDemandeSelectable,
} from "../../../utils/isDemandeSelectable";
import { countDemandesSchema } from "./countDemandes.schema";

export interface Filters
  extends z.infer<typeof countDemandesSchema.querystring> {
  user: RequestUser;
}
export const countDemandesQuery = async ({ user, anneeCampagne }: Filters) => {
  const countDemandes = kdb
    .selectFrom("latestDemandeView as demande")
    .innerJoin("campagne", (join) =>
      join.onRef("campagne.id", "=", "demande.campagneId").$call((eb) => {
        if (anneeCampagne) {
          return eb.on("campagne.annee", "=", anneeCampagne);
        }
        return eb;
      })
    )
    .select((eb) => sql<number>`count(${eb.ref("demande.numero")})`.as("total"))
    .select((eb) =>
      sql<number>`COALESCE(
        SUM(
          CASE WHEN ${eb.ref("demande.statut")} = ${
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
          CASE WHEN ${eb.ref("demande.statut")} = ${
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
          CASE WHEN ${eb.ref("demande.statut")} = ${
            DemandeStatutEnum["refusée"]
          }
          THEN 1
          ELSE 0
          END
        ),
        0
      )`.as(DemandeStatutEnum["refusée"])
    )
    .where(isDemandeNotDeleted)
    .where(isDemandeSelectable({ user }))
    .executeTakeFirstOrThrow()
    .then(cleanNull);

  return countDemandes;
};
