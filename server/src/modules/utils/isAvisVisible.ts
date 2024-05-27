import { ExpressionBuilder, sql } from "kysely";

import { DB } from "../../db/db";
import { RequestUser } from "../core/model/User";
export const isAvisVisible =
  ({ user }: { user: RequestUser }) =>
  (eb: ExpressionBuilder<DB, "avis" | "user">) => {
    return eb.or([
      eb.and([
        eb("avis.isVisibleParTous", "=", sql<boolean>`false`),
        eb
          .selectFrom("user")
          .where("user.id", "=", user.id)
          .select((eb) =>
            sql<boolean>`${eb("user.role", "in", [
              "admin",
              "admin_ra",
              "gestionnaire",
              "gestionnaire_region",
              "pilote",
              "pilote_region",
            ])}`.as("isUserAllowedToSeeAvis")
          ),
      ]),
      eb("avis.isVisibleParTous", "=", sql<boolean>`true`),
    ]);
  };
