import { sql } from "kysely";
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
  const countDemandes = await kdb
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
          CASE WHEN ${eb.ref("demande.statut")} = 'draft'
          THEN 1
          ELSE 0
          END
        ),
        0
      )`.as("draft")
    )
    .select((eb) =>
      sql<number>`COALESCE(
        SUM(
          CASE WHEN ${eb.ref("demande.statut")} = 'submitted'
          THEN 1
          ELSE 0
          END
        ),
        0
      )`.as("submitted")
    )
    .select((eb) =>
      sql<number>`COALESCE(
        SUM(
          CASE WHEN ${eb.ref("demande.statut")} = 'refused'
          THEN 1
          ELSE 0
          END
        ),
        0
      )`.as("refused")
    )
    .where(isDemandeNotDeleted)
    .where(isDemandeSelectable({ user }))
    .executeTakeFirstOrThrow()
    .then(cleanNull);

  return countDemandes;
};
