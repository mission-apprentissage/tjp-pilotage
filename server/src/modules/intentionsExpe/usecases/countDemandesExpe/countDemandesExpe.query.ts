import { sql } from "kysely";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import { z } from "zod";

import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";
import { RequestUser } from "../../../core/model/User";
import {
  isDemandeExpeNotDeleted,
  isDemandeExpeSelectable,
} from "../../../utils/isDemandeSelectable";
import { countDemandesSchema } from "./countDemandesExpe.schema";

export interface Filters
  extends z.infer<typeof countDemandesSchema.querystring> {
  user: RequestUser;
}
export const countDemandesQuery = async ({ user, anneeCampagne }: Filters) => {
  const countDemandes = kdb
    .selectFrom("latestDemandeExpeView as demandeExpe")
    .innerJoin("campagne", (join) =>
      join.onRef("campagne.id", "=", "demandeExpe.campagneId").$call((eb) => {
        if (anneeCampagne) {
          return eb.on("campagne.annee", "=", anneeCampagne);
        }
        return eb;
      })
    )
    .select((eb) =>
      sql<number>`count(${eb.ref("demandeExpe.numero")})`.as("total")
    )
    .select((eb) =>
      sql<number>`COALESCE(
        SUM(
          CASE WHEN ${eb.ref("demandeExpe.statut")} = ${DemandeStatutEnum.draft}
          THEN 1
          ELSE 0
          END
        ),
        0
      )`.as(DemandeStatutEnum.draft)
    )
    .select((eb) =>
      sql<number>`COALESCE(
        SUM(
          CASE WHEN ${eb.ref("demandeExpe.statut")} = ${
            DemandeStatutEnum.submitted
          }
          THEN 1
          ELSE 0
          END
        ),
        0
      )`.as(DemandeStatutEnum.submitted)
    )
    .select((eb) =>
      sql<number>`COALESCE(
        SUM(
          CASE WHEN ${eb.ref("demandeExpe.statut")} = ${
            DemandeStatutEnum.refused
          }
          THEN 1
          ELSE 0
          END
        ),
        0
      )`.as(DemandeStatutEnum.refused)
    )
    .where(isDemandeExpeNotDeleted)
    .where(isDemandeExpeSelectable({ user }))
    .executeTakeFirstOrThrow()
    .then(cleanNull);

  return countDemandes;
};
