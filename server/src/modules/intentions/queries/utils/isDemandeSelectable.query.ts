import Boom from "@hapi/boom";
import { ExpressionBuilder, sql } from "kysely";
import { getPermissionScope } from "shared";

import { DB } from "../../../../db/schema";
import { RequestUser } from "../../../core/model/User";

export const isDemandeSelectable =
  ({ user }: { user: Pick<RequestUser, "id" | "role" | "codeRegion"> }) =>
  (eb: ExpressionBuilder<DB, "demande">) => {
    const { filter, draftFilter } = getDemandeSelectableFilters(user);
    return eb.or([
      eb.and([
        eb("status", "=", "draft"),
        draftFilter.userId
          ? eb("demande.createurId", "=", draftFilter.userId)
          : sql`true`,
        draftFilter.codeRegion
          ? eb("demande.codeRegion", "=", draftFilter.codeRegion)
          : sql`true`,
      ]),
      eb.and([
        eb("status", "!=", "draft"),
        filter.codeRegion
          ? eb("demande.codeRegion", "=", filter.codeRegion)
          : sql`true`,
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
  }[scope?.draft];

  return { filter, draftFilter };
};
