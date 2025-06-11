import { sql } from "kysely";
import type { Role } from "shared";
import type { OrderType } from 'shared/enum/orderEnum';
import type { PermissionScope } from 'shared/enum/permissionScopeEnum';
import { PermissionScopeEnum } from 'shared/enum/permissionScopeEnum';
import type { UserFonction } from "shared/enum/userFonctionEnum";
import { MAX_LIMIT } from "shared/utils/maxLimit";

import { getKbdClient } from "@/db/db";
import { getNormalizedSearchArray } from "@/modules/utils/searchHelpers";
import { cleanNull } from "@/utils/noNull";

export const findUsers = async ({
  offset = 0,
  limit = MAX_LIMIT,
  search,
  orderBy,
  scope,
  scopeFilter,
}: {
  offset?: number;
  limit?: number;
  search?: string;
  orderBy?: { order: OrderType; column: string };
  scope: PermissionScope;
  scopeFilter: Array<string>;
}) => {
  const search_array = getNormalizedSearchArray(search);
  const users = await getKbdClient()
    .selectFrom("user")
    .leftJoin("region", "region.codeRegion", "user.codeRegion")
    .selectAll()
    .select(getKbdClient().fn.count<number>("id").over().as("count"))
    .where((w) => {
      if (!search) return sql`true`;
      return w.and(
        search_array.map((search_word) =>
          w(
            sql`concat(
              unaccent(${w.ref("user.email")}),
              ' ',
              unaccent(${w.ref("user.firstname")}),
              ' ',
              unaccent(${w.ref("user.lastname")})
            )`,
            "ilike",
            `%${search_word}%`
          )
        )
      );
    })
    .$call((q) => {
      if (scope === PermissionScopeEnum["région"]) {
        return q.where("user.codeRegion", "in", scopeFilter);
      }
      return q;
    })
    .$narrowType<{
      role: Role;
      fonction: UserFonction;
     }>()
    .offset(offset)
    .limit(limit)
    .$call((q) => {
      if (!orderBy) return q;
      return q.orderBy(sql.ref(orderBy.column), sql`${sql.raw(orderBy.order)} NULLS LAST`);
    })
    .orderBy("createdAt", "desc")
    .execute()
    .then(cleanNull);

  return {
    count: users[0]?.count ?? 0,
    users: users.map((user) => ({
      ...user,
      createdAt: user.createdAt?.toISOString(),
    })),
  };
};
