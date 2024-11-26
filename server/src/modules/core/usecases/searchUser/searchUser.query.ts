import type { Role } from "shared";
import type { Scope } from "shared/security/permissions";

import { getKbdClient } from "@/db/db";
import { getNormalizedSearch } from "@/modules/utils/normalizeSearch";
import { cleanNull } from "@/utils/noNull";

export const searchUserQuery = async ({
  search,
  scope,
  scopeFilter,
}: {
  search: string;
  scope: Scope;
  scopeFilter: Array<string>;
}) => {
  const users = await getKbdClient()
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
