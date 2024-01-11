import Boom from "@hapi/boom";
import { ExpressionBuilder, sql } from "kysely";
import { getPermissionScope } from "shared";

import { DB } from "../../db/db";
import { RequestUser } from "../core/model/User";

export const isDemandeSelectable =
  ({ user }: { user: Pick<RequestUser, "id" | "role" | "codeRegion"> }) =>
  (eb: ExpressionBuilder<DB, "demande">) => {
    const { filter, draftFilter } = getDemandeSelectableFilters(user);
    return eb.or([
      eb.and([
        eb("status", "=", "draft"),
        draftFilter.userId
          ? eb("demande.createurId", "=", draftFilter.userId)
          : sql<boolean>`true`,
        draftFilter.codeRegion
          ? eb("demande.codeRegion", "=", draftFilter.codeRegion)
          : sql<boolean>`true`,
      ]),
      eb.and([
        eb("status", "!=", "draft"),
        filter.codeRegion
          ? eb("demande.codeRegion", "=", filter.codeRegion)
          : sql<boolean>`true`,
      ]),
    ]);
  };

const getDemandeSelectableFilters = (
  user?: Pick<RequestUser, "id" | "role" | "codeRegion">
) => {
  if (!user) throw new Error("missing variable user");
  const scope = getPermissionScope(user?.role, "intentions/lecture");
  if (!scope?.draft) throw Boom.forbidden();

  const draftFilter = {
    national: {},
    region: { codeRegion: user.codeRegion },
    user: { userId: user.id },
  }[scope?.draft];

  const filter = {
    national: {},
    region: { codeRegion: user.codeRegion },
    user: { userId: user.id },
  }[scope?.default];

  return { filter, draftFilter };
};

export const isDemandeNotDeleted = (eb: ExpressionBuilder<DB, "demande">) =>
  eb("status", "!=", "deleted");

export const isDemandeNotDeletedOrRefused = (
  eb: ExpressionBuilder<DB, "demande">
) => eb("status", "not in", ["deleted", "refused"]);
