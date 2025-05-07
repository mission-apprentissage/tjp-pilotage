import type { ExpressionBuilder } from "kysely";
import { sql } from "kysely";
import { CampagneStatutEnum } from "shared/enum/campagneStatutEnum";

import type { DB } from "@/db/db";

export const isDemandeCampagneEnCours = (eb: ExpressionBuilder<DB, "demande">, alias?: string) => {
  const tableName = alias ?? "demande";

  return eb(
    sql<string>`${sql.table(tableName)}."campagneId"`,
    "in",
    eb.selectFrom("campagne").select("id").where("campagne.statut", "=", CampagneStatutEnum["en cours"])
  );
};
