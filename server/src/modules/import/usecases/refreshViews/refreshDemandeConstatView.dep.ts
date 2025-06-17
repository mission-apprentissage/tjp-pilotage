import { sql } from "kysely";

import { getKbdClient } from "@/db/db";

export const refreshDemandeConstatMaterializedView = async () => {
  await getKbdClient().executeQuery(
    sql`
    REFRESH MATERIALIZED VIEW "demandeConstatView" WITH DATA;
    `.compile(getKbdClient())
  );
};
