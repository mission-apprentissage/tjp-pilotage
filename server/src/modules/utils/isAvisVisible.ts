import type { ExpressionBuilder } from "kysely";
import { sql } from "kysely";
import { AvisTypeEnum } from "shared/enum/avisTypeEnum";

import type { DB } from "@/db/db";
import type { RequestUser } from "@/modules/core/model/User";

/**
 * Un avis est visible :
 * - par tous s'ils ne sont pas de type "consultatif" et qu'ils ne sont pas marqués comme étant visibles par tous
 * - par les utilisateurs ayant un rôle d'admin, d'admin de région, de gestionnaire, de gestionnaire de région, de pilote national ou de région
 * - par l'utilisateur qui a saisi l'avis considéré
 */
export const isAvisVisible =
  ({ user }: { user: RequestUser }) =>
    (eb: ExpressionBuilder<DB, "avis" | "user">) => {
      return eb.or([
        eb.and([
          eb("avis.typeAvis", "=", AvisTypeEnum["consultatif"]),
          eb("avis.isVisibleParTous", "=", sql<boolean>`false`),
          eb
            .selectFrom("user")
            .where("user.id", "=", user.id)
            .select((eb) =>
              sql<boolean>`${eb("user.role", "in", [
                "admin",
                "admin_region",
                "gestionnaire",
                "gestionnaire_region",
                "pilote",
                "pilote_region",
              ])}`.as("isUserAllowedToSeeAvis")
            ),
        ]),
        eb("avis.isVisibleParTous", "=", sql<boolean>`true`),
        eb("avis.createdBy", "=", user.id),
      ]);
    };
