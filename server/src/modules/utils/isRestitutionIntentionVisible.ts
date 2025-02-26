import * as Boom from "@hapi/boom";
import type { ExpressionBuilder } from "kysely";
import { sql } from "kysely";
import { getPermissionScope, RoleEnum } from "shared";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import {PermissionEnum} from 'shared/enum/permissionEnum';

import type { DB } from "@/db/db";
import type { RequestUser } from "@/modules/core/model/User";

export const isRestitutionIntentionVisible =
  ({ user }: { user: RequestUser }) =>
    (eb: ExpressionBuilder<DB, "demande">) => {
      const filters = getRestitutionIntentionsVisiblesFilters(user);

      if(filters.role === RoleEnum["invite"]) return eb
        .and([
          filters.codeRegion ? eb("demande.codeRegion", "=", filters.codeRegion) : sql<boolean>`true`,
          eb("demande.statut", "in", [DemandeStatutEnum["demande validée"], DemandeStatutEnum["refusée"]]),
        ]);

      return eb.and([
        filters.codeRegion ? eb("demande.codeRegion", "=", filters.codeRegion) : sql<boolean>`true`,
        filters.uais ? eb("demande.uai", "in", filters.uais) : sql<boolean>`true`,
        eb.or([
          eb.and([
            eb("demande.statut", "=", DemandeStatutEnum["brouillon"]), eb("demande.createdBy", "=", user.id)
          ]),
          eb("demande.statut", "!=", DemandeStatutEnum["brouillon"]),
        ]),
      ]);
    };

export const isRestitutionIntentionRegionVisible =
  ({ user }: { user: RequestUser }) =>
    (eb: ExpressionBuilder<DB, "region">) => {
      const filters = getRestitutionIntentionsVisiblesFilters(user);
      return eb.and([filters.codeRegion ? eb("region.codeRegion", "=", filters.codeRegion) : sql<boolean>`true`]);
    };

const getRestitutionIntentionsVisiblesFilters = (user?: RequestUser) => {
  if (!user) throw new Error("missing variable user");
  const scope = getPermissionScope(user?.role, PermissionEnum["restitution-intentions/lecture"]);
  if (!scope) throw Boom.forbidden();

  return {
    national: {},
    région: { codeRegion: user.codeRegion },
    uai: { uais: user.uais },
    role: { role: user.role, codeRegion: user.codeRegion },
    user: { userId: user.id },
  }[scope];
};
