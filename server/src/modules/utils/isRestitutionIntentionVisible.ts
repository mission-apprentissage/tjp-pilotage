import Boom from "@hapi/boom";
import { ExpressionBuilder, sql } from "kysely";
import { getPermissionScope } from "shared";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";

import { DB } from "../../db/db";
import { RequestUser } from "../core/model/User";

export const isRestitutionIntentionVisible =
  ({ user }: { user: RequestUser }) =>
  (eb: ExpressionBuilder<DB, "demande">) => {
    const filter = getRestitutionIntentionsVisiblesFilters(user);
    return eb.and([
      filter.codeRegion
        ? eb("demande.codeRegion", "=", filter.codeRegion)
        : sql<boolean>`true`,
      filter.uais
        ? eb.or(filter.uais.map((uai) => eb("demande.uai", "=", uai)))
        : sql<boolean>`true`,
      eb.or([
        eb.and([
          eb("demande.statut", "=", DemandeStatutEnum["brouillon"]),
          eb("demande.createdBy", "=", user.id),
        ]),
        eb("demande.statut", "!=", DemandeStatutEnum["brouillon"]),
      ]),
    ]);
  };

export const isRestitutionIntentionRegionVisible =
  ({ user }: { user: RequestUser }) =>
  (eb: ExpressionBuilder<DB, "region">) => {
    const filter = getRestitutionIntentionsVisiblesFilters(user);
    return eb.and([
      filter.codeRegion
        ? eb("region.codeRegion", "=", filter.codeRegion)
        : sql<boolean>`true`,
    ]);
  };

const getRestitutionIntentionsVisiblesFilters = (user?: RequestUser) => {
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
    uai: { uais: user.uais },
  }[scope?.default];

  return filter;
};
