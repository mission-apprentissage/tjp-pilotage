import { sql } from "kysely";
import { Role } from "shared";

import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";

export const findUsers = async ({
  offset,
  limit,
  search,
  orderBy,
}: {
  offset: number;
  limit: number;
  search?: string;
  orderBy?: { order: "asc" | "desc"; column: string };
}) => {
  const users = await kdb
    .selectFrom("user")
    .leftJoin(
      "region",
      "region.codeRegion",
      "user.codeRegion"
    )
    .selectAll()
    .select(kdb.fn.count<number>("id").over().as("count"))
    .where((w) => {
      if (!search) return sql`true`;
      const search_array = search.split(" ");
      return w.and(
        search_array.map((search_word) =>
          w(
            sql`concat(unaccent(${w.ref("user.email")}),
                ' ',${w.ref("user.firstname")},
                ' ',${w.ref("user.lastname")})`,
            "ilike",
            `%${search_word.normalize("NFD").replace(/[\u0300-\u036f]/g, "")}%`
          )
        )
      );
    })
    .$narrowType<{ role: Role }>()
    .offset(offset)
    .limit(limit)
    .$call((q) => {
      if (!orderBy) return q;
      return q.orderBy(
        sql.ref(orderBy.column),
        sql`${sql.raw(orderBy.order)} NULLS LAST`
      );
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
