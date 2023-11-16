import { sql } from "kysely";

import { kdb } from "../../../../db/db";
import { RequestUser } from "../../../core/model/User";
import { isDemandeSelectable } from "../../../utils/isDemandeSelectable";

export const countDemandes = async ({
  user,
}: {
  user: Pick<RequestUser, "id" | "role" | "codeRegion">;
}) => {
  const countDemandes = await kdb
    .selectFrom("demande")
    .select((eb) => sql<string>`count(${eb.ref("demande.id")})`.as("total"))
    .select((eb) =>
      sql<string>`SUM(CASE WHEN ${eb.ref(
        "demande.status"
      )} = 'draft' THEN 1 ELSE 0 END)`.as("draft")
    )
    .select((eb) =>
      sql<string>`SUM(CASE WHEN ${eb.ref(
        "demande.status"
      )} = 'submitted' THEN 1 ELSE 0 END)`.as("submitted")
    )
    .where(isDemandeSelectable({ user }))
    .executeTakeFirstOrThrow();

  return countDemandes;
};
