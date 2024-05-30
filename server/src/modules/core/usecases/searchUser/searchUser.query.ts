import { Role } from "shared";
import { Scope } from "shared/security/permissions";

import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";
import { getNormalizedSearch } from "../../../utils/normalizeSearch";

export const searchUserQuery = async ({
  search,
  scope,
  scopeFilter,
}: {
  search: string;
  scope: Scope;
  scopeFilter: Array<string>;
}) => {
  const users = await kdb
    .selectFrom("user")
    .selectAll()
    .where("email", "ilike", `%${getNormalizedSearch(search).trim()}%`)
    .$call((q) => {
      if (scope === "region") {
        return q.where("user.codeRegion", "in", scopeFilter);
      }
      return q;
    })
    .$narrowType<{ role: Role }>()
    .limit(20)
    .execute();

  return users.map(cleanNull).map((user) => ({
    ...user,
    createdAt: user.createdAt?.toISOString(),
  }));
};
