import Boom from "@hapi/boom";
import { ExpressionBuilder, sql } from "kysely";
import { getPermissionScope } from "shared";

import { DB } from "../../../../db/schema";
import { RequestUser } from "../../../core/model/User";

export const isStatsDemandeVisible =
  ({ user }: { user: Pick<RequestUser, "id" | "role" | "codeRegion"> }) =>
    (eb: ExpressionBuilder<DB, "demande">) => {
      const filter = getStatsDemandesVisibleFilters(user);
      return eb.and([
        filter.codeRegion
          ? eb("demande.codeRegion", "=", filter.codeRegion)
          : sql`true`,
      ]);
    };

export const isRegionVisible =
  ({ user }: { user: Pick<RequestUser, "id" | "role" | "codeRegion"> }) =>
    (eb: ExpressionBuilder<DB, "region">) => {
      const filter = getStatsDemandesVisibleFilters(user);
      return eb.and([
        filter.codeRegion
          ? eb("region.codeRegion", "=", filter.codeRegion)
          : sql`true`,
      ]);
    };

const getStatsDemandesVisibleFilters = (
  user?: Pick<RequestUser, "id" | "role" | "codeRegion">
) => {
  if (!user) throw new Error("missing variable user");
  const scope = getPermissionScope(
    user?.role,
    "restitution-intentions/lecture"
  );
  if (!scope?.default) throw Boom.forbidden();

  const filter = {
    national: {},
    region: { codeRegion: user.codeRegion },
    user: {},
  }[scope?.default];

  return filter;
};
