import { sql } from "kysely";

import { getKbdClient } from "@/db/db";

export const getRentreesScolaire = async () => {
  return (await getKbdClient()
    .selectFrom("campagne")
    .select(eb => [
      sql<number>`CAST(${eb.ref("annee")} AS INTEGER) + 1`.as("rentreeScolaire")
    ])
    .distinct()
    .execute())
    .map(({rentreeScolaire}) => rentreeScolaire.toString());
};
