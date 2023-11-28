import { sql } from "kysely";

import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";
import { RequestUser } from "../../../core/model/User";
import { isDemandeSelectable } from "../../../utils/isDemandeSelectable";

export const countDemandes = async ({
  user,
}: {
  user: Pick<RequestUser, "id" | "role" | "codeRegion">;
}) => {
  const countDemandes = await kdb
    .selectFrom("demande")
    .select((eb) => sql<number>`count(${eb.ref("demande.id")})`.as("total"))
    .select((eb) =>
      sql<number>`COALESCE(
        SUM(
          CASE WHEN ${eb.ref("demande.status")} = 'draft'
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
          CASE WHEN ${eb.ref("demande.status")} = 'submitted'
          THEN 1
          ELSE 0
          END
        ),
        0
      )`.as("submitted")
    )
    .where(isDemandeSelectable({ user }))
    .where("demande.id", "=", "none")
    .executeTakeFirstOrThrow()
    .then(cleanNull);

  return countDemandes;
};
