import { ExpressionBuilder, ExpressionWrapper, sql, SqlBool } from "kysely";
import { CURRENT_ANNEE_CAMPAGNE } from "shared/time/CURRENT_ANNEE_CAMPAGNE";

import { DB } from "../../db/db";
import { RequestUser } from "../core/model/User";

export const isAllowedToSeePreviousCampagnes =
  ({ user }: { user: RequestUser }) =>
  (
    eb: ExpressionBuilder<DB, "campagne">
  ): ExpressionWrapper<DB, "demande", SqlBool> => {
    return eb.and([
      user.role === "invite"
        ? eb("campagne.annee", "=", CURRENT_ANNEE_CAMPAGNE)
        : sql<boolean>`true`,
    ]);
  };
