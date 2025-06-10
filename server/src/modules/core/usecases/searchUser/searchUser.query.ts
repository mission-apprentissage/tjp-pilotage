import type { Role } from "shared";
import type { PermissionScope } from 'shared/enum/permissionScopeEnum';
import { PermissionScopeEnum } from 'shared/enum/permissionScopeEnum';

import { getKbdClient } from "@/db/db";
import { getNormalizedSearch } from "@/modules/utils/searchHelpers";
import { cleanNull } from "@/utils/noNull";

export const searchUserQuery = async ({
  search,
  scope,
  scopeFilter,
}: {
  search: string;
  scope: PermissionScope;
  scopeFilter: Array<string>;
}) => {
  const users = await getKbdClient()
    .selectFrom("user")
    .selectAll()
    .where("email", "ilike", `%${getNormalizedSearch(search).trim()}%`)
    .$call((q) => {
      if (scope === PermissionScopeEnum["région"]) {
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
