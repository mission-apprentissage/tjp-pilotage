import { sql } from "kysely";

import { kdb } from "../../../db/db";

export const countDemandes = async ({
  codeRegion,
}: {
  codeRegion?: string;
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
    .$call((q) => {
      if (!codeRegion) return q;
      return q.where("codeRegion", "=", codeRegion);
    })
    .executeTakeFirstOrThrow();

  return countDemandes;
};
